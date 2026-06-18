import { useAppSelector } from '../store';
import { THEME_PALETTES, ThemeColors } from '../theme/themes';
import { AppTheme } from '../store/slices/themeSlice';

export const useAppTheme = (): { colors: ThemeColors; theme: AppTheme; isLegendary: boolean } => {
  const theme = useAppSelector((s) => s.theme.activeTheme);
  const colors = THEME_PALETTES[theme] ?? THEME_PALETTES.dark;
  return { colors, theme, isLegendary: theme === 'legendary' };
};
