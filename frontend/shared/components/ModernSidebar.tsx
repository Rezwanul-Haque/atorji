/**
 * Modern Sidebar
 * Collapsible desktop sidebar navigation with theme support
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS, Z_INDEX } from '@shared/constants/theme';
import { useResponsive } from '@shared/hooks';
import { useTheme } from '@shared/contexts';

interface SidebarItem {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  badge?: number;
  children?: SidebarItem[];
}

interface ModernSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const NAVIGATION_ITEMS: SidebarItem[] = [
  {
    key: 'home',
    label: 'Home',
    icon: 'home',
    route: '/'
  },
  {
    key: 'categories',
    label: 'Categories',
    icon: 'grid',
    children: [
      { key: 'men', label: 'Men\'s Fragrances', icon: 'male', route: '/categories?gender=male' },
      { key: 'women', label: 'Women\'s Fragrances', icon: 'female', route: '/categories?gender=female' },
      { key: 'unisex', label: 'Unisex', icon: 'people', route: '/categories?gender=unisex' }
    ]
  },
  {
    key: 'brands',
    label: 'Brands',
    icon: 'sparkles',
    children: [
      { key: 'luxury', label: 'Luxury Brands', icon: 'diamond', route: '/categories?type=luxury' },
      { key: 'designer', label: 'Designer', icon: 'bag-handle', route: '/categories?type=designer' },
      { key: 'niche', label: 'Niche Perfumes', icon: 'flower', route: '/categories?type=niche' }
    ]
  }
];

export const ModernSidebar: React.FC<ModernSidebarProps> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname();
  const { isMobile } = useResponsive();
  const { isDark, colors, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['categories']);

  // Don't render on mobile
  if (isMobile) return null;

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleExpanded = (key: string) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleItemPress = (item: SidebarItem) => {
    if (item.children) {
      if (!isCollapsed) {
        toggleExpanded(item.key);
      }
    } else if (item.route) {
      router.push(item.route);
      onClose?.();
    }
  };

  const isActive = (route?: string) => {
    if (!route) return false;
    return pathname === route || pathname.startsWith(route);
  };

  const renderItem = (item: SidebarItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedKeys.includes(item.key);
    const active = isActive(item.route);

    return (
      <View key={item.key}>
        <TouchableOpacity
          style={[
            styles.item,
            level === 0 && styles.itemTopLevel,
            level > 0 && styles.itemNested,
            active && { backgroundColor: colors.primary[50] }
          ]}
          onPress={() => handleItemPress(item)}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel={item.label}
          accessibilityState={{ selected: active, expanded: isExpanded }}
        >
          {/* Icon */}
          <View style={[
            styles.iconContainer,
            { backgroundColor: colors.neutral[100] },
            active && { backgroundColor: colors.primary[100] }
          ]}>
            <Ionicons
              name={item.icon}
              size={level === 0 ? 22 : 18}
              color={active ? colors.primary[600] : colors.neutral[600]}
            />
          </View>

          {/* Label - Only show if not collapsed */}
          {!isCollapsed && (
            <>
              <Text
                style={[
                  styles.itemLabel,
                  level === 0 && styles.itemLabelTopLevel,
                  level > 0 && styles.itemLabelNested,
                  { color: colors.neutral[700] },
                  active && { color: colors.primary[600], fontWeight: TYPOGRAPHY.fontWeight.semibold }
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>

              {/* Notification Badge */}
              {item.badge && item.badge > 0 && (
                <View style={styles.badgeContainer}>
                  {/* Pulsing Ring */}
                  <View style={[styles.badgePulse, { backgroundColor: colors.error.main }]} />

                  {/* Badge */}
                  <View style={[styles.badge, {
                    backgroundColor: colors.error.main,
                    borderColor: colors.card
                  }]}>
                    <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>{item.badge > 99 ? '99+' : item.badge}</Text>
                  </View>
                </View>
              )}

              {/* Expand/Collapse Icon */}
              {hasChildren && (
                <Ionicons
                  name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                  size={18}
                  color={colors.neutral[400]}
                  style={styles.expandIcon}
                />
              )}
            </>
          )}

          {/* Active Indicator */}
          {active && <View style={[styles.activeIndicator, { backgroundColor: colors.primary[600] }]} />}
        </TouchableOpacity>

        {/* Children - Only show if expanded and not collapsed */}
        {hasChildren && isExpanded && !isCollapsed && (
          <View style={[styles.childrenContainer, { backgroundColor: colors.neutral[50] }]}>
            {item.children!.map((child) => renderItem(child, level + 1))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[
      styles.container,
      {
        width: isCollapsed ? 80 : 280,
        backgroundColor: colors.neutral[0],
        borderRightColor: colors.border
      }
    ]}>
      {/* Header */}
      <View style={[styles.header, {
        backgroundColor: colors.primary[50],
        borderBottomColor: colors.border
      }]}>
        {!isCollapsed ? (
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>✨</Text>
            <View>
              <Text style={[styles.logoText, { color: colors.primary[600] }]}>LUXE</Text>
              <Text style={[styles.logoSubtext, { color: colors.neutral[600] }]}>PARFUMS</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.logoIcon}>✨</Text>
        )}
      </View>

      {/* Toggle Button */}
      <TouchableOpacity
        style={[styles.toggleButton, {
          backgroundColor: colors.neutral[100],
          borderColor: colors.border
        }]}
        onPress={toggleCollapsed}
        accessible={true}
        accessibilityLabel={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <Ionicons
          name={isCollapsed ? 'chevron-forward' : 'chevron-back'}
          size={20}
          color={colors.neutral[600]}
        />
      </TouchableOpacity>

      {/* Navigation Items */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!isCollapsed && (
          <Text style={[styles.sectionTitle, { color: colors.neutral[400] }]}>NAVIGATION</Text>
        )}
        {NAVIGATION_ITEMS.map((item) => renderItem(item))}

        {/* Quick Actions */}
        {!isCollapsed && (
          <Text style={[styles.sectionTitle, { color: colors.neutral[400] }]}>QUICK ACTIONS</Text>
        )}

        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push('/cart')}
          accessible={true}
          accessibilityLabel="View Cart"
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.neutral[100] }]}>
            <Ionicons name="cart" size={22} color={colors.neutral[600]} />
          </View>
          {!isCollapsed && (
            <Text style={[styles.itemLabel, { color: colors.neutral[700] }]}>My Cart</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push('/profile')}
          accessible={true}
          accessibilityLabel="My Account"
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.neutral[100] }]}>
            <Ionicons name="person" size={22} color={colors.neutral[600]} />
          </View>
          {!isCollapsed && (
            <Text style={[styles.itemLabel, { color: colors.neutral[700] }]}>My Account</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Footer with Theme Toggle */}
      <View style={[styles.footer, {
        borderTopColor: colors.border,
        backgroundColor: colors.surface
      }]}>
        <TouchableOpacity
          style={[styles.themeToggle, { backgroundColor: colors.neutral[100] }]}
          onPress={toggleTheme}
          accessible={true}
          accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          <Ionicons
            name={isDark ? 'sunny' : 'moon'}
            size={22}
            color={colors.primary[600]}
          />
          {!isCollapsed && (
            <Text style={[styles.themeToggleText, { color: colors.neutral[700] }]}>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </Text>
          )}
        </TouchableOpacity>

        {!isCollapsed && (
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons name="help-circle-outline" size={20} color={colors.neutral[600]} />
            <Text style={[styles.helpText, { color: colors.neutral[600] }]}>Help & Support</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRightWidth: 1,
    ...SHADOWS.md,
    zIndex: Z_INDEX.sticky,
    transition: 'width 0.3s ease'
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm
  },
  logoIcon: {
    fontSize: 32
  },
  logoText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    letterSpacing: 2
  },
  logoSubtext: {
    fontSize: 10,
    letterSpacing: 3
  },
  toggleButton: {
    position: 'absolute',
    top: SPACING.xl,
    right: -12,
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    zIndex: 10,
    ...SHADOWS.sm
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingVertical: SPACING.md
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    letterSpacing: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    position: 'relative',
    gap: SPACING.sm
  },
  itemTopLevel: {
    paddingVertical: SPACING.md
  },
  itemNested: {
    paddingLeft: SPACING.xxl,
    paddingVertical: SPACING.sm
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemLabel: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium
  },
  itemLabelTopLevel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold
  },
  itemLabelNested: {
    fontSize: TYPOGRAPHY.fontSize.sm
  },
  badgeContainer: {
    position: 'relative',
    marginLeft: SPACING.xs
  },
  badgePulse: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    opacity: 0.3
  },
  badge: {
    borderRadius: BORDER_RADIUS.full,
    minWidth: 24,
    height: 24,
    paddingHorizontal: 7,
    justifyContent: 'center',
    alignItems: 'center',
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
  expandIcon: {
    marginLeft: SPACING.xs
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopRightRadius: BORDER_RADIUS.sm,
    borderBottomRightRadius: BORDER_RADIUS.sm
  },
  childrenContainer: {
    // Dynamic background
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm
  },
  themeToggleText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm
  },
  helpText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium
  }
});
