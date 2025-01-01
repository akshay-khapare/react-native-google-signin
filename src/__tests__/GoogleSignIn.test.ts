import { GoogleSignIn } from '../index';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  },
}));

jest.mock('@react-native-firebase/auth', () => ({
  GoogleAuthProvider: {
    credential: jest.fn(),
  },
  signInWithCredential: jest.fn(),
  signOut: jest.fn(),
}));

describe('GoogleSignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('configure', () => {
    it('should configure GoogleSignin with valid config', async () => {
      const config = { webClientId: 'valid-client-id' };
      await GoogleSignIn.configure(config);
      expect(GoogleSignin.configure).toHaveBeenCalledWith({
        webClientId: config.webClientId,
        offlineAccess: false,
        hostedDomain: undefined,
      });
    });

    it('should throw error for invalid webClientId', async () => {
      const config = { webClientId: '' };
      await expect(GoogleSignIn.configure(config)).rejects.toThrow();
    });
  });

  describe('signIn', () => {
    it('should successfully sign in user', async () => {
      const mockIdToken = 'mock-id-token';
      const mockUserCredential = { user: { uid: 'mock-uid' } };

      (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true);
      (GoogleSignin.signIn as jest.Mock).mockResolvedValue({ idToken: mockIdToken });
      (auth.GoogleAuthProvider.credential as jest.Mock).mockReturnValue('mock-credential');
      (auth().signInWithCredential as jest.Mock).mockResolvedValue(mockUserCredential);

      const result = await GoogleSignIn.signIn();
      expect(result.userCredential).toBe(mockUserCredential);
      expect(result.error).toBeNull();
    });

    it('should handle sign in cancellation', async () => {
      (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true);
      (GoogleSignin.signIn as jest.Mock).mockRejectedValue({ code: 'SIGN_IN_CANCELLED' });

      const result = await GoogleSignIn.signIn();
      expect(result.userCredential).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });

  describe('signOut', () => {
    it('should successfully sign out user', async () => {
      (GoogleSignin.signOut as jest.Mock).mockResolvedValue(null);
      (auth().signOut as jest.Mock).mockResolvedValue(null);

      const result = await GoogleSignIn.signOut();
      expect(result.error).toBeNull();
      expect(GoogleSignin.signOut).toHaveBeenCalled();
      expect(auth().signOut).toHaveBeenCalled();
    });
  });
});
