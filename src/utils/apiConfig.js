// Dynamic API Configuration
// Change this base URL to switch between different backends/deployments
// Everything in the system will use this centralized configuration

// Development vs Production URL handling
const isDevelopment = import.meta.env.DEV;

export const API_CONFIG = {
  // In development: Use Vite proxy to bypass CORS (FAST!)
  // In production: Use CloudFront directly
  BASE_URL: isDevelopment 
    ? '' // Empty for same-origin (uses Vite proxy)
    : 'https://d1xtpep1y73br3.cloudfront.net',
  
  ENDPOINTS: {
    GAMES_DATA: isDevelopment 
      ? '/api/cloudfront/public/game-data.json' // Vite proxy route
      : '/public/game-data.json' // CloudFront direct
  },
  
  // Path prefixes for different asset types - all assets come from BASE_URL
  PATHS: {
    GAMES: '/public/games/',
    THUMBNAILS: '/public/thumbnail/',
    GIFS: '/public/gif/',
    IMAGES: '/public/',
    ASSETS: '/public/'
  },
  
  // CloudFront direct URL (for production and asset URLs)
  CLOUDFRONT_URL: 'https://d1xtpep1y73br3.cloudfront.net'
};

// Utility function to construct full URLs from endpoints
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Dynamic Asset URL Constructor - handles all asset types from BASE_URL (OPTIMIZED)
export const getAssetUrl = (assetPath, assetType = 'images') => {
  console.log('🔧 getAssetUrl called:', { assetPath, assetType });
  
  if (!assetPath) {
    console.log('❌ No assetPath provided');
    return null;
  }
  
  // If the path already includes a full URL, return as is
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
    console.log('✅ Already full URL:', assetPath);
    return assetPath;
  }
  
  // Remove leading slash if present to avoid double slashes
  let cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  console.log('🧹 Cleaned path:', cleanPath);
  
  // Handle different asset types dynamically based on API_CONFIG.PATHS
  if (assetType === 'thumbnail' && !cleanPath.startsWith('public/thumbnail/')) {
    // If it's a thumbnail and doesn't have the full path, construct it
    if (cleanPath.startsWith('thumbnail/')) {
      cleanPath = `public/${cleanPath}`;
    } else {
      cleanPath = `public/thumbnail/${cleanPath}`;
    }
    console.log('🖼️ Thumbnail path constructed:', cleanPath);
  } else if (assetType === 'gif' && !cleanPath.startsWith('public/gif/')) {
    // If it's a GIF and doesn't have the full path, construct it
    if (cleanPath.startsWith('gif/')) {
      cleanPath = `public/${cleanPath}`;
    } else {
      cleanPath = `public/gif/${cleanPath}`;
    }
    console.log('🎬 GIF path constructed:', cleanPath);
  } else if (assetType === 'game' && !cleanPath.startsWith('public/games/')) {
    // If it's a game asset and doesn't have the full path, construct it
    if (cleanPath.startsWith('games/')) {
      cleanPath = `public/${cleanPath}`;
    } else {
      cleanPath = `public/games/${cleanPath}`;
    }
    console.log('🎮 Game path constructed:', cleanPath);
  } else if (!cleanPath.startsWith('public/')) {
    // For other assets, ensure they have the /public/ prefix
    cleanPath = `public/${cleanPath}`;
    console.log('📁 Added public prefix:', cleanPath);
  }
  
  // Split path into segments and encode each segment to handle spaces and special characters
  const pathSegments = cleanPath.split('/');
  const encodedSegments = pathSegments.map(segment => {
    if (segment.trim() === '') return segment; // Keep empty segments as is
    return encodeURIComponent(segment.trim()); // Encode and trim each segment
  });
  
  const encodedPath = encodedSegments.join('/');
  console.log('🔤 Encoded path:', encodedPath);
  
  // Always use CloudFront for assets (images, thumbnails, games)
  // Even in development, assets load directly from CloudFront
  const baseUrl = API_CONFIG.CLOUDFRONT_URL;
  const url = `${baseUrl}/${encodedPath}`;
  
  console.log('🌐 Final URL:', url);
  return url;
};

// Specific functions for different asset types - all use the dynamic getAssetUrl
export const getImageUrl = (imagePath) => getAssetUrl(imagePath, 'images');
export const getThumbnailUrl = (thumbnailPath) => getAssetUrl(thumbnailPath, 'thumbnail');
export const getGifUrl = (gifPath) => getAssetUrl(gifPath, 'gif');

// Enhanced error handling for image loading
export const handleImageError = (e, fallbackUrl = null) => {
  console.warn('Image failed to load:', e.target.src);
  e.target.onerror = null; // Prevent infinite loop
  
  // Use dynamic fallback from our asset system instead of hardcoded paths
  if (!fallbackUrl) {
    fallbackUrl = getAssetUrl('mock-assets/test.gif');
  }
  e.target.src = fallbackUrl;
};

// Enhanced function specifically for game play URLs with better error handling
export const getGamePlayUrl = (playUrl, gameName = '') => {
  if (!playUrl) {
    console.warn('No play URL provided for game:', gameName);
    return null;
  }
  
  // If it's already a full URL, return as is
  if (playUrl.startsWith('http://') || playUrl.startsWith('https://')) {
    return playUrl;
  }
  
  // Handle game URLs specifically - use our dynamic asset system
  return getAssetUrl(playUrl, 'game');
};

// Debug function to log URL transformations
export const debugUrl = (originalUrl, transformedUrl, context = '') => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`URL Debug ${context}:`, {
      original: originalUrl,
      transformed: transformedUrl,
      baseUrl: API_CONFIG.BASE_URL,
      isFullUrl: originalUrl?.startsWith('http')
    });
  }
};

export default API_CONFIG;
