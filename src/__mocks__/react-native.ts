export const Platform = {
  OS: 'android',
  select: (obj: { android: any; ios?: any }) => obj.android,
};

export const NativeModules = {
  RNGoogleSignin: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
    configure: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  },
};
