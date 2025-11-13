/**
 * Order Success Screen
 * Confirmation screen after successful order placement
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@shared/components';
import { COLORS, SPACING, TYPOGRAPHY } from '@shared/constants/theme';

export default function OrderSuccessScreen() {
  const scaleAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Animate success icon
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const handleContinueShopping = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Text style={styles.successIcon}>✓</Text>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>Order Placed Successfully!</Text>
          <Text style={styles.message}>
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
          </Text>

          <View style={styles.infoCard}>
            <InfoRow
              icon="📧"
              label="Confirmation Email"
              value="Sent to your email"
            />
            <InfoRow
              icon="📦"
              label="Delivery"
              value="3-5 business days"
            />
            <InfoRow
              icon="🎯"
              label="Tracking"
              value="Available in 24 hours"
            />
          </View>

          <View style={styles.actions}>
            <Button
              title="Continue Shopping"
              onPress={handleContinueShopping}
              fullWidth
              size="lg"
              accessibilityHint="Returns to home page"
            />
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[0]
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.success.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl
  },
  successIcon: {
    fontSize: 64,
    color: COLORS.neutral[0],
    fontWeight: 'bold'
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral[900],
    textAlign: 'center',
    marginBottom: SPACING.md
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.neutral[600],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
    maxWidth: 400
  },
  infoCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.neutral[50],
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.xl
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md
  },
  infoIcon: {
    fontSize: 32,
    marginRight: SPACING.md
  },
  infoContent: {
    flex: 1
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.neutral[600],
    marginBottom: 2
  },
  infoValue: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.neutral[900]
  },
  actions: {
    width: '100%',
    maxWidth: 400
  }
});
