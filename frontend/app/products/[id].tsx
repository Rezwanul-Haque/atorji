/**
 * Product Details Screen
 * Displays detailed information about a single product
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { products } from '@data/products';
import { Button } from '@shared/components';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@shared/constants/theme';
import { formatCurrency } from '@shared/utils/format';
import { useCart } from '@features/cart/CartContext';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addItem, getItemQuantity, updateQuantity, isInCart } = useCart();
  const [selectedNote, setSelectedNote] = useState<'top' | 'middle' | 'base'>('top');

  const product = products.find((p) => p.id === id);
  const quantity = getItemQuantity(id!);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😔</Text>
          <Text style={styles.errorTitle}>Product not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    if (product.inStock) {
      addItem(product);
    }
  };

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessible={true}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => router.push('/cart')}
            accessible={true}
            accessibilityLabel="Go to cart"
            accessibilityRole="button"
          >
            <Text style={styles.cartIcon}>🛒</Text>
          </TouchableOpacity>
        </View>

        {/* Product Image */}
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
          accessible={true}
          accessibilityLabel={`${product.name} image`}
        />

        {/* Product Info */}
        <View style={styles.content}>
          {/* Brand and Stock Status */}
          <View style={styles.brandRow}>
            <Text style={styles.brand}>{product.brand}</Text>
            {!product.inStock && (
              <View style={styles.outOfStockBadge}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            )}
          </View>

          {/* Name */}
          <Text style={styles.name}>{product.name}</Text>

          {/* Rating and Price Row */}
          <View style={styles.priceRow}>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>★</Text>
              <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          </View>

          <Text style={styles.size}>{product.size}</Text>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fragrance Notes</Text>

            <View style={styles.notesSelector}>
              {(['top', 'middle', 'base'] as const).map((noteType) => (
                <TouchableOpacity
                  key={noteType}
                  style={[
                    styles.noteButton,
                    selectedNote === noteType && styles.noteButtonActive
                  ]}
                  onPress={() => setSelectedNote(noteType)}
                  accessible={true}
                  accessibilityLabel={`View ${noteType} notes`}
                  accessibilityState={{ selected: selectedNote === noteType }}
                >
                  <Text
                    style={[
                      styles.noteButtonText,
                      selectedNote === noteType && styles.noteButtonTextActive
                    ]}
                  >
                    {noteType.charAt(0).toUpperCase() + noteType.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.notesList}>
              {product.notes[selectedNote].map((note, index) => (
                <View key={index} style={styles.noteChip}>
                  <Text style={styles.noteChipText}>{note}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Gender Tag */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>For</Text>
            <View style={styles.genderTag}>
              <Text style={styles.genderTagText}>
                {product.gender === 'unisex'
                  ? 'Unisex'
                  : product.gender === 'male'
                  ? 'Men'
                  : 'Women'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        {isInCart(product.id) ? (
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleDecrement}
              accessible={true}
              accessibilityLabel="Decrease quantity"
              accessibilityRole="button"
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.quantityText}>{quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleIncrement}
              accessible={true}
              accessibilityLabel="Increase quantity"
              accessibilityRole="button"
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Button
            title={product.inStock ? 'Add to Cart' : 'Out of Stock'}
            onPress={handleAddToCart}
            disabled={!product.inStock}
            fullWidth
            accessibilityHint={product.inStock ? 'Adds product to cart' : 'Product is out of stock'}
          />
        )}

        {isInCart(product.id) && (
          <Button
            title="Go to Cart"
            onPress={() => router.push('/cart')}
            variant="outline"
            style={styles.goToCartButton}
            accessibilityHint="Opens cart screen"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[0]
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.neutral[0],
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.neutral[900]
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.neutral[0],
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md
  },
  cartIcon: {
    fontSize: 20
  },
  image: {
    width: '100%',
    height: 400,
    backgroundColor: COLORS.neutral[100]
  },
  content: {
    padding: SPACING.lg
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs
  },
  brand: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.neutral[600],
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: TYPOGRAPHY.fontWeight.medium
  },
  outOfStockBadge: {
    backgroundColor: COLORS.error.light,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm
  },
  outOfStockText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.error.dark,
    fontWeight: TYPOGRAPHY.fontWeight.medium
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral[900],
    marginBottom: SPACING.md
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rating: {
    fontSize: 20,
    color: '#FFC107'
  },
  ratingText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.neutral[700],
    marginLeft: 6,
    fontWeight: TYPOGRAPHY.fontWeight.semibold
  },
  price: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary[600]
  },
  size: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.neutral[600],
    marginBottom: SPACING.xl
  },
  section: {
    marginBottom: SPACING.xl
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral[900],
    marginBottom: SPACING.md
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.base,
    lineHeight: 24,
    color: COLORS.neutral[700]
  },
  notesSelector: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md
  },
  noteButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.neutral[100],
    alignItems: 'center'
  },
  noteButtonActive: {
    backgroundColor: COLORS.primary[500]
  },
  noteButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.neutral[700]
  },
  noteButtonTextActive: {
    color: COLORS.neutral[0]
  },
  notesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm
  },
  noteChip: {
    backgroundColor: COLORS.primary[50],
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary[200]
  },
  noteChipText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary[700],
    fontWeight: TYPOGRAPHY.fontWeight.medium
  },
  genderTag: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.neutral[100],
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full
  },
  genderTagText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.neutral[700]
  },
  bottomBar: {
    padding: SPACING.lg,
    backgroundColor: COLORS.neutral[0],
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
    ...SHADOWS.lg,
    gap: SPACING.md
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary[500],
    justifyContent: 'center',
    alignItems: 'center'
  },
  quantityButtonText: {
    fontSize: 24,
    color: COLORS.neutral[0],
    fontWeight: TYPOGRAPHY.fontWeight.bold
  },
  quantityText: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral[900],
    minWidth: 60,
    textAlign: 'center'
  },
  goToCartButton: {
    marginTop: 0
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: SPACING.lg
  },
  errorTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral[900],
    marginBottom: SPACING.xl
  }
});
