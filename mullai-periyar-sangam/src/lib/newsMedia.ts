export type NewsMediaType = 'image' | 'youtube'

export function parseYouTubeId(url: string): string | null {
  const trimmed = url.trim()
  if (!trimmed) return null

  try {
    const u = new URL(trimmed)
    const host = u.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return u.pathname.slice(1).split('/')[0] || null
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (u.pathname.startsWith('/embed/')) {
        return u.pathname.split('/')[2] || null
      }
      if (u.pathname.startsWith('/shorts/')) {
        return u.pathname.split('/')[2] || null
      }
      return u.searchParams.get('v')
    }
  } catch {
    return null
  }

  return null
}

export function youtubeEmbedUrl(url: string): string | null {
  const id = parseYouTubeId(url)
  return id ? `https://www.youtube.com/embed/${id}` : null
}

export function youtubeThumbnailUrl(url: string): string | null {
  const id = parseYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}
