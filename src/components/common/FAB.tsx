import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, shadows, borderRadius } from '../../theme';

interface FABProps {
  onPress: () => void;
  icon?: string;
  style?: ViewStyle;
  color?: string;
}

export const FAB: React.FC<FABProps> = ({
  onPress,
  icon = '+',
  style,
  color = colors.primary,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.fab, { backgroundColor: color }, shadows.gold, style]}
    activeOpacity={0.8}
  >
    <Text style={styles.icon}>{icon}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  icon: {
    fontSize: 28,
    color: colors.background,
    fontWeight: '700',
    lineHeight: 32,
  },
});
