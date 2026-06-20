import { useState } from 'react'

interface ImageSlotProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
}

export function ImageSlot({ src, alt, className = '', placeholder }: ImageSlotProps) {
  const [error, setError] = useState(false)

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
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
      onError={() => setError(true)}
      loading="lazy"
    />
  )
}
