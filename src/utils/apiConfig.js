/**
 * ============================================
 * CENTRALIZED CLOUDFRONT & ASSET CONFIGURATION
 * ============================================
 * 
 * This module provides utilities for constructing CloudFront URLs
 * for game assets (thumbnails, gifs, games, etc.)
 * 
 * Usage:
 * import { getAssetUrl, getThumbnailUrl, getGifUrl, getGamePlayUrl } from '@/utils/apiConfig';
 */

// Get CloudFront URL from environment variable
// Using S3 direct (CloudFront pending verification)
// TODO: Switch to CloudFront when verified: 'https://dXXXXX.cloudfront.net'
const CLOUDFRONT_URL = import.meta.env.VITE_CLOUDFRONT_URL || 'https://gameportal-assets.s3.us-east-1.amazonaws.com'; // S3 direct

export const API_CONFIG = {
  // CloudFront direct URL (for all asset URLs)
  CLOUDFRONT_URL,
  
  // Path prefixes for different asset types
  PATHS: {
    GAMES: '/public/games/',
    THUMBNAILS: '/public/thumbnail/',
    GIFS: '/public/gif/',
    IMAGES: '/public/',
    ASSETS: '/public/'
  }
};

/**
 * Dynamic Asset URL Constructor - handles all asset types from CloudFront
 * @param {string} assetPath - The path to the asset
 * @param {string} assetType - Type of asset (images, thumbnail, gif, game)
 * @returns {string|null} Full CloudFront URL
 */
export const getAssetUrl = (assetPath, assetType = 'images') => {
  if (!assetPath) return null;
  
  // If the path already includes a full URL, return as is
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
    return assetPath;
  }
  
  // Remove leading slash if present to avoid double slashes
  let cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  
  // Handle different asset types dynamically
  if (assetType === 'thumbnail' && !cleanPath.startsWith('public/thumbnail/')) {
    if (cleanPath.startsWith('thumbnail/')) {
      cleanPath = `public/${cleanPath}`;
    } else {
      cleanPath = `public/thumbnail/${cleanPath}`;
    }
  } else if (assetType === 'gif' && !cleanPath.startsWith('public/gif/')) {
    if (cleanPath.startsWith('gif/')) {
      cleanPath = `public/${cleanPath}`;
    } else {
      cleanPath = `public/gif/${cleanPath}`;
    }
  } else if (assetType === 'game' && !cleanPath.startsWith('public/games/')) {
    if (cleanPath.startsWith('games/')) {
      cleanPath = `public/${cleanPath}`;
    } else {
      cleanPath = `public/games/${cleanPath}`;
    }
  } else if (!cleanPath.startsWith('public/')) {
    cleanPath = `public/${cleanPath}`;
  }
  
  // Split path into segments and encode each segment to handle spaces and special characters
  const pathSegments = cleanPath.split('/');
  const encodedSegments = pathSegments.map(segment => {
    if (segment.trim() === '') return segment;
    return encodeURIComponent(segment.trim());
  });
  
  const encodedPath = encodedSegments.join('/');
  
  // Construct full CloudFront URL
  return `${CLOUDFRONT_URL}/${encodedPath}`;
};

/**
 * Specific functions for different asset types
 */
export const getImageUrl = (imagePath) => getAssetUrl(imagePath, 'images');
export const getThumbnailUrl = (thumbnailPath) => getAssetUrl(thumbnailPath, 'thumbnail');
export const getGifUrl = (gifPath) => getAssetUrl(gifPath, 'gif');

/**
 * Enhanced function specifically for game play URLs
 * @param {string} playUrl - Game play URL or path
 * @param {string} gameName - Game name for logging
 * @returns {string|null} Full game URL
 */
export const getGamePlayUrl = (playUrl, gameName = '') => {
  if (!playUrl) {
    console.warn('No play URL provided for game:', gameName);
    return null;
  }
  
  // If it's already a full URL, return as is
  if (playUrl.startsWith('http://') || playUrl.startsWith('https://')) {
    return playUrl;
  }
  
  // Handle game URLs specifically
  return getAssetUrl(playUrl, 'game');
};

/**
 * Enhanced error handling for image loading
 * @param {Event} e - Error event
 * @param {string} fallbackUrl - Optional fallback URL
 */
export const handleImageError = (e, fallbackUrl = null) => {
  console.warn('Image failed to load:', e.target.src);
  e.target.onerror = null; // Prevent infinite loop
  
  // Use placeholder or custom fallback
  if (!fallbackUrl) {
    fallbackUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23ccc" width="300" height="200"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage Not Found%3C/text%3E%3C/svg%3E';
  }
  e.target.src = fallbackUrl;
};

export default API_CONFIG;
