import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Alert, Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '../store';
import {
  updateCharacterHP, updateCharacterCurrency, toggleInspiration,
  selectCharacter, updateDeathSaves,
} from '../store/slices/charactersSlice';
import {
  ensureResources, useSpellSlot, restoreSpellSlot, longRest,
  useResource, restoreResource, useCustomResource, restoreCustomResource,
} from '../store/slices/resourcesSlice';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { getModifierString, getModifier, formatGold } from '../utils/helpers';
import { HPBar } from '../components/common/HPBar';
import { Card } from '../components/common/Card';
import { SectionHeader } from '../components/common/SectionHeader';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SPELL_SCHOOLS = ['Abjuration', 'Conjuration', 'Divination', 'Enchantement', 'Évocation', 'Illusion', 'Nécromancie', 'Transmutation'];

export const CharacterSheetScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const characters = useAppSelector((s) => s.characters.characters);
  const currentId = useAppSelector((s) => s.characters.currentCharacterId);
  const character = characters.find((c) => c.id === currentId);
  const resources = useAppSelector((s) => s.resources.resources.find((r) => r.characterId === currentId));

  const [hpModal, setHpModal] = useState(false);
  const [hpAmount, setHpAmount] = useState('');
  const [hpMode, setHpMode] = useState<'damage' | 'heal' | 'set'>('damage');
  const [currencyModal, setCurrencyModal] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('stats');

  useEffect(() => {
    if (currentId && !resources) {
      dispatch(ensureResources(currentId));
    }
  }, [currentId]);

  if (!character) return null;

  const handleHPChange = () => {
    const amount = parseInt(hpAmount) || 0;
    if (amount <= 0) { Alert.alert('Valeur invalide'); return; }
    let newHP = character.currentHP;
    if (hpMode === 'damage') newHP = Math.max(0, character.currentHP - amount);
    else if (hpMode === 'heal') newHP = Math.min(character.maxHP, character.currentHP + amount);
    else newHP = Math.min(character.maxHP, Math.max(0, amount));
    dispatch(updateCharacterHP({ id: character.id, currentHP: newHP }));
    setHpModal(false);
    setHpAmount('');
  };

  const handleSwitchCharacter = () => {
    Alert.alert('Changer de personnage', 'Retourner à l\'écran de sélection ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Changer', onPress: () => dispatch(selectCharacter(null)) },
    ]);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getSavingThrowValue = (ability: string) => {
    const stat = character.stats.find((s) => s.abbreviation === ability);
    const base = stat ? getModifier(stat.value) : 0;
    const st = character.savingThrows?.find((s) => s.ability === ability);
    return base + (st?.proficient ? character.proficiencyBonus : 0);
  };

  const getSkillValue = (skill: { ability: string; proficient: boolean; expertise: boolean }) => {
    const stat = character.stats.find((s) => s.abbreviation === skill.ability);
    const base = stat ? getModifier(stat.value) : 0;
    const bonus = skill.expertise
      ? character.proficiencyBonus * 2
      : skill.proficient
      ? character.proficiencyBonus
      : 0;
    return base + bonus;
  };

  const spellsByLevel = character.spells.reduce<Record<number, typeof character.spells>>((acc, spell) => {
    if (!acc[spell.level]) acc[spell.level] = [];
    acc[spell.level].push(spell);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleSwitchCharacter} style={styles.switchBtn}>
            <Text style={styles.switchBtnText}>⟵</Text>
          </TouchableOpacity>
          {character.portrait ? (
            <Image source={{ uri: character.portrait }} style={styles.portrait} />
          ) : (
            <View style={styles.portraitPlaceholder}>
              <Text style={styles.portraitEmoji}>⚔️</Text>
            </View>
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.charName}>{character.name}</Text>
            <Text style={styles.charClass}>{character.characterClass}{character.subclass ? ` · ${character.subclass}` : ''}</Text>
            <View style={styles.charMeta}>
              <Badge label={`Niv. ${character.level}`} color={colors.primary} />
              <Text style={styles.metaDot}> · </Text>
              <Text style={styles.charRace}>{character.race}</Text>
              {character.alignment && <Text style={styles.charAlignment}> · {character.alignment}</Text>}
            </View>
            <Text style={styles.charSystem}>{character.system}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('CreateCharacter', { characterId: character.id })} style={styles.editBtn}>
            <Text style={styles.editBtnText}>✏️</Text>
          </TouchableOpacity>
        </View>

        {/* Inspiration */}
        <TouchableOpacity
          onPress={() => dispatch(toggleInspiration(character.id))}
          style={[styles.inspirationRow, character.inspiration && styles.inspirationActive]}
        >
          <Text style={styles.inspirationText}>✨ Inspiration {character.inspiration ? '(Actif)' : ''}</Text>
        </TouchableOpacity>

        {/* HP Section */}
        <Card style={styles.hpCard} elevated>
          <SectionHeader title="Points de Vie" action={{ label: 'Modifier', onPress: () => setHpModal(true) }} />
          <HPBar current={character.currentHP} max={character.maxHP} temp={character.tempHP} />
          <View style={styles.hpButtons}>
            <TouchableOpacity
              style={[styles.hpBtn, { backgroundColor: colors.error + '22', borderColor: colors.error }]}
              onPress={() => {
                setHpMode('damage');
                setHpModal(true);
              }}
            >
              <Text style={[styles.hpBtnText, { color: colors.error }]}>− Dégâts</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.hpBtn, { backgroundColor: colors.success + '22', borderColor: colors.success }]}
              onPress={() => {
                setHpMode('heal');
                setHpModal(true);
              }}
            >
              <Text style={[styles.hpBtnText, { color: colors.success }]}>+ Soins</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Core Stats Bar */}
        <View style={styles.statsBar}>
          {[
            { label: 'CA', value: character.armorClass },
            { label: 'Init.', value: character.initiative >= 0 ? `+${character.initiative}` : `${character.initiative}` },
            { label: 'Vit.', value: `${character.speed}m` },
            { label: 'Mait.', value: `+${character.proficiencyBonus}` },
          ].map((item) => (
            <View key={item.label} style={styles.statBarItem}>
              <Text style={styles.statBarValue}>{item.value}</Text>
              <Text style={styles.statBarLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Primary Stats */}
        <Card style={styles.section}>
          <TouchableOpacity onPress={() => toggleSection('stats')} style={styles.sectionToggle}>
            <SectionHeader title={`Statistiques (${character.stats.length})`} />
            <Text style={styles.toggleIcon}>{expandedSection === 'stats' ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {expandedSection === 'stats' && (
            <View style={styles.statsGrid}>
              {character.stats.map((stat) => (
                <View key={stat.id} style={styles.statBox}>
                  <Text style={styles.statAbbrv}>{stat.abbreviation}</Text>
                  <Text style={styles.statNum}>{stat.value}</Text>
                  <Text style={styles.statModifier}>{getModifierString(getModifier(stat.value))}</Text>
                  <Text style={styles.statFullName}>{stat.name}</Text>
                </View>
              ))}
            </View>
          )}
        </Card>

        {/* Skills */}
        {character.skills.length > 0 && (
          <Card style={styles.section}>
            <TouchableOpacity onPress={() => toggleSection('skills')} style={styles.sectionToggle}>
              <SectionHeader title={`Compétences (${character.skills.filter(s => s.proficient).length} maîtrisées)`} />
              <Text style={styles.toggleIcon}>{expandedSection === 'skills' ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {expandedSection === 'skills' && (
              <View>
                {character.skills.map((skill) => {
                  const val = getSkillValue(skill);
                  return (
                    <View key={skill.id} style={styles.skillRow}>
                      <View style={[
                        styles.profDot,
                        skill.expertise ? styles.profDotExpertise : skill.proficient ? styles.profDotOn : styles.profDotOff
                      ]} />
                      <Text style={styles.skillName}>{skill.name}</Text>
                      <Text style={styles.skillAbility}>{skill.ability}</Text>
                      <Text style={[styles.skillValue, val > 0 ? styles.positiveVal : val < 0 ? styles.negativeVal : {}]}>
                        {getModifierString(val)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </Card>
        )}

        {/* Saving Throws */}
        {character.savingThrows?.length > 0 && (
          <Card style={styles.section}>
            <TouchableOpacity onPress={() => toggleSection('saves')} style={styles.sectionToggle}>
              <SectionHeader title="Jets de sauvegarde" />
              <Text style={styles.toggleIcon}>{expandedSection === 'saves' ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {expandedSection === 'saves' && (
              <View>
                {character.savingThrows.map((st) => {
                  const val = getSavingThrowValue(st.ability);
                  return (
                    <View key={st.id} style={styles.skillRow}>
                      <View style={[styles.profDot, st.proficient ? styles.profDotOn : styles.profDotOff]} />
                      <Text style={styles.skillName}>{st.name}</Text>
                      <Text style={[styles.skillValue, val >= 0 ? styles.positiveVal : styles.negativeVal]}>
                        {getModifierString(val)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </Card>
        )}

        {/* Spells */}
        {character.spells.length > 0 && (
          <Card style={styles.section}>
            <TouchableOpacity onPress={() => toggleSection('spells')} style={styles.sectionToggle}>
              <SectionHeader title={`Sorts (${character.spells.length})`} />
              <Text style={styles.toggleIcon}>{expandedSection === 'spells' ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {expandedSection === 'spells' && Object.entries(spellsByLevel).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([level, spells]) => (
              <View key={level} style={styles.spellLevelGroup}>
                <Text style={styles.spellLevelTitle}>
                  {parseInt(level) === 0 ? 'Tours de magie' : `Niveau ${level}`}
                </Text>
                {spells.map((spell) => (
                  <View key={spell.id} style={styles.spellRow}>
                    <View style={[styles.preparedDot, spell.prepared && styles.preparedDotOn]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.spellName}>{spell.name}</Text>
                      <Text style={styles.spellMeta}>
                        {spell.school} · {spell.castingTime} · {spell.range}
                        {spell.ritual ? ' · Rituel' : ''}
                        {spell.concentration ? ' · Concentration' : ''}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </Card>
        )}

        {/* Resources (spell slots, ki, etc.) */}
        {resources && (
          <Card style={styles.section}>
            <TouchableOpacity onPress={() => toggleSection('resources')} style={styles.sectionToggle}>
              <SectionHeader title="Ressources" />
              <Text style={styles.toggleIcon}>{expandedSection === 'resources' ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {expandedSection === 'resources' && (
              <View style={styles.resourcesContainer}>
                {/* Spell slots */}
                {resources.spellSlots.map((slot) => {
                  if (slot.total === 0) return null;
                  return (
                    <View key={slot.level} style={styles.resourceRow}>
                      <Text style={styles.resourceLabel}>Sorts Niv.{slot.level}</Text>
                      <View style={styles.slotDots}>
                        {Array.from({ length: slot.total }).map((_, i) => {
                          const used = i < slot.used;
                          return (
                            <TouchableOpacity
                              key={i}
                              style={[styles.slotDot, used && styles.slotDotUsed]}
                              onPress={() => {
                                if (used) {
                                  dispatch(restoreSpellSlot({ characterId: currentId!, level: slot.level }));
                                } else {
                                  dispatch(useSpellSlot({ characterId: currentId!, level: slot.level }));
                                }
                              }}
                            />
                          );
                        })}
                      </View>
                      <Text style={styles.resourceCount}>{slot.total - slot.used}/{slot.total}</Text>
                    </View>
                  );
                })}
                {/* Ki */}
                {resources.ki.total > 0 && (
                  <View style={styles.resourceRow}>
                    <Text style={styles.resourceLabel}>🌀 Ki</Text>
                    <View style={styles.resourceBtns}>
                      <TouchableOpacity style={styles.resBtnMinus} onPress={() => dispatch(useResource({ characterId: currentId!, resource: 'ki' }))}>
                        <Text style={styles.resBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.resourceCount}>{resources.ki.total - resources.ki.used}/{resources.ki.total}</Text>
                      <TouchableOpacity style={styles.resBtnPlus} onPress={() => dispatch(restoreResource({ characterId: currentId!, resource: 'ki' }))}>
                        <Text style={styles.resBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                {/* Bardic Inspiration */}
                {resources.bardicInspiration.total > 0 && (
                  <View style={styles.resourceRow}>
                    <Text style={styles.resourceLabel}>🎵 Inspiration bardique</Text>
                    <View style={styles.resourceBtns}>
                      <TouchableOpacity style={styles.resBtnMinus} onPress={() => dispatch(useResource({ characterId: currentId!, resource: 'bardicInspiration' }))}>
                        <Text style={styles.resBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.resourceCount}>{resources.bardicInspiration.total - resources.bardicInspiration.used}/{resources.bardicInspiration.total}</Text>
                      <TouchableOpacity style={styles.resBtnPlus} onPress={() => dispatch(restoreResource({ characterId: currentId!, resource: 'bardicInspiration' }))}>
                        <Text style={styles.resBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                {/* Rage */}
                {resources.rage.total > 0 && (
                  <View style={styles.resourceRow}>
                    <Text style={styles.resourceLabel}>💢 Rages</Text>
                    <View style={styles.resourceBtns}>
                      <TouchableOpacity style={styles.resBtnMinus} onPress={() => dispatch(useResource({ characterId: currentId!, resource: 'rage' }))}>
                        <Text style={styles.resBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.resourceCount}>{resources.rage.total - resources.rage.used}/{resources.rage.total}</Text>
                      <TouchableOpacity style={styles.resBtnPlus} onPress={() => dispatch(restoreResource({ characterId: currentId!, resource: 'rage' }))}>
                        <Text style={styles.resBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                {/* Custom resources */}
                {resources.customResources.map((cr) => (
                  <View key={cr.id} style={styles.resourceRow}>
                    <Text style={styles.resourceLabel}>{cr.name}</Text>
                    <View style={styles.resourceBtns}>
                      <TouchableOpacity style={styles.resBtnMinus} onPress={() => dispatch(useCustomResource({ characterId: currentId!, id: cr.id }))}>
                        <Text style={styles.resBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.resourceCount}>{cr.total - cr.used}/{cr.total}</Text>
                      <TouchableOpacity style={styles.resBtnPlus} onPress={() => dispatch(restoreCustomResource({ characterId: currentId!, id: cr.id }))}>
                        <Text style={styles.resBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                <Button
                  label="Repos long (restaure tout)"
                  variant="ghost"
                  onPress={() => dispatch(longRest(currentId!))}
                  fullWidth
                  style={{ marginTop: spacing.sm }}
                />
              </View>
            )}
          </Card>
        )}

        {/* Currency */}
        <Card style={styles.section}>
          <TouchableOpacity onPress={() => toggleSection('currency')} style={styles.sectionToggle}>
            <SectionHeader title="Monnaie" action={{ label: 'Modifier', onPress: () => setCurrencyModal(true) }} />
            <Text style={styles.toggleIcon}>{expandedSection === 'currency' ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {expandedSection === 'currency' && (
            <View style={styles.currencyRow}>
              {([
                { key: 'copper', label: 'PC', color: colors.copper },
                { key: 'silver', label: 'PA', color: colors.silver },
                { key: 'electrum', label: 'PE', color: '#a3e0a3' },
                { key: 'gold', label: 'PO', color: colors.gold },
                { key: 'platinum', label: 'PP', color: colors.platinum },
              ] as const).map((coin) => (
                <View key={coin.key} style={styles.coinBox}>
                  <Text style={[styles.coinValue, { color: coin.color }]}>
                    {character.currency[coin.key]}
                  </Text>
                  <Text style={styles.coinLabel}>{coin.label}</Text>
                </View>
              ))}
            </View>
          )}
        </Card>

        {/* Description */}
        {(character.background || character.personality) && (
          <Card style={styles.section}>
            <TouchableOpacity onPress={() => toggleSection('desc')} style={styles.sectionToggle}>
              <SectionHeader title="Description" />
              <Text style={styles.toggleIcon}>{expandedSection === 'desc' ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {expandedSection === 'desc' && (
              <>
                {character.background && (
                  <>
                    <Text style={styles.descLabel}>Historique</Text>
                    <Text style={styles.descText}>{character.background}</Text>
                  </>
                )}
                {character.personality && (
                  <>
                    <Text style={[styles.descLabel, { marginTop: 12 }]}>Personnalité</Text>
                    <Text style={styles.descText}>{character.personality}</Text>
                  </>
                )}
              </>
            )}
          </Card>
        )}
      </ScrollView>

      {/* HP Modal */}
      <Modal visible={hpModal} transparent animationType="fade" onRequestClose={() => setHpModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Modifier les PV</Text>
            <View style={styles.modeRow}>
              {([['damage', '🗡️ Dégâts'], ['heal', '💚 Soins'], ['set', '⚙️ Définir']] as const).map(([m, label]) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setHpMode(m)}
                  style={[styles.modeBtn, hpMode === m && styles.modeBtnActive]}
                >
                  <Text style={[styles.modeBtnText, hpMode === m && styles.modeBtnTextActive]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Input
              label={hpMode === 'set' ? 'Nouveaux PV' : 'Montant'}
              value={hpAmount}
              onChangeText={setHpAmount}
              keyboardType="numeric"
              placeholder="0"
              containerStyle={{ marginTop: 8 }}
            />
            <View style={styles.modalButtons}>
              <Button label="Annuler" onPress={() => setHpModal(false)} variant="ghost" style={{ flex: 1 }} />
              <Button label="Appliquer" onPress={handleHPChange} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Currency Modal */}
      <CurrencyModal
        visible={currencyModal}
        currency={character.currency}
        onClose={() => setCurrencyModal(false)}
        onSave={(currency) => {
          dispatch(updateCharacterCurrency({ id: character.id, currency }));
          setCurrencyModal(false);
        }}
      />
    </View>
  );
};

const CurrencyModal = ({
  visible, currency, onClose, onSave,
}: {
  visible: boolean;
  currency: any;
  onClose: () => void;
  onSave: (c: any) => void;
}) => {
  const [values, setValues] = useState({ ...currency });
  useEffect(() => { setValues({ ...currency }); }, [currency, visible]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Monnaie</Text>
          {(['copper', 'silver', 'electrum', 'gold', 'platinum'] as const).map((key) => (
            <Input
              key={key}
              label={{ copper: 'Pièces de cuivre', silver: 'Pièces d\'argent', electrum: 'Pièces d\'électrum', gold: 'Pièces d\'or', platinum: 'Pièces de platine' }[key]}
              value={String(values[key])}
              onChangeText={(t) => setValues((v: any) => ({ ...v, [key]: parseInt(t) || 0 }))}
              keyboardType="numeric"
            />
          ))}
          <View style={styles.modalButtons}>
            <Button label="Annuler" onPress={onClose} variant="ghost" style={{ flex: 1 }} />
            <Button label="Sauvegarder" onPress={() => onSave(values)} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  switchBtn: { padding: spacing.xs, marginRight: spacing.sm },
  switchBtnText: { color: colors.textSecondary, fontSize: 20 },
  portrait: { width: 72, height: 72, borderRadius: borderRadius.lg, borderWidth: 2, borderColor: colors.primary },
  portraitPlaceholder: {
    width: 72, height: 72, borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceVariant, borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  portraitEmoji: { fontSize: 32 },
  headerInfo: { flex: 1, marginLeft: spacing.sm },
  charName: { ...typography.h4, color: colors.text, marginBottom: 2 },
  charClass: { ...typography.body, color: colors.primary, fontWeight: '600', marginBottom: 4 },
  charMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 2 },
  metaDot: { color: colors.textMuted },
  charRace: { ...typography.bodySmall, color: colors.textSecondary },
  charAlignment: { ...typography.bodySmall, color: colors.textMuted },
  charSystem: { ...typography.caption, color: colors.secondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  editBtn: { padding: spacing.xs },
  editBtnText: { fontSize: 22 },
  inspirationRow: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  inspirationActive: { borderColor: colors.primary, backgroundColor: colors.primaryDark + '33' },
  inspirationText: { color: colors.textSecondary, fontWeight: '600' },
  hpCard: { marginBottom: spacing.sm },
  hpButtons: { flexDirection: 'row', gap: 8, marginTop: spacing.sm },
  hpBtn: {
    flex: 1, borderWidth: 1, borderRadius: borderRadius.md,
    paddingVertical: 10, alignItems: 'center',
  },
  hpBtnText: { fontWeight: '700', fontSize: 14 },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  statBarItem: {
    flex: 1, alignItems: 'center', paddingVertical: 12,
    borderRightWidth: 1, borderRightColor: colors.border,
  },
  statBarValue: { fontSize: 20, fontWeight: '800', color: colors.text },
  statBarLabel: { ...typography.caption, color: colors.textMuted, marginTop: 2, textTransform: 'uppercase' },
  section: { marginBottom: spacing.sm },
  sectionToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleIcon: { color: colors.textMuted, fontSize: 12, marginTop: -8 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: spacing.sm,
  },
  statBox: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 88,
    flex: 1,
  },
  statAbbrv: { ...typography.label, color: colors.primary, textTransform: 'uppercase', letterSpacing: 1 },
  statNum: { fontSize: 28, fontWeight: '800', color: colors.text, lineHeight: 34 },
  statModifier: { fontSize: 16, fontWeight: '700', color: colors.primaryLight },
  statFullName: { ...typography.caption, color: colors.textMuted, marginTop: 2, textAlign: 'center' },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '44',
  },
  profDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10, borderWidth: 1, borderColor: colors.border },
  profDotOff: { backgroundColor: 'transparent' },
  profDotOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  profDotExpertise: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  skillName: { flex: 1, ...typography.body, color: colors.text },
  skillAbility: { ...typography.caption, color: colors.textMuted, marginRight: 12, width: 28 },
  skillValue: { ...typography.body, fontWeight: '700', width: 32, textAlign: 'right', color: colors.textSecondary },
  positiveVal: { color: colors.primaryLight },
  negativeVal: { color: colors.error },
  spellLevelGroup: { marginTop: spacing.sm },
  spellLevelTitle: { ...typography.label, color: colors.secondary, textTransform: 'uppercase', marginBottom: 6 },
  spellRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border + '44' },
  preparedDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border, marginTop: 5, marginRight: 10 },
  preparedDotOn: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  spellName: { ...typography.body, color: colors.text, fontWeight: '600', marginBottom: 2 },
  spellMeta: { ...typography.caption, color: colors.textSecondary },
  currencyRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: spacing.sm },
  coinBox: { alignItems: 'center' },
  coinValue: { fontSize: 22, fontWeight: '800' },
  coinLabel: { ...typography.caption, color: colors.textMuted, textTransform: 'uppercase', marginTop: 2 },
  descLabel: { ...typography.label, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 6 },
  descText: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  resourcesContainer: { marginTop: spacing.sm, gap: 10 },
  resourceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resourceLabel: { ...typography.bodySmall, color: colors.textSecondary, flex: 1, fontWeight: '600' },
  slotDots: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  slotDot: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1.5, borderColor: colors.secondary, backgroundColor: colors.secondary + '33',
  },
  slotDotUsed: { backgroundColor: 'transparent', borderColor: colors.border },
  resourceCount: { ...typography.bodySmall, color: colors.text, fontWeight: '700', minWidth: 36, textAlign: 'right' },
  resourceBtns: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resBtnMinus: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.error + '22', borderWidth: 1, borderColor: colors.error,
    alignItems: 'center', justifyContent: 'center',
  },
  resBtnPlus: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.success + '22', borderWidth: 1, borderColor: colors.success,
    alignItems: 'center', justifyContent: 'center',
  },
  resBtnText: { color: colors.text, fontWeight: '700', fontSize: 16, lineHeight: 18 },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  modalBox: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg, width: '100%', borderWidth: 1, borderColor: colors.border },
  modalTitle: { ...typography.h4, color: colors.primary, marginBottom: spacing.md, textAlign: 'center' },
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: spacing.sm },
  modeBtn: {
    flex: 1, paddingVertical: 8, borderRadius: borderRadius.md, alignItems: 'center',
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceVariant,
  },
  modeBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryDark + '33' },
  modeBtnText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600' },
  modeBtnTextActive: { color: colors.primary },
  modalButtons: { flexDirection: 'row', gap: 8, marginTop: spacing.md },
});
