/**
 * Modern Bottom Navigation
 * Enhanced mobile bottom navigation with theme support and modern styling
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '@shared/constants/theme';
import { useTheme } from '@shared/contexts';

export interface NavItem {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: number;
  onPress: () => void;
}

interface ModernBottomNavProps {
  items: NavItem[];
  activeKey: string;
}

export const ModernBottomNav: React.FC<ModernBottomNavProps> = ({ items, activeKey }) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        paddingBottom: Math.max(insets.bottom, SPACING.sm),
        borderTopColor: colors.border
      }
    ]}>
      {/* Glassmorphism Backdrop */}
      <View style={[styles.backdrop, {
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
      }]} />

      {/* Floating Active Indicator */}
      <View style={styles.floatingIndicatorContainer}>
        {items.map((item, index) => {
          const isActive = item.key === activeKey;
          if (!isActive) return null;

          return (
            <View
              key={item.key}
              style={[
                styles.floatingIndicator,
                {
                  backgroundColor: colors.primary[500],
                  left: `${(index / items.length) * 100 + (50 / items.length)}%`
                }
              ]}
            />
          );
        })}
      </View>

      <View style={styles.content}>
        {items.map((item) => {
          const isActive = item.key === activeKey;

          return (
            <TouchableOpacity
              key={item.key}
              style={styles.navItem}
              onPress={item.onPress}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel={item.label}
              accessibilityState={{ selected: isActive }}
              accessibilityRole="button"
            >
              {/* Icon Container with Ripple Effect */}
              <View style={styles.iconContainer}>
                {/* Active Background with Scale Animation */}
                {isActive && (
                  <View style={[
                    styles.activeBackground,
                    {
                      backgroundColor: colors.primary[100],
                      shadowColor: colors.primary[600]
                    }
                  ]}>
                    {/* Inner Glow */}
                    <View style={[
                      styles.activeGlow,
                      { backgroundColor: colors.primary[200] }
                    ]} />
                  </View>
                )}

                {/* Icon */}
                <View style={styles.iconWrapper}>
                  <Ionicons
                    name={isActive ? item.activeIcon : item.icon}
                    size={isActive ? 24 : 22}
                    color={isActive ? colors.primary[600] : colors.text.tertiary}
                    style={[
                      styles.icon,
                      isActive && styles.activeIcon
                    ]}
                  />

                  {/* Notification Badge */}
                  {item.badge && item.badge > 0 && (
                    <>
                      {/* Pulsing Ring Effect */}
                      <View style={[
                        styles.badgePulse,
                        {
                          backgroundColor: colors.error.main,
                          opacity: 0.3
                        }
                      ]} />

                      {/* Badge Container */}
                      <View style={[
                        styles.badge,
                        {
                          backgroundColor: colors.error.main,
                          borderColor: isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)'
                        }
                      ]}>
                        <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>
                          {item.badge > 99 ? '99+' : item.badge}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </View>

              {/* Label with Fade Effect */}
              <Text
                style={[
                  styles.label,
                  { color: isActive ? colors.primary[600] : colors.text.tertiary },
                  isActive && styles.activeLabel
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>

              {/* Active Indicator Dot */}
              {isActive && (
                <View style={[styles.activeDot, { backgroundColor: colors.primary[600] }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bottom Safe Area with Gradient */}
      <View style={[
        styles.safeAreaGradient,
        {
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.02)'
        }
      ]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingTop: SPACING.xs,
    position: 'relative',
    zIndex: 100,
    // Glassmorphism effect
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    // Enhanced shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
    borderTopWidth: 1
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl
  },
  floatingIndicatorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    zIndex: 2
  },
  floatingIndicator: {
    position: 'absolute',
    top: 0,
    width: 40,
    height: 3,
    borderRadius: BORDER_RADIUS.full,
    transform: [{ translateX: -20 }],
    ...SHADOWS.md
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.xs,
    paddingTop: SPACING.sm,
    paddingBottom: 0,
    position: 'relative',
    zIndex: 1
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: SPACING.xs,
    gap: 2,
    position: 'relative'
  },
  iconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    width: 44,
    height: 44
  },
  activeBackground: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    // Pulsing shadow effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  activeGlow: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    opacity: 0.4
  },
  iconWrapper: {
    position: 'relative',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 28,
    height: 28
  },
  icon: {
    // Base icon style
  },
  activeIcon: {
    // Scale transform for active state
    transform: [{ scale: 1.1 }]
  },
  badgePulse: {
    position: 'absolute',
    top: -10,
    right: -14,
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.full,
    // Animation effect (would need Animated API for real animation)
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -12,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 2.5,
    // Enhanced notification badge shadow
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 8
  },
  badgeText: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    lineHeight: 12,
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  label: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    textAlign: 'center',
    letterSpacing: 0.2
  },
  activeLabel: {
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    letterSpacing: 0.3
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: BORDER_RADIUS.full,
    marginTop: 2,
    ...SHADOWS.sm
  },
  safeAreaGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl
  }
});
