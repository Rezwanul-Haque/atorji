/**
 * Checkout Screen
 * Complete checkout form with shipping and payment validation
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button, Input, CustomAlert } from '@shared/components';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@shared/constants/theme';
import { formatCurrency } from '@shared/utils/format';
import { validation, validateForm, sanitizeInput } from '@shared/utils/validation';
import { useCart } from '@features/cart/CartContext';
import { ShippingAddress } from '@shared/types';
import { useTheme } from '@shared/contexts';
import { useCustomAlert } from '@shared/hooks';

interface FormData extends ShippingAddress {
  email: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export default function CheckoutScreen() {
  const { items, totalPrice, clearCart } = useCart();
  const { colors } = useTheme();
  const { showAlert, hideAlert, alertConfig, isVisible } = useCustomAlert();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const handleFieldChange = (field: keyof FormData, value: string) => {
    // Sanitize input
    const sanitized = sanitizeInput(value);

    setFormData((prev) => ({ ...prev, [field]: sanitized }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFieldBlur = (field: keyof FormData) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: keyof FormData): boolean => {
    const value = formData[field];
    let result;

    switch (field) {
      case 'fullName':
        result = validation.required(value, 'Full name');
        if (result.isValid) {
          result = validation.length(value, 'Full name', 2, 100);
        }
        break;
      case 'email':
        result = validation.email(value);
        break;
      case 'phone':
        result = validation.phone(value);
        break;
      case 'address':
        result = validation.required(value, 'Address');
        break;
      case 'city':
        result = validation.required(value, 'City');
        break;
      case 'state':
        result = validation.required(value, 'State');
        break;
      case 'zipCode':
        result = validation.zipCode(value);
        break;
      case 'cardNumber':
        result = validation.creditCard(value);
        break;
      case 'expiryDate':
        result = validation.expirationDate(value);
        break;
      case 'cvv':
        result = validation.cvv(value);
        break;
      default:
        result = { isValid: true };
    }

    if (!result.isValid) {
      setErrors((prev) => ({ ...prev, [field]: result.error }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      return true;
    }
  };

  const validateAllFields = (): boolean => {
    const fieldsToValidate: (keyof FormData)[] = [
      'fullName',
      'email',
      'phone',
      'address',
      'city',
      'state',
      'zipCode',
      'cardNumber',
      'expiryDate',
      'cvv'
    ];

    let isValid = true;
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    fieldsToValidate.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    // Mark all fields as touched
    const allTouched = fieldsToValidate.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Partial<Record<keyof FormData, boolean>>);

    setTouchedFields(allTouched);

    return isValid;
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      showAlert('Error', 'Your cart is empty');
      return;
    }

    if (!validateAllFields()) {
      showAlert('Validation Error', 'Please fill in all required fields correctly');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear cart
      clearCart();

      // Navigate to success page
      router.replace('/order-success');
    } catch (error) {
      showAlert('Error', 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getFieldError = (field: keyof FormData): string | undefined => {
    return touchedFields[field] ? errors[field] : undefined;
  };

  if (items.length === 0) {
    router.replace('/cart');
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, {
        backgroundColor: colors.card,
        borderBottomColor: colors.border
      }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessible={true}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={[styles.backIcon, { color: colors.text.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Shipping Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Shipping Information</Text>

          <Input
            label="Full Name"
            value={formData.fullName}
            onChangeText={(value) => handleFieldChange('fullName', value)}
            onBlur={() => handleFieldBlur('fullName')}
            error={getFieldError('fullName')}
            placeholder="John Doe"
            required
            autoComplete="name"
            autoCorrect={false}
          />

          <Input
            label="Email"
            value={formData.email}
            onChangeText={(value) => handleFieldChange('email', value)}
            onBlur={() => handleFieldBlur('email')}
            error={getFieldError('email')}
            placeholder="john@example.com"
            required
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
          />

          <Input
            label="Phone"
            value={formData.phone}
            onChangeText={(value) => handleFieldChange('phone', value)}
            onBlur={() => handleFieldBlur('phone')}
            error={getFieldError('phone')}
            placeholder="(555) 123-4567"
            required
            keyboardType="phone-pad"
            autoComplete="tel"
          />

          <Input
            label="Address"
            value={formData.address}
            onChangeText={(value) => handleFieldChange('address', value)}
            onBlur={() => handleFieldBlur('address')}
            error={getFieldError('address')}
            placeholder="123 Main Street"
            required
            autoComplete="street-address"
          />

          <View style={styles.row}>
            <Input
              label="City"
              value={formData.city}
              onChangeText={(value) => handleFieldChange('city', value)}
              onBlur={() => handleFieldBlur('city')}
              error={getFieldError('city')}
              placeholder="New York"
              required
              containerStyle={styles.halfWidth}
              autoComplete="address-level2"
            />

            <Input
              label="State"
              value={formData.state}
              onChangeText={(value) => handleFieldChange('state', value)}
              onBlur={() => handleFieldBlur('state')}
              error={getFieldError('state')}
              placeholder="NY"
              required
              containerStyle={styles.halfWidth}
              autoComplete="address-level1"
            />
          </View>

          <Input
            label="ZIP Code"
            value={formData.zipCode}
            onChangeText={(value) => handleFieldChange('zipCode', value)}
            onBlur={() => handleFieldBlur('zipCode')}
            error={getFieldError('zipCode')}
            placeholder="10001"
            required
            keyboardType="numeric"
            autoComplete="postal-code"
          />
        </View>

        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Payment Information</Text>

          <Input
            label="Card Number"
            value={formData.cardNumber}
            onChangeText={(value) => handleFieldChange('cardNumber', value)}
            onBlur={() => handleFieldBlur('cardNumber')}
            error={getFieldError('cardNumber')}
            placeholder="1234 5678 9012 3456"
            required
            keyboardType="numeric"
            maxLength={19}
            autoComplete="cc-number"
          />

          <View style={styles.row}>
            <Input
              label="Expiry Date"
              value={formData.expiryDate}
              onChangeText={(value) => handleFieldChange('expiryDate', value)}
              onBlur={() => handleFieldBlur('expiryDate')}
              error={getFieldError('expiryDate')}
              placeholder="MMYY"
              required
              keyboardType="numeric"
              maxLength={4}
              containerStyle={styles.halfWidth}
              autoComplete="cc-exp"
              hint="Format: MMYY"
            />

            <Input
              label="CVV"
              value={formData.cvv}
              onChangeText={(value) => handleFieldChange('cvv', value)}
              onBlur={() => handleFieldBlur('cvv')}
              error={getFieldError('cvv')}
              placeholder="123"
              required
              keyboardType="numeric"
              maxLength={4}
              containerStyle={styles.halfWidth}
              secureTextEntry
              autoComplete="cc-csc"
            />
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Order Summary</Text>

          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            {items.map((item) => (
              <View key={item.product.id} style={styles.summaryItem}>
                <Text style={[styles.summaryItemName, { color: colors.text.secondary }]} numberOfLines={1}>
                  {item.product.name} × {item.quantity}
                </Text>
                <Text style={[styles.summaryItemPrice, { color: colors.text.primary }]}>
                  {formatCurrency(item.product.price * item.quantity)}
                </Text>
              </View>
            ))}

            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />

            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Subtotal</Text>
              <Text style={[styles.summaryValue, { color: colors.text.primary }]}>{formatCurrency(totalPrice)}</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Shipping</Text>
              <Text style={[styles.summaryFree, { color: colors.success.main }]}>FREE</Text>
            </View>

            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />

            <View style={styles.summaryItem}>
              <Text style={[styles.totalLabel, { color: colors.text.primary }]}>Total</Text>
              <Text style={[styles.totalValue, { color: colors.primary[600] }]}>{formatCurrency(totalPrice)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, {
        backgroundColor: colors.card,
        borderTopColor: colors.border
      }]}>
        <Button
          title={isProcessing ? 'Processing...' : 'Place Order'}
          onPress={handlePlaceOrder}
          loading={isProcessing}
          fullWidth
          size="lg"
          accessibilityHint="Places your order"
        />

        <Text style={[styles.secureText, { color: colors.text.tertiary }]}>🔒 Secure payment powered by Stripe</Text>
      </View>

      {/* Custom Alert Modal */}
      {alertConfig && (
        <CustomAlert
          visible={isVisible}
          title={alertConfig.title}
          message={alertConfig.message}
          buttons={alertConfig.buttons}
          onDismiss={hideAlert}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // backgroundColor set dynamically
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    // backgroundColor set dynamically,
    borderBottomWidth: 1
    // borderBottomColor set dynamically
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backIcon: {
    fontSize: 24
    // color set dynamically
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold
    // color set dynamically
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: SPACING.lg
  },
  section: {
    marginBottom: SPACING.xl
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    // color set dynamically,
    marginBottom: SPACING.md
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md
  },
  halfWidth: {
    flex: 1
  },
  summaryCard: {
    // backgroundColor set dynamically,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm
  },
  summaryItemName: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    // color set dynamically,
    marginRight: SPACING.sm
  },
  summaryItemPrice: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    // color set dynamically
  },
  summaryDivider: {
    height: 1,
    // backgroundColor set dynamically,
    marginVertical: SPACING.sm
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    // color set dynamically
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    // color set dynamically
  },
  summaryFree: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    // color set dynamically
  },
  totalLabel: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    // color set dynamically
  },
  totalValue: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    // color set dynamically
  },
  bottomBar: {
    padding: SPACING.lg,
    // backgroundColor set dynamically,
    borderTopWidth: 1,
    // borderTopColor set dynamically,
    ...SHADOWS.lg
  },
  secureText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    // color set dynamically,
    textAlign: 'center',
    marginTop: SPACING.sm
  }
});
