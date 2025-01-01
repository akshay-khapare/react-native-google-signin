import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { GoogleSignIn } from '../index';
import { AuthError } from '../errors';

const mockUserCredential = {
  user: {
    displayName: 'Test User',
    email: 'test@example.com',
    uid: '123',
  },
};

const mockGoogleSignin = {
  configure: jest.fn(),
  hasPlayServices: jest.fn().mockResolvedValue(true),
  signIn: jest.fn().mockResolvedValue({
    user: {
      email: 'test@example.com',
      id: '123',
      name: 'Test User',
    },
  }),
  getTokens: jest.fn().mockResolvedValue({
    accessToken: 'mock-access-token',
    idToken: 'mock-id-token',
  }),
  signOut: jest.fn().mockResolvedValue(undefined),
};

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: mockGoogleSignin,
}));

const mockFirebaseAuth = {
  signInWithCredential: jest.fn().mockResolvedValue(mockUserCredential),
  signOut: jest.fn().mockResolvedValue(undefined),
};

const mockGoogleAuthProvider = {
  credential: jest.fn().mockReturnValue('mock-credential'),
  PROVIDER_ID: 'google.com',
};

jest.mock('@react-native-firebase/auth', () => {
  const mockAuth = jest.fn(() => mockFirebaseAuth);
  mockAuth.GoogleAuthProvider = mockGoogleAuthProvider;
  return mockAuth;
});

describe('GoogleSignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('configure', () => {
    it('should configure GoogleSignin', () => {
      const config = {
        webClientId: 'test-client-id',
      };

      GoogleSignIn.configure(config);
      expect(mockGoogleSignin.configure).toHaveBeenCalledWith({
        webClientId: config.webClientId,
        offlineAccess: false,
        hostedDomain: undefined,
      });
    });
  });

  describe('signIn', () => {
    it('should successfully sign in user', async () => {
      const result = await GoogleSignIn.signIn();
      expect(result.userCredential).toEqual(mockUserCredential);
      expect(result.error).toBeNull();
      expect(mockFirebaseAuth.signInWithCredential).toHaveBeenCalledWith('mock-credential');
    });

    it('should handle play services error', async () => {
      mockGoogleSignin.hasPlayServices.mockRejectedValueOnce(
        new Error('Play services not available')
      );

      const result = await GoogleSignIn.signIn();
      expect(result.userCredential).toBeNull();
      expect((result.error as AuthError).code).toBe('PLAY_SERVICES_NOT_AVAILABLE');
    });

    it('should handle sign in error', async () => {
      mockGoogleSignin.hasPlayServices.mockResolvedValueOnce(true);
      mockGoogleSignin.signIn.mockRejectedValueOnce(
        new Error('Sign in failed')
      );

      const result = await GoogleSignIn.signIn();
      expect(result.userCredential).toBeNull();
      expect((result.error as AuthError).code).toBe('SIGN_IN_FAILED');
    });

    it('should handle missing tokens', async () => {
      mockGoogleSignin.hasPlayServices.mockResolvedValueOnce(true);
      mockGoogleSignin.signIn.mockResolvedValueOnce({
        user: {
          email: 'test@example.com',
          id: '123',
          name: 'Test User',
        },
      });
      mockGoogleSignin.getTokens.mockResolvedValueOnce({});

      const result = await GoogleSignIn.signIn();
      expect(result.userCredential).toBeNull();
      expect((result.error as AuthError).code).toBe('SIGN_IN_FAILED');
    });
  });

  describe('signOut', () => {
    it('should successfully sign out', async () => {
      const result = await GoogleSignIn.signOut();
      expect(result.error).toBeNull();
      expect(mockGoogleSignin.signOut).toHaveBeenCalled();
      expect(mockFirebaseAuth.signOut).toHaveBeenCalled();
    });

    it('should handle sign out error', async () => {
      mockGoogleSignin.signOut.mockRejectedValueOnce(
        new Error('Sign out failed')
      );

      const result = await GoogleSignIn.signOut();
      expect((result.error as AuthError).code).toBe('SIGN_OUT_FAILED');
    });
  });
});
