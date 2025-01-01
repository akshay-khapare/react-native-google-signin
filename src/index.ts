import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { createAuthError } from "./errors";
import { useAuthStore } from "./store/useAuthStore";

export interface GoogleSignInConfig {
  webClientId: string;
  hostedDomain?: string;
  offlineAccess?: boolean;
}

export interface SignInResult {
  userCredential: FirebaseAuthTypes.UserCredential | null;
  error: ReturnType<typeof createAuthError> | null;
}

export interface SignOutResult {
  error: ReturnType<typeof createAuthError> | null;
}

export class GoogleSignIn {
  static configure({
    webClientId,
    offlineAccess = false,
    hostedDomain,
  }: GoogleSignInConfig): void {
    if (!webClientId?.trim()) {
      throw createAuthError("CONFIGURATION_MISSING", "webClientId is required");
    }

    GoogleSignin.configure({ webClientId, offlineAccess, hostedDomain });
  }

  static async signIn(): Promise<SignInResult> {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const idToken = (await GoogleSignin.signIn()).data?.idToken;

      if (!idToken) {
        return { userCredential: null, error: createAuthError("NO_ID_TOKEN") };
      }

      const userCredential = await auth().signInWithCredential(
        auth.GoogleAuthProvider.credential(idToken)
      );

      return { userCredential, error: null };
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        const code = error.code;
        if (code === statusCodes.SIGN_IN_CANCELLED) {
          return {
            userCredential: null,
            error: createAuthError("SIGN_IN_CANCELLED"),
          };
        }
        if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          return {
            userCredential: null,
            error: createAuthError("PLAY_SERVICES_NOT_AVAILABLE"),
          };
        }
      }

      const message = error instanceof Error ? error.message : String(error);
      const isNetworkError =
        message.toLowerCase().includes("network") ||
        message.toLowerCase().includes("internet") ||
        message.toLowerCase().includes("connection");

      return {
        userCredential: null,
        error: createAuthError(
          isNetworkError ? "NETWORK_ERROR" : "SIGN_IN_FAILED",
          message
        ),
      };
    }
  }

  static async signOut(): Promise<SignOutResult> {
    try {
      await Promise.all([GoogleSignin.signOut(), auth().signOut()]);
      return { error: null };
    } catch (error) {
      return {
        error: createAuthError(
          "SIGN_OUT_FAILED",
          error instanceof Error ? error.message : String(error)
        ),
      };
    }
  }
}

export { useAuthStore };
