/**
 * ============================================
 * CENTRALIZED ENVIRONMENT-DRIVEN CONFIGURATION
 * ============================================
 * 
 * This is the SINGLE SOURCE OF TRUTH for all configuration.
 * ALL settings come from environment variables - NO hardcoded values.
 * 
 * Usage:
 * import { config } from '@/config';
 * const apiUrl = config.api.baseUrl;
 */

// Environment detection
const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.MODE === 'production';
const isTest = import.meta.env.MODE === 'test';

/**
 * Get environment variable with fallback
 * All configuration comes from VITE_ environment variables
 */
const getEnvVar = (key, fallback = null) => {
  const value = import.meta.env[key];
  if (!value && fallback === null) {
    console.warn(`⚠️ Environment variable ${key} is not set`);
  }
  return value || fallback;
};

/**
 * Environment-driven configuration
 * ALL values come from environment variables
 */
const envConfig = {
  // API Configuration - fully from environment with smart defaults
  api: {
    baseUrl: getEnvVar('VITE_API_BASE_URL', isDevelopment ? 'http://localhost:3000/api' : 'http://localhost:3000/api'),
    timeout: parseInt(getEnvVar('VITE_API_TIMEOUT', '30000')),
  },
  
  // Frontend Configuration
  frontend: {
    url: getEnvVar('VITE_FRONTEND_URL', isDevelopment ? 'http://localhost:5174' : 'http://localhost:5174'),
    title: getEnvVar('VITE_APP_TITLE', 'Gaming Portal Admin'),
    description: getEnvVar('VITE_APP_DESCRIPTION', 'Complete game management system with AWS integration'),
  },
  
  // AWS Configuration - fully from environment
  aws: {
    cloudFrontUrl: getEnvVar('VITE_CLOUDFRONT_URL', 'https://d1xtpep1y73br3.cloudfront.net'),
    region: getEnvVar('VITE_AWS_REGION', 'us-east-1'),
  },
  
  // Feature Flags - from environment
  features: {
    enableAnalytics: getEnvVar('VITE_ENABLE_ANALYTICS', isProduction ? 'true' : 'false') === 'true',
    enableDebugMode: getEnvVar('VITE_DEBUG_MODE', isDevelopment ? 'true' : 'false') === 'true',
    enableDevTools: getEnvVar('VITE_DEV_TOOLS', isDevelopment ? 'true' : 'false') === 'true',
  },
  
  // App Settings - from environment
  app: {
    name: getEnvVar('VITE_APP_NAME', 'Gaming Portal'),
    version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
    
    // Upload limits - configurable via environment
    upload: {
      maxFileSize: parseInt(getEnvVar('VITE_MAX_FILE_SIZE', '52428800')), // 50MB default
      maxFiles: parseInt(getEnvVar('VITE_MAX_FILES', '10')),
      allowedImageTypes: getEnvVar('VITE_ALLOWED_IMAGE_TYPES', 'image/jpeg,image/png,image/gif,image/webp').split(','),
      allowedVideoTypes: getEnvVar('VITE_ALLOWED_VIDEO_TYPES', 'video/mp4,video/webm').split(','),
      allowedArchiveTypes: getEnvVar('VITE_ALLOWED_ARCHIVE_TYPES', 'application/zip,application/x-zip-compressed').split(','),
    },
    
    // Pagination - configurable
    pagination: {
      defaultPageSize: parseInt(getEnvVar('VITE_DEFAULT_PAGE_SIZE', '10')),
      pageSizeOptions: getEnvVar('VITE_PAGE_SIZE_OPTIONS', '10,25,50,100').split(',').map(Number),
    },
    
    // Session timeout
    session: {
      timeout: parseInt(getEnvVar('VITE_SESSION_TIMEOUT', '86400000')), // 24 hours default
    },
  },
};

/**
 * Main Configuration Object
 * This is what you'll import and use throughout the app
 * ALL values come from environment variables
 */
export const config = {
  // Environment info
  env: {
    isDevelopment,
    isProduction,
    isTest,
    mode: import.meta.env.MODE,
  },

  // API Configuration - fully environment driven
  api: {
    baseUrl: envConfig.api.baseUrl,
    timeout: envConfig.api.timeout,
    
    // API Endpoints (relative to baseUrl)
    endpoints: {
      // Auth
      auth: {
        login: '/auth/login',
        logout: '/auth/logout',
        me: '/auth/me',
        register: '/auth/register',
      },
      
      // Games
      games: {
        list: '/games',
        single: (id) => `/games/${id}`,
        create: '/games',
        update: (id) => `/games/${id}`,
        delete: (id) => `/games/${id}`,
      },
      
      // Upload
      upload: {
        files: '/upload/files',
        file: '/upload/file',
      },
      
      // Users
      users: {
        list: '/users',
        single: (id) => `/users/${id}`,
        create: '/users',
        update: (id) => `/users/${id}`,
        delete: (id) => `/users/${id}`,
      },
      
      // Analytics
      analytics: {
        overview: '/analytics/overview',
        games: '/analytics/games',
        users: '/analytics/users',
      },
    },
    
    // Full URL builder helper
    getFullUrl: (endpoint) => {
      return `${envConfig.api.baseUrl}${endpoint}`;
    },
  },

  // Frontend Configuration
  frontend: envConfig.frontend,

  // AWS Configuration - fully environment driven
  aws: {
    cloudFrontUrl: envConfig.aws.cloudFrontUrl,
    region: envConfig.aws.region,
    
    /**
     * Helper to get CloudFront URL for assets
     * @param {string} path - Asset path (can include or exclude /public/ prefix)
     * @param {string} assetType - Type of asset (thumbnail, gif, game, images)
     * @returns {string} Full CloudFront URL
     */
    getAssetUrl: (path, assetType = 'images') => {
      if (!path) return '';
      if (path.startsWith('http://') || path.startsWith('https://')) return path;
      if (!envConfig.aws.cloudFrontUrl) {
        console.warn('⚠️ CLOUDFRONT_URL not configured');
        return path;
      }
      
      // Remove leading slash
      let cleanPath = path.replace(/^\//, '');
      
      // Handle different asset types
      if (assetType === 'thumbnail' && !cleanPath.startsWith('public/thumbnail/')) {
        cleanPath = cleanPath.startsWith('thumbnail/') 
          ? `public/${cleanPath}` 
          : `public/thumbnail/${cleanPath}`;
      } else if (assetType === 'gif' && !cleanPath.startsWith('public/gif/')) {
        cleanPath = cleanPath.startsWith('gif/') 
          ? `public/${cleanPath}` 
          : `public/gif/${cleanPath}`;
      } else if (assetType === 'game' && !cleanPath.startsWith('public/games/')) {
        cleanPath = cleanPath.startsWith('games/') 
          ? `public/${cleanPath}` 
          : `public/games/${cleanPath}`;
      } else if (!cleanPath.startsWith('public/')) {
        cleanPath = `public/${cleanPath}`;
      }
      
      // Encode path segments to handle spaces and special characters
      const encodedPath = cleanPath.split('/').map(segment => 
        segment.trim() === '' ? segment : encodeURIComponent(segment.trim())
      ).join('/');
      
      return `${envConfig.aws.cloudFrontUrl}/${encodedPath}`;
    },
    
    /**
     * Helper to get game asset URL (deprecated - use getAssetUrl with 'game' type)
     * @deprecated Use getAssetUrl(path, 'game') instead
     */
    getGameAssetUrl: (gamePath) => {
      return config.aws.getAssetUrl(gamePath, 'game');
    },
  },

  // Feature Flags - from environment
  features: envConfig.features,

  // App Settings - from environment
  app: envConfig.app,
};

/**
 * Helper function to log configuration (only in development)
 */
export const logConfig = () => {
  if (config.env.isDevelopment) {
    console.group('🔧 Application Configuration');
    console.log('Environment:', config.env.mode);
    console.log('API Base URL:', config.api.baseUrl);
    console.log('Frontend URL:', config.frontend.url);
    console.log('CloudFront URL:', config.aws.cloudFrontUrl);
    console.log('Debug Mode:', config.features.enableDebugMode);
    console.groupEnd();
  }
};

// Export as default as well for convenience
export default config;

