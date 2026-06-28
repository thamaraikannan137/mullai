import { useMemo } from 'react'
import { useAdminLanguage, type AdminLang } from '../context/AdminLanguageContext'

type S = { ta: string; en: string }

function pick<T extends Record<string, S>>(map: T, lang: AdminLang): { [K in keyof T]: string } {
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [k, v[lang]])) as {
    [K in keyof T]: string
  }
}

const common = {
  loading: { ta: 'ஏற்றுகிறது…', en: 'Loading…' },
  save: { ta: 'சேமி', en: 'Save' },
  add: { ta: 'சேர்', en: 'Add' },
  edit: { ta: 'திருத்து', en: 'Edit' },
  delete: { ta: 'நீக்கு', en: 'Delete' },
  approve: { ta: 'அங்கீகரி', en: 'Approve' },
  actions: { ta: 'செயல்', en: 'Actions' },
  name: { ta: 'பெயர்', en: 'Name' },
  fatherName: { ta: 'தந்தை பெயர்', en: "Father's name" },
  aadhaar: { ta: 'ஆதார்', en: 'Aadhaar' },
  email: { ta: 'மின்னஞ்சல்', en: 'Email' },
  village: { ta: 'ஊர்', en: 'Village' },
  phone: { ta: 'கைபேசி', en: 'Phone' },
  date: { ta: 'தேதி', en: 'Date' },
  status: { ta: 'நிலை', en: 'Status' },
  source: { ta: 'மூலம்', en: 'Source' },
  all: { ta: 'அனைத்தும்', en: 'All' },
  pending: { ta: 'நிலுவையில்', en: 'Pending' },
  approved: { ta: 'அங்கீகரித்தது', en: 'Approved' },
  archived: { ta: 'காப்பகம்', en: 'Archived' },
  manual: { ta: 'கைமுறை', en: 'Manual' },
  website: { ta: 'வலைத்தளம்', en: 'Website' },
  published: { ta: 'வெளியிடப்பட்டது', en: 'Published on public site' },
  preview: { ta: 'முன்னோட்டம்', en: 'Preview' },
  noResults: { ta: 'பதிவுகள் எதுவும் இல்லை', en: 'No registrations match this filter' },
  deleted: { ta: 'நீக்கப்பட்டது', en: 'Deleted' },
  saved: { ta: 'மாற்றங்கள் சேமிக்கப்பட்டன', en: 'Changes saved' },
  confirmDeleteMember: { ta: 'இந்த உறுப்பினர் பதிவை நீக்கவா?', en: 'Delete this member registration?' },
  confirmDeleteNews: { ta: 'இந்த செய்தியை நீக்கவா?', en: 'Delete this news post?' },
  confirmDeleteLeader: { ta: 'இந்த நிர்வாகியை நீக்கவா?', en: 'Delete this office bearer?' },
  confirmDeleteDemand: { ta: 'இந்த கோரிக்கையை நீக்கவா?', en: 'Delete this demand?' },
  viewAll: { ta: 'அனைத்தும் →', en: 'View all →' },
  feet: { ta: 'அடி', en: 'ft' },
} as const satisfies Record<string, S>

const members = {
  memberAdded: { ta: 'உறுப்பினர் சேர்க்கப்பட்டது', en: 'Member added' },
  memberUpdated: { ta: 'உறுப்பினர் புதுப்பிக்கப்பட்டது', en: 'Member updated' },
  memberApproved: { ta: 'உறுப்பினர் அங்கீகரிக்கப்பட்டார்', en: 'Member approved' },
  addMember: { ta: 'உறுப்பினர் சேர்', en: 'Add member' },
  editMember: { ta: 'உறுப்பினர் திருத்து', en: 'Edit member' },
  manualNote: {
    ta: 'இந்த உறுப்பினர் கைமுறையாக சேர்க்கப்படும் (மூலம்: கைமுறை)',
    en: 'This member will be added manually (source: Manual)',
  },
  rowsPerPage: { ta: 'வரிகள்', en: 'Rows' },
  showing: { ta: '{from}–{to} / {total} பதிவுகள்', en: 'Showing {from}–{to} of {total}' },
} as const satisfies Record<string, S>

const news = {
  newsAdded: { ta: 'செய்தி சேர்க்கப்பட்டது', en: 'News added' },
  newsUpdated: { ta: 'செய்தி புதுப்பிக்கப்பட்டது', en: 'News updated' },
  addNews: { ta: 'புதிய செய்தி', en: 'Add news' },
  editNews: { ta: 'திருத்து — செய்தி', en: 'Edit news' },
  tag: { ta: 'வகை', en: 'Tag' },
  tagEn: { ta: 'வகை (English)', en: 'Tag (English)' },
  title: { ta: 'தலைப்பு', en: 'Title' },
  titleEn: { ta: 'தலைப்பு (English)', en: 'Title (English)' },
  body: { ta: 'விவரம்', en: 'Body' },
  bodyEn: { ta: 'விவரம் (English)', en: 'Body (English)' },
  mediaType: { ta: 'ஊடக வகை', en: 'Media type' },
  image: { ta: 'படம்', en: 'Image' },
  youtube: { ta: 'YouTube', en: 'YouTube' },
  imageUrl: { ta: 'பட URL', en: 'Image URL' },
  youtubeUrl: { ta: 'YouTube இணைப்பு', en: 'YouTube link' },
  imagePreview: { ta: 'பட முன்னோட்டம்', en: 'Image preview' },
  youtubePreview: { ta: 'YouTube முன்னோட்டம்', en: 'YouTube preview' },
} as const satisfies Record<string, S>

const dashboard = {
  totalMembers: { ta: 'மொத்த உறுப்பினர்கள்', en: 'Total members' },
  pendingRegs: { ta: 'நிலுவையில் உள்ள பதிவுகள்', en: 'Pending approvals' },
  publishedNews: { ta: 'வெளியிட்ட செய்திகள்', en: 'Published news' },
  waterLevel: { ta: 'தற்போதைய நீர்மட்டம்', en: 'Current water level' },
  approvedCount: { ta: 'அங்கீகரித்தது', en: 'approved' },
  needsAttention: { ta: 'கவனம் தேவை', en: 'Needs attention' },
  done: { ta: 'முடிந்தது', en: 'Done' },
  active: { ta: 'செயலில்', en: 'Active' },
  rising: { ta: 'உயர்ந்து வருகிறது', en: 'Rising' },
  recentRegs: { ta: 'சமீபத்திய பதிவுகள்', en: 'Recent registrations' },
  noRegs: { ta: 'பதிவுகள் இல்லை', en: 'No registrations' },
  waterLevelTitle: { ta: 'நீர்மட்டம்', en: 'Water level' },
  updateWater: { ta: 'நீர்மட்டத்தைப் புதுப்பி →', en: 'Update water level →' },
  recentNews: { ta: 'சமீபத்திய செய்திகள்', en: 'Recent news' },
} as const satisfies Record<string, S>

const water = {
  livePreview: { ta: 'நேரடிக் காட்சி', en: 'Live preview' },
  currentFeet: { ta: 'தற்போதைய அடி', en: 'Current level (ft)' },
  targetLabel: { ta: 'இலக்கு', en: 'Target' },
  updateTitle: { ta: 'நீர்மட்டத் தகவலைப் புதுப்பிக்கவும்', en: 'Update water level' },
  updateDesc: {
    ta: 'பொது வலைதளத்தில் காட்டப்படும் அணை நீர்மட்டத்தை புதுப்பிக்கவும்',
    en: 'Update the dam water level shown on the public site',
  },
  current: { ta: 'தற்போதைய நீர்மட்டம் (அடி)', en: 'Current level (ft)' },
  target: { ta: 'இலக்கு நீர்மட்டம் (அடி)', en: 'Target level (ft)' },
  capacity: { ta: 'முழுக் கொள்ளளவு (அடி)', en: 'Full capacity (ft)' },
  trend: { ta: 'போக்கு', en: 'Trend' },
  rising: { ta: 'உயர்ந்து வருகிறது', en: 'Rising' },
  stable: { ta: 'நிலையாக உள்ளது', en: 'Stable' },
  falling: { ta: 'குறைந்து வருகிறது', en: 'Falling' },
  lastUpdated: { ta: 'புதுப்பித்த தேதி', en: 'Last updated' },
  saveChanges: { ta: 'மாற்றங்களைச் சேமி', en: 'Save changes' },
} as const satisfies Record<string, S>

const settings = {
  contactTitle: { ta: 'தொடர்பு விவரங்கள்', en: 'Contact details' },
  contactDesc: { ta: 'பொது வலைதளத்தில் காட்டப்படும் தொடர்பு விவரங்கள்', en: 'Contact details shown on the public site' },
  email: { ta: 'மின்னஞ்சல்', en: 'Email' },
  address: { ta: 'முகவரி', en: 'Address' },
  hours: { ta: 'அலுவலக நேரம்', en: 'Office hours' },
  orgTitle: { ta: 'அமைப்பு விவரம்', en: 'Organisation details' },
  orgDesc: { ta: 'சங்கத்தின் பெயர் மற்றும் குறிக்கோள்', en: 'Organisation name and tagline' },
  orgName: { ta: 'சங்கப் பெயர்', en: 'Organisation name' },
  tagline: { ta: 'குறிக்கோள் வாசகம்', en: 'Tagline' },
  infoNote: {
    ta: 'இங்கு செய்யும் மாற்றங்கள் பொது வலைதளத்தில் உடனடியாகப் பிரதிபலிக்கும்.',
    en: 'Changes made here will reflect on the public site immediately.',
  },
} as const satisfies Record<string, S>

const leaders = {
  leaderAdded: { ta: 'தலைவர் சேர்க்கப்பட்டது', en: 'Leader added' },
  leaderUpdated: { ta: 'தலைவர் புதுப்பிக்கப்பட்டது', en: 'Leader updated' },
  addLeader: { ta: 'தலைவர் சேர்', en: 'Add leader' },
  editPresident: { ta: 'தலைவர் திருத்து', en: 'Edit president' },
  editBearer: { ta: 'நிர்வாகி திருத்து', en: 'Edit office bearer' },
  presidency: { ta: 'தலைமை', en: 'President' },
  role: { ta: 'பதவி (தமிழ்)', en: 'Role (Tamil)' },
  roleEn: { ta: 'பதவி (English)', en: 'Role (English)' },
  nameEn: { ta: 'பெயர் (English)', en: 'Name (English)' },
  initial: { ta: 'சுருக்க எழுத்து', en: 'Initial' },
} as const satisfies Record<string, S>

const demands = {
  demandAdded: { ta: 'கோரிக்கை சேர்க்கப்பட்டது', en: 'Demand added' },
  demandUpdated: { ta: 'கோரிக்கை புதுப்பிக்கப்பட்டது', en: 'Demand updated' },
  addDemand: { ta: 'கோரிக்கை சேர்', en: 'Add demand' },
  editDemand: { ta: 'கோரிக்கை திருத்து', en: 'Edit demand' },
  number: { ta: 'எண்', en: 'No.' },
  demandTa: { ta: 'கோரிக்கை (தமிழ்)', en: 'Demand (Tamil)' },
  demandEn: { ta: 'கோரிக்கை (English)', en: 'Demand (English)' },
} as const satisfies Record<string, S>

export function useAdminT() {
  const { lang } = useAdminLanguage()

  return useMemo(
    () => ({
      lang,
      c: pick(common, lang),
      members: pick(members, lang),
      news: pick(news, lang),
      dashboard: pick(dashboard, lang),
      water: pick(water, lang),
      settings: pick(settings, lang),
      leaders: pick(leaders, lang),
      demands: pick(demands, lang),
    }),
    [lang],
  )
}

export function adminFormLabel(ta: string, en: string, lang: AdminLang) {
  return lang === 'ta' ? `${ta} · ${en}` : en
}
