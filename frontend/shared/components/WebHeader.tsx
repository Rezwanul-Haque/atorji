/**
 * WebHeader Component
 * Desktop/tablet header with logo, search, and navigation
 * Enhanced with modern styling and improved UX
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, TYPOGRAPHY, SHADOWS, Z_INDEX, BORDER_RADIUS } from '@shared/constants/theme';
import { useCart } from '@features/cart/CartContext';
import { useResponsive } from '@shared/hooks';
import { useTheme } from '@shared/contexts';

interface WebHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const WebHeader: React.FC<WebHeaderProps> = ({ searchQuery = '', onSearchChange }) => {
  const { totalItems } = useCart();
  const { isMobile } = useResponsive();
  const { colors } = useTheme();
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  if (isMobile) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.content}>
        {/* Logo with Modern Styling */}
        <TouchableOpacity
          style={styles.logo}
          onPress={() => router.push('/')}
          accessible={true}
          accessibilityLabel="Go to home"
          accessibilityRole="button"
        >
          <View style={[styles.logoIconContainer, { backgroundColor: colors.primary[50] }]}>
            <Text style={styles.logoIcon}>✨</Text>
          </View>
          <View>
            <Text style={[styles.logoText, { color: colors.primary[600] }]}>LUXE</Text>
            <Text style={[styles.logoSubtext, { color: colors.text.secondary }]}>PARFUMS</Text>
          </View>
        </TouchableOpacity>

        {/* Enhanced Search Bar */}
        {onSearchChange && (
          <View style={[
            styles.searchContainer,
            { backgroundColor: colors.surface },
            isSearchFocused && [styles.searchContainerFocused, { borderColor: colors.primary[300], backgroundColor: colors.card }]
          ]}>
            <Ionicons
              name="search"
              size={20}
              color={isSearchFocused ? colors.primary[600] : colors.text.tertiary}
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, { color: colors.text.primary }]}
              placeholder="Search perfumes, brands, collections..."
              value={searchQuery}
              onChangeText={onSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholderTextColor={colors.text.tertiary}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => onSearchChange('')}
                style={styles.clearButton}
                accessible={true}
                accessibilityLabel="Clear search"
              >
                <Ionicons name="close-circle" size={18} color={colors.text.tertiary} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Navigation with Modern Styling */}
        <View style={styles.nav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push('/')}
            accessible={true}
            accessibilityLabel="Home"
          >
            <View style={[styles.navIconContainer, { backgroundColor: colors.neutral[100] }]}>
              <Ionicons name="home" size={22} color={colors.text.secondary} />
            </View>
            <Text style={[styles.navText, { color: colors.text.secondary }]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push('/categories')}
            accessible={true}
            accessibilityLabel="Categories"
          >
            <View style={[styles.navIconContainer, { backgroundColor: colors.neutral[100] }]}>
              <Ionicons name="grid" size={22} color={colors.text.secondary} />
            </View>
            <Text style={[styles.navText, { color: colors.text.secondary }]}>Categories</Text>
          </TouchableOpacity>

          {/* Enhanced Cart Button */}
          <TouchableOpacity
            style={[styles.navItem, styles.cartButton]}
            onPress={() => router.push('/cart')}
            accessible={true}
            accessibilityLabel={`Cart with ${totalItems} items`}
          >
            <View style={styles.cartIconContainer}>
              <View style={[
                styles.navIconContainer,
                { backgroundColor: colors.neutral[100] },
                totalItems > 0 && { backgroundColor: colors.primary[100] }
              ]}>
                <Ionicons
                  name={totalItems > 0 ? 'cart' : 'cart-outline'}
                  size={24}
                  color={totalItems > 0 ? colors.primary[600] : colors.text.secondary}
                />
              </View>
              {totalItems > 0 && (
                <>
                  {/* Pulsing Ring Effect */}
                  <View style={[styles.badgePulse, {
                    backgroundColor: colors.error.main
                  }]} />

                  {/* Notification Badge */}
                  <View style={[styles.badge, {
                    backgroundColor: colors.error.main,
                    borderColor: colors.card
                  }]}>
                    <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>{totalItems > 99 ? '99+' : totalItems}</Text>
                  </View>
                </>
              )}
            </View>
            <Text style={[
              styles.navText,
              { color: colors.text.secondary },
              totalItems > 0 && { color: colors.primary[600] }
            ]}>Cart</Text>
          </TouchableOpacity>

          {/* User Profile Menu */}
          <TouchableOpacity
            style={styles.userButton}
            onPress={() => router.push('/profile')}
            accessible={true}
            accessibilityLabel="Profile"
          >
            <View style={[styles.userAvatar, {
              backgroundColor: colors.primary[100],
              borderColor: colors.primary[200]
            }]}>
              <Ionicons name="person" size={20} color={colors.primary[600]} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Decorative Bottom Border */}
      <View style={[styles.bottomBorder, { backgroundColor: colors.primary[600] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...SHADOWS.md,
    zIndex: Z_INDEX.sticky,
    position: 'relative'
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    maxWidth: 1440,
    alignSelf: 'center',
    width: '100%'
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginRight: SPACING.xl
  },
  logoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm
  },
  logoIcon: {
    fontSize: 28
  },
  logoText: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    letterSpacing: 2
  },
  logoSubtext: {
    fontSize: 10,
    letterSpacing: 3,
    marginTop: -2
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    maxWidth: 600,
    marginRight: SPACING.xl,
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.sm
  },
  searchContainerFocused: {
    ...SHADOWS.md
  },
  searchIcon: {
    marginRight: SPACING.sm
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.base,
    outlineStyle: 'none' as any
  },
  clearButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg
  },
  navIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center'
  },
  navText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium
  },
  cartButton: {
    position: 'relative'
  },
  cartIconContainer: {
    position: 'relative'
  },
  badgePulse: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 34,
    height: 34,
    borderRadius: BORDER_RADIUS.full,
    opacity: 0.3
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
    borderWidth: 3,
    // Enhanced notification badge shadow
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 8
  },
  badgeText: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    lineHeight: 13,
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  userButton: {
    marginLeft: SPACING.sm
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    ...SHADOWS.sm
  },
  bottomBorder: {
    height: 3,
    opacity: 0.1
  }
});
