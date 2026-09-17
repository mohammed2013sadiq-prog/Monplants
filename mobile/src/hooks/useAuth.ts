import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, token, isLoading, error, login, register, logout, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth
  };
};

export default useAuth;
