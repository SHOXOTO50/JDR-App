export const colors = {
  background: '#0D0D0F',
  surface: '#16161E',
  surfaceVariant: '#1E1E2E',
  card: '#1A1A28',
  cardElevated: '#222235',
  primary: '#C9A84C',
  primaryDark: '#8B6914',
  primaryLight: '#E8C86A',
  secondary: '#7C3AED',
  secondaryLight: '#9D5CF0',
  accent: '#DC2626',
  accentLight: '#EF4444',
  text: '#E8E0D0',
  textSecondary: '#9A8F80',
  textMuted: '#5A5040',
  border: '#2A2A3E',
  borderLight: '#3A3A4E',
  success: '#16A34A',
  successLight: '#22C55E',
  warning: '#D97706',
  warningLight: '#F59E0B',
  error: '#DC2626',
  errorLight: '#EF4444',
  hp: '#EF4444',
  hpLow: '#DC2626',
  mana: '#6366F1',
  gold: '#C9A84C',
  silver: '#A0AEC0',
  copper: '#B7704E',
  platinum: '#E2E8F0',
  rare: '#6366F1',
  uncommon: '#16A34A',
  veryRare: '#7C3AED',
  legendary: '#F59E0B',
  artifact: '#DC2626',
  common: '#9A8F80',
  overlay: 'rgba(0,0,0,0.7)',
  overlayLight: 'rgba(0,0,0,0.4)',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 999,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, letterSpacing: 1 },
  h2: { fontSize: 24, fontWeight: '700' as const, letterSpacing: 0.5 },
  h3: { fontSize: 20, fontWeight: '600' as const },
  h4: { fontSize: 18, fontWeight: '600' as const },
  h5: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  bodyLarge: { fontSize: 16, fontWeight: '400' as const },
  bodySmall: { fontSize: 12, fontWeight: '400' as const },
  caption: { fontSize: 10, fontWeight: '400' as const },
  label: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.8 },
  stat: { fontSize: 28, fontWeight: '700' as const },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  gold: {
    shadowColor: '#C9A84C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
};

export default theme;
