import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ScrollView, Alert, Modal as RNModal,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../store';
import {
  startCombat, endCombat, deleteCombat, setActiveCombat,
  addCombatant, removeCombatant, dealDamage, healCombatant,
  nextTurn, addConditionToCombatant, removeConditionFromCombatant,
} from '../store/slices/combatSlice';
import { CombatState as CombatStateType, Combatant } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { generateId, getHPColor, CONDITIONS } from '../utils/helpers';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { HPBar } from '../components/common/HPBar';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { triggerEffect } from '../utils/effectSystem';

const defaultCombat = (characterId: string): CombatStateType => ({
  id: generateId(),
  characterId,
  name: 'Nouveau Combat',
  combatants: [],
  round: 1,
  currentTurnIndex: 0,
  active: true,
  log: [{ id: generateId(), message: 'Combat commencé !', timestamp: new Date().toISOString(), type: 'system' }],
  createdAt: new Date().toISOString(),
});

const defaultCombatant = (): Omit<Combatant, 'id'> => ({
  name: '',
  initiative: 0,
  currentHP: 10,
  maxHP: 10,
  armorClass: 10,
  conditions: [],
  isEnemy: false,
  notes: '',
  isActive: false,
});

const CombatantRow = ({
  combatant,
  isActive,
  onDamage,
  onHeal,
  onRemove,
  onCondition,
}: {
  combatant: Combatant;
  isActive: boolean;
  onDamage: (amount: number) => void;
  onHeal: (amount: number) => void;
  onRemove: () => void;
  onCondition: () => void;
}) => {
  const [amount, setAmount] = useState('');
  const hpColor = getHPColor(combatant.currentHP, combatant.maxHP);

  return (
    <View style={[
      styles.combatantCard,
      isActive && styles.combatantCardActive,
      combatant.isEnemy && styles.combatantCardEnemy,
      combatant.currentHP === 0 && styles.combatantCardKO,
    ]}>
      {isActive && <View style={styles.activePulse} />}
      <View style={styles.combatantTop}>
        <View style={styles.initBadge}>
          <Text style={styles.initValue}>{combatant.initiative}</Text>
          <Text style={styles.initLabel}>Init</Text>
        </View>
        <View style={styles.combatantInfo}>
          <View style={styles.combatantNameRow}>
            <Text style={[styles.combatantName, combatant.currentHP === 0 && styles.deadName]}>
              {combatant.currentHP === 0 ? '☠️ ' : ''}{combatant.name}
              {combatant.isEnemy ? ' 👹' : ' 🧙'}
            </Text>
            {isActive && <Badge label="Tour actif" color={colors.primary} size="sm" />}
          </View>
          <HPBar current={combatant.currentHP} max={combatant.maxHP} height={6} showNumbers={false} />
          <View style={styles.hpTextRow}>
            <Text style={[styles.hpText, { color: hpColor }]}>{combatant.currentHP}/{combatant.maxHP} PV</Text>
            <Text style={styles.acText}>CA {combatant.armorClass}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
          <Text style={styles.removeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      {combatant.conditions.length > 0 && (
        <View style={styles.conditionsRow}>
          {combatant.conditions.map((cond) => {
            const c = CONDITIONS.find((cc) => cc.id === cond);
            return c ? <Badge key={cond} label={c.name} color={c.color} size="sm" /> : null;
          })}
        </View>
      )}

      <View style={styles.combatantActions}>
        <Input
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Montant"
          containerStyle={{ flex: 1, marginBottom: 0 }}
        />
        <TouchableOpacity style={styles.damageBtn} onPress={() => {
          onDamage(parseInt(amount) || 0);
          triggerEffect('damage_dealt');
          setAmount('');
        }}>
          <Text style={styles.damageBtnText}>🗡️ Dégât</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.healBtn} onPress={() => {
          onHeal(parseInt(amount) || 0);
          triggerEffect('heal_received');
          setAmount('');
        }}>
          <Text style={styles.healBtnText}>💚 Soin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.condBtn} onPress={onCondition}>
          <Text style={styles.condBtnText}>⚡</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export const CombatScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentId = useAppSelector((s) => s.characters.currentCharacterId) ?? '';
  const combats = useAppSelector((s) => s.combat.combats);
  const activeCombatId = useAppSelector((s) => s.combat.activeCombatId);

  const activeCombat = combats.find((c) => c.id === activeCombatId);

  const [newCombatantData, setNewCombatantData] = useState(defaultCombatant());
  const [addModal, setAddModal] = useState(false);
  const [condModal, setCondModal] = useState<{ combatantId: string } | null>(null);
  const [showLog, setShowLog] = useState(false);

  // Turn timer
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerInitial, setTimerInitial] = useState(60);
  const [timerSetupModal, setTimerSetupModal] = useState(false);
  const [timerInput, setTimerInput] = useState('60');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((s) => {
          if (s <= 1) {
            setTimerActive(false);
            triggerEffect('combat_next_turn');
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive]);

  const handleTimerSetup = () => {
    const s = Math.max(5, Math.min(600, parseInt(timerInput) || 60));
    setTimerInitial(s);
    setTimerSeconds(s);
    setTimerActive(false);
    setTimerSetupModal(false);
  };

  const handleNextTurn = () => {
    if (!activeCombat) return;
    dispatch(nextTurn(activeCombat.id));
    triggerEffect('combat_next_turn');
    setTimerSeconds(timerInitial);
    setTimerActive(false);
  };

  const createCombat = () => {
    const combat = defaultCombat(currentId);
    dispatch(startCombat(combat));
    triggerEffect('combat_start');
  };

  const handleAddCombatant = () => {
    if (!activeCombat || !newCombatantData.name.trim()) {
      Alert.alert('Nom requis', 'Le combattant doit avoir un nom.');
      return;
    }
    const combatant: Combatant = {
      ...newCombatantData,
      id: generateId(),
      isActive: activeCombat.combatants.length === 0,
    };
    dispatch(addCombatant({ combatId: activeCombat.id, combatant }));
    setNewCombatantData(defaultCombatant());
    setAddModal(false);
  };

  const handleEndCombat = () => {
    if (!activeCombat) return;
    Alert.alert('Terminer le combat', 'Êtes-vous sûr ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Terminer', onPress: () => { dispatch(endCombat(activeCombat.id)); setTimerActive(false); } },
    ]);
  };

  if (!activeCombat) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="⚔️"
          title="Aucun combat en cours"
          subtitle="Lancez un combat pour gérer l'initiative et les points de vie"
          actionLabel="Commencer un combat"
          onAction={createCombat}
        />
        {combats.filter((c) => !c.active).length > 0 && (
          <View style={styles.pastCombats}>
            <Text style={styles.pastTitle}>Combats passés</Text>
            {combats.filter((c) => !c.active).slice(0, 5).map((c) => (
              <TouchableOpacity key={c.id} onPress={() => dispatch(setActiveCombat(c.id))} style={styles.pastCombatRow}>
                <Text style={styles.pastCombatName}>{c.name}</Text>
                <Text style={styles.pastCombatMeta}>Round {c.round} · {c.combatants.length} combattants</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }

  const timerColor = timerSeconds <= 10 ? colors.error : timerSeconds <= 20 ? colors.warning : colors.success;

  return (
    <View style={styles.container}>
      {/* Combat header */}
      <View style={styles.combatHeader}>
        <View style={styles.roundBox}>
          <Text style={styles.roundNum}>{activeCombat.round}</Text>
          <Text style={styles.roundLabel}>Round</Text>
        </View>
        <View style={styles.combatMeta}>
          <Text style={styles.combatName}>{activeCombat.name}</Text>
          <Text style={styles.combatInfo}>
            {activeCombat.combatants.length} combattants ·{' '}
            Tour de {activeCombat.combatants[activeCombat.currentTurnIndex]?.name ?? '—'}
          </Text>
        </View>

        {/* Timer */}
        <TouchableOpacity
          onPress={() => {
            if (timerSeconds === 0) {
              setTimerSeconds(timerInitial);
              setTimerActive(false);
            } else {
              setTimerActive((a) => !a);
            }
          }}
          onLongPress={() => setTimerSetupModal(true)}
          style={[styles.timerBox, { borderColor: timerColor }]}
        >
          <Text style={[styles.timerValue, { color: timerColor }]}>{formatTime(timerSeconds)}</Text>
          <Text style={styles.timerLabel}>{timerActive ? '⏸' : timerSeconds === 0 ? '↺' : '▶'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNextTurn}
          style={styles.nextTurnBtn}
          disabled={activeCombat.combatants.length === 0}
        >
          <Text style={styles.nextTurnIcon}>▶</Text>
          <Text style={styles.nextTurnText}>Tour suiv.</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setShowLog(false)} style={[styles.tab, !showLog && styles.tabActive]}>
          <Text style={[styles.tabText, !showLog && styles.tabTextActive]}>⚔️ Combat</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowLog(true)} style={[styles.tab, showLog && styles.tabActive]}>
          <Text style={[styles.tabText, showLog && styles.tabTextActive]}>📜 Journal ({activeCombat.log.length})</Text>
        </TouchableOpacity>
      </View>

      {!showLog ? (
        <FlatList
          data={[...activeCombat.combatants].sort((a, b) => b.initiative - a.initiative)}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <CombatantRow
              combatant={item}
              isActive={item.isActive}
              onDamage={(amt) => dispatch(dealDamage({ combatId: activeCombat.id, combatantId: item.id, amount: amt }))}
              onHeal={(amt) => dispatch(healCombatant({ combatId: activeCombat.id, combatantId: item.id, amount: amt }))}
              onRemove={() => dispatch(removeCombatant({ combatId: activeCombat.id, combatantId: item.id }))}
              onCondition={() => setCondModal({ combatantId: item.id })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyCombat}>Ajoutez des combattants pour commencer</Text>
          }
          ListFooterComponent={
            <View style={styles.combatFooter}>
              <TouchableOpacity onPress={() => setAddModal(true)} style={styles.addCombatantBtn}>
                <Text style={styles.addCombatantText}>+ Ajouter un combattant</Text>
              </TouchableOpacity>
              <Button label="Terminer le combat" variant="danger" onPress={handleEndCombat} fullWidth style={{ marginTop: 8 }} />
            </View>
          }
        />
      ) : (
        <ScrollView contentContainerStyle={styles.logContent} showsVerticalScrollIndicator={false}>
          {activeCombat.log.map((entry) => (
            <View key={entry.id} style={[styles.logEntry, styles[`logEntry_${entry.type}` as keyof typeof styles] as any]}>
              <Text style={styles.logText}>{entry.message}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Timer setup modal */}
      <Modal visible={timerSetupModal} onClose={() => setTimerSetupModal(false)} title="⏱ Minuteur de tour">
        <Text style={styles.timerSetupLabel}>Durée du tour (secondes)</Text>
        <Input
          value={timerInput}
          onChangeText={setTimerInput}
          keyboardType="numeric"
          placeholder="60"
        />
        <View style={styles.timerPresets}>
          {[30, 60, 90, 120].map((s) => (
            <TouchableOpacity key={s} onPress={() => setTimerInput(String(s))} style={styles.timerPreset}>
              <Text style={styles.timerPresetText}>{s}s</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button label="Appliquer" onPress={handleTimerSetup} fullWidth />
      </Modal>

      {/* Add combatant modal */}
      <Modal visible={addModal} onClose={() => setAddModal(false)} title="Ajouter un combattant">
        <Input
          label="Nom *"
          value={newCombatantData.name}
          onChangeText={(v) => setNewCombatantData({ ...newCombatantData, name: v })}
          placeholder="Gobelin, Aragorn..."
        />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Input label="Initiative" value={String(newCombatantData.initiative)} onChangeText={(v) => setNewCombatantData({ ...newCombatantData, initiative: parseInt(v) || 0 })} keyboardType="numeric" containerStyle={{ flex: 1 }} />
          <Input label="PV max" value={String(newCombatantData.maxHP)} onChangeText={(v) => setNewCombatantData({ ...newCombatantData, maxHP: parseInt(v) || 1, currentHP: parseInt(v) || 1 })} keyboardType="numeric" containerStyle={{ flex: 1 }} />
          <Input label="CA" value={String(newCombatantData.armorClass)} onChangeText={(v) => setNewCombatantData({ ...newCombatantData, armorClass: parseInt(v) || 10 })} keyboardType="numeric" containerStyle={{ flex: 1 }} />
        </View>
        <View style={styles.enemyToggle}>
          <Text style={styles.enemyToggleText}>C'est un ennemi</Text>
          <TouchableOpacity
            onPress={() => setNewCombatantData({ ...newCombatantData, isEnemy: !newCombatantData.isEnemy })}
            style={[styles.toggleBtn, newCombatantData.isEnemy && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleBtnText, newCombatantData.isEnemy && styles.toggleBtnTextActive]}>
              {newCombatantData.isEnemy ? '👹 Ennemi' : '🧙 Allié'}
            </Text>
          </TouchableOpacity>
        </View>
        <Button label="Ajouter" onPress={handleAddCombatant} fullWidth />
      </Modal>

      {/* Condition modal */}
      <RNModal visible={!!condModal} transparent animationType="slide" onRequestClose={() => setCondModal(null)}>
        <View style={styles.condOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={() => setCondModal(null)} />
          <View style={styles.condSheet}>
            <Text style={styles.condTitle}>Conditions</Text>
            <ScrollView>
              {CONDITIONS.map((cond) => {
                const combatant = activeCombat.combatants.find((cb) => cb.id === condModal?.combatantId);
                const hasCondition = combatant?.conditions.includes(cond.id);
                return (
                  <TouchableOpacity
                    key={cond.id}
                    style={[styles.condItem, hasCondition && { backgroundColor: cond.color + '22' }]}
                    onPress={() => {
                      if (!condModal) return;
                      if (hasCondition) {
                        dispatch(removeConditionFromCombatant({ combatId: activeCombat.id, combatantId: condModal.combatantId, condition: cond.id }));
                      } else {
                        dispatch(addConditionToCombatant({ combatId: activeCombat.id, combatantId: condModal.combatantId, condition: cond.id }));
                        triggerEffect('condition_applied');
                      }
                    }}
                  >
                    <View style={[styles.condDot, { backgroundColor: cond.color }]} />
                    <Text style={[styles.condItemText, hasCondition && { color: cond.color, fontWeight: '700' }]}>{cond.name}</Text>
                    {hasCondition && <Text style={{ color: cond.color }}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <Button label="Fermer" onPress={() => setCondModal(null)} fullWidth style={{ marginTop: 8 }} variant="ghost" />
          </View>
        </View>
      </RNModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  combatHeader: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, padding: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.sm,
  },
  roundBox: {
    width: 48, height: 48, borderRadius: borderRadius.round,
    backgroundColor: colors.primary + '22', borderWidth: 2, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  roundNum: { fontSize: 20, fontWeight: '900', color: colors.primary },
  roundLabel: { ...typography.caption, color: colors.primaryDark, textTransform: 'uppercase', fontSize: 8 },
  combatMeta: { flex: 1 },
  combatName: { ...typography.h5, color: colors.text },
  combatInfo: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  timerBox: {
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderRadius: borderRadius.md,
    paddingHorizontal: 10, paddingVertical: 6, minWidth: 64,
  },
  timerValue: { fontSize: 16, fontWeight: '800', lineHeight: 20 },
  timerLabel: { fontSize: 10, color: colors.textMuted },
  timerSetupLabel: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.sm },
  timerPresets: { flexDirection: 'row', gap: 8, marginBottom: spacing.md },
  timerPreset: {
    flex: 1, paddingVertical: 8, borderRadius: borderRadius.md, alignItems: 'center',
    backgroundColor: colors.surfaceVariant, borderWidth: 1, borderColor: colors.border,
  },
  timerPresetText: { ...typography.body, color: colors.textSecondary, fontWeight: '600' },
  nextTurnBtn: {
    backgroundColor: colors.primary, borderRadius: borderRadius.md,
    paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center',
  },
  nextTurnIcon: { fontSize: 14, color: colors.background },
  nextTurnText: { ...typography.caption, color: colors.background, fontWeight: '700' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { ...typography.bodySmall, color: colors.textMuted, fontWeight: '600' },
  tabTextActive: { color: colors.primary },
  list: { padding: spacing.md, paddingBottom: 40 },
  emptyCombat: { ...typography.body, color: colors.textMuted, textAlign: 'center', padding: spacing.xl },
  combatantCard: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg,
    marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border,
    padding: spacing.sm, ...shadows.small, overflow: 'hidden',
  },
  combatantCardActive: { borderColor: colors.primary, borderWidth: 2 },
  combatantCardEnemy: { borderColor: colors.error + '66' },
  combatantCardKO: { opacity: 0.5 },
  activePulse: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
    backgroundColor: colors.primary,
  },
  combatantTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.sm },
  initBadge: {
    width: 44, height: 44, borderRadius: borderRadius.round,
    backgroundColor: colors.surfaceVariant, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  initValue: { fontSize: 16, fontWeight: '900', color: colors.text },
  initLabel: { ...typography.caption, color: colors.textMuted, fontSize: 8, textTransform: 'uppercase' },
  combatantInfo: { flex: 1 },
  combatantNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  combatantName: { ...typography.h5, color: colors.text, flex: 1 },
  deadName: { color: colors.textMuted, textDecorationLine: 'line-through' },
  hpTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  hpText: { ...typography.bodySmall, fontWeight: '700' },
  acText: { ...typography.bodySmall, color: colors.textSecondary },
  removeBtn: { padding: 6 },
  removeBtnText: { color: colors.error, fontSize: 16 },
  conditionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: spacing.sm },
  combatantActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  damageBtn: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: borderRadius.md,
    backgroundColor: colors.error + '22', borderWidth: 1, borderColor: colors.error,
  },
  damageBtnText: { ...typography.bodySmall, color: colors.error, fontWeight: '700' },
  healBtn: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: borderRadius.md,
    backgroundColor: colors.success + '22', borderWidth: 1, borderColor: colors.success,
  },
  healBtnText: { ...typography.bodySmall, color: colors.success, fontWeight: '700' },
  condBtn: {
    width: 36, height: 36, borderRadius: borderRadius.round,
    backgroundColor: colors.secondary + '22', borderWidth: 1, borderColor: colors.secondary,
    alignItems: 'center', justifyContent: 'center',
  },
  condBtnText: { fontSize: 16 },
  addCombatantBtn: {
    borderWidth: 1, borderColor: colors.primary, borderStyle: 'dashed',
    borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center',
  },
  addCombatantText: { color: colors.primary, fontWeight: '600' },
  combatFooter: { gap: 8 },
  logContent: { padding: spacing.md },
  logEntry: {
    backgroundColor: colors.card, borderRadius: borderRadius.md, padding: spacing.sm,
    marginBottom: 6, borderLeftWidth: 3, borderLeftColor: colors.border,
  },
  logEntry_system: { borderLeftColor: colors.textMuted },
  logEntry_damage: { borderLeftColor: colors.error },
  logEntry_heal: { borderLeftColor: colors.success },
  logEntry_condition: { borderLeftColor: colors.secondary },
  logEntry_action: { borderLeftColor: colors.primary },
  logText: { ...typography.bodySmall, color: colors.textSecondary },
  pastCombats: { padding: spacing.md },
  pastTitle: { ...typography.label, color: colors.textMuted, textTransform: 'uppercase', marginBottom: spacing.sm },
  pastCombatRow: {
    backgroundColor: colors.card, borderRadius: borderRadius.md, padding: spacing.sm,
    marginBottom: 8, borderWidth: 1, borderColor: colors.border,
  },
  pastCombatName: { ...typography.body, color: colors.textSecondary, fontWeight: '600' },
  pastCombatMeta: { ...typography.caption, color: colors.textMuted },
  enemyToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  enemyToggleText: { ...typography.body, color: colors.text },
  toggleBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: borderRadius.round,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceVariant,
  },
  toggleBtnActive: { borderColor: colors.error, backgroundColor: colors.error + '22' },
  toggleBtnText: { ...typography.body, color: colors.textSecondary, fontWeight: '600' },
  toggleBtnTextActive: { color: colors.error },
  condOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  condSheet: {
    backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.xxl, borderTopRightRadius: borderRadius.xxl,
    padding: spacing.lg, borderTopWidth: 1, borderColor: colors.border, maxHeight: '70%',
  },
  condTitle: { ...typography.h4, color: colors.primary, textAlign: 'center', marginBottom: spacing.md },
  condItem: {
    flexDirection: 'row', alignItems: 'center', padding: spacing.sm,
    borderRadius: borderRadius.md, marginBottom: 4, gap: 12,
  },
  condDot: { width: 12, height: 12, borderRadius: 6 },
  condItemText: { ...typography.body, color: colors.text, flex: 1 },
});
