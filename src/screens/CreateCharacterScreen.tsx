import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Image, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useAppDispatch, useAppSelector } from '../store';
import { addCharacter, updateCharacter } from '../store/slices/charactersSlice';
import { Character, CharacterStat, CharacterSkill } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { generateId, DEFAULT_DND_STATS, DEFAULT_DND_SKILLS, getProficiencyBonus } from '../utils/helpers';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { RootStackParamList } from '../navigation/AppNavigator';

type RouteType = RouteProp<RootStackParamList, 'CreateCharacter'>;

const SYSTEMS = ['D&D 5e', 'Pathfinder', 'Pathfinder 2e', 'Warhammer', 'Call of Cthulhu', 'Personnalisé'];
const ALIGNMENTS = ['Loyal Bon', 'Neutre Bon', 'Chaotique Bon', 'Loyal Neutre', 'Vrai Neutre', 'Chaotique Neutre', 'Loyal Mauvais', 'Neutre Mauvais', 'Chaotique Mauvais'];
const STEPS = ['Identité', 'Profil', 'Statistiques', 'Portrait'];

const StepIndicator = ({ current, total }: { current: number; total: number }) => (
  <View style={styles.stepRow}>
    {Array.from({ length: total }).map((_, i) => (
      <View key={i} style={[styles.stepDot, i === current && styles.stepDotActive, i < current && styles.stepDotDone]} />
    ))}
  </View>
);

const SelectButton = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={[styles.selectBtn, selected && styles.selectBtnActive]} activeOpacity={0.7}>
    <Text style={[styles.selectBtnText, selected && styles.selectBtnTextActive]}>{label}</Text>
  </TouchableOpacity>
);

export const CreateCharacterScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteType>();
  const dispatch = useAppDispatch();
  const characters = useAppSelector((s) => s.characters.characters);

  const editingId = route.params?.characterId;
  const existing = editingId ? characters.find((c) => c.id === editingId) : undefined;

  const [step, setStep] = useState(0);
  const [name, setName] = useState(existing?.name ?? '');
  const [race, setRace] = useState(existing?.race ?? '');
  const [charClass, setCharClass] = useState(existing?.characterClass ?? '');
  const [subclass, setSubclass] = useState(existing?.subclass ?? '');
  const [level, setLevel] = useState(String(existing?.level ?? 1));
  const [age, setAge] = useState(existing?.age ?? '');
  const [height, setHeight] = useState(existing?.height ?? '');
  const [weight, setWeight] = useState(existing?.weight ?? '');
  const [system, setSystem] = useState(existing?.system ?? 'D&D 5e');
  const [background, setBackground] = useState(existing?.background ?? '');
  const [personality, setPersonality] = useState(existing?.personality ?? '');
  const [alignment, setAlignment] = useState(existing?.alignment ?? '');
  const [currentHP, setCurrentHP] = useState(String(existing?.currentHP ?? 10));
  const [maxHP, setMaxHP] = useState(String(existing?.maxHP ?? 10));
  const [ac, setAC] = useState(String(existing?.armorClass ?? 10));
  const [speed, setSpeed] = useState(String(existing?.speed ?? 9));
  const [portrait, setPortrait] = useState(existing?.portrait ?? '');
  const [stats, setStats] = useState<CharacterStat[]>(existing?.stats ?? DEFAULT_DND_STATS.map(s => ({ ...s, id: generateId() })));

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Autorisez l\'accès à la galerie pour choisir un portrait.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) setPortrait(result.assets[0].uri);
  };

  const updateStat = (id: string, value: string) => {
    setStats((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value: Math.max(1, parseInt(value) || 1) } : s))
    );
  };

  const addCustomStat = () => {
    setStats((prev) => [...prev, { id: generateId(), name: 'Nouveau stat', abbreviation: 'NEW', value: 10, isPrimary: false }]);
  };

  const removeStat = (id: string) => {
    setStats((prev) => prev.filter((s) => s.id !== id));
  };

  const validate = (): boolean => {
    if (step === 0) {
      if (!name.trim()) { Alert.alert('Champ requis', 'Le nom est obligatoire'); return false; }
      if (!race.trim()) { Alert.alert('Champ requis', 'La race est obligatoire'); return false; }
      if (!charClass.trim()) { Alert.alert('Champ requis', 'La classe est obligatoire'); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleSave();
  };

  const handleSave = () => {
    const lvl = parseInt(level) || 1;
    const now = new Date().toISOString();
    const character: Character = {
      id: editingId ?? generateId(),
      name: name.trim(),
      portrait: portrait || undefined,
      race: race.trim(),
      characterClass: charClass.trim(),
      subclass: subclass.trim() || undefined,
      level: lvl,
      age: age.trim() || undefined,
      height: height.trim() || undefined,
      weight: weight.trim() || undefined,
      background: background.trim(),
      personality: personality.trim(),
      alignment: alignment || undefined,
      system,
      stats,
      skills: existing?.skills ?? DEFAULT_DND_SKILLS.map(sk => ({ ...sk, id: generateId() })),
      spells: existing?.spells ?? [],
      savingThrows: existing?.savingThrows ?? [],
      currentHP: parseInt(currentHP) || 10,
      maxHP: parseInt(maxHP) || 10,
      tempHP: existing?.tempHP ?? 0,
      armorClass: parseInt(ac) || 10,
      speed: parseInt(speed) || 9,
      initiative: existing?.initiative ?? 0,
      proficiencyBonus: getProficiencyBonus(lvl),
      currency: existing?.currency ?? { copper: 0, silver: 0, electrum: 0, gold: 0, platinum: 0 },
      inspiration: false,
      exhaustion: 0,
      deathSaves: { successes: 0, failures: 0 },
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    if (editingId) {
      dispatch(updateCharacter(character));
    } else {
      dispatch(addCharacter(character));
    }
    navigation.goBack();
  };

  const renderStep0 = () => (
    <>
      <Input label="Nom du personnage *" value={name} onChangeText={setName} placeholder="Aragorn, Legolas..." />
      <Input label="Race *" value={race} onChangeText={setRace} placeholder="Humain, Elfe, Nain..." />
      <Input label="Classe *" value={charClass} onChangeText={setCharClass} placeholder="Guerrier, Mage, Rôdeur..." />
      <Input label="Sous-classe" value={subclass} onChangeText={setSubclass} placeholder="Champion, Archmage..." />
      <View style={styles.row}>
        <Input label="Niveau" value={level} onChangeText={setLevel} keyboardType="numeric" containerStyle={{ flex: 1, marginRight: 8 }} />
        <Input label="Âge" value={age} onChangeText={setAge} placeholder="Ex: 25 ans" containerStyle={{ flex: 1 }} />
      </View>
      <View style={styles.row}>
        <Input label="Taille" value={height} onChangeText={setHeight} placeholder="1m80" containerStyle={{ flex: 1, marginRight: 8 }} />
        <Input label="Poids" value={weight} onChangeText={setWeight} placeholder="75 kg" containerStyle={{ flex: 1 }} />
      </View>
      <Text style={styles.fieldLabel}>Système de jeu</Text>
      <View style={styles.selectGrid}>
        {SYSTEMS.map((s) => <SelectButton key={s} label={s} selected={system === s} onPress={() => setSystem(s)} />)}
      </View>
    </>
  );

  const renderStep1 = () => (
    <>
      <Input label="Historique / Background" value={background} onChangeText={setBackground} placeholder="Soldat, Criminel, Sage..." multiline numberOfLines={3} />
      <Input label="Personnalité & Traits" value={personality} onChangeText={setPersonality} placeholder="Décrivez la personnalité de votre personnage..." multiline numberOfLines={4} />
      <Text style={styles.fieldLabel}>Alignement</Text>
      <View style={styles.selectGrid}>
        {ALIGNMENTS.map((a) => <SelectButton key={a} label={a} selected={alignment === a} onPress={() => setAlignment(a)} />)}
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      <View style={styles.row}>
        <Input label="PV actuels" value={currentHP} onChangeText={setCurrentHP} keyboardType="numeric" containerStyle={{ flex: 1, marginRight: 8 }} />
        <Input label="PV max" value={maxHP} onChangeText={setMaxHP} keyboardType="numeric" containerStyle={{ flex: 1 }} />
      </View>
      <View style={styles.row}>
        <Input label="Classe d'armure" value={ac} onChangeText={setAC} keyboardType="numeric" containerStyle={{ flex: 1, marginRight: 8 }} />
        <Input label="Vitesse (m)" value={speed} onChangeText={setSpeed} keyboardType="numeric" containerStyle={{ flex: 1 }} />
      </View>
      <Text style={[styles.fieldLabel, { marginBottom: 12 }]}>Statistiques</Text>
      {stats.map((stat) => (
        <View key={stat.id} style={styles.statRow}>
          <Text style={styles.statName}>{stat.name}</Text>
          <View style={styles.statInputRow}>
            <TouchableOpacity
              style={styles.statBtn}
              onPress={() => updateStat(stat.id, String(stat.value - 1))}
            >
              <Text style={styles.statBtnText}>−</Text>
            </TouchableOpacity>
            <View style={styles.statValueBox}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statMod}>{stat.value >= 10 ? '+' : ''}{Math.floor((stat.value - 10) / 2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.statBtn}
              onPress={() => updateStat(stat.id, String(stat.value + 1))}
            >
              <Text style={styles.statBtnText}>+</Text>
            </TouchableOpacity>
            {!stat.isPrimary && (
              <TouchableOpacity onPress={() => removeStat(stat.id)} style={styles.removeStatBtn}>
                <Text style={styles.removeStatText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
      <TouchableOpacity onPress={addCustomStat} style={styles.addStatBtn}>
        <Text style={styles.addStatText}>+ Ajouter une statistique</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep3 = () => (
    <View style={styles.portraitStep}>
      <TouchableOpacity onPress={pickImage} style={styles.portraitPicker} activeOpacity={0.85}>
        {portrait ? (
          <Image source={{ uri: portrait }} style={styles.portraitPreview} />
        ) : (
          <View style={styles.portraitEmpty}>
            <Text style={styles.portraitEmptyIcon}>📷</Text>
            <Text style={styles.portraitEmptyText}>Choisir un portrait</Text>
          </View>
        )}
      </TouchableOpacity>
      {portrait && (
        <TouchableOpacity onPress={() => setPortrait('')} style={styles.removePortrait}>
          <Text style={styles.removePortraitText}>Supprimer le portrait</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.portraitHint}>
        Le portrait sera affiché sur votre fiche de personnage.{'\n'}Format carré recommandé.
      </Text>
    </View>
  );

  const steps: Record<number, React.ReactNode> = { 0: renderStep0(), 1: renderStep1(), 2: renderStep2(), 3: renderStep3() };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{STEPS[step]}</Text>
          <Text style={styles.headerStep}>{step + 1} / {STEPS.length}</Text>
        </View>
        <StepIndicator current={step} total={STEPS.length} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {steps[step]}
        </ScrollView>

        <View style={styles.footer}>
          {step > 0 && (
            <Button label="Précédent" onPress={() => setStep(step - 1)} variant="ghost" style={{ flex: 1, marginRight: 8 }} />
          )}
          <Button
            label={step === STEPS.length - 1 ? (editingId ? 'Enregistrer' : 'Créer') : 'Suivant'}
            onPress={handleNext}
            style={{ flex: step > 0 ? 1 : undefined, minWidth: 160 }}
            fullWidth={step === 0}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  headerTitle: { ...typography.h3, color: colors.text },
  headerStep: { ...typography.body, color: colors.textMuted },
  stepRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: spacing.sm },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  stepDotActive: { backgroundColor: colors.primary, width: 24 },
  stepDotDone: { backgroundColor: colors.primaryDark },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  row: { flexDirection: 'row' },
  fieldLabel: { ...typography.label, color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 8 },
  selectGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  selectBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceVariant,
  },
  selectBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryDark + '33' },
  selectBtnText: { ...typography.bodySmall, color: colors.textSecondary },
  selectBtnTextActive: { color: colors.primary, fontWeight: '700' },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statName: { ...typography.body, color: colors.text, flex: 1, fontWeight: '600' },
  statInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statBtn: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBtnText: { color: colors.primary, fontSize: 18, fontWeight: '700', lineHeight: 20 },
  statValueBox: { alignItems: 'center', minWidth: 40 },
  statValue: { ...typography.h4, color: colors.text },
  statMod: { ...typography.caption, color: colors.primary, fontWeight: '700' },
  removeStatBtn: { padding: 6 },
  removeStatText: { color: colors.error, fontSize: 14 },
  addStatBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  addStatText: { color: colors.primary, fontWeight: '600' },
  portraitStep: { alignItems: 'center', paddingVertical: spacing.xl },
  portraitPicker: {
    width: 200,
    height: 200,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    overflow: 'hidden',
    ...shadows.medium,
  },
  portraitPreview: { width: '100%', height: '100%' },
  portraitEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceVariant,
    gap: 12,
  },
  portraitEmptyIcon: { fontSize: 48 },
  portraitEmptyText: { color: colors.textSecondary, fontWeight: '600' },
  removePortrait: { marginTop: spacing.md },
  removePortraitText: { color: colors.error, fontWeight: '600' },
  portraitHint: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
