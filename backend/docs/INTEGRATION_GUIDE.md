# Cloudinary Integration Guide

## Quick Setup

### 1. Add Upload Routes to Your Server

In your main server file (e.g., `index.js` or `app.js`), add the upload routes:

```javascript
import uploadRoutes from './routes/uploadRoutes.js';

// Add this after your existing routes
app.use('/api/upload', uploadRoutes);

// Make sure to add the error handling middleware after all routes
app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      status: false,
      message: 'Invalid JSON format'
    });
  }
  
  console.error('Server Error:', error);
  res.status(500).json({
    status: false,
    message: 'Internal server error'
  });
});
```

### 2. Available Endpoints

After integration, these endpoints will be available:

- `POST /api/upload/articles/images` - Upload article images (max 5)
- `POST /api/upload/impacts/images` - Upload impact images (max 3)  
- `POST /api/upload/profile/image` - Upload single profile image
- `DELETE /api/upload/images/:publicId` - Delete image by public ID
- `GET /api/upload/stats` - Get upload statistics (admin)

### 3. Environment Variables Required

Ensure these are set in your `.env` file:

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_SECRET_KEY=your_secret_key_here
```

### 4. Testing the Integration

Use curl or Postman to test:

```bash
# Upload article images
curl -X POST \
  -H "Cookie: authToken=your_jwt_token" \
  -F "images=@image1.jpg" \
  -F "images=@image2.png" \
  http://localhost:2025/api/upload/articles/images

# Delete an image
curl -X DELETE \
  -H "Cookie: authToken=your_jwt_token" \
  http://localhost:2025/api/upload/images/article-1234567890-sample
```

## Security Checklist

- ✅ All upload endpoints require authentication
- ✅ File type validation (images only)
- ✅ File size limits (5MB default)
- ✅ Filename sanitization
- ✅ Error handling for malicious uploads
- ✅ Environment variable validation

## Performance Considerations

- Images are automatically optimized by Cloudinary
- Default transformations reduce file size while maintaining quality
- CDN delivery for fast image loading
- Folder organization prevents storage chaos

## Monitoring

Monitor your Cloudinary usage at: https://cloudinary.com/console

Key metrics to watch:
- Storage usage
- Bandwidth consumption  
- Transformation credits
- API request limits