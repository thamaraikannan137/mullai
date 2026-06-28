import presidentPhoto from '../assets/Screenshot 2026-06-21 at 12.28.07\u202fAM.png'

export interface GaugeTick {
  label: string
  pos: string
  len: string
}

export const gaugeTicks: GaugeTick[] = [
  { label: '152', pos: '85%', len: '18px' },
  { label: '130', pos: '72%', len: '10px' },
  { label: '120', pos: '66%', len: '14px' },
  { label: '100', pos: '55%', len: '10px' },
  { label: '80', pos: '44%', len: '14px' },
  { label: '60', pos: '33%', len: '10px' },
  { label: '40', pos: '22%', len: '14px' },
  { label: '20', pos: '11%', len: '10px' },
  { label: '0', pos: '0%', len: '18px' },
]

export const president = {
  photo: typeof presidentPhoto === 'string' ? presidentPhoto : presidentPhoto.src,
}

export const images = {
  about:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Paddy%20field%20in%20Theni%20district.jpg?width=1200',
  join: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mullapperiyardam.jpg?width=1200',
}
