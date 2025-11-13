/**
 * Card Component
 * Reusable card with variants and shadows - Theme aware
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { SPACING, BORDER_RADIUS, SHADOWS } from '@shared/constants/theme';
import { useTheme } from '@shared/contexts';

type CardVariant = 'default' | 'elevated' | 'outlined';

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: keyof typeof SPACING;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  onPress,
  style,
  padding = 'md',
  testID
}) => {
  const { colors } = useTheme();

  const cardStyles = [
    styles.base,
    { backgroundColor: colors.card },
    variant === 'elevated' && SHADOWS.md,
    variant === 'outlined' && {
      borderWidth: 1,
      borderColor: colors.border
    },
    padding !== 'none' && { padding: SPACING[padding] },
    style
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles} testID={testID}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.lg
  }
});
