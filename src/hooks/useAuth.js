import { useState, useEffect } from 'react';
import { APP_PASSWORD_HASH, SESSION_TIMEOUT } from '../constants/auth';
import { hashPassword, generateToken, isValidToken } from '../utils/crypto';

const SESSION_KEY = 'pos_session';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const { timestamp, token } = JSON.parse(session);
        const now = Date.now();

        // Validate session has required fields and valid token format
        if (!timestamp || !token || !isValidToken(token)) {
          localStorage.removeItem(SESSION_KEY);
          return;
        }

        // Check if session is still valid (within 24 hours)
        if (now - timestamp < SESSION_TIMEOUT) {
          setIsAuthenticated(true);
        } else {
          // Session expired, clear it
          localStorage.removeItem(SESSION_KEY);
        }
      } catch (error) {
        // Invalid session data, clear it
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const login = async (password) => {
    try {
      // Hash the input password
      const passwordHash = await hashPassword(password);

      // Compare with stored hash
      if (passwordHash === APP_PASSWORD_HASH) {
        // Set session with timestamp and random token
        const session = {
          timestamp: Date.now(),
          token: generateToken()
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: 'Nesprávné heslo' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Chyba při přihlašování' };
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    login,
    logout
  };
};
