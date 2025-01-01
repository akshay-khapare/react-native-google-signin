// Error codes for authentication errors
export type AuthErrorCode =
  | "PLAY_SERVICES_NOT_AVAILABLE"
  | "SIGN_IN_FAILED"
  | "SIGN_IN_CANCELLED"
  | "SIGN_IN_IN_PROGRESS"
  | "INVALID_CREDENTIALS"
  | "SIGN_OUT_FAILED"
  | "NO_ID_TOKEN"
  | "CONFIGURATION_MISSING"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

export interface AuthError {
  code: AuthErrorCode;
  message?: string;
  // Optional additional data that might be useful for error handling
  details?: Record<string, unknown>;
}

/**
 * Create an auth error with the specified code and optional message and details
 */
export function createAuthError(
  code: AuthErrorCode,
  message?: string,
  details?: Record<string, unknown>
): AuthError {
  return {
    code,
    message,
    details,
  };
}

/**
 * Convert any error to an AuthError
 */
export function toAuthError(error: unknown): AuthError {
  if (isAuthError(error)) {
    return error;
  }

  const message = error instanceof Error ? error.message : String(error);
  return createAuthError("UNKNOWN_ERROR", message);
}

/**
 * Type guard to check if an error is an AuthError
 */
export function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as AuthError).code === "string"
  );
}
