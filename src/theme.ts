import { StyleSheet, Platform } from 'react-native';

export const C = {
  bg:       '#0c0a1a',
  bg2:      '#141029',
  panel:    '#1b1638',
  panel2:   '#221a47',
  border:   '#34285f',
  gold:     '#f5c542',
  goldDim:  '#b8862a',
  text:     '#ece8ff',
  muted:    '#9b93c7',
  accent:   '#8b5cf6',
  accent2:  '#6d4ee0',
  green:    '#4ade80',
  red:      '#f87171',
  blue:     '#60a5fa',
  rarities: {
    commun:    '#9ca3af',
    rare:      '#60a5fa',
    épique:    '#c084fc',
    légendaire:'#f5c542',
    mythique:  '#fb7185',
  },
};

export const S = StyleSheet.create({
  flex1:    { flex: 1 },
  row:      { flexDirection: 'row', alignItems: 'center' },
  spread:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  center:   { alignItems: 'center', justifyContent: 'center' },
  textCenter:{ textAlign: 'center' },

  // Card
  card: {
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 16,
  },

  // Texts
  h1:  { fontSize: 28, fontWeight: '900', color: C.text },
  h2:  { fontSize: 20, fontWeight: '800', color: C.text },
  h3:  { fontSize: 16, fontWeight: '800', color: C.text },
  body:{ fontSize: 14, color: C.text, lineHeight: 20 },
  sm:  { fontSize: 12, color: C.muted },
  xs:  { fontSize: 11, color: C.muted },

  // Buttons
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.panel2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText:  { color: C.text, fontWeight: '700', fontSize: 15 },
  btnGold:  { backgroundColor: C.gold, borderWidth: 0 },
  btnGoldText: { color: '#2a2008', fontWeight: '800', fontSize: 15 },
  btnAccent:{ backgroundColor: C.accent, borderWidth: 0 },
  btnAccentText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Chip
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 99, backgroundColor: C.panel2,
    borderWidth: 1, borderColor: C.border,
  },
  chipText: { fontSize: 12, fontWeight: '700', color: C.muted },
  chipGoldText: { color: C.gold },

  // Section title
  sectionTitle: {
    fontSize: 11, fontWeight: '800', color: C.muted,
    textTransform: 'uppercase', letterSpacing: 1.5,
    marginTop: 20, marginBottom: 8,
  },

  // Input
  input: {
    backgroundColor: C.bg2, borderWidth: 1, borderColor: C.border,
    borderRadius: 12, padding: 13, color: C.text,
    fontSize: 16, fontWeight: '600',
  },

  // XP bar track
  xpTrack: {
    height: 12, backgroundColor: '#0e0b22',
    borderRadius: 99, overflow: 'hidden',
    borderWidth: 1, borderColor: C.border,
  },
  xpFill: {
    height: '100%',
    backgroundColor: C.gold,
    borderRadius: 99,
  },
  skillTrack: { height: 7 },
  skillFill:  { backgroundColor: C.accent },
});
