import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '../store';
import { useLan } from '../net/LanContext';
import { CharacterSnapshot, NetPlayer } from '../net/lanProtocol';
import { setAppMode, setGroupReady } from '../store/slices/appModeSlice';
import { selectCharacter } from '../store/slices/charactersSlice';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { getHPColor } from '../utils/helpers';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useBackHandler } from '../hooks/useBackHandler';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ThemedScreen } from '../components/ThemedScreen';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PlayerRow = ({ player, canKick, onKick }: {
  player: NetPlayer;
  canKick: boolean;
  onKick: () => void;
}) => {
  const c = player.character;
  return (
    <View style={[styles.playerRow, { borderColor: player.isGM ? colors.primary : colors.border }]}>
      <View style={styles.playerAvatar}>
        <Text style={styles.playerAvatarText}>{player.isGM ? '👑' : '🧑'}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.playerNameRow}>
          <Text style={styles.playerName}>{player.playerName}</Text>
          {player.isGM && <Text style={styles.gmTag}>MJ</Text>}
        </View>
        {c ? (
          <>
            <Text style={styles.charLine}>{c.name} · {c.characterClass} Niv.{c.level}</Text>
            <Text style={[styles.hpLine, { color: getHPColor(c.currentHP, c.maxHP) }]}>
              ❤️ {c.currentHP}/{c.maxHP} · 🛡️ CA {c.armorClass}
            </Text>
            {c.conditions.length > 0 && (
              <Text style={styles.condLine}>⚠️ {c.conditions.join(', ')}</Text>
            )}
          </>
        ) : (
          <Text style={styles.noChar}>Aucun personnage</Text>
        )}
      </View>
      {canKick && !player.isGM && (
        <TouchableOpacity onPress={onKick} style={styles.kickBtn}>
          <Text style={styles.kickBtnText}>Expulser</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const LanScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<Nav>();
  const activeCampaign = useAppSelector((s) =>
    s.campaign.campaigns.find((c) => c.id === s.campaign.activeCampaignId) ?? null
  );
  const isSetupGate = !activeCampaign;

  useBackHandler(useCallback(() => {
    if (!isSetupGate) return false;
    dispatch(setAppMode(null));
    return true;
  }, [dispatch, isSetupGate]));

  const character = useAppSelector((s) => {
    const id = s.characters.currentCharacterId;
    return id ? s.characters.characters.find((c) => c.id === id) : null;
  });
  const characters = useAppSelector((s) => s.characters.characters);
  const inventoryItems = useAppSelector((s) => {
    const id = s.characters.currentCharacterId;
    return id ? s.inventory.items.filter((i) => i.characterId === id) : [];
  });

  const snapshot: CharacterSnapshot | null = useMemo(() => character ? {
    id: character.id,
    name: character.name,
    characterClass: character.characterClass,
    level: character.level,
    currentHP: character.currentHP,
    maxHP: character.maxHP,
    armorClass: character.armorClass,
    conditions: [],
    inventory: inventoryItems.map((i) => ({
      id: i.id, name: i.name, quantity: i.quantity, category: i.category, equipped: i.equipped,
    })),
  } : null, [character, inventoryItems]);

  const lan = useLan();
  const [playerName, setPlayerName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [manualIp, setManualIp] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleLeave = useCallback(() => {
    lan.leave();
    if (isSetupGate) {
      dispatch(setAppMode(null));
    } else {
      navigation.goBack();
    }
  }, [lan.leave, isSetupGate, dispatch, navigation]);

  useEffect(() => {
    if (character && !playerName) setPlayerName(character.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character]);

  // Diffuse la fiche (PV/CA/personnage/inventaire) en direct
  useEffect(() => {
    if (lan.mode === 'hosting' || lan.mode === 'connected') {
      lan.pushUpdate(snapshot);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot, lan.mode]);

  const confirmKick = (p: NetPlayer) => {
    Alert.alert('Expulser', `Expulser ${p.playerName} de la partie ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Expulser', style: 'destructive', onPress: () => lan.kick(p.peerId) },
    ]);
  };

  const renderBanner = () => (
    <View style={styles.banner}>
      <Text style={styles.bannerLabel}>PARTIE EN RÉSEAU · CAMPAGNE</Text>
      <Text style={styles.bannerName} numberOfLines={1}>🗺️ {activeCampaign?.name ?? '—'}</Text>
    </View>
  );

  const renderCharacterPicker = () => (
    <View style={styles.charPickerCard}>
      <Text style={styles.sectionTitle}>Votre personnage</Text>
      {characters.length === 0 ? (
        <Text style={styles.noChar}>Aucun personnage disponible.</Text>
      ) : (
        <View style={styles.charPickerRow}>
          {characters.map((c) => (
            <TouchableOpacity
              key={c.id}
              onPress={() => dispatch(selectCharacter(c.id))}
              style={[styles.charChip, c.id === character?.id && styles.charChipActive]}
            >
              <Text style={[styles.charChipText, c.id === character?.id && styles.charChipTextActive]}>
                {c.name} · Niv.{c.level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderGateFooter = () => {
    if (!isSetupGate) return null;
    return (
      <View style={styles.gateFooter}>
        <Button label="Continuer vers le choix de la campagne →" onPress={() => dispatch(setGroupReady(true))} fullWidth />
        <TouchableOpacity onPress={() => dispatch(setAppMode(null))} style={styles.gateBackLink}>
          <Text style={styles.gateBackLinkText}>⟵ Changer de mode</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // --- États de connexion ---------------------------------------------------

  if (!lan.available) {
    return (
      <ThemedScreen>
      <View style={styles.container}>
        {renderBanner()}
        <View style={styles.centerBox}>
          <Text style={styles.bigIcon}>📡</Text>
          <Text style={styles.infoTitle}>Module réseau indisponible</Text>
          <Text style={styles.infoText}>
            Cette fonctionnalité nécessite la dernière version de l'app installée via APK.
          </Text>
        </View>
        {renderGateFooter()}
      </View>
      </ThemedScreen>
    );
  }

  if (lan.mode === 'hosting') {
    return (
      <ThemedScreen>
      <View style={styles.container}>
        {renderBanner()}
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>CODE D'INVITATION</Text>
            <Text style={styles.codeValue}>{lan.code}</Text>
            <Text style={styles.codeHint}>
              Les joueurs entrent ce code pour rejoindre. Tout le monde doit être sur le même réseau
              (votre Wi-Fi, ou le point d'accès Wi-Fi de ce téléphone si vous utilisez le partage de connexion).
            </Text>
            <Text style={styles.ipHint}>IP de l'hôte : {lan.hostIp}</Text>
          </View>

          {renderCharacterPicker()}

          <Text style={styles.sectionTitle}>Joueurs connectés ({lan.roster.length})</Text>
          {lan.roster.map((p) => (
            <PlayerRow key={p.peerId} player={p} canKick onKick={() => confirmKick(p)} />
          ))}
          {lan.roster.length <= 1 && (
            <Text style={styles.waiting}>En attente de joueurs…</Text>
          )}

          <Button label="Arrêter la partie" variant="danger" onPress={handleLeave} fullWidth style={{ marginTop: spacing.lg }} />
        </ScrollView>
        {renderGateFooter()}
      </View>
      </ThemedScreen>
    );
  }

  if (lan.mode === 'joining' || lan.mode === 'connected') {
    return (
      <ThemedScreen>
      <View style={styles.container}>
        {renderBanner()}
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.statusCard, { borderColor: lan.mode === 'connected' ? colors.success : colors.warning }]}>
            <Text style={styles.statusIcon}>{lan.mode === 'connected' ? '✅' : '⏳'}</Text>
            <Text style={styles.statusText}>
              {lan.mode === 'connected' ? 'Connecté à la partie' : 'Connexion en cours…'}
            </Text>
            <Text style={styles.ipHint}>Hôte : {lan.hostIp}</Text>
          </View>

          {renderCharacterPicker()}

          <Text style={styles.sectionTitle}>Groupe ({lan.roster.length})</Text>
          {lan.roster.map((p) => (
            <PlayerRow key={p.peerId} player={p} canKick={false} onKick={() => {}} />
          ))}

          <Button label="Quitter la partie" variant="danger" onPress={handleLeave} fullWidth style={{ marginTop: spacing.lg }} />
        </ScrollView>
        {renderGateFooter()}
      </View>
      </ThemedScreen>
    );
  }

  if (lan.mode === 'kicked') {
    return (
      <ThemedScreen>
      <View style={styles.container}>
        {renderBanner()}
        <View style={styles.centerBox}>
          <Text style={styles.bigIcon}>🚪</Text>
          <Text style={styles.infoTitle}>Vous avez été expulsé</Text>
          <Text style={styles.infoText}>Le MJ vous a retiré de la partie.</Text>
          <Button label="Retour" onPress={handleLeave} style={{ marginTop: spacing.lg }} />
        </View>
        {renderGateFooter()}
      </View>
      </ThemedScreen>
    );
  }

  // mode 'idle' ou 'error'
  return (
    <ThemedScreen>
    <View style={styles.container}>
      {renderBanner()}
      <ScrollView contentContainerStyle={styles.content}>
        {lan.mode === 'error' && !!lan.errorMsg && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {lan.errorMsg}</Text>
          </View>
        )}

        <Input
          label="Votre nom (joueur)"
          value={playerName}
          onChangeText={setPlayerName}
          placeholder="Alex, Marie…"
        />

        {/* Héberger */}
        <View style={styles.actionCard}>
          <Text style={styles.actionIcon}>👑</Text>
          <Text style={styles.actionTitle}>Héberger (MJ)</Text>
          <Text style={styles.actionDesc}>
            Crée une partie sur ce téléphone et génère un code d'invitation. Les autres rejoignent et vous pouvez les expulser.
            Fonctionne sur votre Wi-Fi habituel ou via le point d'accès Wi-Fi (hotspot) de ce téléphone.
          </Text>
          <Button
            label="Héberger une partie"
            onPress={() => lan.host(playerName, snapshot, manualIp.trim() || undefined)}
            fullWidth
          />
          <TouchableOpacity onPress={() => setShowAdvanced((v) => !v)} style={styles.advancedToggle}>
            <Text style={styles.advancedToggleText}>
              {showAdvanced ? '▲ Masquer la configuration avancée' : '▼ L\'adresse détectée est incorrecte ?'}
            </Text>
          </TouchableOpacity>
          {showAdvanced && (
            <View style={styles.advancedBox}>
              <Text style={styles.advancedHint}>
                Si l'hébergement via point d'accès Wi-Fi échoue, indiquez ici l'adresse IP locale de ce
                téléphone (visible dans les paramètres du point d'accès, souvent 192.168.43.1 sur Android).
              </Text>
              <Input
                value={manualIp}
                onChangeText={setManualIp}
                placeholder="Ex : 192.168.43.1"
                keyboardType="decimal-pad"
              />
            </View>
          )}
        </View>

        {/* Rejoindre */}
        <View style={styles.actionCard}>
          <Text style={styles.actionIcon}>🔗</Text>
          <Text style={styles.actionTitle}>Rejoindre</Text>
          <Text style={styles.actionDesc}>Entrez le code d'invitation donné par le MJ.</Text>
          <Input
            value={joinCode}
            onChangeText={(v) => setJoinCode(v.toUpperCase())}
            placeholder="Ex : A7K2P9Z"
            autoCapitalize="characters"
            containerStyle={{ marginBottom: spacing.sm }}
            style={styles.codeInput}
          />
          <Button
            label="Rejoindre la partie"
            variant="secondary"
            onPress={() => lan.join(joinCode, playerName, snapshot)}
            fullWidth
          />
        </View>

        <Text style={styles.footNote}>
          ℹ️ Le multijoueur LAN nécessite que tous les appareils partagent le même réseau local : votre
          Wi-Fi, ou le point d'accès Wi-Fi (hotspot) de l'hôte. Le réseau mobile (données cellulaires) de
          chaque joueur séparément ne peut pas fonctionner : sans réseau partagé, les téléphones ne peuvent
          pas se joindre directement entre eux (cela demanderait un serveur relais en ligne, que cette app
          n'utilise pas pour garder vos parties 100% locales et gratuites).
        </Text>
        {renderGateFooter()}
      </ScrollView>
    </View>
    </ThemedScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: {
    backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  bannerLabel: { ...typography.caption, color: colors.textMuted, letterSpacing: 1.5 },
  bannerName: { ...typography.h5, color: colors.secondary, marginTop: 2 },
  content: { padding: spacing.md, paddingBottom: 40 },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  bigIcon: { fontSize: 56, marginBottom: spacing.md },
  infoTitle: { ...typography.h4, color: colors.textSecondary, marginBottom: spacing.sm, textAlign: 'center' },
  infoText: { ...typography.body, color: colors.textMuted, textAlign: 'center', lineHeight: 22 },
  codeCard: {
    backgroundColor: colors.card, borderRadius: borderRadius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.primary, alignItems: 'center', marginBottom: spacing.lg, ...shadows.gold,
  },
  codeLabel: { ...typography.label, color: colors.textMuted, letterSpacing: 2 },
  codeValue: { fontSize: 44, fontWeight: '900', color: colors.primary, letterSpacing: 8, marginVertical: spacing.sm },
  codeHint: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },
  ipHint: { ...typography.caption, color: colors.textMuted, marginTop: spacing.sm },
  sectionTitle: {
    ...typography.label, color: colors.primary, textTransform: 'uppercase', letterSpacing: 1.2,
    marginBottom: spacing.sm, marginTop: spacing.sm,
  },
  charPickerCard: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md, ...shadows.small,
  },
  charPickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  charChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: borderRadius.round,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceVariant,
  },
  charChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryDark + '33' },
  charChipText: { ...typography.bodySmall, color: colors.textMuted, fontWeight: '600' },
  charChipTextActive: { color: colors.primary },
  playerRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md,
    marginBottom: spacing.sm, borderWidth: 1,
  },
  playerAvatar: {
    width: 44, height: 44, borderRadius: borderRadius.round, backgroundColor: colors.surfaceVariant,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  playerAvatarText: { fontSize: 22 },
  playerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  playerName: { ...typography.h5, color: colors.text },
  gmTag: {
    ...typography.caption, color: colors.primary, fontWeight: '800',
    borderWidth: 1, borderColor: colors.primary, borderRadius: borderRadius.round,
    paddingHorizontal: 6, paddingVertical: 1,
  },
  charLine: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  hpLine: { ...typography.bodySmall, fontWeight: '700', marginTop: 2 },
  condLine: { ...typography.caption, color: colors.warning, marginTop: 2 },
  noChar: { ...typography.bodySmall, color: colors.textMuted, fontStyle: 'italic', marginTop: 2 },
  kickBtn: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: borderRadius.md,
    backgroundColor: colors.error + '22', borderWidth: 1, borderColor: colors.error,
  },
  kickBtnText: { ...typography.bodySmall, color: colors.error, fontWeight: '700' },
  waiting: { ...typography.body, color: colors.textMuted, textAlign: 'center', padding: spacing.lg, fontStyle: 'italic' },
  statusCard: {
    backgroundColor: colors.card, borderRadius: borderRadius.xl, padding: spacing.lg,
    borderWidth: 1, alignItems: 'center', marginBottom: spacing.lg,
  },
  statusIcon: { fontSize: 40, marginBottom: spacing.sm },
  statusText: { ...typography.h4, color: colors.text },
  actionCard: {
    backgroundColor: colors.card, borderRadius: borderRadius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md, ...shadows.small,
  },
  actionIcon: { fontSize: 32, marginBottom: spacing.sm },
  actionTitle: { ...typography.h4, color: colors.text, marginBottom: 4 },
  actionDesc: { ...typography.bodySmall, color: colors.textMuted, lineHeight: 18, marginBottom: spacing.md },
  advancedToggle: { marginTop: spacing.sm, alignItems: 'center' },
  advancedToggleText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  advancedBox: { marginTop: spacing.sm },
  advancedHint: { ...typography.caption, color: colors.textMuted, lineHeight: 16, marginBottom: spacing.sm },
  codeInput: { fontSize: 20, letterSpacing: 4, fontWeight: '800', textAlign: 'center' },
  errorBox: {
    backgroundColor: colors.error + '22', borderRadius: borderRadius.md, padding: spacing.md,
    borderWidth: 1, borderColor: colors.error, marginBottom: spacing.md,
  },
  errorText: { ...typography.bodySmall, color: colors.errorLight, lineHeight: 18 },
  footNote: { ...typography.caption, color: colors.textMuted, lineHeight: 16, marginTop: spacing.md },
  gateFooter: { padding: spacing.md, paddingTop: 0 },
  gateBackLink: { alignItems: 'center', marginTop: spacing.sm },
  gateBackLinkText: { ...typography.body, color: colors.textSecondary, fontWeight: '600' },
});
