import {
  GoogleSignin,
  type User,
} from "@react-native-google-signin/google-signin";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { AuthError } from "./errors";
import { useAuthStore } from "./store/useAuthStore";

// Types
export interface GoogleSignInConfig {
  webClientId: string;
  hostedDomain?: string;
  offlineAccess?: boolean;
}

export interface SignInResult {
  userCredential: FirebaseAuthTypes.UserCredential | null;
  error: AuthError | null;
}

export interface SignOutResult {
  error: AuthError | null;
}

// Google Sign-In Helper
export class GoogleSignIn {
  static configure(config: GoogleSignInConfig): void {
    if (!config.webClientId) {
      throw new Error("webClientId is required");
    }

    GoogleSignin.configure({
      webClientId: config.webClientId,
      offlineAccess: config.offlineAccess || false,
      hostedDomain: config.hostedDomain,
    });
  }

  static async signIn(): Promise<SignInResult> {
    try {
      // Check if Play Services are available
      try {
        await GoogleSignin.hasPlayServices();
      } catch (error) {
        return {
          userCredential: null,
          error: new AuthError(
            'PLAY_SERVICES_NOT_AVAILABLE',
            (error as Error).message
          ),
        };
      }

      // Perform Google Sign In
      const signInResult = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      
      if (!tokens?.idToken) {
        return {
          userCredential: null,
          error: new AuthError('TOKEN_ERROR', 'No ID token received'),
        };
      }

      // Create Firebase credential
      const credential = auth.GoogleAuthProvider.credential(tokens.idToken);

      // Sign in to Firebase
      const userCredential = await auth().signInWithCredential(credential);

      return {
        userCredential,
        error: null,
      };
    } catch (error) {
      return {
        userCredential: null,
        error: new AuthError('SIGN_IN_FAILED', (error as Error).message),
      };
    }
  }

  static async signOut(): Promise<SignOutResult> {
    try {
      await Promise.all([GoogleSignin.signOut(), auth().signOut()]);
      return { error: null };
    } catch (error) {
      return {
        error: new AuthError('SIGN_OUT_FAILED', (error as Error).message),
      };
    }
  }
}

// Export types and components
export { useAuthStore };
