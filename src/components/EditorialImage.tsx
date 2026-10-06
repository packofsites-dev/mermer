import React, { useState } from 'react';

interface EditorialImageProps {
  src?: string;
  alt: string;
  aspectClass?: string;
  className?: string;
  imgClassName?: string;
  caption?: string;
  priority?: boolean;
}

export const EditorialImage: React.FC<EditorialImageProps> = ({
  src,
  alt,
  aspectClass = 'aspect-[16/9]',
  className = '',
  imgClassName = '',
  caption,
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);

  // If no image URL or image fails to load, do not render a broken image icon
  if (!src || src.trim().length === 0 || hasError) {
    return null;
  }

  return (
    <figure className={`group w-full overflow-hidden ${className}`}>
      <div
        className={`relative w-full overflow-hidden bg-charcoal/5 border hairline-border rounded-[2px] ${aspectClass}`}
      >
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading={priority ? 'eager' : 'lazy'}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.015] ${imgClassName}`}
        />
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-xs font-sans text-charcoal/65 tracking-[0.02em]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
