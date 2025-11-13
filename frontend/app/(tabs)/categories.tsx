/**
 * Categories Screen
 * Browse perfumes by category, gender, and brand
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { products } from '@data/products';
import { WebHeader } from '@shared/components/WebHeader';
import { Card } from '@shared/components';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@shared/constants/theme';
import { useResponsive } from '@shared/hooks';
import { useTheme } from '@shared/contexts';

type Category = {
  id: string;
  name: string;
  icon: string;
  count: number;
  filter: 'all' | 'male' | 'female' | 'unisex';
};

export default function CategoriesScreen() {
  const { isMobile } = useResponsive();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate product counts by category
  const categories: Category[] = useMemo(() => [
    {
      id: 'all',
      name: 'All Perfumes',
      icon: '✨',
      count: products.length,
      filter: 'all'
    },
    {
      id: 'male',
      name: 'For Him',
      icon: '👨',
      count: products.filter(p => p.gender === 'male').length,
      filter: 'male'
    },
    {
      id: 'female',
      name: 'For Her',
      icon: '👩',
      count: products.filter(p => p.gender === 'female').length,
      filter: 'female'
    },
    {
      id: 'unisex',
      name: 'Unisex',
      icon: '🌟',
      count: products.filter(p => p.gender === 'unisex').length,
      filter: 'unisex'
    }
  ], []);

  // Get unique brands
  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand)));
    return uniqueBrands.map(brand => ({
      name: brand,
      count: products.filter(p => p.brand === brand).length
    }));
  }, []);

  const handleCategoryPress = (filter: 'all' | 'male' | 'female' | 'unisex') => {
    router.push({
      pathname: '/',
      params: { filter }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
      <WebHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {isMobile && (
        <View style={[styles.mobileHeader, {
          backgroundColor: colors.card,
          borderBottomColor: colors.border
        }]}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Categories</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>Browse by collection</Text>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Grid */}
        <View style={styles.section}>
          {!isMobile && <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Shop by Category</Text>}
          <View style={[styles.grid, !isMobile && styles.gridDesktop]}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, !isMobile && styles.categoryCardDesktop, { backgroundColor: colors.card }]}
                onPress={() => handleCategoryPress(category.filter)}
                accessible={true}
                accessibilityLabel={`${category.name} - ${category.count} products`}
                accessibilityRole="button"
              >
                <View style={[styles.categoryIcon, { backgroundColor: colors.primary[50] }]}>
                  <Text style={styles.categoryIconText}>{category.icon}</Text>
                </View>
                <Text style={[styles.categoryName, { color: colors.text.primary }]}>{category.name}</Text>
                <Text style={[styles.categoryCount, { color: colors.text.secondary }]}>{category.count} Products</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Brands */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Popular Brands</Text>
          <View style={styles.brandsList}>
            {brands.map((brand, index) => (
              <Card key={index} variant="outlined" style={styles.brandCard}>
                <View style={styles.brandContent}>
                  <View style={styles.brandInfo}>
                    <Text style={styles.brandIcon}>🏷️</Text>
                    <Text style={[styles.brandName, { color: colors.text.primary }]}>{brand.name}</Text>
                  </View>
                  <View style={[styles.brandBadge, { backgroundColor: colors.primary[100] }]}>
                    <Text style={[styles.brandCount, { color: colors.primary[700] }]}>{brand.count}</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Price Ranges */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Shop by Price</Text>
          <View style={styles.priceRanges}>
            {[
              { label: 'Under $100', range: '0-100', count: products.filter(p => p.price < 100).length },
              { label: '$100 - $150', range: '100-150', count: products.filter(p => p.price >= 100 && p.price < 150).length },
              { label: '$150 - $200', range: '150-200', count: products.filter(p => p.price >= 150 && p.price < 200).length },
              { label: '$200+', range: '200+', count: products.filter(p => p.price >= 200).length }
            ].map((priceRange, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.priceCard, { backgroundColor: colors.card }]}
                onPress={() => router.push('/')}
                accessible={true}
                accessibilityLabel={`${priceRange.label} - ${priceRange.count} products`}
                accessibilityRole="button"
              >
                <Ionicons name="pricetag-outline" size={24} color={colors.primary[600]} />
                <View style={styles.priceInfo}>
                  <Text style={[styles.priceLabel, { color: colors.text.primary }]}>{priceRange.label}</Text>
                  <Text style={[styles.priceCount, { color: colors.text.secondary }]}>{priceRange.count} products</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Collections */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Featured Collections</Text>
          <View style={styles.collections}>
            {[
              { name: 'New Arrivals', icon: '🆕', color: colors.primary[100] },
              { name: 'Best Sellers', icon: '⭐', color: colors.warning.light },
              { name: 'Summer Collection', icon: '☀️', color: colors.info.light },
              { name: 'Winter Collection', icon: '❄️', color: colors.primary[50] }
            ].map((collection, index) => (
              <Card
                key={index}
                onPress={() => router.push('/')}
                style={[styles.collectionCard, { backgroundColor: collection.color }]}
              >
                <Text style={styles.collectionIcon}>{collection.icon}</Text>
                <Text style={[styles.collectionName, { color: colors.text.primary }]}>{collection.name}</Text>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mobileHeader: {
    padding: SPACING.lg,
    borderBottomWidth: 1
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    marginTop: 4
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
    marginBottom: SPACING.md
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md
  },
  gridDesktop: {
    gap: SPACING.lg
  },
  categoryCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    ...SHADOWS.sm
  },
  categoryCardDesktop: {
    minWidth: '22%',
    padding: SPACING.xl
  },
  categoryIcon: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md
  },
  categoryIconText: {
    fontSize: 40
  },
  categoryName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginBottom: SPACING.xs,
    textAlign: 'center'
  },
  categoryCount: {
    fontSize: TYPOGRAPHY.fontSize.sm
  },
  brandsList: {
    gap: SPACING.sm
  },
  brandCard: {
    padding: SPACING.md
  },
  brandContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  brandInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1
  },
  brandIcon: {
    fontSize: 28
  },
  brandName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold
  },
  brandBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full
  },
  brandCount: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold
  },
  priceRanges: {
    gap: SPACING.sm
  },
  priceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.md,
    ...SHADOWS.sm
  },
  priceInfo: {
    flex: 1
  },
  priceLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold
  },
  priceCount: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginTop: 2
  },
  collections: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md
  },
  collectionCard: {
    flex: 1,
    minWidth: '45%',
    padding: SPACING.lg,
    alignItems: 'center'
  },
  collectionIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm
  },
  collectionName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    textAlign: 'center'
  }
});
