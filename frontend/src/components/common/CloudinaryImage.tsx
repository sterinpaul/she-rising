import React, { useState, useEffect } from 'react';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

const CloudinaryImage: React.FC<CloudinaryImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  fallback = '/placeholder-image.svg' 
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // Reset states when src changes
    setImageSrc(src);
    setIsLoading(true);
    setError(false);
  }, [src]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
    
    // Try to fix SVG URLs that might be raw resources
    if (src.includes('/raw/upload/') && !src.includes('.svg')) {
      // Add .svg extension for raw SVG files
      const svgUrl = `${src}.svg`;
      setImageSrc(svgUrl);
      return;
    }
    
    // If it's already an SVG URL or other format, use fallback
    if (fallback) {
      setImageSrc(fallback);
    }
  };

  // For SVG files from raw upload, we might need to fetch and inline them
  const isSvgRaw = src.includes('/raw/upload/') && (src.includes('svg') || src.endsWith('.svg'));
  
  if (isSvgRaw) {
    return (
      <div className={`relative ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
        )}
        <img
          src={`${src}.svg`} // Ensure .svg extension
          alt={alt}
          className={className}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
      />
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500 text-xs">
          Failed to load
        </div>
      )}
    </div>
  );
};

export default CloudinaryImage;