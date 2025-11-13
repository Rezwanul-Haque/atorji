/**
 * Custom Alert Component
 * Cross-platform alert dialog that works on both mobile and web
 */

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@shared/constants/theme';
import { useTheme } from '@shared/contexts';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  onDismiss: () => void;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK', style: 'default' }],
  onDismiss
}) => {
  const { colors } = useTheme();

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <Pressable
        style={styles.overlay}
        onPress={onDismiss}
      >
        <View style={styles.centeredView}>
          <Pressable>
            <View style={[
              styles.alertContainer,
              { backgroundColor: colors.card },
              SHADOWS.lg
            ]}>
              {/* Title */}
              <Text style={[styles.title, { color: colors.text.primary }]}>
                {title}
              </Text>

              {/* Message */}
              {message && (
                <Text style={[styles.message, { color: colors.text.secondary }]}>
                  {message}
                </Text>
              )}

              {/* Buttons */}
              <View style={styles.buttonsContainer}>
                {buttons.map((button, index) => {
                  const isDestructive = button.style === 'destructive';
                  const isCancel = button.style === 'cancel';

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.button,
                        isCancel && styles.cancelButton,
                        isDestructive && [styles.destructiveButton, { backgroundColor: colors.error.light }],
                        !isDestructive && !isCancel && { backgroundColor: colors.primary[50] },
                        index < buttons.length - 1 && styles.buttonMargin
                      ]}
                      onPress={() => handleButtonPress(button)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          isDestructive && [styles.destructiveText, { color: colors.error.dark }],
                          isCancel && [styles.cancelText, { color: colors.text.secondary }],
                          !isDestructive && !isCancel && [styles.defaultText, { color: colors.primary[700] }]
                        ]}
                      >
                        {button.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg
  },
  alertContainer: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    minWidth: 280,
    maxWidth: 400,
    width: '100%'
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.sm,
    textAlign: 'center'
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.base,
    marginBottom: SPACING.lg,
    textAlign: 'center',
    lineHeight: 22
  },
  buttonsContainer: {
    flexDirection: 'column',
    gap: SPACING.sm
  },
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center'
  },
  buttonMargin: {
    marginBottom: 0
  },
  cancelButton: {
    backgroundColor: 'transparent'
  },
  destructiveButton: {
    // backgroundColor set dynamically
  },
  buttonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold
  },
  defaultText: {
    // color set dynamically
  },
  cancelText: {
    fontWeight: TYPOGRAPHY.fontWeight.medium
  },
  destructiveText: {
    fontWeight: TYPOGRAPHY.fontWeight.bold
  }
});
