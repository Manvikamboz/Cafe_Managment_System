import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch fresh user profile from DB using stored token
  const fetchProfile = useCallback(async () => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await API.get('/auth/me');
      setUser(data);
    } catch {
      // Token invalid or expired — clear it
      sessionStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    sessionStorage.setItem('authToken', data.token);
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password });
    sessionStorage.setItem('authToken', data.token);
    setUser(data);
    return data;
  };

  // Called after favorites toggle — re-fetches profile from DB
  const refreshUser = async () => {
    await fetchProfile();
  };

  const logout = () => {
    sessionStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
