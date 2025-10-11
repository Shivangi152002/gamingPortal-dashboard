/**
 * Image utility functions
 * Provides safe fallback images that don't require network requests
 */

/**
 * Get a safe placeholder image as data URI
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Text to display (default: "No Image")
 * @returns {string} Data URI for placeholder image
 */
export const getPlaceholderImage = (width = 200, height = 200, text = 'No Image') => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#cccccc"/>
      <text x="50%" y="50%" font-family="Arial" font-size="${Math.max(12, Math.min(width, height) / 15)}" 
            fill="#666666" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Safe image error handler that uses local placeholder
 * @param {Event} event - Image error event
 * @param {number} width - Fallback image width
 * @param {number} height - Fallback image height
 * @param {string} text - Fallback text
 */
export const handleImageError = (event, width = 200, height = 200, text = 'No Image') => {
  // Prevent infinite loops by checking if we're already showing a placeholder
  if (!event.target.src.startsWith('data:image/svg+xml')) {
    event.target.src = getPlaceholderImage(width, height, text);
  }
};

/**
 * Get image URL with safe fallback
 * @param {string} imagePath - Path to image
 * @param {string} cloudFrontUrl - CloudFront base URL
 * @param {number} width - Fallback width
 * @param {number} height - Fallback height
 * @param {string} text - Fallback text
 * @returns {string} Image URL or placeholder
 */
export const getImageUrlWithFallback = (imagePath, cloudFrontUrl, width = 200, height = 200, text = 'No Image') => {
  if (!imagePath) {
    return getPlaceholderImage(width, height, text);
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Clean the path - remove leading slash and public/ if present
  const cleanPath = imagePath.replace(/^(\/)?public\//, '');
  
  // Construct full URL
  if (cloudFrontUrl) {
    return `${cloudFrontUrl}/public/${cleanPath}`;
  }
  
  // Fallback to placeholder if no CloudFront URL
  return getPlaceholderImage(width, height, text);
};
