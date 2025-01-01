import { GoogleAuthHelper } from '../index';

describe('GoogleAuthHelper', () => {
  const mockConfig = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    redirectUri: 'http://localhost:3000/callback'
  };

  let authHelper: GoogleAuthHelper;

  beforeEach(() => {
    authHelper = new GoogleAuthHelper(mockConfig);
  });

  describe('getAuthUrl', () => {
    it('should generate auth URL with default scopes', () => {
      const authUrl = authHelper.getAuthUrl();
      expect(authUrl).toContain('scope=profile');
      expect(authUrl).toContain('scope=email');
      expect(authUrl).toContain(mockConfig.clientId);
    });

    it('should generate auth URL with custom scopes', () => {
      const customScopes = ['profile', 'email', 'openid'];
      const authUrl = authHelper.getAuthUrl(customScopes);
      customScopes.forEach(scope => {
        expect(authUrl).toContain(`scope=${scope}`);
      });
    });
  });

  describe('verifyToken', () => {
    it('should throw error for invalid token', async () => {
      await expect(authHelper.verifyToken('invalid-token'))
        .rejects
        .toThrow('Token verification failed');
    });
  });

  describe('getTokens', () => {
    it('should throw error for invalid code', async () => {
      await expect(authHelper.getTokens('invalid-code'))
        .rejects
        .toThrow('Failed to get tokens');
    });
  });
});
