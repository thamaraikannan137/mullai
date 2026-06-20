interface LogoProps {
  variant?: 'header' | 'footer'
  size?: number
}

export function Logo({ variant = 'header', size = 48 }: LogoProps) {
  if (variant === 'footer') {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} className="block shrink-0" aria-hidden>
        <circle cx="50" cy="50" r="49" fill="#FBFCFA" />
        <circle cx="50" cy="50" r="48" fill="none" stroke="#E6B130" strokeWidth="2" />
        <path
          d="M50 22 C63 40 71 50 71 61 a21 21 0 1 1 -42 0 C29 50 37 40 50 22 Z"
          fill="#064E3B"
        />
        <path d="M50 72 C50 61 56 54 65 52 C63 62 57 69 50 72 Z" fill="#23C483" />
        <path d="M50 72 C50 61 44 54 35 52 C37 62 43 69 50 72 Z" fill="#4ADE80" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="block shrink-0" aria-hidden>
      <circle cx="50" cy="50" r="49" fill="#064E3B" />
      <circle cx="50" cy="50" r="48" fill="none" stroke="#E6B130" strokeWidth="2" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#E6B130" strokeWidth="0.8" opacity="0.5" />
      <path
        d="M50 22 C63 40 71 50 71 61 a21 21 0 1 1 -42 0 C29 50 37 40 50 22 Z"
        fill="#FBFCFA"
      />
      <path d="M50 72 C50 61 56 54 65 52 C63 62 57 69 50 72 Z" fill="#0E9F6E" />
      <path d="M50 72 C50 61 44 54 35 52 C37 62 43 69 50 72 Z" fill="#23C483" />
      <path d="M50 73 L50 50" stroke="#067A52" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
