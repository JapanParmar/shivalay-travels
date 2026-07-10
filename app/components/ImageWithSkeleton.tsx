'use client';
import React, { useState, useEffect, useRef } from 'react';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperStyle?: React.CSSProperties;
}

export default function ImageWithSkeleton({ src, alt, className, style, wrapperStyle, ...props }: ImageWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Reset loaded state when src changes
    setLoaded(false);

    // Check if the image has already loaded (e.g. cached by browser)
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true);
    }
  }, [src]);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    // Resolve skeleton state on error so layout is never blocked
    setLoaded(true);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      background: 'rgba(255, 255, 255, 0.02)',
      ...wrapperStyle
    }}>
      {/* Shimmer Skeleton Loader */}
      {!loaded && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.01) 25%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.01) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.6s infinite linear',
          zIndex: 2,
        }} />
      )}

      {/* Actual Image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={className}
        style={{
          ...style,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
        {...props}
      />
    </div>
  );
}
