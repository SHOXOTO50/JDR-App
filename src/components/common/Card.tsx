import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  variant?: 'default' | 'gold' | 'danger';
}

export const Card: React.FC<CardProps> = ({ children, style, elevated, variant = 'default' }) => {
  const borderColor = {
    default: colors.border,
    gold: colors.primary,
    danger: colors.error,
  }[variant];

  return (
    <View
      style={[
        styles.card,
        elevated && shadows.medium,
        { borderColor },
        variant === 'gold' && styles.goldCard,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  goldCard: {
    backgroundColor: colors.surfaceVariant,
  },
});
