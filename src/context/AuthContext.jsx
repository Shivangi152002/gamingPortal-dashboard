import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../utils/axios';
import { config } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('🔍 Checking session with /auth/me...');
        console.log('🔍 Endpoint:', config.api.endpoints.auth.me);
        console.log('🔍 Base URL:', config.api.baseUrl);
        
        // Use relative path since axios instance already has baseURL configured
        const response = await axios.get(config.api.endpoints.auth.me);
        
        console.log('✅ /auth/me API responded');
        console.log('📦 Response data:', response.data);
        
        if (response.data.success) {
          setUser(response.data.data.user);
          console.log('✅ User authenticated:', response.data.data.user);
        } else {
          console.log('⚠️ Response success=false:', response.data.message);
          setUser(null);
        }
      } catch (error) {
        console.error('❌ /auth/me error occurred:');
        console.error('   Status:', error.response?.status);
        console.error('   Message:', error.response?.data?.message || error.message);
        console.error('   Full error:', error);
        
        // Not authenticated
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login...');
      // Use relative path since axios instance already has baseURL configured
      const response = await axios.post(config.api.endpoints.auth.login, {
        email,
        password
      });

      if (response.data.success) {
        const { user } = response.data.data;
        setUser(user);
        console.log('✅ Login successful:', user);
        
        // Immediately verify session with /auth/me
        console.log('🔍 Calling /api/auth/me to verify session...');
        try {
          const meResponse = await axios.get(config.api.endpoints.auth.me);
          if (meResponse.data.success) {
            setUser(meResponse.data.data.user);
            console.log('✅ Session verified via /auth/me:', meResponse.data.data.user);
          }
        } catch (meError) {
          console.error('⚠️ Failed to verify session:', meError.message);
        }
        
        return { success: true };
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = async () => {
    try {
      // Use relative path since axios instance already has baseURL configured
      await axios.post(config.api.endpoints.auth.logout);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      isAuthenticated: !!user,
      isRoot: user?.role === 'root'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};