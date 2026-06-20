export interface NavItem {
  ta: string
  href: string
}

export interface GaugeTick {
  label: string
  pos: string
  len: string
}

export interface Stat {
  value: string
  ta: string
}

export interface Leader {
  name: string
  role_ta: string
  role_en: string
  photo?: string
  initial?: string
}

export interface Demand {
  num: string
  ta: string
  en: string
}

export interface NewsItem {
  tag: string
  date: string
  ta: string
  body: string
  img: string
}

export interface ContactItem {
  label: string
  value: string
  icon: 'phone' | 'email' | 'location'
}

export const nav: NavItem[] = [
  { ta: 'முகப்பு', href: '#home' },
  { ta: 'சங்கம் பற்றி', href: '#about' },
  { ta: 'தலைவர்கள்', href: '#leaders' },
  { ta: 'கோரிக்கைகள்', href: '#demands' },
  { ta: 'செய்திகள்', href: '#news' },
  { ta: 'தொடர்பு', href: '#contact' },
]

export const districts = ['தேனி', 'மதுரை', 'சிவகங்கை', 'ராமநாதபுரம்', 'திண்டுக்கல்']

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

export const stats: Stat[] = [
  { value: '5', ta: 'பாசன மாவட்டங்கள்' },
  { value: '152 அடி', ta: 'கோரும் முழு நீர்மட்டம்' },
  { value: '1000+', ta: 'உறுப்பினர் விவசாயிகள்' },
  { value: '1895', ta: 'அணை அமைக்கப்பட்ட ஆண்டு' },
]

export const president: Leader = {
  name: 'மு. முருகன்',
  role_ta: 'தலைவர்',
  role_en: 'President',
  photo:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Paddy%20field%20in%20Theni%20district.jpg?width=1000',
}

export const bearers: Leader[] = [
  { name: 'பெயர் இங்கே', role_ta: 'செயலாளர்', role_en: 'Secretary', initial: 'செ' },
  { name: 'பெயர் இங்கே', role_ta: 'பொருளாளர்', role_en: 'Treasurer', initial: 'பொ' },
  { name: 'பெயர் இங்கே', role_ta: 'துணைத் தலைவர்', role_en: 'Vice President', initial: 'து' },
]

export const demands: Demand[] = [
  {
    num: '01',
    ta: 'முல்லைப் பெரியாறு அணையின் நீர்மட்டம் 152 அடியாக உயர்த்தப்பட வேண்டும்.',
    en: "Raise the dam's water level to the full 152 feet.",
  },
  {
    num: '02',
    ta: 'பாசனத் தேவைக்கேற்ப தண்ணீர் காலத்தோடு திறந்துவிடப்பட வேண்டும்.',
    en: 'Release irrigation water on time, as per cultivation needs.',
  },
  {
    num: '03',
    ta: 'பெரியாறு பாசனப் பகுதி விவசாயிகளின் நீர் உரிமை சட்டப்படி பாதுகாக்கப்பட வேண்டும்.',
    en: 'Legally protect the water rights of farmers in the command area.',
  },
  {
    num: '04',
    ta: 'அணையின் கட்டமைப்புப் பாதுகாப்பு தொடர்ந்து கண்காணிக்கப்பட வேண்டும்.',
    en: "Continuously monitor and ensure the dam's structural safety.",
  },
  {
    num: '05',
    ta: 'ஒருபோக விவசாயிகளுக்கு உரிய நஷ்டஈடு மற்றும் பயிர்க் காப்பீடு வழங்கப்பட வேண்டும்.',
    en: 'Provide fair compensation and crop insurance to single-crop farmers.',
  },
]

export const news: NewsItem[] = [
  {
    tag: 'போராட்டம்',
    date: 'ஜூன் 12, 2026',
    ta: 'நீர்மட்டக் கோரிக்கை வலியுறுத்தி தேனியில் மாபெரும் ஆர்ப்பாட்டம்',
    body: 'ஆயிரக்கணக்கான விவசாயிகள் கலந்துகொண்ட ஆர்ப்பாட்டத்தில் சங்கத்தின் ஐந்து கோரிக்கைகள் முன்வைக்கப்பட்டன.',
    img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mullaperiyar%20View.jpg?width=800',
  },
  {
    tag: 'கூட்டம்',
    date: 'மே 28, 2026',
    ta: 'ஐந்து மாவட்ட விவசாயப் பிரதிநிதிகள் ஒருங்கிணைப்புக் கூட்டம்',
    body: 'வரும் பாசன காலத்திற்கான திட்டமிடல் குறித்து பிரதிநிதிகள் கலந்தாய்வு செய்தனர்.',
    img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mullapperiyardam.jpg?width=800',
  },
  {
    tag: 'அறிவிப்பு',
    date: 'மே 10, 2026',
    ta: 'புதிய உறுப்பினர் பதிவு முகாம் — அனைத்து ஊராட்சிகளிலும்',
    body: 'ஒருபோக விவசாயிகள் இலவசமாக சங்க உறுப்பினராக பதிவு செய்துகொள்ளலாம்.',
    img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Paddy%20field%20in%20Theni%20district.jpg?width=800',
  },
]

export const contacts: ContactItem[] = [
  { icon: 'phone', label: 'கைபேசி / Phone', value: '+91 00000 00000' },
  { icon: 'email', label: 'மின்னஞ்சல் / Email', value: 'contact@mullaiperiyar.org' },
  {
    icon: 'location',
    label: 'முகவரி / Address',
    value: 'சங்க அலுவலகம், தேனி மாவட்டம், தமிழ்நாடு',
  },
]

export const images = {
  hero: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mullaperiyar%20View.jpg?width=1920',
  about:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Paddy%20field%20in%20Theni%20district.jpg?width=1200',
  join: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mullapperiyardam.jpg?width=1200',
}
