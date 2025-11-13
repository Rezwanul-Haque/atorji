/**
 * Formatting Utilities
 * Production-ready formatting functions with internationalization support
 */

import { APP_CONFIG } from '../constants/config';

/**
 * Formats a number as currency
 */
export const formatCurrency = (
  amount: number,
  options?: Intl.NumberFormatOptions
): string => {
  try {
    return new Intl.NumberFormat(APP_CONFIG.currency.locale, {
      style: 'currency',
      currency: APP_CONFIG.currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options
    }).format(amount);
  } catch (error) {
    // Fallback if Intl is not available
    return `${APP_CONFIG.currency.symbol}${amount.toFixed(2)}`;
  }
};

/**
 * Formats a date with options
 */
export const formatDate = (
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return new Intl.DateTimeFormat(APP_CONFIG.currency.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }).format(dateObj);
  } catch (error) {
    return String(date);
  }
};

/**
 * Formats a phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  return phone;
};

/**
 * Formats a credit card number with masking
 */
export const formatCreditCard = (cardNumber: string, maskDigits = true): string => {
  const cleaned = cardNumber.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g) || [];

  if (maskDigits && groups.length > 1) {
    const masked = groups.map((group, index) =>
      index < groups.length - 1 ? '****' : group
    );
    return masked.join(' ');
  }

  return groups.join(' ');
};

/**
 * Truncates text with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Capitalizes first letter of each word
 */
export const capitalize = (text: string): string => {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Formats a number with abbreviation (1K, 1M, etc.)
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Formats file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
