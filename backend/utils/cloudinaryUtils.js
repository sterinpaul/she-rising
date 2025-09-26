/**
 * Utility functions for Cloudinary URL handling
 */

/**
 * Fix SVG URLs from Cloudinary raw upload to be browser-displayable
 * @param {string} cloudinaryUrl - The original Cloudinary URL
 * @returns {string} - Browser-displayable URL
 */
export const fixSvgUrl = (cloudinaryUrl) => {
  if (!cloudinaryUrl) return cloudinaryUrl;
  
  // Check if it's a raw SVG upload
  if (cloudinaryUrl.includes('/raw/upload/')) {
    // If it doesn't already have .svg extension, add it
    if (!cloudinaryUrl.endsWith('.svg')) {
      // Check if the filename indicates it's an SVG
      if (cloudinaryUrl.includes('svg') || cloudinaryUrl.toLowerCase().includes('svg')) {
        return `${cloudinaryUrl}.svg`;
      }
    }
    
    // For raw SVG files, add proper headers via URL parameters
    if (cloudinaryUrl.includes('svg') || cloudinaryUrl.endsWith('.svg')) {
      const separator = cloudinaryUrl.includes('?') ? '&' : '?';
      return `${cloudinaryUrl}${separator}fl_attachment:false`;
    }
  }
  
  return cloudinaryUrl;
};

/**
 * Process an array of image URLs to fix SVG display issues
 * @param {string[]} imageUrls - Array of image URLs
 * @returns {string[]} - Array of processed URLs
 */
export const processImageUrls = (imageUrls) => {
  if (!Array.isArray(imageUrls)) return imageUrls;
  
  return imageUrls.map(url => fixSvgUrl(url));
};

/**
 * Process impact data to fix image URLs
 * @param {Object} impact - Impact object with images array
 * @returns {Object} - Impact object with processed image URLs
 */
export const processImpactImages = (impact) => {
  if (!impact) return impact;
  
  return {
    ...impact,
    images: impact.images ? processImageUrls(impact.images) : []
  };
};