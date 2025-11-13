/**
 * Error Handling Utilities
 * Production-ready error handling with proper logging and user-friendly messages
 */

export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  SERVER = 'SERVER_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN_ERROR'
}

export class AppError extends Error {
  type: ErrorType;
  userMessage: string;
  originalError?: Error;
  statusCode?: number;

  constructor(
    type: ErrorType,
    message: string,
    userMessage: string,
    originalError?: Error,
    statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.userMessage = userMessage;
    this.originalError = originalError;
    this.statusCode = statusCode;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Maps error types to user-friendly messages
 */
const ERROR_MESSAGES: Record<ErrorType, string> = {
  [ErrorType.NETWORK]: 'Unable to connect. Please check your internet connection and try again.',
  [ErrorType.VALIDATION]: 'Please check your input and try again.',
  [ErrorType.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorType.UNAUTHORIZED]: 'You need to be logged in to perform this action.',
  [ErrorType.FORBIDDEN]: 'You do not have permission to perform this action.',
  [ErrorType.SERVER]: 'Something went wrong on our end. Please try again later.',
  [ErrorType.TIMEOUT]: 'The request took too long. Please try again.',
  [ErrorType.UNKNOWN]: 'An unexpected error occurred. Please try again.'
};

/**
 * Creates a standardized error object
 */
export const createError = (
  type: ErrorType,
  message?: string,
  originalError?: Error,
  statusCode?: number
): AppError => {
  const userMessage = message || ERROR_MESSAGES[type];
  return new AppError(
    type,
    message || ERROR_MESSAGES[type],
    userMessage,
    originalError,
    statusCode
  );
};

/**
 * Handles and categorizes errors
 */
export const handleError = (error: unknown): AppError => {
  // Already an AppError
  if (error instanceof AppError) {
    return error;
  }

  // Standard Error
  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('Network') || error.message.includes('fetch')) {
      return createError(ErrorType.NETWORK, undefined, error);
    }

    // Timeout errors
    if (error.message.includes('timeout') || error.message.includes('Timeout')) {
      return createError(ErrorType.TIMEOUT, undefined, error);
    }

    // Generic error
    return createError(ErrorType.UNKNOWN, error.message, error);
  }

  // Unknown error type
  return createError(ErrorType.UNKNOWN, String(error));
};

/**
 * Logs errors in development, sends to monitoring in production
 */
export const logError = (error: AppError, context?: Record<string, any>): void => {
  if (__DEV__) {
    console.error('Error:', {
      type: error.type,
      message: error.message,
      userMessage: error.userMessage,
      statusCode: error.statusCode,
      context,
      stack: error.stack,
      originalError: error.originalError
    });
  } else {
    // In production, send to error monitoring service
    // Example: Sentry, Bugsnag, etc.
    // Sentry.captureException(error, { contexts: { custom: context } });
    console.error(`[${error.type}] ${error.message}`);
  }
};

/**
 * Safe async error wrapper
 */
export const tryCatch = async <T>(
  fn: () => Promise<T>,
  errorType: ErrorType = ErrorType.UNKNOWN
): Promise<[T | null, AppError | null]> => {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    const appError = error instanceof AppError ? error : createError(errorType, undefined, error as Error);
    logError(appError);
    return [null, appError];
  }
};

/**
 * Retry logic for failed operations
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw createError(
    ErrorType.UNKNOWN,
    `Failed after ${maxRetries} attempts`,
    lastError!
  );
};
