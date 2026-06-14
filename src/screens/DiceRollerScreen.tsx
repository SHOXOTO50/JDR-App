import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, FlatList, Animated,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../store';
import { addRoll, clearHistory } from '../store/slices/diceSlice';
import {
  rollFormula, rollWithAdvantage, rollWithDisadvantage,
  getDiceColor, getDiceEmoji, isCritical, isCriticalFail, DICE_TYPES,
  DiceSides, parseDiceFormula,
} from '../utils/dice';
import { formatRollResult } from '../utils/dice';
import { formatDateTime } from '../utils/helpers';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { DiceRoll } from '../types';
import { Alert } from 'react-native';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const DiceButton = ({
  sides,
  count,
  onPress,
  onLongPress,
}: {
  sides: DiceSides;
  count: number;
  onPress: () => void;
  onLongPress: () => void;
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const color = getDiceColor(sides);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, speed: 50 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.diceBtn, { borderColor: color, transform: [{ scale }] }]}
      activeOpacity={0.9}
    >
      <View style={[styles.diceBtnInner, { backgroundColor: color + '22' }]}>
        {count > 1 && (
          <View style={[styles.diceBadge, { backgroundColor: color }]}>
            <Text style={styles.diceBadgeText}>{count}</Text>
          </View>
        )}
        <Text style={[styles.diceBtnLabel, { color }]}>{getDiceEmoji(sides)}</Text>
        <Text style={styles.diceSides}>D{sides}</Text>
      </View>
    </AnimatedTouchable>
  );
};

const RollResultCard = ({ roll }: { roll: DiceRoll }) => {
  const crit = isCritical(roll);
  const critFail = isCriticalFail(roll);
  const color = crit ? colors.primary : critFail ? colors.error : colors.text;

  return (
    <View style={[styles.rollCard, crit && styles.rollCardCrit, critFail && styles.rollCardCritFail]}>
      <View style={styles.rollTop}>
        <Text style={styles.rollFormula}>{roll.formula}</Text>
        {crit && <Text style={styles.critLabel}>CRITIQUE !</Text>}
        {critFail && <Text style={styles.critFailLabel}>ÉCHEC CRITIQUE !</Text>}
        <Text style={[styles.rollTotal, { color }]}>{roll.total}</Text>
      </View>
      {roll.dice.length > 1 && (
        <Text style={styles.rollBreakdown}>{formatRollResult(roll)}</Text>
      )}
      <Text style={styles.rollTime}>{formatDateTime(roll.timestamp)}</Text>
    </View>
  );
};

export const DiceRollerScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const rolls = useAppSelector((s) => s.dice.rolls);
  const currentId = useAppSelector((s) => s.characters.currentCharacterId) ?? undefined;

  const [diceCounts, setDiceCounts] = useState<Record<number, number>>({});
  const [formula, setFormula] = useState('');
  const [lastRoll, setLastRoll] = useState<DiceRoll | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'dice' | 'formula'>('dice');

  const incrementDie = (sides: DiceSides) => {
    setDiceCounts((prev) => ({ ...prev, [sides]: (prev[sides] ?? 0) + 1 }));
  };

  const resetDie = (sides: DiceSides) => {
    setDiceCounts((prev) => ({ ...prev, [sides]: 0 }));
  };

  const rollSingle = (sides: DiceSides) => {
    const count = diceCounts[sides] || 1;
    const roll = rollFormula(`${count}D${sides}`, currentId);
    dispatch(addRoll(roll));
    setLastRoll(roll);
  };

  const rollAll = () => {
    const parts = Object.entries(diceCounts)
      .filter(([, count]) => count > 0)
      .map(([sides, count]) => `${count}D${sides}`);
    if (parts.length === 0) return;
    const roll = rollFormula(parts.join('+'), currentId);
    dispatch(addRoll(roll));
    setLastRoll(roll);
    setDiceCounts({});
  };

  const rollFormulaInput = () => {
    const cleaned = formula.trim();
    if (!cleaned) { Alert.alert('Formule vide', 'Entrez une formule de dés (ex: 2D6+3)'); return; }
    const parsed = parseDiceFormula(cleaned);
    if (!parsed.valid) { Alert.alert('Formule invalide', 'Format accepté: XDY+Z (ex: 2D6+3, 1D20-1)'); return; }
    const roll = rollFormula(cleaned.toUpperCase(), currentId);
    dispatch(addRoll(roll));
    setLastRoll(roll);
  };

  const handleAdvantage = () => {
    const roll = rollWithAdvantage(currentId);
    dispatch(addRoll(roll));
    setLastRoll(roll);
  };

  const handleDisadvantage = () => {
    const roll = rollWithDisadvantage(currentId);
    dispatch(addRoll(roll));
    setLastRoll(roll);
  };

  const hasDice = Object.values(diceCounts).some((c) => c > 0);

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setActiveTab('dice')}
          style={[styles.tab, activeTab === 'dice' && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeTab === 'dice' && styles.tabTextActive]}>🎲 Dés</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('formula')}
          style={[styles.tab, activeTab === 'formula' && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeTab === 'formula' && styles.tabTextActive]}>📐 Formule</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowHistory(!showHistory)}
          style={[styles.tab, showHistory && styles.tabActive]}
        >
          <Text style={[styles.tabText, showHistory && styles.tabTextActive]}>📜 Historique ({rolls.length})</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Last Roll Result */}
        {lastRoll && (
          <View style={styles.resultDisplay}>
            <Text style={styles.resultLabel}>Dernier jet</Text>
            {isCritical(lastRoll) && <Text style={styles.critBanner}>🏆 COUP CRITIQUE !</Text>}
            {isCriticalFail(lastRoll) && <Text style={styles.critFailBanner}>💀 ÉCHEC CRITIQUE !</Text>}
            <Text style={styles.resultFormula}>{lastRoll.formula}</Text>
            <Text style={[
              styles.resultTotal,
              isCritical(lastRoll) && { color: colors.primary },
              isCriticalFail(lastRoll) && { color: colors.error },
            ]}>
              {lastRoll.total}
            </Text>
            {lastRoll.dice.length > 1 && (
              <Text style={styles.resultBreakdown}>
                [{lastRoll.dice.map((d) => d.result).join(' + ')}]
                {lastRoll.modifier !== 0 ? ` ${lastRoll.modifier > 0 ? '+' : ''}${lastRoll.modifier}` : ''}
              </Text>
            )}
            {lastRoll.advantage && <Text style={styles.advLabel}>Avantage</Text>}
            {lastRoll.disadvantage && <Text style={styles.disadvLabel}>Désavantage</Text>}
          </View>
        )}

        {activeTab === 'dice' && (
          <>
            {/* Dice grid */}
            <View style={styles.diceGrid}>
              {DICE_TYPES.map((sides) => (
                <DiceButton
                  key={sides}
                  sides={sides}
                  count={diceCounts[sides] ?? 0}
                  onPress={() => rollSingle(sides)}
                  onLongPress={() => incrementDie(sides)}
                />
              ))}
            </View>

            <Text style={styles.diceHint}>Tapez pour lancer · Appui long pour sélectionner</Text>

            {/* Multi-dice controls */}
            {hasDice && (
              <View style={styles.multiDiceBar}>
                <Text style={styles.multiDiceText}>
                  {Object.entries(diceCounts)
                    .filter(([, c]) => c > 0)
                    .map(([s, c]) => `${c}D${s}`)
                    .join(' + ')}
                </Text>
                <TouchableOpacity onPress={rollAll} style={styles.rollAllBtn}>
                  <Text style={styles.rollAllText}>🎲 Lancer tout</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDiceCounts({})} style={styles.resetBtn}>
                  <Text style={styles.resetText}>Effacer</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* D20 special */}
            <View style={styles.d20Row}>
              <TouchableOpacity style={styles.d20Btn} onPress={handleAdvantage} activeOpacity={0.8}>
                <Text style={styles.d20BtnIcon}>⬆️</Text>
                <Text style={styles.d20BtnText}>Avantage</Text>
                <Text style={styles.d20BtnSub}>2D20 garder le plus haut</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.d20Btn, styles.d20BtnDisadv]} onPress={handleDisadvantage} activeOpacity={0.8}>
                <Text style={styles.d20BtnIcon}>⬇️</Text>
                <Text style={styles.d20BtnText}>Désavantage</Text>
                <Text style={styles.d20BtnSub}>2D20 garder le plus bas</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {activeTab === 'formula' && (
          <View style={styles.formulaSection}>
            <Text style={styles.formulaTitle}>Formule personnalisée</Text>
            <Text style={styles.formulaDesc}>Exemples: 1D20+5, 2D6+3, 4D8, 1D100</Text>
            <View style={styles.formulaInputRow}>
              <TextInput
                style={styles.formulaInput}
                value={formula}
                onChangeText={setFormula}
                placeholder="Ex: 2D6+3"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="characters"
                returnKeyType="done"
                onSubmitEditing={rollFormulaInput}
              />
              <TouchableOpacity onPress={rollFormulaInput} style={styles.formulaRollBtn}>
                <Text style={styles.formulaRollBtnText}>🎲</Text>
              </TouchableOpacity>
            </View>
            {/* Quick formulas */}
            <Text style={styles.quickTitle}>Formules rapides</Text>
            <View style={styles.quickGrid}>
              {['1D4', '1D6', '1D8', '1D10', '1D12', '1D20', '1D100', '2D6', '2D8', '4D6', '1D20+5', '2D6+3'].map((f) => (
                <TouchableOpacity
                  key={f}
                  style={styles.quickChip}
                  onPress={() => {
                    const roll = rollFormula(f, currentId);
                    dispatch(addRoll(roll));
                    setLastRoll(roll);
                    setFormula(f);
                  }}
                >
                  <Text style={styles.quickChipText}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* History */}
        {showHistory && (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Historique des jets</Text>
              {rolls.length > 0 && (
                <TouchableOpacity onPress={() => {
                  Alert.alert('Effacer', 'Effacer tout l\'historique ?', [
                    { text: 'Annuler', style: 'cancel' },
                    { text: 'Effacer', style: 'destructive', onPress: () => dispatch(clearHistory()) },
                  ]);
                }}>
                  <Text style={styles.clearHistoryText}>Effacer</Text>
                </TouchableOpacity>
              )}
            </View>
            {rolls.length === 0 ? (
              <Text style={styles.noHistory}>Aucun jet enregistré</Text>
            ) : (
              rolls.map((roll) => <RollResultCard key={roll.id} roll={roll} />)
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { ...typography.bodySmall, color: colors.textMuted, fontWeight: '600' },
  tabTextActive: { color: colors.primary },
  content: { padding: spacing.md, paddingBottom: 40 },
  resultDisplay: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    ...shadows.gold,
  },
  resultLabel: { ...typography.caption, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 2 },
  critBanner: { fontSize: 18, fontWeight: '900', color: colors.primary, marginTop: 4 },
  critFailBanner: { fontSize: 18, fontWeight: '900', color: colors.error, marginTop: 4 },
  resultFormula: { ...typography.body, color: colors.textSecondary, marginTop: 4 },
  resultTotal: { fontSize: 80, fontWeight: '900', color: colors.text, lineHeight: 88 },
  resultBreakdown: { ...typography.bodySmall, color: colors.textSecondary },
  advLabel: { ...typography.caption, color: colors.success, fontWeight: '700', marginTop: 4 },
  disadvLabel: { ...typography.caption, color: colors.error, fontWeight: '700', marginTop: 4 },
  diceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  diceBtn: {
    width: 90,
    height: 90,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    overflow: 'hidden',
    ...shadows.medium,
  },
  diceBtnInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  diceBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceBadgeText: { fontSize: 11, fontWeight: '900', color: '#000' },
  diceBtnLabel: { fontSize: 22, fontWeight: '900', letterSpacing: -1 },
  diceSides: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  diceHint: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.md },
  multiDiceBar: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  multiDiceText: { flex: 1, ...typography.body, color: colors.primary, fontWeight: '700' },
  rollAllBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  rollAllText: { ...typography.body, color: colors.background, fontWeight: '800' },
  resetBtn: { paddingHorizontal: 12, paddingVertical: 8 },
  resetText: { ...typography.bodySmall, color: colors.textMuted },
  d20Row: { flexDirection: 'row', gap: 12, marginBottom: spacing.md },
  d20Btn: {
    flex: 1, backgroundColor: colors.card, borderRadius: borderRadius.lg,
    padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.success,
  },
  d20BtnDisadv: { borderColor: colors.error },
  d20BtnIcon: { fontSize: 24, marginBottom: 4 },
  d20BtnText: { ...typography.h5, color: colors.text, marginBottom: 2 },
  d20BtnSub: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
  formulaSection: { marginBottom: spacing.md },
  formulaTitle: { ...typography.h4, color: colors.text, marginBottom: 4 },
  formulaDesc: { ...typography.bodySmall, color: colors.textMuted, marginBottom: spacing.md },
  formulaInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.md },
  formulaInput: {
    flex: 1, backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingVertical: 14,
    color: colors.text, fontSize: 20, fontWeight: '700', textAlign: 'center', letterSpacing: 2,
  },
  formulaRollBtn: {
    width: 56, height: 56, borderRadius: borderRadius.md, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  formulaRollBtnText: { fontSize: 28 },
  quickTitle: { ...typography.label, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 8 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: borderRadius.round,
    backgroundColor: colors.surfaceVariant, borderWidth: 1, borderColor: colors.border,
  },
  quickChipText: { ...typography.body, color: colors.text, fontWeight: '700' },
  historySection: { marginTop: spacing.md },
  historyHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm,
  },
  historyTitle: { ...typography.h5, color: colors.textSecondary },
  clearHistoryText: { ...typography.bodySmall, color: colors.error, fontWeight: '600' },
  noHistory: { ...typography.body, color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.lg },
  rollCard: {
    backgroundColor: colors.card, borderRadius: borderRadius.md,
    padding: spacing.sm, marginBottom: 8, borderWidth: 1, borderColor: colors.border,
  },
  rollCardCrit: { borderColor: colors.primary, backgroundColor: colors.primaryDark + '22' },
  rollCardCritFail: { borderColor: colors.error, backgroundColor: colors.error + '11' },
  rollTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rollFormula: { ...typography.body, color: colors.textSecondary, flex: 1 },
  critLabel: { ...typography.bodySmall, color: colors.primary, fontWeight: '900', marginHorizontal: 8 },
  critFailLabel: { ...typography.bodySmall, color: colors.error, fontWeight: '900', marginHorizontal: 8 },
  rollTotal: { fontSize: 24, fontWeight: '900', color: colors.text },
  rollBreakdown: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  rollTime: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
});
