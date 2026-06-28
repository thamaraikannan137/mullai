export interface PageMeta {
  ta: string
  en: string
  showSearch?: boolean
  searchPlaceholderTa?: string
  searchPlaceholderEn?: string
  showAdd?: boolean
  addLabel?: string
  addLabelEn?: string
  addTo?: string
}

export const pageMeta: Record<string, PageMeta> = {
  '/admin': { ta: 'முகப்பு', en: 'Dashboard Overview' },
  '/admin/members': {
    ta: 'உறுப்பினர்கள்',
    en: 'Member Registrations',
    showSearch: true,
    searchPlaceholderTa: 'பெயர் / தந்தை பெயர் / ஊர் / தொலைபேசி / ஆதார் / மின்னஞ்சல்...',
    searchPlaceholderEn: 'Search name / father / village / phone / Aadhaar / email...',
    showAdd: true,
    addLabel: 'உறுப்பினர் சேர்',
    addLabelEn: 'Add member',
    addTo: '/admin/members?add=1',
  },
  '/admin/submissions': {
    ta: 'உறுப்பினர்கள்',
    en: 'Member Registrations',
    showSearch: true,
    searchPlaceholderTa: 'பெயர் / தந்தை பெயர் / ஊர் / தொலைபேசி / ஆதார் / மின்னஞ்சல்...',
    searchPlaceholderEn: 'Search name / father / village / phone / Aadhaar / email...',
    showAdd: true,
    addLabel: 'உறுப்பினர் சேர்',
    addLabelEn: 'Add member',
    addTo: '/admin/members?add=1',
  },
  '/admin/news': {
    ta: 'செய்திகள் & அறிவிப்புகள்',
    en: 'News & Announcements',
    showAdd: true,
    addLabel: 'செய்தி சேர்',
    addLabelEn: 'Add news',
    addTo: '/admin/news?new=1',
  },
  '/admin/leaders': {
    ta: 'தலைவர்கள்',
    en: 'Leadership',
    showAdd: true,
    addLabel: 'தலைவர் சேர்',
    addLabelEn: 'Add leader',
    addTo: '/admin/leaders?add=1',
  },
  '/admin/demands': {
    ta: 'எங்கள் கோரிக்கைகள்',
    en: 'Our Demands',
    showAdd: true,
    addLabel: 'கோரிக்கை சேர்',
    addLabelEn: 'Add demand',
    addTo: '/admin/demands?add=1',
  },
  '/admin/content': { ta: 'பக்க உள்ளடக்கம்', en: 'Page Content' },
  '/admin/water': { ta: 'நீர்மட்ட நிலை', en: 'Water Level Status' },
  '/admin/settings': { ta: 'தொடர்பு & அமைப்பு', en: 'Contact & Settings' },
  '/admin/contact': { ta: 'தொடர்பு & அமைப்பு', en: 'Contact & Settings' },
}

export function getPageMeta(pathname: string): PageMeta {
  if (pathname.startsWith('/admin/news/')) {
    return pageMeta['/admin/news']
  }
  return pageMeta[pathname] ?? { ta: 'Admin', en: 'Admin Console' }
}
