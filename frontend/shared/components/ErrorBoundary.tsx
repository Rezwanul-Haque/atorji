/**
 * Error Boundary Component
 * Production-ready error boundary with fallback UI
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@shared/components/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '@shared/constants/theme';
import { logError, createError, ErrorType } from '@shared/utils/errors';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    logError(
      createError(ErrorType.UNKNOWN, error.message, error),
      { componentStack: errorInfo.componentStack }
    );

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>😔</Text>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            We're sorry for the inconvenience. Please try again.
          </Text>

          {__DEV__ && this.state.error && (
            <View style={styles.errorDetails}>
              <Text style={styles.errorTitle}>Error Details:</Text>
              <Text style={styles.errorMessage}>{this.state.error.message}</Text>
            </View>
          )}

          <Button
            title="Try Again"
            onPress={this.handleReset}
            style={styles.button}
          />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.neutral[0]
  },
  emoji: {
    fontSize: 64,
    marginBottom: SPACING.lg
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.neutral[900],
    textAlign: 'center',
    marginBottom: SPACING.md
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.neutral[600],
    textAlign: 'center',
    marginBottom: SPACING.xl,
    maxWidth: 300
  },
  button: {
    minWidth: 200
  },
  errorDetails: {
    backgroundColor: COLORS.error.light,
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.lg,
    width: '100%',
    maxWidth: 400
  },
  errorTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.error.dark,
    marginBottom: SPACING.sm
  },
  errorMessage: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.error.dark,
    fontFamily: 'monospace'
  }
});
