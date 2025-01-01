export const errorMessages = {
  // Play Services related errors
  playServicesNotAvailable: "Google Play Services is not available or outdated",

  // Sign-in related errors
  signInFailed: "Google Sign-In failed",
  signInCancelled: "Google Sign-In was cancelled",
  signInAlreadyInProgress: "Google Sign-In is already in progress",
  invalidCredentials: "Failed to get user credentials from Google Sign-In",

  // Sign-out related errors
  signOutFailed: "Failed to sign out",

  // Token related errors
  noIdToken: "No ID token received from Google Sign-In",

  // Configuration errors
  configurationMissing: "Google Sign-In configuration is missing or invalid",

  // Network related errors
  networkError: "Network error occurred during authentication",

  // Unknown errors
  unknown: "An unknown error occurred",
};

export type AuthErrorCode =
  | "INVALID_CONFIG"
  | "NO_ID_TOKEN"
  | "SIGN_IN_CANCELLED"
  | "IN_PROGRESS"
  | "PLAY_SERVICES_NOT_AVAILABLE"
  | "SIGN_IN_FAILED"
  | "SIGN_OUT_FAILED";

export class AuthError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode, message?: string) {
    super(message || code);
    this.code = code;
    this.name = "AuthError";
  }
}

// Helper function to create typed errors
export const createError = (code: AuthErrorCode, message?: string) => {
  return new AuthError(code, message);
};
