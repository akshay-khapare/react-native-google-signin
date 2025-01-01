import { useAuthStore } from '../store/useAuthStore';
import { GoogleSignIn } from '../index';

jest.mock('../index', () => ({
  GoogleSignIn: {
    signIn: jest.fn(),
    signOut: jest.fn(),
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      isLoading: false,
      isError: null,
    });
  });

  it('should initialize with default state', () => {
    const state = useAuthStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.isError).toBeNull();
  });

  it('should set error message', () => {
    useAuthStore.getState().setError('Test error');
    expect(useAuthStore.getState().isError).toBe('Test error');
  });

  it('should reset state', () => {
    useAuthStore.getState().setError('Test error');
    useAuthStore.getState().resetState();
    const state = useAuthStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.isError).toBeNull();
  });

  describe('googleSignIn', () => {
    const mockUserCredential = {
      user: {
        uid: '123',
        email: 'test@example.com',
      },
    };

    it('should handle successful sign in', async () => {
      (GoogleSignIn.signIn as jest.Mock).mockResolvedValue({
        userCredential: mockUserCredential,
        error: null,
      });

      const signInResult = await useAuthStore.getState().googleSignIn();

      expect(signInResult).toBe(mockUserCredential);
      expect(useAuthStore.getState().isLoading).toBe(false);
      expect(useAuthStore.getState().isError).toBeNull();
    });

    it('should handle sign in error', async () => {
      const error = new Error('Sign in failed');
      (GoogleSignIn.signIn as jest.Mock).mockResolvedValue({
        userCredential: null,
        error,
      });

      const signInResult = await useAuthStore.getState().googleSignIn();

      expect(signInResult).toBeNull();
      expect(useAuthStore.getState().isLoading).toBe(false);
      expect(useAuthStore.getState().isError).toBe(error.message);
    });

    it('should not sign in if already loading', async () => {
      useAuthStore.setState({ isLoading: true });

      const signInResult = await useAuthStore.getState().googleSignIn();
      
      expect(signInResult).toBeNull();
      expect(GoogleSignIn.signIn).not.toHaveBeenCalled();
    });
  });

  describe('signOut', () => {
    it('should handle successful sign out', async () => {
      (GoogleSignIn.signOut as jest.Mock).mockResolvedValue({ error: null });

      await useAuthStore.getState().signOut();

      expect(useAuthStore.getState().isLoading).toBe(false);
      expect(useAuthStore.getState().isError).toBeNull();
    });

    it('should handle sign out error', async () => {
      const error = new Error('Sign out failed');
      (GoogleSignIn.signOut as jest.Mock).mockResolvedValue({ error });

      await useAuthStore.getState().signOut();

      expect(useAuthStore.getState().isLoading).toBe(false);
      expect(useAuthStore.getState().isError).toBe(error.message);
    });
  });
});
