export interface HeroSlide {
  type: 'image' | 'video'
  src: string
  poster?: string
  alt: string
}

export const heroSlides: HeroSlide[] = [
  {
    type: 'image',
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mullaperiyar%20View.jpg?width=1920',
    alt: 'முல்லைப் பெரியாறு அணைக் காட்சி',
  },
  {
    type: 'image',
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mullapperiyardam.jpg?width=1920',
    alt: 'முல்லைப் பெரியாறு அணை',
  },
  {
    type: 'image',
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Paddy%20field%20in%20Theni%20district.jpg?width=1920',
    alt: 'தேனி மாவட்ட வயல்வெளி',
  },
  {
    type: 'video',
    src: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/1/1d/Mullaperiyar.ogv/Mullaperiyar.ogv.360p.webm',
    poster:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Mullapperiyardam.jpg?width=1920',
    alt: 'முல்லைப் பெரியாறு அணை வீடியோ',
  },
]
