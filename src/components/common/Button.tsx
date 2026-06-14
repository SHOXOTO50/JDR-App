import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors, borderRadius, typography } from '../../theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  style,
  textStyle,
  fullWidth,
}) => {
  const bgColor = {
    primary: colors.primary,
    secondary: colors.secondary,
    danger: colors.error,
    ghost: 'transparent',
    outline: 'transparent',
  }[variant];

  const textColor = variant === 'ghost' || variant === 'outline' ? colors.primary : colors.background;

  const paddingV = { sm: 8, md: 12, lg: 16 }[size];
  const paddingH = { sm: 12, md: 20, lg: 28 }[size];
  const fontSize = { sm: 12, md: 14, lg: 16 }[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        { backgroundColor: bgColor, paddingVertical: paddingV, paddingHorizontal: paddingH },
        variant === 'outline' && styles.outline,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <Text style={[styles.label, { color: textColor, fontSize }, textStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  outline: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
