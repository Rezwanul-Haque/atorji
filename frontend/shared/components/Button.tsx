/**
 * Button Component
 * Production-ready button with accessibility and variants
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  AccessibilityRole
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@shared/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  textStyle
}) => {
  const isDisabled = disabled || loading;

  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    !isDisabled && variant !== 'ghost' && SHADOWS.sm,
    style
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text` as keyof typeof styles],
    styles[`${size}Text` as keyof typeof styles],
    isDisabled && styles.disabledText,
    textStyle
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      accessible={true}
      accessibilityRole={'button' as AccessibilityRole}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      testID={testID}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? COLORS.neutral[0] : COLORS.primary[500]}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row'
  },

  // Variants
  primary: {
    backgroundColor: COLORS.primary[500]
  },
  secondary: {
    backgroundColor: COLORS.neutral[700]
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary[500]
  },
  ghost: {
    backgroundColor: 'transparent'
  },
  danger: {
    backgroundColor: COLORS.error.main
  },

  // Sizes
  sm: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 36
  },
  md: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    minHeight: 44
  },
  lg: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    minHeight: 52
  },

  // Text styles
  text: {
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    textAlign: 'center'
  },
  primaryText: {
    color: COLORS.neutral[0]
  },
  secondaryText: {
    color: COLORS.neutral[0]
  },
  outlineText: {
    color: COLORS.primary[500]
  },
  ghostText: {
    color: COLORS.primary[500]
  },
  dangerText: {
    color: COLORS.neutral[0]
  },

  // Text sizes
  smText: {
    fontSize: TYPOGRAPHY.fontSize.sm
  },
  mdText: {
    fontSize: TYPOGRAPHY.fontSize.base
  },
  lgText: {
    fontSize: TYPOGRAPHY.fontSize.lg
  },

  // States
  fullWidth: {
    width: '100%'
  },
  disabled: {
    opacity: 0.5
  },
  disabledText: {
    opacity: 0.7
  }
});
