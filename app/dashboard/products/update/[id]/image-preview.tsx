'use client';

interface ImagePreviewProps {
  src: string;
  alt: string;
}

export default function ImagePreview({ src, alt }: ImagePreviewProps) {
  return (
    <img 
      src={src} 
      alt={alt} 
      className="h-full w-full object-cover"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = '/default-image.jpg';
      }}
    />
  );
}