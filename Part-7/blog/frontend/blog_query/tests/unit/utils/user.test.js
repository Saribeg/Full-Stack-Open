import { initializeUser, loginUser, logoutUser } from '../../../src/utils/user';

import * as apiModule from '../../../src/services/api';
import * as commonHelpers from '../../../src/utils/commonHelpers';
import loginService from '../../../src/services/login';

vi.mock('../../../src/services/api', () => ({
  setToken: vi.fn(),
  clearToken: vi.fn(),
}));

vi.mock('../../../src/utils/commonHelpers', () => ({
  safeParseJSON: vi.fn(),
}));

vi.mock('../../../src/services/login', () => ({
  default: {
    login: vi.fn(),
  },
}));

describe('user utils', () => {
  let dispatchUser;

  beforeEach(() => {
    vi.clearAllMocks();
    dispatchUser = vi.fn();
    localStorage.clear();
  });

  describe('initializeUser', () => {
    it('does nothing if no user in localStorage', () => {
      commonHelpers.safeParseJSON.mockReturnValue(null);

      initializeUser(dispatchUser);

      expect(dispatchUser).not.toHaveBeenCalled();
      expect(apiModule.setToken).not.toHaveBeenCalled();
    });

    it('dispatches and sets token if valid user with token exists', () => {
      const mockUser = { username: 'test', token: 'abc123' };
      localStorage.setItem('user', JSON.stringify(mockUser));
      commonHelpers.safeParseJSON.mockReturnValue(mockUser);

      initializeUser(dispatchUser);

      expect(dispatchUser).toHaveBeenCalledWith({ type: 'SET_USER', payload: mockUser });
      expect(apiModule.setToken).toHaveBeenCalledWith('abc123');
    });

    it('ignores invalid parsed user', () => {
      commonHelpers.safeParseJSON.mockReturnValue({}); // no token

      initializeUser(dispatchUser);

      expect(dispatchUser).not.toHaveBeenCalled();
      expect(apiModule.setToken).not.toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    it('logs in, saves user, dispatches and sets token', async () => {
      const mockUserData = { username: 'john', token: 'token123' };
      loginService.login.mockResolvedValue(mockUserData);

      const result = await loginUser(dispatchUser, { username: 'john', password: 'pw' });

      expect(loginService.login).toHaveBeenCalledWith({ username: 'john', password: 'pw' });

      const saved = JSON.parse(localStorage.getItem('user'));
      expect(saved).toEqual(mockUserData);

      expect(dispatchUser).toHaveBeenCalledWith({ type: 'SET_USER', payload: mockUserData });
      expect(apiModule.setToken).toHaveBeenCalledWith('token123');
      expect(result).toEqual(mockUserData);
    });
  });

  describe('logoutUser', () => {
    it('removes user, clears token, and dispatches logout', () => {
      localStorage.setItem('user', JSON.stringify({ username: 'old' }));

      logoutUser(dispatchUser);

      expect(localStorage.getItem('user')).toBeNull();
      expect(apiModule.clearToken).toHaveBeenCalled();
      expect(dispatchUser).toHaveBeenCalledWith({ type: 'LOGOUT_USER' });
    });
  });
});
