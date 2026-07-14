import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create Axios Instance
export const api = axios.create({
  baseURL: '/api'
});

// Request interceptor to inject JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check user session on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Session validation failed', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login (requests OTP)
  const login = async (email, password, role) => {
    const response = await api.post('/auth/login', { email, password, role });
    return response.data;
  };

  // Verify OTP & finalize login
  const verifyOtp = async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('userName', response.data.name);
      
      // Fetch user data
      const meResponse = await api.get('/auth/me');
      setUser(meResponse.data.data);
    }
    return response.data;
  };

  // Register Patient
  const register = async (name, email, password, phone) => {
    const response = await api.post('/auth/register', { name, email, password, phone });
    return response.data;
  };

  // Register Doctor
  const registerDoctor = async (doctorData) => {
    const response = await api.post('/doctors', doctorData);
    return response.data;
  };

  // Logout
  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        login,
        verifyOtp,
        register,
        registerDoctor,
        logout,
        isAuthenticated: !!user,
        role: user ? user.role : null
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
