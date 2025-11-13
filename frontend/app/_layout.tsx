/**
 * Root Layout
 * Sets up providers and global app configuration
 */

import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from '@shared/components';
import { CartProvider } from '@features/cart/CartContext';
import { ThemeProvider, useTheme } from '@shared/contexts';

function AppStack() {
  const { isDark, colors } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="products/[id]" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="order-success" />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <CartProvider>
            <AppStack />
          </CartProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
