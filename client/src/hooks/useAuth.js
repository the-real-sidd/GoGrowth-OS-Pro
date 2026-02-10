import { useState, useCallback } from 'react';
import { userAPI } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await userAPI.login({ email, password });
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setError(null);
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await userAPI.register({ name, email, password });
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setError(null);
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const getCurrentUser = async () => {
    try {
      const response = await userAPI.getCurrentUser();
      setUser(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      logout();
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    getCurrentUser
  };
};
