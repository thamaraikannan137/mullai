import { useState } from 'react'
import type { StaticImageData } from 'next/image'

interface ImageSlotProps {
  src: string | StaticImageData
  alt: string
  className?: string
  placeholder?: string
}

export function ImageSlot({ src, alt, className = '', placeholder }: ImageSlotProps) {
  const [error, setError] = useState(false)
  const resolvedSrc = typeof src === 'string' ? src : src.src

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-green-dark/10 text-sm text-text-muted ${className}`}
      >
        {placeholder ?? alt}
      </div>
    )
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={`object-cover ${className}`}
      onError={() => setError(true)}
      loading="lazy"
    />
  )
}
