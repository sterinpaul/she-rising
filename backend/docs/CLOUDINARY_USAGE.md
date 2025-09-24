# Cloudinary Image Upload - Usage Guide

## Overview

The enhanced Cloudinary configuration provides secure, robust image upload functionality with comprehensive error handling, file validation, and optimization features.

## Features

- ✅ **File Type Validation**: Supports JPEG, PNG, WebP, SVG, BMP, TIFF, HEIC
- ✅ **File Size Limits**: Configurable (default: 5MB per file)
- ✅ **Security**: MIME type validation and filename sanitization
- ✅ **Image Optimization**: Automatic compression and format optimization
- ✅ **Error Handling**: Comprehensive error messages and handling
- ✅ **Flexible Configuration**: Single/multiple uploads with custom options
- ✅ **Cloud Storage**: Organized folder structure in Cloudinary

## Setup

### 1. Environment Variables

Ensure these variables are set in your `.env` file:

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_SECRET_KEY=your_secret_key_here
```

### 2. Import the Middleware

```javascript
import { 
  uploadImages,
  uploadSingleImage,
  uploadMultipleImages,
  handleUploadError,
  deleteImage,
  getImageDetails
} from '../middlewares/cloudinaryConfig.js';
```

## Usage Examples

### 1. Basic Multiple Image Upload

```javascript
import express from 'express';
import { uploadMultipleImages, handleUploadError } from '../middlewares/cloudinaryConfig.js';

const router = express.Router();

router.post('/upload-gallery', 
  uploadMultipleImages('images', 'gallery', 5), // Field name, type, max count
  handleUploadError, // Error handling middleware
  (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          status: false,
          message: 'No images uploaded'
        });
      }

      const uploadedImages = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        originalName: file.originalname
      }));

      res.status(200).json({
        status: true,
        message: 'Images uploaded successfully',
        data: { images: uploadedImages }
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Upload processing failed'
      });
    }
  }
);
```

### 2. Single Image Upload (Profile Picture)

```javascript
router.post('/upload-profile',
  uploadSingleImage('profilePicture', 'profile'),
  handleUploadError,
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: false,
          message: 'No profile picture uploaded'
        });
      }

      const profileImage = {
        url: req.file.path,
        publicId: req.file.filename
      };

      res.status(200).json({
        status: true,
        message: 'Profile picture uploaded successfully',
        data: { profileImage }
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Profile upload failed'
      });
    }
  }
);
```

### 3. Custom Configuration Upload

```javascript
router.post('/upload-articles',
  uploadImages('article', {
    fieldName: 'articleImages',
    multiple: true,
    maxCount: 3,
    maxSize: 2 * 1024 * 1024, // 2MB limit
    folder: 'articles',
    transformation: [
      { width: 800, height: 600, crop: 'fill' },
      { quality: 'auto:best' }
    ]
  }),
  handleUploadError,
  (req, res) => {
    // Handle upload response
    res.json({
      status: true,
      images: req.files.map(file => ({
        url: file.path,
        publicId: file.filename
      }))
    });
  }
);
```

### 4. Article Upload with Image Management

```javascript
import { uploadMultipleImages, handleUploadError, deleteImage } from '../middlewares/cloudinaryConfig.js';

// Create article with images
router.post('/articles',
  uploadMultipleImages('images', 'article', 5),
  handleUploadError,
  async (req, res) => {
    try {
      const { title, content, author, category } = req.body;
      
      // Process uploaded images
      const images = req.files ? req.files.map(file => file.path) : [];
      
      // Create article in database
      const article = new Article({
        title,
        content,
        author,
        category,
        images
      });
      
      await article.save();
      
      res.status(201).json({
        status: true,
        message: 'Article created successfully',
        data: article
      });
    } catch (error) {
      // If database save fails, cleanup uploaded images
      if (req.files) {
        for (const file of req.files) {
          try {
            await deleteImage(file.filename);
          } catch (deleteError) {
            console.error('Failed to cleanup image:', deleteError);
          }
        }
      }
      
      res.status(500).json({
        status: false,
        message: 'Article creation failed'
      });
    }
  }
);

// Update article and manage images
router.put('/articles/:id',
  uploadMultipleImages('newImages', 'article', 3),
  handleUploadError,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, removeImages } = req.body;
      
      const article = await Article.findById(id);
      if (!article) {
        return res.status(404).json({
          status: false,
          message: 'Article not found'
        });
      }
      
      // Remove specified images
      if (removeImages && removeImages.length > 0) {
        for (const imageUrl of removeImages) {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          try {
            await deleteImage(publicId);
            article.images = article.images.filter(img => img !== imageUrl);
          } catch (error) {
            console.error('Failed to delete image:', error);
          }
        }
      }
      
      // Add new images
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => file.path);
        article.images.push(...newImages);
      }
      
      // Update article
      article.title = title || article.title;
      article.content = content || article.content;
      
      await article.save();
      
      res.json({
        status: true,
        message: 'Article updated successfully',
        data: article
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Article update failed'
      });
    }
  }
);
```

### 5. Image Management Utilities

```javascript
// Delete image
router.delete('/images/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await deleteImage(publicId);
    
    res.json({
      status: true,
      message: 'Image deleted successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to delete image'
    });
  }
});

// Get image details
router.get('/images/:publicId/details', async (req, res) => {
  try {
    const { publicId } = req.params;
    const details = await getImageDetails(publicId);
    
    res.json({
      status: true,
      data: details
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: 'Image not found'
    });
  }
});
```

## Configuration Options

### uploadImages(type, options)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `fieldName` | string | 'images' | HTML form field name |
| `multiple` | boolean | true | Allow multiple files |
| `maxCount` | number | 10 | Maximum number of files |
| `maxSize` | number | 5MB | Maximum file size in bytes |
| `folder` | string | `${type}s` | Cloudinary folder name |
| `transformation` | array | Auto optimization | Image transformation rules |

### Default Transformations

```javascript
[
  { width: 1200, height: 1200, crop: 'limit' },
  { quality: 'auto:good', fetch_format: 'auto' }
]
```

## Error Handling

The middleware provides detailed error messages for common scenarios:

- **File too large**: "File too large. Maximum size is 5MB."
- **Too many files**: "Too many files. Maximum is 10 files."
- **Invalid file type**: "Invalid file type. Allowed types: image/jpeg, image/png..."
- **Upload service error**: "Image upload service temporarily unavailable."

## Security Features

1. **MIME Type Validation**: Only allows image file types
2. **File Size Limits**: Prevents large file uploads
3. **Filename Sanitization**: Removes special characters
4. **Environment Validation**: Checks required config on startup

## Frontend Integration

### HTML Form Example

```html
<form enctype="multipart/form-data">
  <input type="file" name="images" multiple accept="image/*">
  <button type="submit">Upload Images</button>
</form>
```

### JavaScript Fetch Example

```javascript
const uploadImages = async (files) => {
  const formData = new FormData();
  
  // Add multiple files
  for (let i = 0; i < files.length; i++) {
    formData.append('images', files[i]);
  }
  
  try {
    const response = await fetch('/api/upload-gallery', {
      method: 'POST',
      body: formData,
      credentials: 'include' // For cookie-based auth
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};
```

## Best Practices

1. **Always use the error handling middleware** after upload middleware
2. **Cleanup failed uploads** in your route handlers
3. **Validate uploaded images** in your business logic
4. **Store only the URLs** in your database, not the files
5. **Use appropriate transformations** for your use case
6. **Implement rate limiting** for upload endpoints
7. **Log upload activities** for monitoring

## Troubleshooting

### Common Issues

1. **"Missing required Cloudinary environment variables"**
   - Ensure all Cloudinary environment variables are set in `.env`

2. **"File too large" errors**
   - Adjust `maxSize` option or compress images before upload

3. **Upload fails silently**
   - Check that `handleUploadError` middleware is used
   - Verify Cloudinary credentials are correct

4. **Images not showing**
   - Verify the image URLs returned from Cloudinary
   - Check browser network tab for failed requests

### Debug Mode

Add logging to troubleshoot upload issues:

```javascript
router.post('/debug-upload',
  (req, res, next) => {
    console.log('Upload request received');
    next();
  },
  uploadMultipleImages('images', 'debug'),
  (req, res, next) => {
    console.log('Files processed:', req.files?.length || 0);
    next();
  },
  handleUploadError,
  (req, res) => {
    console.log('Upload completed successfully');
    res.json({ success: true, files: req.files });
  }
);
```