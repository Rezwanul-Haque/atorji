/**
 * Application Configuration
 * Central configuration for the application
 */

export const APP_CONFIG = {
  name: 'Perfume Store',
  version: '1.0.0',
  apiTimeout: 30000,
  currency: {
    code: 'USD',
    symbol: '$',
    locale: 'en-US'
  },
  pagination: {
    itemsPerPage: 20,
    initialPage: 1
  },
  validation: {
    minPasswordLength: 8,
    maxNameLength: 100,
    maxDescriptionLength: 500,
    phoneRegex: /^[\d\s\-\+\(\)]+$/,
    zipCodeRegex: /^\d{5}(-\d{4})?$/
  }
} as const;

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/[id]',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order-success',
  PROFILE: '/profile'
} as const;

export const STORAGE_KEYS = {
  CART: '@perfume_store/cart',
  USER_PREFERENCES: '@perfume_store/preferences',
  RECENT_SEARCHES: '@perfume_store/recent_searches'
} as const;
