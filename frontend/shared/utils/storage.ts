/**
 * Storage Utilities
 * Production-ready async storage wrapper with error handling
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logError, createError, ErrorType } from './errors';

export const storage = {
  /**
   * Safely sets an item in storage
   */
  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      logError(
        createError(ErrorType.UNKNOWN, 'Failed to save to storage', error as Error),
        { key, operation: 'setItem' }
      );
      return false;
    }
  },

  /**
   * Safely gets an item from storage
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      logError(
        createError(ErrorType.UNKNOWN, 'Failed to read from storage', error as Error),
        { key, operation: 'getItem' }
      );
      return null;
    }
  },

  /**
   * Safely removes an item from storage
   */
  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      logError(
        createError(ErrorType.UNKNOWN, 'Failed to remove from storage', error as Error),
        { key, operation: 'removeItem' }
      );
      return false;
    }
  },

  /**
   * Clears all storage
   */
  async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      logError(
        createError(ErrorType.UNKNOWN, 'Failed to clear storage', error as Error),
        { operation: 'clear' }
      );
      return false;
    }
  },

  /**
   * Gets multiple items at once
   */
  async multiGet<T>(keys: string[]): Promise<Record<string, T | null>> {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      const result: Record<string, T | null> = {};

      pairs.forEach(([key, value]) => {
        result[key] = value ? JSON.parse(value) : null;
      });

      return result;
    } catch (error) {
      logError(
        createError(ErrorType.UNKNOWN, 'Failed to read multiple items', error as Error),
        { keys, operation: 'multiGet' }
      );
      return {};
    }
  }
};
