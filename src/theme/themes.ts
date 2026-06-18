import { colors as darkColors } from './index';

export type ThemeName = 'dark' | 'parchment' | 'modern' | 'legendary';

export interface ThemeColors {
  background: string; surface: string; surfaceVariant: string;
  card: string; cardElevated: string;
  primary: string; primaryDark: string; primaryLight: string;
  secondary: string; secondaryLight: string;
  accent: string; accentLight: string;
  text: string; textSecondary: string; textMuted: string;
  border: string; borderLight: string;
  success: string; successLight: string;
  warning: string; warningLight: string;
  error: string; errorLight: string;
  hp: string; hpLow: string; mana: string;
  gold: string; silver: string; copper: string; platinum: string;
  rare: string; uncommon: string; veryRare: string; legendary: string;
  artifact: string; common: string;
  overlay: string; overlayLight: string;
  white: string; black: string; transparent: string;
}

export const THEME_PALETTES: Record<ThemeName, ThemeColors> = {
  dark: darkColors as ThemeColors,

  parchment: {
    background: '#1C1508', surface: '#261C0A', surfaceVariant: '#30220E',
    card: '#2A1C0C', cardElevated: '#342816',
    primary: '#D4A853', primaryDark: '#A07830', primaryLight: '#ECC870',
    secondary: '#8B4513', secondaryLight: '#A55A20',
    accent: '#C0392B', accentLight: '#E74C3C',
    text: '#F0E8D8', textSecondary: '#C0A880', textMuted: '#806040',
    border: '#3A2A18', borderLight: '#4A3820',
    success: '#2E7D32', successLight: '#43A047',
    warning: '#E65100', warningLight: '#EF6C00',
    error: '#C62828', errorLight: '#E53935',
    hp: '#EF4444', hpLow: '#DC2626', mana: '#6B4EAF',
    gold: '#D4A853', silver: '#A0AEC0', copper: '#B7704E', platinum: '#E2E8F0',
    rare: '#5E4F9E', uncommon: '#2E7D32', veryRare: '#6A1B9A',
    legendary: '#E65100', artifact: '#C62828', common: '#806040',
    overlay: 'rgba(0,0,0,0.75)', overlayLight: 'rgba(0,0,0,0.45)',
    white: '#FFFFFF', black: '#000000', transparent: 'transparent',
  },

  modern: {
    background: '#080C16', surface: '#0E1520', surfaceVariant: '#141E2C',
    card: '#121C28', cardElevated: '#1A2436',
    primary: '#3B82F6', primaryDark: '#1D4ED8', primaryLight: '#60A5FA',
    secondary: '#06B6D4', secondaryLight: '#22D3EE',
    accent: '#8B5CF6', accentLight: '#A78BFA',
    text: '#E2EAF4', textSecondary: '#94A3B8', textMuted: '#475569',
    border: '#1E2D40', borderLight: '#263850',
    success: '#10B981', successLight: '#34D399',
    warning: '#F59E0B', warningLight: '#FCD34D',
    error: '#EF4444', errorLight: '#F87171',
    hp: '#EF4444', hpLow: '#DC2626', mana: '#8B5CF6',
    gold: '#F59E0B', silver: '#94A3B8', copper: '#B7704E', platinum: '#E2E8F0',
    rare: '#8B5CF6', uncommon: '#10B981', veryRare: '#7C3AED',
    legendary: '#F59E0B', artifact: '#EF4444', common: '#475569',
    overlay: 'rgba(0,0,0,0.75)', overlayLight: 'rgba(0,0,0,0.45)',
    white: '#FFFFFF', black: '#000000', transparent: 'transparent',
  },

  legendary: {
    background: '#08000E', surface: '#100018', surfaceVariant: '#180024',
    card: '#140012', cardElevated: '#200020',
    primary: '#FFD700', primaryDark: '#CC9900', primaryLight: '#FFE84D',
    secondary: '#FF4400', secondaryLight: '#FF6620',
    accent: '#FF0088', accentLight: '#FF44AA',
    text: '#FFF8E7', textSecondary: '#D4B090', textMuted: '#8A6040',
    border: '#3A1830', borderLight: '#501840',
    success: '#00CC44', successLight: '#22FF66',
    warning: '#FF8800', warningLight: '#FFAA00',
    error: '#FF2244', errorLight: '#FF4466',
    hp: '#FF4444', hpLow: '#FF2222', mana: '#AA00FF',
    gold: '#FFD700', silver: '#C0C0C0', copper: '#D4845A', platinum: '#E8E8FF',
    rare: '#AA00FF', uncommon: '#00CC44', veryRare: '#CC00AA',
    legendary: '#FFD700', artifact: '#FF2244', common: '#8A6040',
    overlay: 'rgba(0,0,0,0.82)', overlayLight: 'rgba(0,0,0,0.55)',
    white: '#FFFFFF', black: '#000000', transparent: 'transparent',
  },
};
