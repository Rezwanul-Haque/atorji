/**
 * useResponsive Hook
 * Provides responsive breakpoint detection
 */

import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { BREAKPOINTS } from '@shared/constants/theme';

interface ResponsiveState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
}

export function useResponsive(): ResponsiveState {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const onChange = ({ window }: { window: ScaledSize }) => {
      setDimensions({ width: window.width, height: window.height });
    };

    const subscription = Dimensions.addEventListener('change', onChange);

    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;

  return {
    width,
    height,
    isMobile: width < BREAKPOINTS.tablet,
    isTablet: width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop,
    isDesktop: width >= BREAKPOINTS.desktop && width < BREAKPOINTS.wide,
    isWide: width >= BREAKPOINTS.wide
  };
}
