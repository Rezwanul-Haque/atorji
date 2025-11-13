/**
 * Theme Context
 * Manages light/dark mode and provides theme colors throughout the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  colors: typeof lightColors;
}

const THEME_STORAGE_KEY = '@app_theme_mode';

// Light mode colors
const lightColors = {
  // Primary palette
  primary: {
    50: '#f0f4ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81'
  },
  // Neutral palette
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    1000: '#000000'
  },
  // Semantic colors
  success: {
    light: '#d1fae5',
    main: '#10b981',
    dark: '#059669'
  },
  error: {
    light: '#fee2e2',
    main: '#ef4444',
    dark: '#dc2626'
  },
  warning: {
    light: '#fef3c7',
    main: '#f59e0b',
    dark: '#d97706'
  },
  info: {
    light: '#dbeafe',
    main: '#3b82f6',
    dark: '#2563eb'
  },
  // UI specific
  background: '#ffffff',
  surface: '#fafafa',
  card: '#ffffff',
  border: '#e4e4e7',
  text: {
    primary: '#18181b',
    secondary: '#52525b',
    tertiary: '#a1a1aa',
    inverse: '#ffffff'
  }
};

// Dark mode colors
const darkColors = {
  // Primary palette (slightly adjusted for dark mode)
  primary: {
    50: '#312e81',
    100: '#3730a3',
    200: '#4338ca',
    300: '#4f46e5',
    400: '#6366f1',
    500: '#818cf8',
    600: '#a5b4fc',
    700: '#c7d2fe',
    800: '#e0e7ff',
    900: '#f0f4ff'
  },
  // Neutral palette (inverted)
  neutral: {
    0: '#000000',
    50: '#18181b',
    100: '#27272a',
    200: '#3f3f46',
    300: '#52525b',
    400: '#71717a',
    500: '#a1a1aa',
    600: '#d4d4d8',
    700: '#e4e4e7',
    800: '#f4f4f5',
    900: '#fafafa',
    1000: '#ffffff'
  },
  // Semantic colors (adjusted)
  success: {
    light: '#065f46',
    main: '#10b981',
    dark: '#d1fae5'
  },
  error: {
    light: '#7f1d1d',
    main: '#ef4444',
    dark: '#fee2e2'
  },
  warning: {
    light: '#78350f',
    main: '#f59e0b',
    dark: '#fef3c7'
  },
  info: {
    light: '#1e3a8a',
    main: '#3b82f6',
    dark: '#dbeafe'
  },
  // UI specific
  background: '#000000',
  surface: '#18181b',
  card: '#27272a',
  border: '#3f3f46',
  text: {
    primary: '#fafafa',
    secondary: '#d4d4d8',
    tertiary: '#a1a1aa',
    inverse: '#18181b'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('auto');

  // Load saved theme preference
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedMode && (savedMode === 'light' || savedMode === 'dark' || savedMode === 'auto')) {
        setMode(savedMode as ThemeMode);
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
    }
  };

  const saveThemePreference = async (newMode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Determine if dark mode is active
  const isDark = mode === 'dark' || (mode === 'auto' && systemColorScheme === 'dark');

  // Get current colors based on theme
  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setMode(newMode);
    saveThemePreference(newMode);
  };

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
    saveThemePreference(newMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        isDark,
        toggleTheme,
        setThemeMode,
        colors
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
