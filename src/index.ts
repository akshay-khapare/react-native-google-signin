import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { AuthErrorCode, createError } from "./errors";
import { useAuthStore } from "./store/useAuthStore";

// Types
export interface GoogleSignInConfig {
  webClientId: string;
  offlineAccess?: boolean;
  hostedDomain?: string;
}

// Google Sign-In Helper
export class GoogleSignIn {
  static async configure(config: GoogleSignInConfig) {
    if (!config.webClientId) {
      throw createError("INVALID_CONFIG", "webClientId is required");
    }
    if (typeof config.webClientId !== 'string') {
      throw createError("INVALID_CONFIG", "webClientId must be a string");
    }
    if (config.hostedDomain && typeof config.hostedDomain !== 'string') {
      throw createError("INVALID_CONFIG", "hostedDomain must be a string");
    }

    GoogleSignin.configure({
      webClientId: config.webClientId,
      offlineAccess: config.offlineAccess ?? false,
      hostedDomain: config.hostedDomain,
    });
  }

  static async signIn(): Promise<{
    userCredential: FirebaseAuthTypes.UserCredential | null;
    error: Error | null;
  }> {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const { idToken } = await GoogleSignin.signIn();
      if (!idToken) {
        throw createError("NO_ID_TOKEN");
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(
        googleCredential
      );

      return { userCredential, error: null };
    } catch (error: any) {
      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        return {
          userCredential: null,
          error: createError("SIGN_IN_CANCELLED"),
        };
      }
      if (error?.code === statusCodes.IN_PROGRESS) {
        return {
          userCredential: null,
          error: createError("IN_PROGRESS"),
        };
      }
      if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return {
          userCredential: null,
          error: createError("PLAY_SERVICES_NOT_AVAILABLE"),
        };
      }
      return {
        userCredential: null,
        error: createError("SIGN_IN_FAILED"),
      };
    }
  }

  static async signOut(): Promise<{ error: Error | null }> {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      return { error: null };
    } catch (error) {
      return { error: createError("SIGN_OUT_FAILED") };
    }
  }
}

// Export types and components
export { useAuthStore, AuthErrorCode };
