/**
 * Cart Context - Global State Management
 * Production-ready context with persistence and optimistic updates
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { CartItem, Product } from '@shared/types';
import { STORAGE_KEYS } from '@shared/constants/config';
import { storage } from '@shared/utils/storage';
import { logError, createError, ErrorType } from '@shared/utils/errors';

// Action types
type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SET_LOADING'; payload: boolean };

// State interface
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

// Context interface
interface CartContextType extends CartState {
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
}

// Initial state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: true
};

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Reducer function
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.id
      );

      let newItems: CartItem[];

      if (existingItem) {
        // Update quantity if item already exists
        newItems = state.items.map((item) =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, { product: action.payload, quantity: 1 }];
      }

      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        )
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        (item) => item.product.id !== action.payload
      );

      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        )
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: productId });
      }

      const newItems = state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );

      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        )
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
        totalItems: action.payload.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: action.payload.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),
        isLoading: false
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    default:
      return state;
  }
};

// Provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from storage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await storage.getItem<CartItem[]>(STORAGE_KEYS.CART);
        if (savedCart) {
          dispatch({ type: 'LOAD_CART', payload: savedCart });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        logError(
          createError(ErrorType.UNKNOWN, 'Failed to load cart', error as Error),
          { operation: 'loadCart' }
        );
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    if (!state.isLoading) {
      storage.setItem(STORAGE_KEYS.CART, state.items);
    }
  }, [state.items, state.isLoading]);

  // Actions
  const addItem = useCallback((product: Product) => {
    if (!product.inStock) {
      logError(
        createError(ErrorType.VALIDATION, 'Cannot add out-of-stock item'),
        { product: product.id }
      );
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: product });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 0) {
      logError(
        createError(ErrorType.VALIDATION, 'Quantity cannot be negative'),
        { productId, quantity }
      );
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const getItemQuantity = useCallback(
    (productId: string): number => {
      const item = state.items.find((item) => item.product.id === productId);
      return item?.quantity || 0;
    },
    [state.items]
  );

  const isInCart = useCallback(
    (productId: string): boolean => {
      return state.items.some((item) => item.product.id === productId);
    },
    [state.items]
  );

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
