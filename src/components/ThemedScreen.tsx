import React from 'react';
import { View, ImageBackground, ViewStyle, StyleSheet } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const ThemedScreen: React.FC<Props> = ({ children, style }) => {
  const { colors, isLegendary } = useAppTheme();

  if (isLegendary) {
    return (
      <ImageBackground
        source={require('../../assets/secret-bg.jpg')}
        style={[s.fill, style]}
        resizeMode="cover"
      >
        <View style={[s.fill, { backgroundColor: 'rgba(8,0,14,0.82)' }]}>
          {children}
        </View>
      </ImageBackground>
    );
  }

  return (
    <View style={[s.fill, { backgroundColor: colors.background }, style]}>
      {children}
    </View>
  );
};

const s = StyleSheet.create({ fill: { flex: 1 } });
