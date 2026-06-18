import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Animated, SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '../store';
import { goToScene, setFlag, gainReward, markComplete, resetAdventure } from '../store/slices/adventureSlice';
import { updateCharacter } from '../store/slices/charactersSlice';
import { addItem } from '../store/slices/inventorySlice';
import { addQuest, updateQuestStatus } from '../store/slices/questsSlice';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { generateId, getProficiencyBonus } from '../utils/helpers';
import { ThemedScreen } from '../components/ThemedScreen';
import { RootStackParamList } from '../navigation/AppNavigator';
import { AUBE_HEROS_ADVENTURE } from '../data/adventures/aube_heros';
import {
  PlayableAdventure, AdventureScene, LocalCombatState, LiveEnemy, EnemyTemplate,
} from '../types/adventure';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// ─── Dice helpers ────────────────────────────────────────────────────────────
const rollD = (sides: number) => Math.floor(Math.random() * sides) + 1;
const rollFormula = (formula: string): number => {
  const m = formula.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
  if (!m) return 1;
  let total = 0;
  for (let i = 0; i < parseInt(m[1]); i++) total += rollD(parseInt(m[2]));
  if (m[3]) total += parseInt(m[3]);
  return Math.max(1, total);
};
const getStatMod = (value: number) => Math.floor((value - 10) / 2);

// ─── Adventure registry ──────────────────────────────────────────────────────
const ADVENTURES: Record<string, PlayableAdventure> = {
  [AUBE_HEROS_ADVENTURE.id]: AUBE_HEROS_ADVENTURE,
};

// ─── HPBar component ─────────────────────────────────────────────────────────
const HPBar: React.FC<{ current: number; max: number; color?: string }> = ({ current, max, color = colors.success }) => {
  const pct = Math.max(0, Math.min(1, current / max));
  const barColor = pct > 0.5 ? colors.success : pct > 0.25 ? colors.warning : colors.error;
  return (
    <View style={hp.track}>
      <View style={[hp.fill, { width: `${pct * 100}%`, backgroundColor: color ?? barColor }]} />
    </View>
  );
};
const hp = StyleSheet.create({
  track: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden', flex: 1 },
  fill: { height: '100%', borderRadius: 4 },
});

// ─── Main Screen ─────────────────────────────────────────────────────────────
export const AdventureScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();

  // Redux state
  const adventureRun = useAppSelector((s) => s.adventure);
  const character = useAppSelector((s) => {
    const id = s.characters.currentCharacterId;
    return id ? s.characters.characters.find((c) => c.id === id) : null;
  });
  const existingQuests = useAppSelector((s) => s.quests.quests);

  // Local state
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [combat, setCombat] = useState<LocalCombatState | null>(null);
  const [phase, setPhase] = useState<'read' | 'dialogue' | 'choices' | 'combat' | 'reward_anim'>('read');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  const adventure = adventureRun.adventureId ? ADVENTURES[adventureRun.adventureId] : null;
  const scene: AdventureScene | null = adventure && adventureRun.currentSceneId
    ? adventure.scenes[adventureRun.currentSceneId] ?? null
    : null;

  const chapter = scene ? adventure?.chapters.find((c) => c.id === scene.chapterId) : null;

  // ─── Fade in on scene change ────────────────────────────────────────────────
  useEffect(() => {
    if (!scene) return;
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    setDialogueIndex(0);
    setShowChoices(false);
    setCombat(null);

    if (scene.type === 'dialogue') setPhase('dialogue');
    else if (scene.type === 'combat') { setPhase('combat'); initCombat(scene); }
    else setPhase('read');

    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [adventureRun.currentSceneId]);

  // ─── Combat init ─────────────────────────────────────────────────────────────
  const initCombat = useCallback((s: AdventureScene) => {
    if (!s.enemies || !character) return;
    const enemies: LiveEnemy[] = s.enemies.map((e: EnemyTemplate, i: number) => ({
      instanceId: `${e.id}_${i}`,
      templateId: e.id,
      name: e.name,
      icon: e.icon,
      maxHP: e.maxHP,
      currentHP: e.maxHP,
      ca: e.ca,
      atkBonus: e.atkBonus,
      dmgFormula: e.dmgFormula,
      xpReward: e.xpReward,
      goldDrop: e.goldDrop ?? 0,
      isBoss: e.isBoss ?? false,
    }));
    const pendingXP = enemies.reduce((sum, e) => sum + e.xpReward, 0);
    const pendingGold = enemies.reduce((sum, e) => sum + e.goldDrop, 0);
    setCombat({
      enemies,
      playerHP: character.currentHP,
      round: 1,
      phase: 'player_turn',
      log: [`⚔️ Round 1 — À votre tour !`],
      victorySceneId: s.victorySceneId ?? s.autoNextSceneId ?? '',
      defeatSceneId: s.defeatSceneId ?? s.autoNextSceneId ?? '',
      pendingXP,
      pendingGold,
    });
  }, [character]);

  // ─── Player attack ────────────────────────────────────────────────────────────
  const handlePlayerAttack = (targetIndex: number) => {
    if (!combat || combat.phase !== 'player_turn' || !character) return;

    const target = combat.enemies[targetIndex];
    if (!target || target.currentHP <= 0) {
      const aliveIdx = combat.enemies.findIndex((e) => e.currentHP > 0);
      if (aliveIdx === -1) return;
      handlePlayerAttack(aliveIdx);
      return;
    }

    // Compute player attack
    const strStat = character.stats.find((s) => s.abbreviation === 'FOR');
    const strMod = strStat ? getStatMod(strStat.value) : 0;
    const prof = getProficiencyBonus(character.level);
    const atkBonus = strMod + prof;

    // Check for equipped weapon
    const equippedWeapon = useEquippedWeapon();
    const dmgFormula = equippedWeapon?.damage ?? `1d6${strMod >= 0 ? '+' : ''}${strMod}`;

    const roll = rollD(20);
    const total = roll + atkBonus;
    const hit = roll === 20 || total >= target.ca;
    const isCrit = roll === 20;

    let log = combat.log.slice(-8);
    let newEnemies = combat.enemies.map((e) => ({ ...e }));

    if (hit) {
      const dmg = isCrit ? rollFormula(dmgFormula) + rollFormula(dmgFormula) : rollFormula(dmgFormula);
      newEnemies[targetIndex].currentHP = Math.max(0, target.currentHP - dmg);
      log = [...log, `🗡️ D20(${roll})+${atkBonus}=${total} ≥ CA${target.ca} → TOUCHÉ !${isCrit ? ' CRITIQUE !' : ''} ${dmg} dégâts à ${target.name}`];
      if (newEnemies[targetIndex].currentHP === 0) {
        log = [...log, `💀 ${target.name} est vaincu !`];
      }
    } else {
      log = [...log, `🗡️ D20(${roll})+${atkBonus}=${total} < CA${target.ca} → Raté.`];
    }

    const allDead = newEnemies.every((e) => e.currentHP <= 0);
    if (allDead) {
      log = [...log, `🏆 Tous les ennemis sont vaincus !`];
      setCombat({ ...combat, enemies: newEnemies, log, phase: 'victory' });
      return;
    }

    setCombat({ ...combat, enemies: newEnemies, log, phase: 'enemy_turn' });
  };

  // ─── Enemy turn (auto, with delay) ───────────────────────────────────────────
  useEffect(() => {
    if (!combat || combat.phase !== 'enemy_turn' || !character) return;
    const timer = setTimeout(() => {
      let newHP = combat.playerHP;
      const playerCA = character.armorClass;
      let log = combat.log.slice(-8);

      for (const enemy of combat.enemies) {
        if (enemy.currentHP <= 0) continue;
        const roll = rollD(20);
        const total = roll + enemy.atkBonus;
        const hit = roll === 20 || total >= playerCA;
        if (hit) {
          const dmg = rollFormula(enemy.dmgFormula);
          newHP = Math.max(0, newHP - dmg);
          log = [...log, `👹 ${enemy.name}: D20(${roll})+${enemy.atkBonus}=${total} → ${dmg} dégâts sur vous !`];
        } else {
          log = [...log, `👹 ${enemy.name}: D20(${roll})+${enemy.atkBonus}=${total} < CA${playerCA} → Raté !`];
        }
      }

      if (newHP <= 0) {
        log = [...log, `💔 Vous avez été vaincu...`];
        setCombat({ ...combat, playerHP: 0, log, phase: 'defeat' });
        return;
      }

      const nextRound = combat.round + 1;
      log = [...log, `⚔️ Round ${nextRound} — À votre tour !`];
      setCombat({ ...combat, playerHP: newHP, log, round: nextRound, phase: 'player_turn' });
    }, 900);
    return () => clearTimeout(timer);
  }, [combat?.phase]);

  // ─── Potion use ────────────────────────────────────────────────────────────
  const inventory = useAppSelector((s) => character ? s.inventory.items.filter((i) => i.characterId === character.id && i.category === 'consommable' && i.quantity > 0) : []);
  const handleUsePotion = () => {
    if (!combat || combat.phase !== 'player_turn' || !character) return;
    if (inventory.length === 0) { Alert.alert('Aucun consommable', 'Vous n\'avez pas de potion ou de consommable.'); return; }
    const potion = inventory[0];
    const healAmt = rollFormula('1d4+4');
    const newHP = Math.min(character.maxHP, combat.playerHP + healAmt);
    const log = [...combat.log.slice(-8), `🧪 ${potion.name} — Vous récupérez ${healAmt} PV !`];
    setCombat({ ...combat, playerHP: newHP, log });
    dispatch({ type: 'inventory/updateQuantity', payload: { id: potion.id, quantity: potion.quantity - 1 } });
  };

  // ─── Flee ────────────────────────────────────────────────────────────────────
  const handleFlee = () => {
    if (!combat || !character || !scene) return;
    const success = rollD(2) === 2;
    if (success) {
      Alert.alert('🏃 Fuite réussie !', 'Vous avez réussi à fuir le combat. Aucun XP n\'est accordé.');
      dispatch(goToScene(combat.defeatSceneId));
    } else {
      const log = [...combat.log.slice(-8), '🏃 Tentative de fuite échouée — L\'ennemi frappe pendant que vous fuyez !'];
      setCombat({ ...combat, log, phase: 'enemy_turn' });
    }
  };

  // ─── Combat end handlers ──────────────────────────────────────────────────────
  const handleCombatVictory = () => {
    if (!combat || !character) return;
    dispatch(updateCharacter({ ...character, currentHP: Math.max(1, combat.playerHP) }));
    dispatch(gainReward({ xp: combat.pendingXP, gold: combat.pendingGold }));
    if (scene?.reward?.questComplete) {
      applyQuestCompletes(scene.reward.questComplete);
    }
    dispatch(goToScene(combat.victorySceneId));
  };

  const handleCombatDefeat = () => {
    if (!combat || !character) return;
    dispatch(updateCharacter({ ...character, currentHP: Math.max(1, Math.floor(character.maxHP * 0.1)) }));
    dispatch(goToScene(combat.defeatSceneId));
  };

  // ─── Scene navigation ─────────────────────────────────────────────────────────
  const handleContinue = () => {
    if (!scene) return;
    if (scene.type === 'adventure_end') {
      dispatch(markComplete());
      dispatch(gainReward(scene.reward ?? {}));
      return;
    }
    applySceneReward(scene);
    if (scene.autoNextSceneId) dispatch(goToScene(scene.autoNextSceneId));
    else setShowChoices(true);
  };

  const handleChoice = (choice: { id: string; nextSceneId: string; setFlag?: string; reward?: { xp?: number; gold?: number } }) => {
    if (choice.setFlag) dispatch(setFlag({ key: choice.setFlag, value: true }));
    if (choice.reward) dispatch(gainReward(choice.reward));
    dispatch(goToScene(choice.nextSceneId));
  };

  const handleDialogueNext = () => {
    if (!scene?.dialogue) return;
    if (dialogueIndex < scene.dialogue.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      // Dialogue finished — show quest offer if any, then choices/continue
      if (scene.questOffer) {
        offerQuest(scene.questOffer);
      } else if (scene.choices) {
        setPhase('choices');
      } else {
        applySceneReward(scene);
        if (scene.dialogueNextSceneId) dispatch(goToScene(scene.dialogueNextSceneId));
        else if (scene.autoNextSceneId) dispatch(goToScene(scene.autoNextSceneId));
      }
    }
  };

  // ─── Quest offering ───────────────────────────────────────────────────────────
  const offerQuest = (offer: NonNullable<AdventureScene['questOffer']>) => {
    if (!character) return;
    const already = existingQuests.find((q) => q.characterId === character.id && q.title === offer.title);
    if (!already) {
      const now = new Date().toISOString();
      dispatch(addQuest({
        id: generateId(),
        characterId: character.id,
        title: offer.title,
        description: offer.description,
        reward: offer.reward,
        status: 'active',
        type: offer.type,
        objectives: offer.objectives.map((o) => ({ id: generateId(), description: o, completed: false })),
        createdAt: now,
        updatedAt: now,
      }));
      Alert.alert(`📜 Nouvelle quête !`, `"${offer.title}" ajoutée à votre liste de quêtes.`);
    }
    if (scene?.choices) setPhase('choices');
    else if (scene?.dialogueNextSceneId) dispatch(goToScene(scene.dialogueNextSceneId));
    else if (scene?.autoNextSceneId) dispatch(goToScene(scene.autoNextSceneId));
  };

  const applyQuestCompletes = (titles: string[]) => {
    if (!character) return;
    titles.forEach((title) => {
      const q = existingQuests.find((quest) => quest.characterId === character.id && quest.title === title);
      if (q) dispatch(updateQuestStatus({ id: q.id, status: 'terminee' }));
    });
  };

  const applySceneReward = (s: AdventureScene) => {
    if (!s.reward) return;
    if (s.reward.xp || s.reward.gold) dispatch(gainReward({ xp: s.reward.xp ?? 0, gold: s.reward.gold ?? 0 }));
    if (s.reward.questComplete) applyQuestCompletes(s.reward.questComplete);
    if (s.reward.items && character) {
      s.reward.items.forEach((item) => {
        dispatch(addItem({
          id: generateId(),
          characterId: character.id,
          name: item.name,
          description: item.description,
          quantity: 1,
          weight: 0,
          value: 0,
          rarity: item.rarity as any,
          equipped: false,
          category: item.category as any,
          damage: item.damage,
          notes: 'Obtenu lors de l\'aventure',
          properties: [],
        }));
      });
    }
  };

  // ─── Equipped weapon helper (outside hooks — computed inline) ────────────────
  const equippedWeaponData = useAppSelector((s) => {
    if (!character) return null;
    return s.inventory.items.find((i) => i.characterId === character.id && i.equipped && i.category === 'arme' && i.damage) ?? null;
  });
  const useEquippedWeapon = () => equippedWeaponData;

  // ─── No adventure running guard ───────────────────────────────────────────────
  if (!adventureRun.adventureId || !adventure || !scene) {
    return (
      <ThemedScreen>
        <SafeAreaView style={styles.safe}>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>⚔️</Text>
            <Text style={styles.emptyTitle}>Aucune aventure en cours</Text>
            <Text style={styles.emptySubtitle}>Lancez une aventure depuis la liste des campagnes</Text>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backBtnText}>⟵ Retour</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ThemedScreen>
    );
  }

  // ─── Adventure complete screen ────────────────────────────────────────────────
  if (adventureRun.isComplete) {
    return (
      <ThemedScreen>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={styles.endContainer}>
            <Text style={styles.endTrophy}>🏆</Text>
            <Text style={styles.endTitle}>Aventure Terminée !</Text>
            <Text style={styles.endSubtitle}>{adventure.title}</Text>
            <View style={styles.endStatsBox}>
              <View style={styles.endStat}>
                <Text style={styles.endStatVal}>{adventureRun.totalXP}</Text>
                <Text style={styles.endStatLabel}>XP gagné</Text>
              </View>
              <View style={styles.endStat}>
                <Text style={styles.endStatVal}>{adventureRun.totalGold}</Text>
                <Text style={styles.endStatLabel}>Or gagné</Text>
              </View>
              <View style={styles.endStat}>
                <Text style={styles.endStatVal}>{adventureRun.visitedSceneIds.length}</Text>
                <Text style={styles.endStatLabel}>Scènes</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.endBtn} onPress={() => { dispatch(resetAdventure()); navigation.goBack(); }}>
              <Text style={styles.endBtnText}>🏰 Retour à la carte</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ThemedScreen>
    );
  }

  // ─── COMBAT PHASE ─────────────────────────────────────────────────────────────
  if (scene.type === 'combat' && combat) {
    const aliveEnemies = combat.enemies.filter((e) => e.currentHP > 0);

    if (combat.phase === 'victory') {
      return (
        <ThemedScreen>
          <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.combatEnd}>
              <Text style={styles.victoryIcon}>🏆</Text>
              <Text style={styles.victoryTitle}>Victoire !</Text>
              <Text style={styles.victoryXP}>+{combat.pendingXP} XP · +{combat.pendingGold} 💰</Text>
              <View style={styles.logBox}>
                {combat.log.slice(-6).map((l, i) => <Text key={i} style={styles.logLine}>{l}</Text>)}
              </View>
              <TouchableOpacity style={styles.continueBtn} onPress={handleCombatVictory}>
                <Text style={styles.continueBtnText}>Continuer l'aventure ›</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </ThemedScreen>
      );
    }

    if (combat.phase === 'defeat') {
      return (
        <ThemedScreen>
          <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.combatEnd}>
              <Text style={styles.victoryIcon}>💀</Text>
              <Text style={[styles.victoryTitle, { color: colors.error }]}>Vaincu...</Text>
              <Text style={styles.defeatText}>Vous survivez de justesse.</Text>
              <View style={styles.logBox}>
                {combat.log.slice(-4).map((l, i) => <Text key={i} style={styles.logLine}>{l}</Text>)}
              </View>
              <TouchableOpacity style={[styles.continueBtn, { backgroundColor: colors.error }]} onPress={handleCombatDefeat}>
                <Text style={styles.continueBtnText}>Continuer malgré tout ›</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </ThemedScreen>
      );
    }

    return (
      <ThemedScreen>
        <SafeAreaView style={styles.safe}>
          <ScrollView ref={scrollRef} contentContainerStyle={styles.combatContainer}>
            {/* Header */}
            <View style={styles.combatHeader}>
              <Text style={styles.chapterLabel}>{chapter?.title}</Text>
              <Text style={styles.combatRound}>Round {combat.round}</Text>
            </View>
            <Text style={styles.sceneTitle}>{scene.title}</Text>
            {scene.combatIntro && <Text style={styles.combatIntro}>{scene.combatIntro}</Text>}

            {/* Player HP */}
            <View style={styles.playerHPBox}>
              <View style={styles.combatantRow}>
                <Text style={styles.combatantName}>⚔️ {character?.name ?? 'Votre personnage'}</Text>
                <Text style={[styles.combatantHP, { color: combat.playerHP < (character?.maxHP ?? 1) * 0.3 ? colors.error : colors.success }]}>
                  {combat.playerHP}/{character?.maxHP ?? '?'} PV
                </Text>
              </View>
              <HPBar current={combat.playerHP} max={character?.maxHP ?? 1} />
            </View>

            {/* Enemies */}
            <View style={styles.enemiesBox}>
              {combat.enemies.map((enemy, idx) => (
                <View key={enemy.instanceId} style={[styles.enemyCard, enemy.currentHP <= 0 && styles.enemyCardDead]}>
                  <View style={styles.combatantRow}>
                    <Text style={styles.enemyIcon}>{enemy.icon}</Text>
                    <Text style={[styles.combatantName, enemy.currentHP <= 0 && { color: colors.textMuted }]}>
                      {enemy.name}{enemy.isBoss ? ' ⭐ BOSS' : ''}
                    </Text>
                    <Text style={styles.combatantHP}>
                      {enemy.currentHP > 0 ? `${enemy.currentHP}/${enemy.maxHP} PV` : '💀 KO'}
                    </Text>
                  </View>
                  {enemy.currentHP > 0 && <HPBar current={enemy.currentHP} max={enemy.maxHP} color={enemy.isBoss ? colors.error : colors.warning} />}
                </View>
              ))}
            </View>

            {/* Combat Log */}
            <View style={styles.logBox}>
              <Text style={styles.logLabel}>Journal de combat</Text>
              {combat.log.slice(-5).map((line, i) => (
                <Text key={i} style={[styles.logLine, i === Math.min(4, combat.log.length - 1) && styles.logLineLast]}>
                  {line}
                </Text>
              ))}
            </View>

            {/* Actions */}
            {combat.phase === 'player_turn' && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handlePlayerAttack(aliveEnemies.length > 0 ? combat.enemies.indexOf(aliveEnemies[0]) : 0)}
                >
                  <Text style={styles.actionBtnIcon}>⚔️</Text>
                  <Text style={styles.actionBtnText}>Attaquer</Text>
                </TouchableOpacity>
                {inventory.length > 0 && (
                  <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPotion]} onPress={handleUsePotion}>
                    <Text style={styles.actionBtnIcon}>🧪</Text>
                    <Text style={styles.actionBtnText}>Potion</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={[styles.actionBtn, styles.actionBtnFlee]} onPress={handleFlee}>
                  <Text style={styles.actionBtnIcon}>🏃</Text>
                  <Text style={styles.actionBtnText}>Fuir</Text>
                </TouchableOpacity>
              </View>
            )}
            {combat.phase === 'enemy_turn' && (
              <View style={styles.enemyTurnIndicator}>
                <Text style={styles.enemyTurnText}>⏳ Tour de l'ennemi...</Text>
              </View>
            )}

            {/* Target selector if multiple alive enemies */}
            {combat.phase === 'player_turn' && aliveEnemies.length > 1 && (
              <View style={styles.targetSection}>
                <Text style={styles.targetLabel}>Choisir une cible :</Text>
                {aliveEnemies.map((enemy) => {
                  const idx = combat.enemies.indexOf(enemy);
                  return (
                    <TouchableOpacity key={enemy.instanceId} style={styles.targetBtn} onPress={() => handlePlayerAttack(idx)}>
                      <Text style={styles.targetBtnText}>{enemy.icon} {enemy.name} — {enemy.currentHP} PV</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </ThemedScreen>
    );
  }

  // ─── NARRATIVE / DIALOGUE / CHOICE PHASES ─────────────────────────────────────
  const currentDialogueLine = scene.dialogue?.[dialogueIndex];
  const isLastDialogueLine = scene.dialogue ? dialogueIndex >= scene.dialogue.length - 1 : true;

  return (
    <ThemedScreen>
      <SafeAreaView style={styles.safe}>
        <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
          <ScrollView ref={scrollRef} contentContainerStyle={styles.sceneContainer} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.sceneHeader}>
              <TouchableOpacity onPress={() => Alert.alert('Quitter ?', 'Votre progression est sauvegardée.', [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Quitter', onPress: () => navigation.goBack() },
              ])} style={styles.quitBtn}>
                <Text style={styles.quitBtnText}>✕</Text>
              </TouchableOpacity>
              <View style={styles.chapterPill}>
                <Text style={styles.chapterLabel}>Chapitre {chapter?.number} — {chapter?.title}</Text>
              </View>
              <View style={styles.xpPill}>
                <Text style={styles.xpText}>⭐ {adventureRun.totalXP} XP</Text>
              </View>
            </View>

            {/* Scene title */}
            <Text style={styles.sceneTitle}>{scene.title}</Text>

            {/* Type badge */}
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>
                {scene.type === 'dialogue' ? '💬 Dialogue'
                  : scene.type === 'exploration' ? '🗺️ Exploration'
                  : scene.type === 'rest' ? '🛏️ Repos'
                  : scene.type === 'reward' ? '🏆 Récompense'
                  : scene.type === 'chapter_end' ? '📖 Fin de chapitre'
                  : scene.type === 'adventure_end' ? '🏆 Fin d\'aventure'
                  : '📜 Récit'}
              </Text>
            </View>

            {/* Narrative text */}
            <Text style={styles.narrative}>{scene.narrative}</Text>

            {/* Reward display */}
            {scene.reward && (scene.type === 'reward' || scene.type === 'chapter_end' || scene.type === 'adventure_end') && (
              <View style={styles.rewardBox}>
                {scene.reward.xp ? <Text style={styles.rewardLine}>⭐ +{scene.reward.xp} XP</Text> : null}
                {scene.reward.gold && scene.reward.gold > 0 ? <Text style={styles.rewardLine}>💰 +{scene.reward.gold} pièces d'or</Text> : null}
                {scene.reward.gold && scene.reward.gold < 0 ? <Text style={[styles.rewardLine, { color: colors.error }]}>💰 {scene.reward.gold} pièces d'or</Text> : null}
                {scene.reward.items?.map((item, i) => (
                  <Text key={i} style={styles.rewardLine}>🎁 {item.name}</Text>
                ))}
              </View>
            )}

            {/* Dialogue bubble */}
            {scene.type === 'dialogue' && currentDialogueLine && phase === 'dialogue' && (
              <TouchableOpacity style={[
                styles.dialogueBubble,
                currentDialogueLine.isPlayer ? styles.dialogueBubblePlayer : styles.dialogueBubbleNPC,
              ]} onPress={handleDialogueNext} activeOpacity={0.8}>
                <View style={styles.dialogueSpeakerRow}>
                  <Text style={[styles.dialogueSpeaker, currentDialogueLine.isPlayer && styles.dialogueSpeakerPlayer]}>
                    {currentDialogueLine.isPlayer ? '👤 Vous' : `🗣️ ${currentDialogueLine.speaker}`}
                  </Text>
                  <Text style={styles.dialogueProgress}>
                    {dialogueIndex + 1}/{scene.dialogue!.length}
                  </Text>
                </View>
                <Text style={[styles.dialogueText, currentDialogueLine.isPlayer && styles.dialogueTextPlayer]}>
                  {currentDialogueLine.text}
                </Text>
                <Text style={styles.dialogueTap}>
                  {isLastDialogueLine ? '[ Appuyer pour terminer ]' : '[ Appuyer pour continuer ]'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Quest offer reminder */}
            {scene.questOffer && phase === 'choices' && (
              <View style={styles.questOfferBox}>
                <Text style={styles.questOfferTitle}>📜 Quête proposée : {scene.questOffer.title}</Text>
                <Text style={styles.questOfferReward}>🏆 {scene.questOffer.reward}</Text>
              </View>
            )}

            {/* Choices */}
            {phase === 'choices' && scene.choices && (
              <View style={styles.choicesSection}>
                <Text style={styles.choicesLabel}>Que faites-vous ?</Text>
                {scene.choices.map((choice) => (
                  <TouchableOpacity
                    key={choice.id}
                    style={styles.choiceBtn}
                    onPress={() => handleChoice(choice)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.choiceBtnIcon}>{choice.icon ?? '›'}</Text>
                    <Text style={styles.choiceBtnText}>{choice.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Continue button */}
            {phase === 'read' && (
              <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.85}>
                <Text style={styles.continueBtnText}>
                  {scene.type === 'adventure_end' ? '🏆 Terminer l\'aventure'
                    : scene.type === 'chapter_end' ? '📖 Chapitre suivant ›'
                    : scene.autoNextSceneId ? 'Continuer ›'
                    : 'Faire un choix ›'}
                </Text>
              </TouchableOpacity>
            )}
            {(scene.type === 'exploration' || scene.type === 'choice') && !showChoices && phase === 'read' && !scene.autoNextSceneId && (
              <TouchableOpacity style={styles.continueBtn} onPress={() => setShowChoices(true)} activeOpacity={0.85}>
                <Text style={styles.continueBtnText}>Faire un choix ›</Text>
              </TouchableOpacity>
            )}
            {(scene.type === 'exploration' || scene.type === 'choice') && (showChoices || phase === 'read') && scene.choices && phase !== 'choices' && !scene.autoNextSceneId && (
              <View style={styles.choicesSection}>
                <Text style={styles.choicesLabel}>Que faites-vous ?</Text>
                {scene.choices.map((choice) => (
                  <TouchableOpacity key={choice.id} style={styles.choiceBtn} onPress={() => handleChoice(choice)} activeOpacity={0.8}>
                    <Text style={styles.choiceBtnIcon}>{choice.icon ?? '›'}</Text>
                    <Text style={styles.choiceBtnText}>{choice.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </ThemedScreen>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyIcon: { fontSize: 64, marginBottom: spacing.md },
  emptyTitle: { ...typography.h3, color: colors.primary, marginBottom: spacing.sm },
  emptySubtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.xl },
  backBtn: { paddingVertical: 12, paddingHorizontal: spacing.xl, backgroundColor: colors.primary, borderRadius: borderRadius.lg },
  backBtnText: { ...typography.h5, color: colors.background, fontWeight: '700' },

  sceneContainer: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  sceneHeader: { flexDirection: 'row', alignItems: 'center', paddingTop: spacing.md, paddingBottom: spacing.sm, gap: 8 },
  quitBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surfaceVariant, alignItems: 'center', justifyContent: 'center' },
  quitBtnText: { color: colors.textMuted, fontSize: 16, fontWeight: '700' },
  chapterPill: { flex: 1, backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.round, paddingHorizontal: 10, paddingVertical: 4 },
  chapterLabel: { ...typography.caption, color: colors.secondary, fontWeight: '700' },
  xpPill: { backgroundColor: colors.primary + '22', borderRadius: borderRadius.round, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: colors.primary },
  xpText: { ...typography.caption, color: colors.primary, fontWeight: '700' },

  sceneTitle: { ...typography.h3, color: colors.primary, marginTop: spacing.md, marginBottom: spacing.sm },
  typeBadge: { alignSelf: 'flex-start', backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.round, paddingHorizontal: 10, paddingVertical: 4, marginBottom: spacing.md },
  typeBadgeText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },

  narrative: {
    ...typography.body, color: colors.text, lineHeight: 26,
    backgroundColor: colors.card, borderRadius: borderRadius.lg,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border,
    marginBottom: spacing.md, fontStyle: 'italic',
  },

  rewardBox: {
    backgroundColor: colors.primary + '18', borderRadius: borderRadius.lg,
    padding: spacing.md, borderWidth: 1, borderColor: colors.primary,
    marginBottom: spacing.md, gap: 4,
  },
  rewardLine: { ...typography.body, color: colors.primary, fontWeight: '700' },

  dialogueBubble: {
    borderRadius: borderRadius.xl, padding: spacing.md, marginBottom: spacing.md,
    borderWidth: 1, ...shadows.small,
  },
  dialogueBubbleNPC: { backgroundColor: colors.card, borderColor: colors.secondary, marginRight: spacing.xl },
  dialogueBubblePlayer: { backgroundColor: colors.primary + '18', borderColor: colors.primary, marginLeft: spacing.xl },
  dialogueSpeakerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  dialogueSpeaker: { ...typography.label, color: colors.secondary, textTransform: 'uppercase' },
  dialogueSpeakerPlayer: { color: colors.primary },
  dialogueProgress: { ...typography.caption, color: colors.textMuted },
  dialogueText: { ...typography.body, color: colors.text, lineHeight: 22, marginBottom: 8 },
  dialogueTextPlayer: { color: colors.text, fontStyle: 'italic' },
  dialogueTap: { ...typography.caption, color: colors.textMuted, textAlign: 'right' },

  questOfferBox: {
    backgroundColor: colors.warning + '18', borderRadius: borderRadius.lg,
    padding: spacing.md, borderWidth: 1, borderColor: colors.warning, marginBottom: spacing.md,
  },
  questOfferTitle: { ...typography.h5, color: colors.warning, marginBottom: 4 },
  questOfferReward: { ...typography.bodySmall, color: colors.textSecondary },

  choicesSection: { marginBottom: spacing.md },
  choicesLabel: { ...typography.label, color: colors.textMuted, textTransform: 'uppercase', marginBottom: spacing.sm, letterSpacing: 1 },
  choiceBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.card, borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.sm, ...shadows.small,
  },
  choiceBtnIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  choiceBtnText: { ...typography.body, color: colors.text, flex: 1, fontWeight: '600' },

  continueBtn: {
    backgroundColor: colors.primary, borderRadius: borderRadius.lg,
    paddingVertical: 16, alignItems: 'center', ...shadows.gold,
    marginBottom: spacing.md,
  },
  continueBtnText: { ...typography.h5, color: colors.background, fontWeight: '800' },

  // Combat styles
  combatContainer: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  combatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.md, paddingBottom: spacing.sm },
  combatRound: { ...typography.label, color: colors.primary, fontWeight: '700' },
  combatIntro: { ...typography.body, color: colors.textSecondary, fontStyle: 'italic', marginBottom: spacing.md, lineHeight: 22 },

  playerHPBox: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.success + '66', marginBottom: spacing.sm, gap: 6,
  },
  enemiesBox: { gap: spacing.sm, marginBottom: spacing.md },
  enemyCard: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.error + '55', gap: 6,
  },
  enemyCardDead: { opacity: 0.4, borderColor: colors.border },
  combatantRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  enemyIcon: { fontSize: 22, width: 30, textAlign: 'center' },
  combatantName: { ...typography.body, color: colors.text, flex: 1, fontWeight: '700' },
  combatantHP: { ...typography.bodySmall, color: colors.success, fontWeight: '700' },

  logBox: {
    backgroundColor: colors.background, borderRadius: borderRadius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md, gap: 4,
  },
  logLabel: { ...typography.caption, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 4, letterSpacing: 1 },
  logLine: { ...typography.caption, color: colors.textSecondary, lineHeight: 18 },
  logLineLast: { color: colors.text, fontWeight: '600' },

  actionRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  actionBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: colors.primary, borderRadius: borderRadius.lg, paddingVertical: 14,
    ...shadows.gold,
  },
  actionBtnPotion: { backgroundColor: colors.success },
  actionBtnFlee: { backgroundColor: colors.surfaceVariant, borderWidth: 1, borderColor: colors.border },
  actionBtnIcon: { fontSize: 22 },
  actionBtnText: { ...typography.bodySmall, color: colors.background, fontWeight: '800' },

  enemyTurnIndicator: {
    backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.lg,
    padding: spacing.md, alignItems: 'center', marginBottom: spacing.md,
  },
  enemyTurnText: { ...typography.body, color: colors.textSecondary },

  targetSection: { marginBottom: spacing.md },
  targetLabel: { ...typography.caption, color: colors.textMuted, marginBottom: 8, textTransform: 'uppercase' },
  targetBtn: {
    backgroundColor: colors.error + '22', borderRadius: borderRadius.md, borderWidth: 1,
    borderColor: colors.error, padding: spacing.sm, marginBottom: 6,
  },
  targetBtnText: { ...typography.body, color: colors.error, fontWeight: '700' },

  combatEnd: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  victoryIcon: { fontSize: 72, marginBottom: spacing.md },
  victoryTitle: { ...typography.h2, color: colors.primary, marginBottom: spacing.sm },
  victoryXP: { ...typography.h5, color: colors.textSecondary, marginBottom: spacing.lg },
  defeatText: { ...typography.body, color: colors.textMuted, marginBottom: spacing.lg },

  endContainer: { alignItems: 'center', padding: spacing.xl, paddingTop: spacing.xxl },
  endTrophy: { fontSize: 80, marginBottom: spacing.md },
  endTitle: { ...typography.h2, color: colors.primary, marginBottom: spacing.sm, textAlign: 'center' },
  endSubtitle: { ...typography.h5, color: colors.textSecondary, marginBottom: spacing.xl, textAlign: 'center' },
  endStatsBox: { flexDirection: 'row', gap: spacing.xl, marginBottom: spacing.xl },
  endStat: { alignItems: 'center' },
  endStatVal: { ...typography.h2, color: colors.primary, fontWeight: '900' },
  endStatLabel: { ...typography.caption, color: colors.textMuted, marginTop: 4 },
  endBtn: {
    backgroundColor: colors.primary, borderRadius: borderRadius.lg, paddingVertical: 16,
    paddingHorizontal: spacing.xxl, ...shadows.gold,
  },
  endBtnText: { ...typography.h5, color: colors.background, fontWeight: '800' },
});
