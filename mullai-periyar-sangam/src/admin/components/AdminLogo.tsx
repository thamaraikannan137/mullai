export function AdminLogo({ size = 42 }: { size?: number }) {
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
