/**
 * ProductCard Component
 * Displays product information in a card format with theme support
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Product } from '@shared/types';
import { Card } from '@shared/components';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@shared/constants/theme';
import { formatCurrency } from '@shared/utils/format';
import { useCart } from '@features/cart/CartContext';
import { useTheme } from '@shared/contexts';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo<ProductCardProps>(({ product }) => {
  const { addItem, isInCart } = useCart();
  const { colors } = useTheme();

  const handlePress = () => {
    router.push(`/products/${product.id}`);
  };

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    addItem(product);
  };

  return (
    <Card
      variant="elevated"
      padding="none"
      onPress={handlePress}
      style={styles.card}
      testID={`product-card-${product.id}`}
    >
      <Image
        source={{ uri: product.image }}
        style={[styles.image, { backgroundColor: colors.neutral[100] }]}
        resizeMode="cover"
        accessible={true}
        accessibilityLabel={`${product.name} product image`}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.brand, { color: colors.text.secondary }]} numberOfLines={1}>
            {product.brand}
          </Text>
          {!product.inStock && (
            <View style={[styles.outOfStockBadge, { backgroundColor: colors.error.light }]}>
              <Text style={[styles.outOfStockText, { color: colors.error.dark }]}>Out of Stock</Text>
            </View>
          )}
        </View>

        <Text style={[styles.name, { color: colors.text.primary }]} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: colors.primary[600] }]}>{formatCurrency(product.price)}</Text>
            <Text style={[styles.size, { color: colors.text.tertiary }]}>{product.size}</Text>
          </View>

          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★</Text>
            <Text style={[styles.ratingText, { color: colors.text.secondary }]}>{product.rating.toFixed(1)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: colors.primary[500] },
            !product.inStock && [styles.addButtonDisabled, { backgroundColor: colors.neutral[300] }],
            isInCart(product.id) && [styles.addButtonInCart, {
              backgroundColor: colors.success.light,
              borderColor: colors.success.main
            }]
          ]}
          onPress={handleAddToCart}
          disabled={!product.inStock}
          accessible={true}
          accessibilityLabel={`Add ${product.name} to cart`}
          accessibilityHint={product.inStock ? 'Double tap to add to cart' : 'Out of stock'}
        >
          <Text
            style={[
              styles.addButtonText,
              { color: colors.neutral[0] },
              isInCart(product.id) && [styles.addButtonTextInCart, { color: colors.success.dark }]
            ]}
          >
            {isInCart(product.id) ? 'In Cart' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginBottom: SPACING.md,
    maxWidth: 500
  },
  image: {
    width: '100%',
    height: 200
  },
  content: {
    padding: SPACING.md
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs
  },
  brand: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1
  },
  outOfStockBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm
  },
  outOfStockText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginBottom: SPACING.sm
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: SPACING.md
  },
  priceContainer: {
    flex: 1
  },
  price: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold
  },
  size: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginTop: 2
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rating: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: '#FFC107'
  },
  ratingText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginLeft: 4,
    fontWeight: TYPOGRAPHY.fontWeight.medium
  },
  addButton: {
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center'
  },
  addButtonDisabled: {
    // Dynamic backgroundColor applied inline
  },
  addButtonInCart: {
    borderWidth: 1
  },
  addButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold
  },
  addButtonTextInCart: {
    // Dynamic color applied inline
  }
});
