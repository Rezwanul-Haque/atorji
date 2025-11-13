/**
 * Tabs Layout
 * Modern bottom navigation for mobile, with web layout support
 */

import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useResponsive } from '@shared/hooks';
import { ModernBottomNav, ModernSidebar, WebHeader } from '@shared/components';
import { useCart } from '@features/cart/CartContext';
import { router, usePathname } from 'expo-router';

export default function TabsLayout() {
  const { totalItems } = useCart();
  const { isMobile } = useResponsive();
  const pathname = usePathname();

  // Determine active tab from pathname
  const getActiveKey = () => {
    if (pathname === '/' || pathname.startsWith('/(tabs)')) return 'index';
    if (pathname.startsWith('/categories')) return 'categories';
    if (pathname.startsWith('/cart')) return 'cart';
    if (pathname.startsWith('/history')) return 'history';
    if (pathname.startsWith('/profile')) return 'profile';
    return 'index';
  };

  // Navigation items for modern bottom nav (Cart in the middle)
  const navItems = [
    {
      key: 'index',
      icon: 'home-outline' as const,
      activeIcon: 'home' as const,
      label: 'Home',
      onPress: () => router.push('/')
    },
    {
      key: 'categories',
      icon: 'grid-outline' as const,
      activeIcon: 'grid' as const,
      label: 'Categories',
      onPress: () => router.push('/categories')
    },
    {
      key: 'cart',
      icon: 'cart-outline' as const,
      activeIcon: 'cart' as const,
      label: 'Cart',
      badge: totalItems,
      onPress: () => router.push('/cart')
    },
    {
      key: 'history',
      icon: 'time-outline' as const,
      activeIcon: 'time' as const,
      label: 'History',
      onPress: () => router.push('/history')
    },
    {
      key: 'profile',
      icon: 'person-outline' as const,
      activeIcon: 'person' as const,
      label: 'Account',
      onPress: () => router.push('/profile')
    }
  ];

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {/* Sidebar for Desktop */}
      {!isMobile && <ModernSidebar />}

      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            // Hide default tab bar (we'll use custom components)
            tabBarStyle: { display: 'none' }
          }}
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="categories" />
          <Tabs.Screen name="cart" />
          <Tabs.Screen name="history" />
          <Tabs.Screen name="profile" />
        </Tabs>

        {/* Modern Bottom Navigation for Mobile */}
        {isMobile && (
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <ModernBottomNav items={navItems} activeKey={getActiveKey()} />
          </View>
        )}
      </View>
    </View>
  );
}
