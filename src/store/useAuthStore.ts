import { create } from "zustand";
import { GoogleSignIn } from "../index";
import { createError } from "../errors";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

interface AuthState {
  isLoading: boolean;
  isError: string | null;
  setError: (error: string | null) => void;
  googleSignIn: () => Promise<FirebaseAuthTypes.UserCredential | null>;
  signOut: () => Promise<void>;
  resetState: () => void;
}

const initialState = {
  isLoading: false,
  isError: null,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialState,

  setError: (error: string | null) => set({ isError: error }),
  resetState: () => set(initialState),

  googleSignIn: async () => {
    if (get().isLoading) return null;

    set({ isLoading: true, isError: null });

    try {
      const { userCredential, error } = await GoogleSignIn.signIn();

      if (error) {
        throw error;
      }

      if (!userCredential) {
        throw createError("SIGN_IN_FAILED", "Invalid credentials received");
      }

      set({ isLoading: false });
      return userCredential;
    } catch (error: any) {
      set({
        isError: error.message,
        isLoading: false,
      });
      return null;
    }
  },

  signOut: async () => {
    if (get().isLoading) return;

    set({ isLoading: true, isError: null });

    try {
      const { error } = await GoogleSignIn.signOut();

      if (error) {
        throw error;
      }

      set({ ...initialState });
    } catch (error: any) {
      set({
        isError: error.message,
        isLoading: false,
      });
    }
  },
}));
