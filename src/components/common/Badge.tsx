import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, typography } from '../../theme';

interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, color = colors.primary, size = 'md' }) => {
  const fontSize = size === 'sm' ? 9 : 11;
  const paddingH = size === 'sm' ? 6 : 8;
  const paddingV = size === 'sm' ? 2 : 3;
  return (
    <View style={[styles.badge, { borderColor: color, paddingHorizontal: paddingH, paddingVertical: paddingV }]}>
      <Text style={[styles.label, { color, fontSize }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: borderRadius.round,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
