import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('prefetch_token'));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(token && user);

  // Decode JWT payload to extract user info
  const decodeToken = useCallback((jwt) => {
    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      return {
        userId: payload.userId || payload.sub,
        username: payload.username,
        email: payload.email,
        role: payload.role,
        department: payload.department,
      };
    } catch {
      return null;
    }
  }, []);

  // Initialize from stored token
  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUser(decoded);
      } else {
        localStorage.removeItem('prefetch_token');
        setToken(null);
      }
    }
    setLoading(false);
  }, [token, decodeToken]);

  const login = useCallback(async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    const { token: jwt, user: userData } = response.data;

    localStorage.setItem('prefetch_token', jwt);
    setToken(jwt);
    setUser(userData);

    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('prefetch_token');
    setToken(null);
    setUser(null);
  }, []);

  // For demo/development: bypass login with a mock role
  const loginDemo = useCallback((role) => {
    const demoUsers = {
      STUDENT: {
        userId: 'demo-student-001',
        username: 'Rahul Sharma',
        email: 'CS2024098@campus.edu',
        role: 'STUDENT',
        department: 'Computer Science',
      },
      STAFF: {
        userId: 'demo-staff-001',
        username: 'R. Sen',
        email: 'staff.sen@campus.edu',
        role: 'STAFF',
        department: 'Store Operations',
      },
      ADMIN: {
        userId: 'demo-admin-001',
        username: 'Dr. Admin',
        email: 'admin.director@campus.edu',
        role: 'ADMIN',
        department: 'Store Administration',
      },
    };

    const demoUser = demoUsers[role];
    if (!demoUser) return;

    // Create a fake JWT for demo purposes
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ ...demoUser, exp: Date.now() / 1000 + 86400 }));
    const fakeToken = `${header}.${payload}.demo-signature`;

    localStorage.setItem('prefetch_token', fakeToken);
    setToken(fakeToken);
    setUser(demoUser);

    return demoUser;
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    loginDemo,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
