/**
 * Cart Screen
 * Displays cart items with quantity controls and checkout button
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button, WebHeader } from '@shared/components';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@shared/constants/theme';
import { formatCurrency } from '@shared/utils/format';
import { useCart } from '@features/cart/CartContext';
import { useResponsive } from '@shared/hooks';
import { CartItem } from '@shared/types';
import { useTheme } from '@shared/contexts';

export default function CartScreen() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem
  } = useCart();
  const { isMobile } = useResponsive();
  const { colors } = useTheme();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleIncrement = (productId: string, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const handleDecrement = (productId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    }
  };

  const handleRemove = (productId: string) => {
    removeItem(productId);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const { product, quantity } = item;
    const subtotal = product.price * quantity;

    return (
      <View style={[styles.cartItem, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          onPress={() => router.push(`/products/${product.id}`)}
          accessible={true}
          accessibilityLabel={`View ${product.name} details`}
          accessibilityRole="button"
        >
          <Image
            source={{ uri: product.image }}
            style={styles.itemImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View style={styles.itemInfo}>
          <TouchableOpacity
            onPress={() => router.push(`/products/${product.id}`)}
          >
            <Text style={[styles.itemBrand, { color: colors.text.secondary }]}>{product.brand}</Text>
            <Text style={[styles.itemName, { color: colors.text.primary }]} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={[styles.itemSize, { color: colors.text.tertiary }]}>{product.size}</Text>
          </TouchableOpacity>

          <View style={styles.itemFooter}>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={[styles.quantityButton, { backgroundColor: colors.primary[500] }]}
                onPress={() => handleDecrement(product.id, quantity)}
                accessible={true}
                accessibilityLabel="Decrease quantity"
                accessibilityRole="button"
              >
                <Text style={[styles.quantityButtonText, { color: colors.neutral[0] }]}>−</Text>
              </TouchableOpacity>

              <Text style={[styles.quantityText, { color: colors.text.primary }]}>{quantity}</Text>

              <TouchableOpacity
                style={[styles.quantityButton, { backgroundColor: colors.primary[500] }]}
                onPress={() => handleIncrement(product.id, quantity)}
                accessible={true}
                accessibilityLabel="Increase quantity"
                accessibilityRole="button"
              >
                <Text style={[styles.quantityButtonText, { color: colors.neutral[0] }]}>+</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text style={[styles.itemPrice, { color: colors.primary[600] }]}>{formatCurrency(subtotal)}</Text>
              {quantity > 1 && (
                <Text style={[styles.itemPriceUnit, { color: colors.text.tertiary }]}>
                  {formatCurrency(product.price)} each
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemove(product.id)}
            accessible={true}
            accessibilityLabel={`Remove ${product.name} from cart`}
            accessibilityRole="button"
          >
            <Text style={[styles.removeButtonText, { color: colors.error.main }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
        <View style={{ flex: 1, paddingBottom: isMobile ? 80 : 0 }}>
        <WebHeader />

        {isMobile && (
          <View style={[styles.header, {
            backgroundColor: colors.card,
            borderBottomColor: colors.border
          }]}>
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Cart</Text>
          </View>
        )}

        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>Your cart is empty</Text>
          <Text style={[styles.emptyMessage, { color: colors.text.secondary }]}>
            Add some perfumes to get started
          </Text>
          <Button
            title="Discover Perfumes"
            onPress={() => router.push('/')}
            style={styles.emptyButton}
          />
        </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
      <View style={{ flex: 1, paddingBottom: isMobile ? 80 : 0 }}>
      <WebHeader />

      {/* Mobile Header */}
      {isMobile && (
        <View style={[styles.header, {
          backgroundColor: colors.card,
          borderBottomColor: colors.border
        }]}>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Cart ({totalItems})</Text>
        </View>
      )}

      {/* Cart Items */}
      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={[styles.listContent, isMobile && styles.listContentMobile]}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Summary */}
      <View style={[
        styles.bottomBar,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.border
        }
      ]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Subtotal</Text>
          <Text style={[styles.summaryValue, { color: colors.text.primary }]}>{formatCurrency(totalPrice)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Shipping</Text>
          <Text style={[styles.shippingFree, { color: colors.success.main }]}>FREE</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.text.primary }]}>Total</Text>
          <Text style={[styles.totalValue, { color: colors.primary[600] }]}>{formatCurrency(totalPrice)}</Text>
        </View>

        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          fullWidth
          size="lg"
          accessibilityHint="Proceeds to checkout screen"
        />
      </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor set dynamically
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    // backgroundColor set dynamically,
    borderBottomWidth: 1,
    // borderBottomColor set dynamically
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    // color set dynamically
  },
  listContent: {
    padding: SPACING.lg
  },
  listContentMobile: {
    paddingBottom: 0 // Padding handled at container level
  },
  cartItem: {
    flexDirection: 'row',
    // backgroundColor set dynamically,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.md,
    // backgroundColor set dynamically
  },
  itemInfo: {
    flex: 1,
    marginLeft: SPACING.md
  },
  itemBrand: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    // color set dynamically,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  itemName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    // color set dynamically,
    marginBottom: 2
  },
  itemSize: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    // color set dynamically,
    marginBottom: SPACING.sm
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    // backgroundColor set dynamically,
    justifyContent: 'center',
    alignItems: 'center'
  },
  quantityButtonText: {
    fontSize: 18,
    // color set dynamically,
    fontWeight: TYPOGRAPHY.fontWeight.bold
  },
  quantityText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    // color set dynamically,
    minWidth: 32,
    textAlign: 'center'
  },
  itemPrice: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    // color set dynamically,
    textAlign: 'right'
  },
  itemPriceUnit: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    // color set dynamically,
    textAlign: 'right',
    marginTop: 2
  },
  removeButton: {
    marginTop: SPACING.sm,
    alignSelf: 'flex-start'
  },
  removeButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    // color set dynamically,
    fontWeight: TYPOGRAPHY.fontWeight.medium
  },
  bottomBar: {
    padding: SPACING.lg,
    // backgroundColor set dynamically,
    borderTopWidth: 1,
    // borderTopColor set dynamically,
    ...SHADOWS.lg
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm
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
  shippingFree: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    // color set dynamically
  },
  divider: {
    height: 1,
    // backgroundColor set dynamically,
    marginVertical: SPACING.md
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg
  },
  totalLabel: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    // color set dynamically
  },
  totalValue: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold
    // color set dynamically
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: SPACING.lg
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    // color set dynamically,
    marginBottom: SPACING.sm,
    textAlign: 'center'
  },
  emptyMessage: {
    fontSize: TYPOGRAPHY.fontSize.base,
    // color set dynamically,
    textAlign: 'center',
    marginBottom: SPACING.xl
  },
  emptyButton: {
    minWidth: 200
  }
});
