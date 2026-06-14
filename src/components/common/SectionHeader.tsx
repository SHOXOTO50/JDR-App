import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';

interface SectionHeaderProps {
  title: string;
  action?: { label: string; onPress: () => void };
  subtitle?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action, subtitle }) => (
  <View style={styles.row}>
    <View style={styles.left}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
    {action && (
      <TouchableOpacity onPress={action.onPress}>
        <Text style={styles.action}>{action.label}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  left: { flex: 1 },
  title: {
    ...typography.label,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  action: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
});
