// Mock React Native
jest.mock('react-native', () => require('./__mocks__/react-native'));

// Mock React Native's NativeModules
jest.mock('react-native/Libraries/BatchedBridge/NativeModules', () => ({
  RNGoogleSignin: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
    configure: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  },
}));
