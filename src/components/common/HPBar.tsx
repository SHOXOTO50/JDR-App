import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../../theme';
import { getHPColor } from '../../utils/helpers';

interface HPBarProps {
  current: number;
  max: number;
  temp?: number;
  showNumbers?: boolean;
  height?: number;
}

export const HPBar: React.FC<HPBarProps> = ({
  current,
  max,
  temp = 0,
  showNumbers = true,
  height = 10,
}) => {
  const ratio = max > 0 ? Math.min(current / max, 1) : 0;
  const tempRatio = max > 0 ? Math.min(temp / max, 1 - ratio) : 0;
  const hpColor = getHPColor(current, max);

  return (
    <View>
      {showNumbers && (
        <View style={styles.numbers}>
          <Text style={[styles.current, { color: hpColor }]}>{current}</Text>
          <Text style={styles.sep}> / </Text>
          <Text style={styles.max}>{max}</Text>
          {temp > 0 && <Text style={styles.temp}> +{temp} temp</Text>}
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            { width: `${ratio * 100}%`, backgroundColor: hpColor, height },
          ]}
        />
        {tempRatio > 0 && (
          <View
            style={[
              styles.tempFill,
              {
                width: `${tempRatio * 100}%`,
                left: `${ratio * 100}%`,
                height,
              },
            ]}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  numbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  current: {
    fontSize: 22,
    fontWeight: '700',
  },
  sep: {
    color: colors.textMuted,
    fontSize: 16,
  },
  max: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  temp: {
    color: colors.mana,
    fontSize: 12,
    marginLeft: 6,
  },
  track: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: borderRadius.round,
  },
  tempFill: {
    position: 'absolute',
    top: 0,
    backgroundColor: colors.mana,
    borderRadius: borderRadius.round,
    opacity: 0.7,
  },
});
