/**
 * Home Screen - Product Listing
 * Main screen displaying all products with search and filter
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, useWindowDimensions, TextInput, Modal, Animated, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { products } from '@data/products';
import { ProductCard } from '@features/products/ProductCard';
import { LoadingSpinner, WebHeader } from '@shared/components';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@shared/constants/theme';
import { useDebounce, useResponsive } from '@shared/hooks';
import { useCart } from '@features/cart/CartContext';
import { useTheme } from '@shared/contexts';
import { Product } from '@shared/types';
import { formatCurrency } from '@shared/utils/format';

type GenderFilter = 'all' | 'male' | 'female' | 'unisex';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const debouncedMobileSearch = useDebounce(mobileSearchQuery, 200);
  const { isLoading } = useCart();
  const { isMobile } = useResponsive();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const searchInputRef = useRef<TextInput>(null);
  const modalAnimation = useRef(new Animated.Value(0)).current;

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.brand.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.description.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesGender =
        genderFilter === 'all' || product.gender === genderFilter;

      return matchesSearch && matchesGender;
    });
  }, [debouncedSearch, genderFilter]);

  // Mobile search results
  const mobileSearchResults = useMemo(() => {
    if (!debouncedMobileSearch) return [];
    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(debouncedMobileSearch.toLowerCase()) ||
        product.brand.toLowerCase().includes(debouncedMobileSearch.toLowerCase()) ||
        product.description.toLowerCase().includes(debouncedMobileSearch.toLowerCase())
      );
    }).slice(0, 20); // Limit to 20 results
  }, [debouncedMobileSearch]);

  // Autocomplete suggestions (brands and popular searches)
  const autocompleteSuggestions = useMemo(() => {
    if (!mobileSearchQuery || mobileSearchQuery.length < 2) return [];

    const query = mobileSearchQuery.toLowerCase();
    const suggestions = new Set<string>();

    // Add matching brands
    products.forEach((product) => {
      if (product.brand.toLowerCase().includes(query)) {
        suggestions.add(product.brand);
      }
      // Add matching product names
      if (product.name.toLowerCase().includes(query)) {
        suggestions.add(product.name);
      }
    });

    return Array.from(suggestions).slice(0, 5);
  }, [mobileSearchQuery]);

  // Open search modal
  const openSearchModal = () => {
    setIsSearchModalVisible(true);
    Animated.spring(modalAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 10
    }).start();
    // Focus input after a short delay
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  // Close search modal
  const closeSearchModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      setIsSearchModalVisible(false);
      setMobileSearchQuery('');
    });
  };

  // Handle search result selection
  const handleResultPress = (productId: string) => {
    closeSearchModal();
    router.push(`/products/${productId}`);
  };

  // Handle suggestion selection
  const handleSuggestionPress = (suggestion: string) => {
    setMobileSearchQuery(suggestion);
  };

  // Dynamic columns based on screen width
  // Mobile: 1 column
  // Tablet (768-1279px): 2 columns
  // Desktop (1280-1919px): 3 columns
  // Large Desktop (1920px+): 4 columns
  const getNumColumns = () => {
    if (isMobile) return 1;
    if (width < 1280) return 2;
    if (width < 1920) return 3;
    return 4;
  };

  const numColumns = getNumColumns();

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading your cart..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
      <WebHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Mobile Header */}
      {isMobile && (
        <View style={[styles.mobileHeader, {
          backgroundColor: colors.card,
          borderBottomColor: colors.border
        }]}>
          <View>
            <Text style={[styles.title, { color: colors.text.primary }]}>Discover</Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>Premium Perfumes</Text>
          </View>

          {/* Search Icon Button */}
          <TouchableOpacity
            style={[styles.searchIconButton, { backgroundColor: colors.primary[50] }]}
            onPress={openSearchModal}
            accessible={true}
            accessibilityLabel="Open search"
          >
            <Ionicons name="search" size={22} color={colors.primary[600]} />
          </TouchableOpacity>
        </View>
      )}

      {/* Mobile Search Modal */}
      <Modal
        visible={isSearchModalVisible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeSearchModal}
      >
        <Animated.View
          style={[
            styles.modalOverlay,
            {
              opacity: modalAnimation
            }
          ]}
        >
          <Pressable style={styles.modalBackdrop} onPress={closeSearchModal} />

          <Animated.View
            style={[
              styles.searchModalContainer,
              {
                backgroundColor: colors.card,
                transform: [
                  {
                    translateY: modalAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-50, 0]
                    })
                  }
                ]
              }
            ]}
          >
            {/* Search Header */}
            <View style={[styles.searchModalHeader, { borderBottomColor: colors.border }]}>
              <View style={[styles.searchInputContainer, { backgroundColor: colors.surface }]}>
                <Ionicons name="search" size={20} color={colors.primary[600]} />
                <TextInput
                  ref={searchInputRef}
                  style={[styles.searchModalInput, { color: colors.text.primary }]}
                  placeholder="Search perfumes, brands..."
                  value={mobileSearchQuery}
                  onChangeText={setMobileSearchQuery}
                  placeholderTextColor={colors.text.tertiary}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {mobileSearchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setMobileSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity onPress={closeSearchModal} style={styles.cancelButton}>
                <Text style={[styles.cancelText, { color: colors.primary[600] }]}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {/* Autocomplete Suggestions */}
            {autocompleteSuggestions.length > 0 && mobileSearchQuery.length >= 2 && (
              <View style={[styles.suggestionsContainer, { borderBottomColor: colors.border }]}>
                <Text style={[styles.suggestionsTitle, { color: colors.text.secondary }]}>
                  SUGGESTIONS
                </Text>
                {autocompleteSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionPress(suggestion)}
                  >
                    <Ionicons name="search" size={18} color={colors.text.tertiary} />
                    <Text style={[styles.suggestionText, { color: colors.text.primary }]}>
                      {suggestion}
                    </Text>
                    <Ionicons name="arrow-up-outline" size={18} color={colors.text.tertiary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Search Results */}
            {mobileSearchQuery.length > 0 && (
              <View style={styles.searchResultsContainer}>
                {mobileSearchResults.length === 0 ? (
                  <View style={styles.noResults}>
                    <Ionicons name="search-outline" size={48} color={colors.neutral[300]} />
                    <Text style={[styles.noResultsText, { color: colors.text.secondary }]}>
                      No results found for "{mobileSearchQuery}"
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text style={[styles.resultsCount, { color: colors.text.secondary }]}>
                      {mobileSearchResults.length} {mobileSearchResults.length === 1 ? 'result' : 'results'}
                    </Text>
                    <FlatList
                      data={mobileSearchResults}
                      keyExtractor={(item) => item.id}
                      showsVerticalScrollIndicator={false}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[styles.searchResultItem, { borderBottomColor: colors.border }]}
                          onPress={() => handleResultPress(item.id)}
                        >
                          <Image
                            source={{ uri: item.image }}
                            style={[styles.resultImage, { backgroundColor: colors.neutral[100] }]}
                            resizeMode="cover"
                          />
                          <View style={styles.resultDetails}>
                            <Text style={[styles.resultBrand, { color: colors.text.secondary }]}>
                              {item.brand}
                            </Text>
                            <Text style={[styles.resultName, { color: colors.text.primary }]} numberOfLines={2}>
                              {item.name}
                            </Text>
                            <View style={styles.resultMeta}>
                              <Text style={[styles.resultPrice, { color: colors.primary[600] }]}>
                                {formatCurrency(item.price)}
                              </Text>
                              <View style={styles.resultRating}>
                                <Ionicons name="star" size={14} color="#FFC107" />
                                <Text style={[styles.resultRatingText, { color: colors.text.secondary }]}>
                                  {item.rating.toFixed(1)}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
                        </TouchableOpacity>
                      )}
                    />
                  </>
                )}
              </View>
            )}

            {/* Empty State - Show when no query */}
            {mobileSearchQuery.length === 0 && (
              <View style={styles.emptySearchState}>
                <Ionicons name="search-outline" size={64} color={colors.neutral[300]} />
                <Text style={[styles.emptySearchTitle, { color: colors.text.primary }]}>
                  Search for perfumes
                </Text>
                <Text style={[styles.emptySearchText, { color: colors.text.secondary }]}>
                  Find your favorite fragrances by name, brand, or description
                </Text>
              </View>
            )}
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* Gender Filter */}
      <View style={[styles.filterContainer, {
        backgroundColor: colors.card,
        borderBottomColor: colors.border
      }]}>
        {(['all', 'male', 'female', 'unisex'] as GenderFilter[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              {
                backgroundColor: colors.neutral[100],
                borderColor: colors.neutral[300]
              },
              genderFilter === filter && {
                backgroundColor: colors.primary[500],
                borderColor: colors.primary[500]
              }
            ]}
            onPress={() => setGenderFilter(filter)}
            accessible={true}
            accessibilityLabel={`Filter by ${filter}`}
            accessibilityState={{ selected: genderFilter === filter }}
          >
            <Text
              style={[
                styles.filterText,
                { color: colors.neutral[700] },
                genderFilter === filter && { color: colors.neutral[0] }
              ]}
            >
              {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results Count */}
      <Text style={[styles.resultsText, { color: colors.text.secondary }]}>
        {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
      </Text>

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>No perfumes found</Text>
          <Text style={[styles.emptyMessage, { color: colors.text.secondary }]}>
            Try adjusting your search or filter to find what you're looking for
          </Text>
        </View>
      ) : (
        <FlatList
          key={numColumns}
          data={filteredProducts}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mobileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginTop: 2
  },
  searchIconButton: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm
  },
  // Search Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  searchModalContainer: {
    flex: 1,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.lg
  },
  searchModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    borderBottomWidth: 1
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full
  },
  searchModalInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base,
    outlineStyle: 'none' as any
  },
  cancelButton: {
    paddingHorizontal: SPACING.sm
  },
  cancelText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold
  },
  // Suggestions Styles
  suggestionsContainer: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1
  },
  suggestionsTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    letterSpacing: 0.5
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md
  },
  suggestionText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base
  },
  // Search Results Styles
  searchResultsContainer: {
    flex: 1
  },
  resultsCount: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.sm
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.md
  },
  resultDetails: {
    flex: 1,
    gap: 4
  },
  resultBrand: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  resultName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4
  },
  resultPrice: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold
  },
  resultRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  resultRatingText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING['3xl']
  },
  noResultsText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    marginTop: SPACING.md,
    textAlign: 'center',
    maxWidth: 280
  },
  emptySearchState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl
  },
  emptySearchTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm
  },
  emptySearchText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    textAlign: 'center',
    maxWidth: 280
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    borderBottomWidth: 1,
    flexWrap: 'wrap'
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1
  },
  filterText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium
  },
  resultsText: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.sm
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl
  },
  columnWrapper: {
    gap: SPACING.md,
    marginBottom: SPACING.md
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: SPACING.lg
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.sm,
    textAlign: 'center'
  },
  emptyMessage: {
    fontSize: TYPOGRAPHY.fontSize.base,
    textAlign: 'center',
    maxWidth: 300
  }
});
