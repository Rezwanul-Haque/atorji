/**
 * Input Component
 * Production-ready input with validation and accessibility
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@shared/constants/theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  required = false,
  containerStyle,
  inputStyle,
  labelStyle,
  editable = true,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!error;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, labelStyle]}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}

      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
          !editable && styles.inputDisabled,
          inputStyle
        ]}
        placeholderTextColor={COLORS.neutral[400]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        accessible={true}
        accessibilityLabel={label}
        accessibilityHint={hint}
        accessibilityState={{ disabled: !editable }}
        editable={editable}
        {...textInputProps}
      />

      {hasError && <Text style={styles.errorText}>{error}</Text>}
      {hint && !hasError && <Text style={styles.hintText}>{hint}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: SPACING.md
  },
  labelContainer: {
    marginBottom: SPACING.xs
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.neutral[700]
  },
  required: {
    color: COLORS.error.main
  },
  input: {
    backgroundColor: COLORS.neutral[0],
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.neutral[900],
    minHeight: 44
  },
  inputFocused: {
    borderColor: COLORS.primary[500],
    borderWidth: 2
  },
  inputError: {
    borderColor: COLORS.error.main
  },
  inputDisabled: {
    backgroundColor: COLORS.neutral[100],
    color: COLORS.neutral[500]
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.error.main,
    marginTop: SPACING.xs
  },
  hintText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.neutral[500],
    marginTop: SPACING.xs
  }
});
