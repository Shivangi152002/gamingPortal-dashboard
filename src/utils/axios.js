import axios from 'axios';
import { config } from '../config';

// Create a centralized axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  withCredentials: true, // Always send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add any additional config before request is sent
axiosInstance.interceptors.request.use(
  (config) => {
    // Log request for debugging (only in development)
    if (import.meta.env.DEV) {
      const fullUrl = config.baseURL + config.url;
      console.log(`🔵 ${config.method?.toUpperCase()} ${fullUrl}`);
      console.log('   WithCredentials:', config.withCredentials);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common error cases
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      const fullUrl = response.config.baseURL + response.config.url;
      console.log(`✅ ${response.status} ${response.config.method?.toUpperCase()} ${fullUrl}`);
    }
    return response;
  },
  (error) => {
    // Log error details
    if (error.response) {
      const fullUrl = error.config?.baseURL + error.config?.url;
      console.error(`🔴 ${error.response.status} ${error.config?.method?.toUpperCase()} ${fullUrl}`);
      console.error('   Error:', error.response.data?.message || error.message);
      
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        console.error('   Authentication failed - redirecting to login...');
        
        // If not on login page, redirect to login
        if (!window.location.pathname.includes('/login')) {
          setTimeout(() => {
            window.location.href = '/login';
          }, 1000);
        }
      }
    } else {
      console.error('❌ Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Also set global axios defaults as fallback
axios.defaults.withCredentials = true;

export default axiosInstance;

