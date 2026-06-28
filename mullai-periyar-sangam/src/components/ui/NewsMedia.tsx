import { ImageSlot } from './ImageSlot'
import { youtubeEmbedUrl } from '../../lib/newsMedia'
import type { NewsMediaType } from '../../lib/newsMedia'

interface NewsMediaProps {
  mediaType?: NewsMediaType
  src: string
  title: string
  className?: string
}

export function NewsMedia({ mediaType = 'image', src, title, className = 'h-[180px] w-full' }: NewsMediaProps) {
  if (mediaType === 'youtube' && src) {
    const embed = youtubeEmbedUrl(src)
    if (embed) {
      return (
        <div className={`relative overflow-hidden bg-[#0a0a0a] ${className}`}>
          <iframe
            src={embed}
            title={title}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      )
    }
  }

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-[radial-gradient(120%_150%_at_80%_0%,#0A8A5C,#064E3B)] ${className}`}
      />
    )
  }

  return <ImageSlot src={src} alt={title} className={className} />
}
