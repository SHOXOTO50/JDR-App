import { View, StyleSheet } from 'react-native';
import { C, S } from '../theme';

interface Props { value: number; max: number; skill?: boolean; }

export default function XPBar({ value, max, skill }: Props) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <View style={[S.xpTrack, skill && S.skillTrack]}>
      <View style={[S.xpFill, skill && S.skillFill, { width: `${pct}%` as any }]} />
    </View>
  );
}
