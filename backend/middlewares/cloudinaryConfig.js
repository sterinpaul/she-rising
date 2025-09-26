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

// Enhanced file validation middleware
const fileFilter = (_req, file, cb) => {
  // Check MIME type
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/bmp',
    'image/tiff',
    'image/tif',
    'image/svg+xml',
    'image/webp',
    'image/heic',
    'image/gif'
  ];

  // Enhanced validation: check both MIME type and file extension
  const fileExtension = file.originalname.toLowerCase().split('.').pop();
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'tif', 'svg', 'webp', 'heic', 'gif'];

  const isMimeTypeValid = allowedMimeTypes.includes(file.mimetype);
  const isExtensionValid = allowedExtensions.includes(fileExtension || '');

  if (isMimeTypeValid || isExtensionValid) {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 
      `Invalid file type. File: ${file.originalname}, MIME: ${file.mimetype}, Extension: ${fileExtension}. Allowed types: ${allowedMimeTypes.join(', ')}`), false);
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
      
      // Determine resource type: SVG must use 'raw', others use 'image'
      const isSvg = file.mimetype === 'image/svg+xml' || file.originalname.toLowerCase().endsWith('.svg');
      const resourceType = isSvg ? "raw" : "image";
      
      const baseParams = {
        folder,
        resource_type: resourceType,
        public_id: `${type}-${Date.now()}-${safeName}`,
        // Add user ID to metadata if available
        context: req.user ? `user_id=${req.user.id}` : undefined,
      };

      // Only add format restrictions and transformations for non-SVG images
      if (!isSvg) {
        baseParams.allowed_formats = ["jpg", "jpeg", "png", "bmp", "tiff", "tif", "webp", "heic", "gif"];
        baseParams.transformation = transformation;
      } else {
        // For SVG files uploaded as raw, ensure proper content type
        baseParams.format = 'svg';
      }

      return baseParams;
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

// Enhanced error handling middleware for upload errors
export const handleUploadError = (error, req, res, next) => {
  console.error('Upload error encountered:', {
    errorType: error.constructor.name,
    errorCode: error.code,
    errorMessage: error.message,
    requestFiles: req.files ? req.files.length : 0,
    requestBody: Object.keys(req.body || {}),
    timestamp: new Date().toISOString()
  });

  if (error instanceof multer.MulterError) {
    console.error('Multer error details:', {
      code: error.code,
      field: error.field,
      message: error.message,
      stack: error.stack
    });

    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          status: false,
          message: 'File too large. Maximum size is 10MB.',
          error: 'FILE_SIZE_LIMIT'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          status: false,
          message: 'Too many files. Maximum is 10 files.',
          error: 'FILE_COUNT_LIMIT'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          status: false,
          message: error.message || 'Unexpected file field or invalid file type.',
          error: 'INVALID_FILE_TYPE',
          details: error.message
        });
      default:
        return res.status(400).json({
          status: false,
          message: 'File upload error: ' + error.message,
          error: 'UPLOAD_ERROR',
          code: error.code
        });
    }
  }
  
  // Cloudinary specific errors
  if (error.message && error.message.includes('cloudinary')) {
    console.error('Cloudinary error:', error);
    return res.status(500).json({
      status: false,
      message: 'Image upload service temporarily unavailable.',
      error: 'CLOUDINARY_ERROR'
    });
  }

  // Generic error handling
  console.error('Unhandled upload error:', error);
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
