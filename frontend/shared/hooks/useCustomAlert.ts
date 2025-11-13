/**
 * Custom Alert Hook
 * Provides a simple API for showing cross-platform alerts
 */

import { useState, useCallback } from 'react';
import { AlertButton } from '@shared/components';

interface AlertConfig {
  title: string;
  message?: string;
  buttons?: AlertButton[];
}

export const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showAlert = useCallback((title: string, message?: string, buttons?: AlertButton[]) => {
    setAlertConfig({ title, message, buttons });
    setIsVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setIsVisible(false);
    // Clear config after animation completes
    setTimeout(() => setAlertConfig(null), 300);
  }, []);

  return {
    showAlert,
    hideAlert,
    alertConfig,
    isVisible
  };
};
