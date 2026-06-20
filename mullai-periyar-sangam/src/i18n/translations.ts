export type Lang = 'ta' | 'en'

export interface NavItem {
  label: string
  href: string
}

export interface StatItem {
  value: string
  label: string
}

export interface DemandItem {
  num: string
  text: string
  sub?: string
}

export interface NewsItem {
  tag: string
  date: string
  title: string
  body: string
  img: string
}

export interface BearerItem {
  name: string
  role: string
  initial: string
}

export interface ContactItem {
  label: string
  value: string
  icon: 'phone' | 'email' | 'location'
}

export interface Translations {
  lang: Lang
  siteNameLines: string[]
  nav: NavItem[]
  joinCta: string
  menu: string
  switchLang: string
  scrollToTop: string

  hero: {
    titleLines: string[]
    subtitle: string
    description: string
    joinBtn: string
    demandsBtn: string
    districts: string[]
    stats: StatItem[]
    waterLevel: string
    carouselLabel: string
    prevSlide: string
    nextSlide: string
  }

  about: {
    sectionLabel: string
    titleLines: string[]
    p1: string
    p2: string
    stat1: string
    stat2: string
    badge: string
    imageAlt: string
  }

  quote: {
    text: string
    attribution: string
  }

  leaders: {
    sectionLabel: string
    presidentName: string
    presidentRoleShort: string
    quote: string
    p1: string
    presidentRole: string
    bearersTitle: string
    bearers: BearerItem[]
  }

  demands: {
    sectionLabel: string
    title: string
    intro: string
    items: DemandItem[]
  }

  news: {
    sectionLabel: string
    title: string
    items: NewsItem[]
  }

  join: {
    sectionLabel: string
    title: string
    description: string
    freeNote: string
    nameLabel: string
    namePlaceholder: string
    villageLabel: string
    villagePlaceholder: string
    phoneLabel: string
    phonePlaceholder: string
    submitBtn: string
    thanks: string
    thanksMsg: string
    defaultName: string
  }

  contact: {
    sectionLabel: string
    title: string
    description: string
    hours: string
    items: ContactItem[]
  }

  footer: {
    description: string
    pagesTitle: string
    districtsTitle: string
    districts: string[]
    copyright: string
    tagline: string
  }
}

export const translations: Record<Lang, Translations> = {
  ta: {
    lang: 'ta',
    siteNameLines: ['முல்லைப் பெரியாறு', 'ஒருபோக பாசன', 'விவசாயிகள் சங்கம்'],
    nav: [
      { label: 'முகப்பு', href: '#home' },
      { label: 'சங்கம் பற்றி', href: '#about' },
      { label: 'தலைவர்கள்', href: '#leaders' },
      { label: 'கோரிக்கைகள்', href: '#demands' },
      { label: 'செய்திகள்', href: '#news' },
      { label: 'தொடர்பு', href: '#contact' },
    ],
    joinCta: 'உறுப்பினராகுங்கள்',
    menu: 'மெனு',
    switchLang: 'English',
    scrollToTop: 'மேலே செல்',

    hero: {
      titleLines: ['முல்லைப் பெரியாறு', 'ஒருபோக பாசன', 'விவசாயிகள் சங்கம்'],
      subtitle: "Mullai Periyar Single-Crop Irrigation Farmers' Association",
      description:
        'பெரியாறு நீரை நம்பி வாழும் தென் தமிழ்நாட்டு விவசாயிகளின் உரிமைகளைப் பாதுகாக்கவும், நீர்மட்டக் கோரிக்கைகளை மக்களுக்கு எடுத்துச் செல்லவும் ஒன்றிணைந்த ஒற்றைக் குரல்.',
      joinBtn: 'உறுப்பினராகுங்கள் →',
      demandsBtn: 'எங்கள் கோரிக்கைகள்',
      districts: ['தேனி', 'மதுரை', 'சிவகங்கை', 'ராமநாதபுரம்', 'திண்டுக்கல்'],
      stats: [
        { value: '5', label: 'பாசன மாவட்டங்கள்' },
        { value: '152 அடி', label: 'கோரும் முழு நீர்மட்டம்' },
        { value: '1000+', label: 'உறுப்பினர் விவசாயிகள்' },
        { value: '1895', label: 'அணை அமைக்கப்பட்ட ஆண்டு' },
      ],
      waterLevel: '152 அடி',
      carouselLabel: 'முகப்பு படங்கள் மற்றும் வீடியோக்கள்',
      prevSlide: 'முந்தைய படம்',
      nextSlide: 'அடுத்த படம்',
    },

    about: {
      sectionLabel: 'About the Association',
      titleLines: ['மண்ணையும் நீரையும்', 'நேசிக்கும் சங்கம்'],
      p1: 'முல்லைப் பெரியாறு ஒருபோக பாசன விவசாயிகள் சங்கம், பெரியாறு அணையின் நீரை நம்பி ஒருபோக சாகுபடி செய்யும் தென் தமிழ்நாட்டு விவசாயிகளின் கூட்டமைப்பாகும். தண்ணீர் காலத்தோடு திறக்கப்படுவதையும், நீர்மட்டம் முழுமையாகப் பேணப்படுவதையும் உறுதிப்படுத்த இச்சங்கம் தொடர்ந்து குரல் கொடுத்து வருகிறது.',
      p2: 'அணைப் பாதுகாப்பு, நியாயமான நீர்ப்பகிர்வு, பாசனப் பகுதி விவசாயிகளின் வாழ்வாதாரம் — இவற்றை மையமாகக் கொண்டு போராட்டங்கள், கூட்டங்கள், விழிப்புணர்வுப் பணிகளை சங்கம் ஒருங்கிணைக்கிறது.',
      stat1: 'பயனடையும் மாவட்டங்கள்',
      stat2: 'கோரும் முழு நீர்மட்டம்',
      badge: 'பெரியாறு அணை அமைக்கப்பட்ட ஆண்டு',
      imageAlt: 'தேனி மாவட்ட வயல்வெளி',
    },

    quote: {
      text: 'நீர் என்பது எங்கள் தயவில் கிடைப்பதன்று — அது எங்கள் பிறப்புரிமை.',
      attribution: 'சங்கத்தின் கொள்கை',
    },

    leaders: {
      sectionLabel: 'Leadership',
      presidentName: 'மு. முருகன்',
      presidentRoleShort: 'தலைவர்',
      quote:
        'பெரியாறு நீர் எங்கள் மூதாதையர் உழைப்பின் பலன். அந்த நீரை, அதன் முழு உரிமையை, அடுத்த தலைமுறைக்குக் கடத்துவதே எங்கள் சங்கத்தின் கடமை.',
      p1: 'தேனி முதல் ராமநாதபுரம் வரை பரந்த ஐந்து மாவட்ட விவசாயிகளின் குரலாக, நீர்மட்டக் கோரிக்கையையும் அணைப் பாதுகாப்பையும் அரசின் கவனத்திற்கு இடைவிடாமல் எடுத்துச் செல்கிறோம்.',
      presidentRole: 'தலைவர், முல்லைப் பெரியாறு ஒருபோக பாசன விவசாயிகள் சங்கம்',
      bearersTitle: 'Office Bearers · நிர்வாகிகள்',
      bearers: [
        { name: 'பெயர் இங்கே', role: 'செயலாளர்', initial: 'செ' },
        { name: 'பெயர் இங்கே', role: 'பொருளாளர்', initial: 'பொ' },
        { name: 'பெயர் இங்கே', role: 'துணைத் தலைவர்', initial: 'து' },
      ],
    },

    demands: {
      sectionLabel: 'Our Demands',
      title: 'எங்கள் கோரிக்கைகள்',
      intro:
        'பெரியாறு பாசனப் பகுதி விவசாயிகளின் வாழ்வாதாரத்தை உறுதி செய்யும் முக்கியக் கோரிக்கைகள். இவற்றை அரசின் கவனத்திற்கு தொடர்ந்து எடுத்துச் செல்கிறோம்.',
      items: [
        {
          num: '01',
          text: 'முல்லைப் பெரியாறு அணையின் நீர்மட்டம் 152 அடியாக உயர்த்தப்பட வேண்டும்.',
          sub: "Raise the dam's water level to the full 152 feet.",
        },
        {
          num: '02',
          text: 'பாசனத் தேவைக்கேற்ப தண்ணீர் காலத்தோடு திறந்துவிடப்பட வேண்டும்.',
          sub: 'Release irrigation water on time, as per cultivation needs.',
        },
        {
          num: '03',
          text: 'பெரியாறு பாசனப் பகுதி விவசாயிகளின் நீர் உரிமை சட்டப்படி பாதுகாக்கப்பட வேண்டும்.',
          sub: 'Legally protect the water rights of farmers in the command area.',
        },
        {
          num: '04',
          text: 'அணையின் கட்டமைப்புப் பாதுகாப்பு தொடர்ந்து கண்காணிக்கப்பட வேண்டும்.',
          sub: "Continuously monitor and ensure the dam's structural safety.",
        },
        {
          num: '05',
          text: 'ஒருபோக விவசாயிகளுக்கு உரிய நஷ்டஈடு மற்றும் பயிர்க் காப்பீடு வழங்கப்பட வேண்டும்.',
          sub: 'Provide fair compensation and crop insurance to single-crop farmers.',
        },
      ],
    },

    news: {
      sectionLabel: 'News & Announcements',
      title: 'செய்திகள் & அறிவிப்புகள்',
      items: [
        {
          tag: 'போராட்டம்',
          date: 'ஜூன் 12, 2026',
          title: 'நீர்மட்டக் கோரிக்கை வலியுறுத்தி தேனியில் மாபெரும் ஆர்ப்பாட்டம்',
          body: 'ஆயிரக்கணக்கான விவசாயிகள் கலந்துகொண்ட ஆர்ப்பாட்டத்தில் சங்கத்தின் ஐந்து கோரிக்கைகள் முன்வைக்கப்பட்டன.',
          img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mullaperiyar%20View.jpg?width=800',
        },
        {
          tag: 'கூட்டம்',
          date: 'மே 28, 2026',
          title: 'ஐந்து மாவட்ட விவசாயப் பிரதிநிதிகள் ஒருங்கிணைப்புக் கூட்டம்',
          body: 'வரும் பாசன காலத்திற்கான திட்டமிடல் குறித்து பிரதிநிதிகள் கலந்தாய்வு செய்தனர்.',
          img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mullapperiyardam.jpg?width=800',
        },
        {
          tag: 'அறிவிப்பு',
          date: 'மே 10, 2026',
          title: 'புதிய உறுப்பினர் பதிவு முகாம் — அனைத்து ஊராட்சிகளிலும்',
          body: 'ஒருபோக விவசாயிகள் இலவசமாக சங்க உறுப்பினராக பதிவு செய்துகொள்ளலாம்.',
          img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Paddy%20field%20in%20Theni%20district.jpg?width=800',
        },
      ],
    },

    join: {
      sectionLabel: 'Become a Member',
      title: 'சங்கத்தில் இணையுங்கள்',
      description:
        'பெரியாறு பாசனப் பகுதி விவசாயிகளின் ஒற்றைக் குரலாக நாம் ஒன்றிணைவோம். உங்கள் விவரங்களைப் பதிவு செய்தால், சங்கத்தின் தொண்டர்கள் உங்களைத் தொடர்பு கொள்வார்கள்.',
      freeNote: 'உறுப்பினர் கட்டணம் முற்றிலும் இலவசம்',
      nameLabel: 'பெயர்',
      namePlaceholder: 'உங்கள் முழுப் பெயர்',
      villageLabel: 'ஊர்',
      villagePlaceholder: 'உங்கள் ஊர் / மாவட்டம்',
      phoneLabel: 'கைபேசி',
      phonePlaceholder: '+91 ',
      submitBtn: 'பதிவு செய்யுங்கள் →',
      thanks: 'நன்றி',
      thanksMsg:
        'உங்கள் பதிவு பெறப்பட்டது. சங்கத்தின் தொண்டர்கள் விரைவில் உங்களைத் தொடர்பு கொள்வார்கள்.',
      defaultName: 'நண்பரே',
    },

    contact: {
      sectionLabel: 'Get in Touch',
      title: 'தொடர்பு கொள்ள',
      description:
        'கோரிக்கைகள், உறுப்பினர் சேர்க்கை, நிகழ்வுத் தகவல்கள் — எதற்கும் சங்க அலுவலகத்தைத் தொடர்பு கொள்ளுங்கள். உங்கள் குரல் எங்கள் வலிமை.',
      hours: 'திங்கள் – சனி · காலை 10 – மாலை 6',
      items: [
        { icon: 'phone', label: 'கைபேசி', value: '+91 00000 00000' },
        { icon: 'email', label: 'மின்னஞ்சல்', value: 'contact@mullaiperiyar.org' },
        {
          icon: 'location',
          label: 'முகவரி',
          value: 'சங்க அலுவலகம், மேலூர், மதுரை மாவட்டம், தமிழ்நாடு',
        },
      ],
    },

    footer: {
      description:
        'பெரியாறு பாசனப் பகுதி விவசாயிகளின் உரிமைகளுக்கான ஒற்றைக் குரல். நீர், மண், வாழ்வாதாரம் — நம் உரிமை.',
      pagesTitle: 'பக்கங்கள்',
      districtsTitle: 'பாசன மாவட்டங்கள்',
      districts: ['தேனி', 'மதுரை', 'சிவகங்கை', 'ராமநாதபுரம்', 'திண்டுக்கல்'],
      copyright:
        '© 2026 முல்லைப் பெரியாறு ஒருபோக பாசன விவசாயிகள் சங்கம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
      tagline: 'நீர் நம் உரிமை',
    },
  },

  en: {
    lang: 'en',
    siteNameLines: ['Mullai Periyar', 'Single-Crop Irrigation', "Farmers' Association"],
    nav: [
      { label: 'Home', href: '#home' },
      { label: 'About', href: '#about' },
      { label: 'Leaders', href: '#leaders' },
      { label: 'Demands', href: '#demands' },
      { label: 'News', href: '#news' },
      { label: 'Contact', href: '#contact' },
    ],
    joinCta: 'Join Us',
    menu: 'Menu',
    switchLang: 'தமிழ்',
    scrollToTop: 'Scroll to top',

    hero: {
      titleLines: ['Mullai Periyar', 'Single-Crop Irrigation', "Farmers' Association"],
      subtitle: 'முல்லைப் பெரியாறு ஒருபோக பாசன விவசாயிகள் சங்கம்',
      description:
        'A united voice to protect the rights of South Tamil Nadu farmers who depend on Periyar water, and to carry water-level demands to the people.',
      joinBtn: 'Become a Member →',
      demandsBtn: 'Our Demands',
      districts: ['Theni', 'Madurai', 'Sivagangai', 'Ramanathapuram', 'Dindigul'],
      stats: [
        { value: '5', label: 'Irrigation Districts' },
        { value: '152 ft', label: 'Full Water Level Demanded' },
        { value: '1000+', label: 'Member Farmers' },
        { value: '1895', label: 'Dam Built' },
      ],
      waterLevel: '152 ft',
      carouselLabel: 'Hero images and videos',
      prevSlide: 'Previous slide',
      nextSlide: 'Next slide',
    },

    about: {
      sectionLabel: 'About the Association',
      titleLines: ['An Association', 'That Cherishes Land & Water'],
      p1: 'The Mullai Periyar Single-Crop Irrigation Farmers\' Association is a collective of South Tamil Nadu farmers who depend on Periyar dam water for single-crop cultivation. The association continues to advocate for timely water release and full maintenance of the water level.',
      p2: 'Centered on dam safety, fair water distribution, and the livelihood of command-area farmers, the association coordinates protests, meetings, and awareness campaigns.',
      stat1: 'Beneficiary Districts',
      stat2: 'Full Water Level Demanded',
      badge: 'Year Periyar Dam Was Built',
      imageAlt: 'Paddy field in Theni district',
    },

    quote: {
      text: 'Water is not a favour granted to us — it is our birthright.',
      attribution: 'Association Policy',
    },

    leaders: {
      sectionLabel: 'Leadership',
      presidentName: 'M. Murugan',
      presidentRoleShort: 'President',
      quote:
        'Periyar water is the fruit of our ancestors\' labour. Passing that water, with its full rights, to the next generation is our association\'s duty.',
      p1: 'As the voice of farmers across five districts from Theni to Ramanathapuram, we relentlessly bring water-level demands and dam safety to the government\'s attention.',
      presidentRole: "President, Mullai Periyar Single-Crop Irrigation Farmers' Association",
      bearersTitle: 'Office Bearers',
      bearers: [
        { name: 'Name Here', role: 'Secretary', initial: 'S' },
        { name: 'Name Here', role: 'Treasurer', initial: 'T' },
        { name: 'Name Here', role: 'Vice President', initial: 'V' },
      ],
    },

    demands: {
      sectionLabel: 'Our Demands',
      title: 'Our Demands',
      intro:
        'Key demands to secure the livelihood of farmers in the Periyar command area. We continuously raise these with the government.',
      items: [
        {
          num: '01',
          text: "Raise the Mullai Periyar dam's water level to the full 152 feet.",
        },
        {
          num: '02',
          text: 'Release irrigation water on time, as per cultivation needs.',
        },
        {
          num: '03',
          text: 'Legally protect the water rights of farmers in the command area.',
        },
        {
          num: '04',
          text: "Continuously monitor and ensure the dam's structural safety.",
        },
        {
          num: '05',
          text: 'Provide fair compensation and crop insurance to single-crop farmers.',
        },
      ],
    },

    news: {
      sectionLabel: 'News & Announcements',
      title: 'News & Announcements',
      items: [
        {
          tag: 'Protest',
          date: 'June 12, 2026',
          title: 'Mass rally in Theni demanding full water level',
          body: 'Thousands of farmers participated; all five association demands were raised.',
          img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mullaperiyar%20View.jpg?width=800',
        },
        {
          tag: 'Meeting',
          date: 'May 28, 2026',
          title: 'Five-district farmer representatives coordination meet',
          body: 'Representatives reviewed planning for the upcoming irrigation season.',
          img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mullapperiyardam.jpg?width=800',
        },
        {
          tag: 'Notice',
          date: 'May 10, 2026',
          title: 'New member registration camp — in all village panchayats',
          body: 'Single-crop farmers can register as association members free of charge.',
          img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Paddy%20field%20in%20Theni%20district.jpg?width=800',
        },
      ],
    },

    join: {
      sectionLabel: 'Become a Member',
      title: 'Join the Association',
      description:
        'Let us unite as the single voice of Periyar command-area farmers. Register your details and association volunteers will contact you.',
      freeNote: 'Membership is completely free',
      nameLabel: 'Name',
      namePlaceholder: 'Your full name',
      villageLabel: 'Village',
      villagePlaceholder: 'Your village / district',
      phoneLabel: 'Phone',
      phonePlaceholder: '+91 ',
      submitBtn: 'Register →',
      thanks: 'Thank you',
      thanksMsg:
        'Your registration has been received. Association volunteers will contact you shortly.',
      defaultName: 'friend',
    },

    contact: {
      sectionLabel: 'Get in Touch',
      title: 'Contact Us',
      description:
        'For demands, membership, or event information — contact the association office. Your voice is our strength.',
      hours: 'Mon – Sat · 10 AM – 6 PM',
      items: [
        { icon: 'phone', label: 'Phone', value: '+91 00000 00000' },
        { icon: 'email', label: 'Email', value: 'contact@mullaiperiyar.org' },
        {
          icon: 'location',
          label: 'Address',
          value: 'Association Office, Melur, Madurai District, Tamil Nadu',
        },
      ],
    },

    footer: {
      description:
        'The united voice for the rights of Periyar command-area farmers. Water, soil, livelihood — our right.',
      pagesTitle: 'Pages',
      districtsTitle: 'Irrigation Districts',
      districts: ['Theni', 'Madurai', 'Sivagangai', 'Ramanathapuram', 'Dindigul'],
      copyright:
        '© 2026 Mullai Periyar Single-Crop Irrigation Farmers\' Association. All rights reserved.',
      tagline: 'Water is our right',
    },
  },
}
