const mockUserCredential = {
  user: {
    displayName: 'Test User',
    email: 'test@example.com',
    uid: '123',
  },
};

const auth = jest.fn(() => ({
  signInWithCredential: jest.fn().mockResolvedValue(mockUserCredential),
  signOut: jest.fn().mockResolvedValue(undefined),
}));

auth.GoogleAuthProvider = {
  credential: jest.fn().mockReturnValue('mock-credential'),
};

export default auth;
