import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import configKeys from "../config/configKeys.js";

// Validate required environment variables
const validateCloudinaryConfig = () => {
  const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_SECRET_KEY'];
  const missing = required.filter(key => !configKeys[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required Cloudinary environment variables: ${missing.join(', ')}`);
  }
};

// Initialize Cloudinary with validation
try {
  validateCloudinaryConfig();
  cloudinary.config({
    cloud_name: configKeys.CLOUDINARY_CLOUD_NAME,
    api_key: configKeys.CLOUDINARY_API_KEY,
    api_secret: configKeys.CLOUDINARY_SECRET_KEY,
  });
} catch (error) {
  console.error('Cloudinary configuration error:', error.message);
  process.exit(1);
}

// File validation middleware
const fileFilter = (_req, file, cb) => {
  // Check MIME type
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/bmp',
    'image/tiff',
    'image/svg+xml',
    'image/webp',
    'image/heic'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`), false);
  }
};

// Upload configuration with different options
export const uploadImages = (type = 'general', options = {}) => {
  const {
    fieldName = 'images',
    multiple = true,
    maxCount = 10,
    maxSize = 10 * 1024 * 1024, // 10MB default
    folder = `${type}s`,
    transformation = [
      { width: 1200, height: 1200, crop: 'limit' },
      { quality: 'auto:good', fetch_format: 'auto' }
    ]
  } = options;

  const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
      // Sanitize filename
      const safeName = file.originalname
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .split('.')[0]
        .substring(0, 50); // Limit filename length
      
      return {
        folder,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "bmp", "tiff", "tif", "svg", "webp", "heic"],
        public_id: `${type}-${Date.now()}-${safeName}`,
        transformation,
        // Add user ID to metadata if available
        context: req.user ? `user_id=${req.user.id}` : undefined,
      };
    },
  });

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
      files: maxCount
    }
  });

  // Return appropriate multer method based on multiple flag
  if (multiple) {
    return upload.array(fieldName, maxCount);
  } else {
    return upload.single(fieldName);
  }
};

// Convenience methods for common use cases
export const uploadSingleImage = (fieldName = 'image', type = 'general') => {
  return uploadImages(type, { fieldName, multiple: false, maxCount: 1 });
};

export const uploadMultipleImages = (type = 'general') => {
  return uploadImages(type, { fieldName:'images', multiple: true, maxCount:10 });
};

// Error handling middleware for upload errors
export const handleUploadError = (error, _req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          status: false,
          message: 'File too large. Maximum size is 5MB.'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          status: false,
          message: 'Too many files. Maximum is 10 files.'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          status: false,
          message: error.message || 'Unexpected file field.'
        });
      default:
        return res.status(400).json({
          status: false,
          message: 'File upload error: ' + error.message
        });
    }
  }
  
  // Cloudinary specific errors
  if (error.message && error.message.includes('cloudinary')) {
    return res.status(500).json({
      status: false,
      message: 'Image upload service temporarily unavailable.'
    });
  }
  
  next(error);
};

// Utility function to delete images from Cloudinary
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Utility function to get image details
export const getImageDetails = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.error('Error getting image details from Cloudinary:', error);
    throw error;
  }
};
