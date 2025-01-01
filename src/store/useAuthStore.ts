import { create } from "zustand";
import { GoogleSignIn } from "../index";
import { AuthError } from "../errors";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

/** State interface for authentication store */
interface AuthState {
  /** Whether an authentication operation is in progress */
  isLoading: boolean;
  /** Current authentication error, if any */
  error: AuthError | null;
  /** Set the current error state */
  setError: (error: AuthError | null) => void;
  /** Perform Google Sign-In */
  googleSignIn: () => Promise<FirebaseAuthTypes.UserCredential | null>;
  /** Sign out the current user */
  signOut: () => Promise<void>;
  /** Reset the store to its initial state */
  resetState: () => void;
}

const initialState = {
  isLoading: false,
  error: null,
} as const;

/**
 * Authentication store using Zustand
 * @remarks Manages authentication state and operations
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialState,

  setError: (error) => set({ error }),

  resetState: () => set(initialState),

  googleSignIn: async () => {
    if (get().isLoading) return null;
    set({ isLoading: true, error: null });

    try {
      const { userCredential, error } = await GoogleSignIn.signIn();
      set({ isLoading: false, error: error || null });
      return userCredential;
    } catch (error) {
      set({ isLoading: false, error: error as AuthError });
      return null;
    }
  },

  signOut: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });

    try {
      const { error } = await GoogleSignIn.signOut();
      set({ isLoading: false, error: error || null });
    } catch (error) {
      set({ isLoading: false, error: error as AuthError });
    }
  },
}));
