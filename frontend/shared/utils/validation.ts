/**
 * Validation Utilities
 * Production-ready validation functions with proper error messages
 */

import { APP_CONFIG } from '../constants/config';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validation = {
  /**
   * Validates email format
   */
  email: (email: string): ValidationResult => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || email.trim() === '') {
      return { isValid: false, error: 'Email is required' };
    }

    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }

    return { isValid: true };
  },

  /**
   * Validates phone number
   */
  phone: (phone: string): ValidationResult => {
    if (!phone || phone.trim() === '') {
      return { isValid: false, error: 'Phone number is required' };
    }

    if (!APP_CONFIG.validation.phoneRegex.test(phone)) {
      return { isValid: false, error: 'Please enter a valid phone number' };
    }

    if (phone.replace(/\D/g, '').length < 10) {
      return { isValid: false, error: 'Phone number must be at least 10 digits' };
    }

    return { isValid: true };
  },

  /**
   * Validates required text field
   */
  required: (value: string, fieldName: string): ValidationResult => {
    if (!value || value.trim() === '') {
      return { isValid: false, error: `${fieldName} is required` };
    }

    return { isValid: true };
  },

  /**
   * Validates text length
   */
  length: (
    value: string,
    fieldName: string,
    min?: number,
    max?: number
  ): ValidationResult => {
    const length = value?.trim().length || 0;

    if (min !== undefined && length < min) {
      return {
        isValid: false,
        error: `${fieldName} must be at least ${min} characters`
      };
    }

    if (max !== undefined && length > max) {
      return {
        isValid: false,
        error: `${fieldName} must not exceed ${max} characters`
      };
    }

    return { isValid: true };
  },

  /**
   * Validates zip code
   */
  zipCode: (zipCode: string): ValidationResult => {
    if (!zipCode || zipCode.trim() === '') {
      return { isValid: false, error: 'Zip code is required' };
    }

    if (!APP_CONFIG.validation.zipCodeRegex.test(zipCode)) {
      return { isValid: false, error: 'Please enter a valid zip code' };
    }

    return { isValid: true };
  },

  /**
   * Validates credit card number (basic Luhn algorithm)
   */
  creditCard: (cardNumber: string): ValidationResult => {
    const cleaned = cardNumber.replace(/\D/g, '');

    if (!cleaned) {
      return { isValid: false, error: 'Card number is required' };
    }

    if (cleaned.length < 13 || cleaned.length > 19) {
      return { isValid: false, error: 'Invalid card number length' };
    }

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    if (sum % 10 !== 0) {
      return { isValid: false, error: 'Invalid card number' };
    }

    return { isValid: true };
  },

  /**
   * Validates CVV
   */
  cvv: (cvv: string): ValidationResult => {
    const cleaned = cvv.replace(/\D/g, '');

    if (!cleaned) {
      return { isValid: false, error: 'CVV is required' };
    }

    if (cleaned.length < 3 || cleaned.length > 4) {
      return { isValid: false, error: 'CVV must be 3 or 4 digits' };
    }

    return { isValid: true };
  },

  /**
   * Validates expiration date (MM/YY format)
   */
  expirationDate: (date: string): ValidationResult => {
    const cleaned = date.replace(/\D/g, '');

    if (!cleaned || cleaned.length !== 4) {
      return { isValid: false, error: 'Expiration date must be MM/YY format' };
    }

    const month = parseInt(cleaned.substring(0, 2), 10);
    const year = parseInt(cleaned.substring(2, 4), 10);

    if (month < 1 || month > 12) {
      return { isValid: false, error: 'Invalid month' };
    }

    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { isValid: false, error: 'Card has expired' };
    }

    return { isValid: true };
  }
};

/**
 * Sanitizes user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .trim();
};

/**
 * Validates multiple fields and returns all errors
 */
export const validateForm = <T extends Record<string, any>>(
  fields: T,
  validators: Partial<Record<keyof T, (value: any) => ValidationResult>>
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } => {
  const errors: Partial<Record<keyof T, string>> = {};
  let isValid = true;

  for (const [key, validator] of Object.entries(validators)) {
    const result = validator(fields[key as keyof T]);
    if (!result.isValid) {
      errors[key as keyof T] = result.error;
      isValid = false;
    }
  }

  return { isValid, errors };
};
