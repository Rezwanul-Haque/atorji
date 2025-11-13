/**
 * LoadingSpinner Component
 * Reusable loading indicator
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@shared/constants/theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = COLORS.primary[500],
  message,
  fullScreen = false,
  style
}) => {
  const containerStyle = [
    styles.container,
    fullScreen && styles.fullScreen,
    style
  ];

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl
  },
  fullScreen: {
    flex: 1,
    backgroundColor: COLORS.neutral[0]
  },
  message: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.neutral[600],
    textAlign: 'center'
  }
});
