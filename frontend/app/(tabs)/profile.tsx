/**
 * Profile/Account Screen
 * User profile, settings, and account information with theme support
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WebHeader, Card, CustomAlert } from '@shared/components';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@shared/constants/theme';
import { useResponsive, useCustomAlert } from '@shared/hooks';
import { useCart } from '@features/cart/CartContext';
import { useTheme } from '@shared/contexts';

type MenuItem = {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  badge?: number;
};

export default function ProfileScreen() {
  const { isMobile } = useResponsive();
  const { totalItems, clearCart } = useCart();
  const { colors, isDark, mode, setThemeMode } = useTheme();
  const { showAlert, hideAlert, alertConfig, isVisible } = useCustomAlert();

  const handleLogout = () => {
    showAlert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            showAlert('Success', 'You have been logged out');
          }
        }
      ]
    );
  };

  const handleClearCart = () => {
    showAlert(
      'Clear Cart',
      'Are you sure you want to clear your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearCart();
            showAlert('Success', 'Cart cleared successfully');
          }
        }
      ]
    );
  };

  // Helper functions defined before menu items
  const getThemeLabel = () => {
    if (mode === 'auto') return 'Auto (System)';
    if (mode === 'light') return 'Light';
    return 'Dark';
  };

  const handleThemeChange = () => {
    console.log('Theme change clicked');
    showAlert(
      'Choose Theme',
      'Select your preferred theme',
      [
        {
          text: 'Auto (System)',
          onPress: () => {
            console.log('Setting theme to auto');
            setThemeMode('auto');
          }
        },
        {
          text: 'Light',
          onPress: () => {
            console.log('Setting theme to light');
            setThemeMode('light');
          }
        },
        {
          text: 'Dark',
          onPress: () => {
            console.log('Setting theme to dark');
            setThemeMode('dark');
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  // Menu items
  const accountMenuItems: MenuItem[] = [
    {
      icon: 'person-outline',
      title: 'Personal Information',
      subtitle: 'Update your details',
      onPress: () => showAlert('Coming Soon', 'This feature is under development')
    },
    {
      icon: 'location-outline',
      title: 'Addresses',
      subtitle: 'Manage shipping addresses',
      onPress: () => showAlert('Coming Soon', 'This feature is under development')
    },
    {
      icon: 'card-outline',
      title: 'Payment Methods',
      subtitle: 'Manage your payment cards',
      onPress: () => showAlert('Coming Soon', 'This feature is under development')
    }
  ];

  const appearanceMenuItems: MenuItem[] = [
    {
      icon: isDark ? 'moon' : 'sunny',
      title: 'Theme',
      subtitle: getThemeLabel(),
      onPress: handleThemeChange
    },
    {
      icon: 'color-palette-outline',
      title: 'Accent Color',
      subtitle: 'Purple (Default)',
      onPress: () => showAlert('Coming Soon', 'Custom accent colors coming soon')
    },
    {
      icon: 'text-outline',
      title: 'Display Size',
      subtitle: 'Standard',
      onPress: () => showAlert('Coming Soon', 'Display size options coming soon')
    }
  ];

  const ordersMenuItems: MenuItem[] = [
    {
      icon: 'receipt-outline',
      title: 'Order History',
      subtitle: 'View past orders',
      onPress: () => router.push('/history')
    },
    {
      icon: 'cart-outline',
      title: 'Shopping Cart',
      subtitle: `${totalItems} items in cart`,
      badge: totalItems,
      onPress: () => router.push('/cart')
    },
    {
      icon: 'heart-outline',
      title: 'Wishlist',
      subtitle: 'Your favorite items',
      onPress: () => showAlert('Coming Soon', 'This feature is under development')
    }
  ];

  const settingsMenuItems: MenuItem[] = [
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      onPress: () => showAlert('Coming Soon', 'This feature is under development')
    },
    {
      icon: 'language-outline',
      title: 'Language & Region',
      subtitle: 'English (US)',
      onPress: () => showAlert('Coming Soon', 'This feature is under development')
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'FAQs and contact us',
      onPress: () => showAlert('Coming Soon', 'This feature is under development')
    },
    {
      icon: 'information-circle-outline',
      title: 'About',
      subtitle: 'App version 1.0.0',
      onPress: () => showAlert('Perfume Store', 'Version 1.0.0\n\nA modern e-commerce app for premium perfumes.')
    }
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.title}
      style={[styles.menuItem, { borderBottomColor: colors.border }]}
      onPress={() => {
        console.log('Menu item clicked:', item.title);
        item.onPress();
      }}
      accessible={true}
      accessibilityLabel={item.title}
      accessibilityHint={item.subtitle}
      accessibilityRole="button"
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIcon, { backgroundColor: colors.primary[50] }]}>
          <Ionicons name={item.icon as any} size={24} color={colors.primary[600]} />
        </View>
        <View style={styles.menuText}>
          <Text style={[styles.menuTitle, { color: colors.text.primary }]}>{item.title}</Text>
          {item.subtitle && <Text style={[styles.menuSubtitle, { color: colors.text.secondary }]}>{item.subtitle}</Text>}
        </View>
      </View>
      <View style={styles.menuItemRight}>
        {item.badge !== undefined && item.badge > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.error.main }]}>
            <Text style={[styles.badgeText, { color: colors.neutral[0] }]}>{item.badge}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
      <WebHeader />

      {isMobile && (
        <View style={[styles.mobileHeader, {
          backgroundColor: colors.card,
          borderBottomColor: colors.border
        }]}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Account</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>Manage your profile and preferences</Text>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, isMobile && styles.scrollContentMobile]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: colors.primary[500] }]}>
              <Text style={[styles.avatarText, { color: colors.neutral[0] }]}>JD</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text.primary }]}>John Doe</Text>
              <Text style={[styles.profileEmail, { color: colors.text.secondary }]}>john.doe@example.com</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.editButton, {
              borderColor: colors.primary[300],
              backgroundColor: colors.primary[50]
            }]}
            onPress={() => {
              console.log('Edit profile clicked');
              showAlert('Coming Soon', 'Profile editing feature is under development');
            }}
            accessible={true}
            accessibilityLabel="Edit profile"
            accessibilityRole="button"
          >
            <Ionicons name="create-outline" size={20} color={colors.primary[600]} />
            <Text style={[styles.editButtonText, { color: colors.primary[700] }]}>Edit Profile</Text>
          </TouchableOpacity>
        </Card>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Account</Text>
          <Card variant="outlined" padding="none" style={styles.menuCard}>
            {accountMenuItems.map(renderMenuItem)}
          </Card>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Appearance</Text>
          <Card variant="outlined" padding="none" style={styles.menuCard}>
            {appearanceMenuItems.map(renderMenuItem)}
          </Card>
        </View>

        {/* Orders Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Orders & Shopping</Text>
          <Card variant="outlined" padding="none" style={styles.menuCard}>
            {ordersMenuItems.map(renderMenuItem)}
          </Card>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Settings & Support</Text>
          <Card variant="outlined" padding="none" style={styles.menuCard}>
            {settingsMenuItems.map(renderMenuItem)}
          </Card>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {totalItems > 0 && (
            <TouchableOpacity
              style={[styles.dangerButton, {
                borderColor: colors.error.main,
                backgroundColor: colors.error.light
              }]}
              onPress={handleClearCart}
              accessible={true}
              accessibilityLabel="Clear cart"
              accessibilityRole="button"
            >
              <Ionicons name="trash-outline" size={20} color={colors.error.main} />
              <Text style={[styles.dangerButtonText, { color: colors.error.dark }]}>Clear Cart</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.logoutButton, {
              borderColor: colors.error.main,
              backgroundColor: colors.card
            }]}
            onPress={handleLogout}
            accessible={true}
            accessibilityLabel="Logout"
            accessibilityRole="button"
          >
            <Ionicons name="log-out-outline" size={20} color={colors.error.main} />
            <Text style={[styles.logoutButtonText, { color: colors.error.main }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
  scrollContentMobile: {
    paddingBottom: 100 // Extra padding for bottom nav bar on mobile
  },
  profileCard: {
    marginBottom: SPACING.xl
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md
  },
  avatarText: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold
  },
  profileInfo: {
    flex: 1
  },
  profileName: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: 4
  },
  profileEmail: {
    fontSize: TYPOGRAPHY.fontSize.base
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1
  },
  editButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold
  },
  section: {
    marginBottom: SPACING.xl
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: SPACING.md
  },
  menuCard: {
    padding: 0
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.md
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuText: {
    flex: 1
  },
  menuTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginBottom: 2
  },
  menuSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm
  },
  badge: {
    borderRadius: BORDER_RADIUS.full,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8
  },
  badgeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.bold
  },
  actions: {
    gap: SPACING.md,
    marginBottom: SPACING.xl
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1
  },
  dangerButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1
  },
  logoutButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold
  }
});
