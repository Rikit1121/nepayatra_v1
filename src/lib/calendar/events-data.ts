import type { CalendarEvent } from '@/lib/supabase/types'

export interface FestivalGuide {
  slug: string
  name: string
  nepaliName: string
  category: 'major_festival' | 'cultural_spectacle' | 'religious_pilgrimage'
  heroImage?: string
  dates: {
    year2026: {
      ad: string
      bs: string
      durationDays: number
      mainDay: string
    }
    year2025: {
      ad: string
      bs: string
      durationDays: number
      mainDay: string
    }
  }
  tagline: string
  significance: string
  culturalPractices: string[]
  travelImpact: {
    crowdLevel: 'Extreme' | 'High' | 'Moderate' | 'Low'
    closureWarning: string
    transportAdvice: string
    lodgingAdvice: string
  }
  bestDestinations: {
    slug: string
    name: string
    whyVisit: string
  }[]
  faqs: {
    question: string
    answer: string
  }[]
}

export const VERIFIED_CALENDAR_EVENTS_2026: CalendarEvent[] = [
  {
    id: 'cal-2026-maghe-sankranti',
    slug: 'maghe-sankranti-2026',
    title: 'Maghe Sankranti 2026',
    nepali_title: 'माघे संक्रान्ति २०८२',
    event_type: 'festival',
    start_date_ad: '2026-01-15',
    end_date_ad: '2026-01-15',
    start_date_bs: '2082-10-01',
    end_date_bs: '2082-10-01',
    year_ad: 2026,
    year_bs: 2082,
    is_public_holiday: true,
    summary: 'Winter solstice harvest festival marking the sun’s transit into Makara (Capricorn). Sacred river bathing and traditional sesame sweets.',
    description: 'Maghe Sankranti is celebrated with holy dips at sacred river confluences (Devghat in Chitwan, Ridi, Shankhamul in Patan). Tharu communities celebrate Maghi as their biggest new year festival.',
    travel_impact: 'Devghat (Chitwan) draws over 100,000 pilgrims. Highways to Chitwan see dense pilgrim traffic.',
    recommended_destinations: ['chitwan', 'kathmandu', 'pokhara'],
    featured: false,
    public_visible: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cal-2026-maha-shivaratri',
    slug: 'maha-shivaratri-2026',
    title: 'Maha Shivaratri 2026',
    nepali_title: 'महाशिवरात्रि २०८२',
    event_type: 'festival',
    start_date_ad: '2026-02-15',
    end_date_ad: '2026-02-15',
    start_date_bs: '2082-11-03',
    end_date_bs: '2082-11-03',
    year_ad: 2026,
    year_bs: 2082,
    is_public_holiday: true,
    summary: 'The Great Night of Lord Shiva. Hundreds of thousands of sadhus and pilgrims gather at sacred Pashupatinath Temple.',
    description: 'One of the most intense spiritual spectacles in South Asia. Holy men (Sadhus) with ash-covered bodies and long dreadlocks gather around sacred bonfires along the Bagmati River.',
    travel_impact: 'Massive pedestrian congestion around Pashupatinath and Gaushala. Airport road traffic diverted.',
    recommended_destinations: ['kathmandu', 'pashupatinath'],
    featured: true,
    public_visible: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cal-2026-holi',
    slug: 'holi-2026',
    title: 'Holi (Fagu Purnima) 2026',
    nepali_title: 'होली / फागु पूर्णिमा २०८२',
    event_type: 'festival',
    start_date_ad: '2026-03-03',
    end_date_ad: '2026-03-04',
    start_date_bs: '2082-11-19',
    end_date_bs: '2082-11-20',
    year_ad: 2026,
    year_bs: 2082,
    is_public_holiday: true,
    summary: 'Festival of colours welcoming spring. Celebrated March 3 in hilly areas (Kathmandu, Pokhara) and March 4 in the Terai.',
    description: 'Locals and international visitors celebrate in Kathmandu Durbar Square and Pokhara Lakeside with vibrant organic powders, water balloons (lolas), and music.',
    travel_impact: 'City traffic pauses until late afternoon. Protect cameras and phones in waterproof bags.',
    recommended_destinations: ['kathmandu', 'pokhara', 'janakpur'],
    featured: true,
    public_visible: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cal-2026-nepali-new-year',
    slug: 'nepali-new-year-2083',
    title: 'Nepali New Year 2083',
    nepali_title: 'नयाँ वर्ष २०८३ (नव वर्ष)',
    event_type: 'public_holiday',
    start_date_ad: '2026-04-14',
    end_date_ad: '2026-04-14',
    start_date_bs: '2083-01-01',
    end_date_bs: '2083-01-01',
    year_ad: 2026,
    year_bs: 2083,
    is_public_holiday: true,
    summary: 'Official first day of Bikram Sambat 2083 (Baishakh 1). Grand Bisket Jatra chariot festival in Bhaktapur.',
    description: 'Baishakh 1 marks the official start of the Nepalese calendar. In Bhaktapur, huge wooden chariots of Bhairava and Bhadrakali are pulled in an epic tug-of-war.',
    travel_impact: 'Public holiday. Bhaktapur streets are packed with thousands of spectators.',
    recommended_destinations: ['bhaktapur', 'kathmandu', 'pokhara'],
    featured: true,
    public_visible: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cal-2026-buddha-jayanti',
    slug: 'buddha-jayanti-2026',
    title: 'Buddha Jayanti 2026',
    nepali_title: 'बुद्ध जयन्ती २०८३',
    event_type: 'festival',
    start_date_ad: '2026-05-01',
    end_date_ad: '2026-05-01',
    start_date_bs: '2083-01-18',
    end_date_bs: '2083-01-18',
    year_ad: 2026,
    year_bs: 2083,
    is_public_holiday: true,
    summary: 'Birth, enlightenment, and nirvana of Lord Buddha. Major ceremonies in Lumbini, Boudhanath, and Swayambhunath.',
    description: 'International Buddhist delegations and pilgrims chant prayers at the Mayadevi Temple in Lumbini (Buddha’s birthplace). Boudhanath stupa is adorned with thousands of butter lamps.',
    travel_impact: 'High pilgrimage footfall in Lumbini and Kathmandu stupas. Peaceful, respectful atmosphere.',
    recommended_destinations: ['lumbini', 'kathmandu', 'boudhanath'],
    featured: true,
    public_visible: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cal-2026-teej',
    slug: 'teej-2026',
    title: 'Haritalika Teej 2026',
    nepali_title: 'हरितालिका तीज २०८३',
    event_type: 'festival',
    start_date_ad: '2026-09-14',
    end_date_ad: '2026-09-14',
    start_date_bs: '2083-05-29',
    end_date_bs: '2083-05-29',
    year_ad: 2026,
    year_bs: 2083,
    is_public_holiday: true,
    summary: 'Hindu women’s festival of fasting, red sarees, and joyous temple courtyard dancing in honor of Shiva & Parvati.',
    description: 'Tens of thousands of women dressed in brilliant red sarees gather at Pashupatinath Temple to sing and dance traditional folk songs from dawn until midnight.',
    travel_impact: 'Temple areas crowded with women devotees; streets around Pashupatinath closed to vehicles.',
    recommended_destinations: ['kathmandu', 'pokhara'],
    featured: false,
    public_visible: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cal-2026-constitution-day',
    slug: 'constitution-day-2026',
    title: 'National Constitution Day 2026',
    nepali_title: 'संविधान दिवस २०८३',
    event_type: 'national_day',
    start_date_ad: '2026-09-19',
    end_date_ad: '2026-09-19',
    start_date_bs: '2083-06-03',
    end_date_bs: '2083-06-03',
    year_ad: 2026,
    year_bs: 2083,
    is_public_holiday: true,
    summary: 'National Day celebrating Nepal’s democratic constitution of 2015 with civic ceremonies and monuments lit in national colors.',
    description: 'Parades at Tundikhel and illuminated historic squares across Kathmandu.',
    travel_impact: 'Government offices closed. Tourist travel, hotels, and intercity buses operate normally.',
    recommended_destinations: ['kathmandu'],
    featured: false,
    public_visible: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cal-2026-indra-jatra',
    slug: 'indra-jatra-2026',
    title: 'Indra Jatra 2026',
    nepali_title: 'इन्द्रजात्रा २०८३',
    event_type: 'cultural_event',
    start_date_ad: '2026-09-25',
    end_date_ad: '2026-09-25',
    start_date_bs: '2083-06-09',
    end_date_bs: '2083-06-09',
    year_ad: 2026,
    year_bs: 2083,
    is_public_holiday: true,
    summary: 'Kathmandu’s premier street festival featuring chariot processions of the Living Goddess (Kumari) and masked Lakhey dances.',
    description: 'Over 8 days, historic Kathmandu turns into an open-air theater with the Kumari chariot pulling, masked dancers, and the display of the massive Sweta Bhairab mask.',
    travel_impact: 'Historic core of Kathmandu closed to vehicular traffic; outstanding cultural photography.',
    recommended_destinations: ['kathmandu'],
    featured: true,
    public_visible: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cal-2026-dashain',
    slug: 'dashain-2026',
    title: 'Dashain Festival 2026',
    nepali_title: 'दशैं / बडा दशैं २०८३',
    event_type: 'festival',
    start_date_ad: '2026-10-11',
    end_date_ad: '2026-10-20',
    start_date_bs: '2083-06-25',
    end_date_bs: '2083-07-04',
    year_ad: 2026,
    year_bs: 2083,
    is_public_holiday: true,
    summary: 'Nepal’s longest and most auspicious festival celebrating the victory of Goddess Durga. Vijaya Dashami is on October 20, 2026.',
    description: 'Families gather across Nepal for blessings, tika, jamara, flying kites, and swinging on high bamboo swings (ping).',
    travel_impact: 'Massive exodus from Kathmandu to villages. Buses book out weeks early; advance flight and hotel bookings essential. Kathmandu city is delightfully quiet during the peak 3 days.',
    recommended_destinations: ['kathmandu', 'pokhara', 'bhaktapur'],
    featured: true,
    public_visible: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cal-2026-tihar',
    slug: 'tihar-2026',
    title: 'Tihar (Deepawali) 2026',
    nepali_title: 'तिहार / दीपावली २०८३',
    event_type: 'festival',
    start_date_ad: '2026-11-08',
    end_date_ad: '2026-11-12',
    start_date_bs: '2083-07-23',
    end_date_bs: '2083-07-27',
    year_ad: 2026,
    year_bs: 2083,
    is_public_holiday: true,
    summary: '5-day Festival of Lights honouring crows, dogs, cows, Laxmi, and the brother-sister bond (Bhai Tika on Nov 12).',
    description: 'Every home and street glows with clay lamps, marigold garlands, and colourful rangoli. Children sing traditional Deusi-Bhailo door to door.',
    travel_impact: 'Warm and welcoming for international tourists. Evenings in Thamel and Lakeside Pokhara are breathtakingly illuminated.',
    recommended_destinations: ['kathmandu', 'pokhara', 'patan'],
    featured: true,
    public_visible: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cal-2026-chhath',
    slug: 'chhath-2026',
    title: 'Chhath Puja 2026',
    nepali_title: 'छठ पर्व २०८३',
    event_type: 'festival',
    start_date_ad: '2026-11-15',
    end_date_ad: '2026-11-15',
    start_date_bs: '2083-07-30',
    end_date_bs: '2083-07-30',
    year_ad: 2026,
    year_bs: 2083,
    is_public_holiday: true,
    summary: 'Ancient Sun God worship on riverbanks and ponds across the Terai and Kathmandu (Kamal Pokhari, Bagmati).',
    description: 'Devotees stand in water offering arghya to the setting and rising sun, with bamboo baskets of sweets (thekuwa) and sugarcane.',
    travel_impact: 'Janakpur, Birgunj, and Biratnagar lakeshores are extraordinarily vibrant.',
    recommended_destinations: ['janakpur', 'birgunj', 'kathmandu'],
    featured: false,
    public_visible: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
]

export const FESTIVAL_GUIDES: FestivalGuide[] = [
  {
    slug: 'dashain',
    name: 'Dashain (Bijaya Dashami)',
    nepaliName: 'बडा दशैं',
    category: 'major_festival',
    heroImage: '/images/kathmandu.webp',
    dates: {
      year2026: {
        ad: 'October 11 – October 20, 2026',
        bs: '25 Ashwin – 4 Kartik 2083',
        durationDays: 10,
        mainDay: 'October 20, 2026 (Vijaya Dashami)',
      },
      year2025: {
        ad: 'September 22 – October 1, 2025',
        bs: '6 Ashwin – 15 Ashwin 2082',
        durationDays: 10,
        mainDay: 'October 1, 2025 (Vijaya Dashami)',
      },
    },
    tagline: 'Nepal’s grandest national festival celebrating family reunion, victory of good over evil, and divine blessings.',
    significance:
      'Dashain commemorates Goddess Durga’s victory over the demon Mahishasura. It is celebrated by virtually all communities across Nepal and represents the most sacred time for family reunions.',
    culturalPractices: [
      'Ghatasthapana: Sowing holy barley seeds in sand to grow sacred golden shoots (Jamara).',
      'Fulpati: Royal military parade carrying sacred flowers from Gorkha to Kathmandu.',
      'Maha Ashtami & Navami: Worship of Goddess Durga and blessing of vehicles and tools.',
      'Vijaya Dashami: Elders apply red tika and green jamara to younger family members along with cash blessings (Dakshina).',
      'Flying paper kites across Himalayan blue skies and swinging on giant bamboo swings (Ping).',
    ],
    travelImpact: {
      crowdLevel: 'Extreme',
      closureWarning: 'Government offices, banks, embassies, and local markets close for 5 to 7 days around Vijaya Dashami.',
      transportAdvice: 'Long-distance buses from Kathmandu sell out weeks in advance. Book domestic flights well ahead.',
      lodgingAdvice: 'Hotels and tourist restaurants in Thamel and Lakeside Pokhara operate normally with festive menus.',
    },
    bestDestinations: [
      {
        slug: 'kathmandu',
        name: 'Kathmandu Valley',
        whyVisit: 'Witness Fulpati military ceremonies at Tundikhel and serene, uncrowded historic streets during Vijaya Dashami.',
      },
      {
        slug: 'bhaktapur',
        name: 'Bhaktapur Durbar Square',
        whyVisit: 'Experience authentic Newari rituals, traditional music, and giant bamboo swings in village squares.',
      },
      {
        slug: 'pokhara',
        name: 'Pokhara',
        whyVisit: 'Clear autumn skies over Phewa Lake and Annapurna peaks during Nepal’s premier festive season.',
      },
    ],
    faqs: [
      {
        question: 'Can tourists participate in Dashain?',
        answer: 'Yes! While Dashain is primarily a family festival, Nepali hosts and hotel staff frequently invite travelers to receive tika and share festive feasts (goat curry, sel roti, sweets).',
      },
      {
        question: 'Are trekking routes open during Dashain?',
        answer: 'Yes, autumn trekking (Annapurna, Everest, Langtang) is at its peak during Dashain. Teahouses along main routes stay open, though guide and porter availability should be booked early.',
      },
    ],
  },
  {
    slug: 'tihar',
    name: 'Tihar (Deepawali & Bhai Tika)',
    nepaliName: 'तिहार / दीपावली',
    category: 'major_festival',
    heroImage: '/images/sarangkot.webp',
    dates: {
      year2026: {
        ad: 'November 8 – November 12, 2026',
        bs: '23 Kartik – 27 Kartik 2083',
        durationDays: 5,
        mainDay: 'November 12, 2026 (Bhai Tika)',
      },
      year2025: {
        ad: 'October 19 – October 23, 2025',
        bs: '3 Kartik – 7 Kartik 2082',
        durationDays: 5,
        mainDay: 'October 23, 2025 (Bhai Tika)',
      },
    },
    tagline: 'The 5-day festival of lights celebrating animals, Goddess Laxmi, and the enduring bond between siblings.',
    significance:
      'Tihar is second only to Dashain in importance. It uniquely expresses gratitude to animals (crows, dogs, cows, and oxen) before welcoming Goddess Laxmi into illuminated homes and celebrating the brother-sister relationship on Bhai Tika.',
    culturalPractices: [
      'Kaag Tihar (Day 1): Offering food to crows, messengers of death.',
      'Kukur Tihar (Day 2): Garlanded dogs blessed with tika celebrating their loyalty.',
      'Gai Tihar & Laxmi Puja (Day 3): Cows garlanded; houses illuminated with clay lamps (diyos) and vibrant rangoli at doorways.',
      'Govardhan Puja & Mha Puja (Day 4): Worship of oxen, mountains, and Newari celebration of the inner self (Mha Puja).',
      'Bhai Tika (Day 5): Sisters apply seven-coloured tika (Saptarangi) to brothers, offering walnut garlands and delicacies.',
    ],
    travelImpact: {
      crowdLevel: 'Moderate',
      closureWarning: 'Shops close on Laxmi Puja evening and Bhai Tika afternoon, but tourist areas remain open.',
      transportAdvice: 'Intercity transport operates with reduced frequencies on Bhai Tika; taxis in tourist hubs remain available.',
      lodgingAdvice: 'Hotels in Kathmandu and Pokhara decorate extensively and offer traditional festive meals.',
    },
    bestDestinations: [
      {
        slug: 'kathmandu',
        name: 'Kathmandu (Thamel & Ason)',
        whyVisit: 'See illuminated heritage alleys, bustling spice markets in Ason, and evening Deusi-Bhailo street performances.',
      },
      {
        slug: 'pokhara',
        name: 'Pokhara Lakeside',
        whyVisit: 'Lakeside promenade illuminated by candlelight with live acoustic music and tranquil lake reflections.',
      },
      {
        slug: 'patan',
        name: 'Patan (Lalitpur)',
        whyVisit: 'Witness traditional Newari Mha Puja rituals and intricately crafted floral rangoli in Newar courtyards.',
      },
    ],
    faqs: [
      {
        question: 'Is Tihar a good time to visit Nepal?',
        answer: 'Tihar is arguably the most photogenic and enjoyable festival for foreign travelers. The atmosphere is warm, festive, and welcoming, with musical singing groups on every corner.',
      },
    ],
  },
  {
    slug: 'holi',
    name: 'Holi (Fagu Purnima)',
    nepaliName: 'होली / फागु पूर्णिमा',
    category: 'cultural_spectacle',
    heroImage: '/images/bhaktapur.webp',
    dates: {
      year2026: {
        ad: 'March 3 – March 4, 2026',
        bs: '19 Falgun – 20 Falgun 2082',
        durationDays: 2,
        mainDay: 'March 3, 2026 (Hills) / March 4 (Terai)',
      },
      year2025: {
        ad: 'March 14 – March 15, 2025',
        bs: '1 Chaitra – 2 Chaitra 2081',
        durationDays: 2,
        mainDay: 'March 14, 2025 (Hills) / March 15 (Terai)',
      },
    },
    tagline: 'The exuberance of spring in a cascade of vibrant colours, water play, and street dancing.',
    significance:
      'Holi marks the arrival of spring and the triumph of devotee Prahlada over the demoness Holika. In Nepal, the ceremonial erection of the bamboo pole (Chir) in Kathmandu Durbar Square officially signals the week-long festive spirit.',
    culturalPractices: [
      'Throwing dry herbal powder (Abir/Gulal) and coloured water balloons among friends and strangers.',
      'Live music concerts and open-air dances in Kathmandu Durbar Square and Pokhara Lakeside.',
      'Drinking traditional lassi and sharing festive sweets.',
    ],
    travelImpact: {
      crowdLevel: 'High',
      closureWarning: 'Shops and public transport halt during the morning and afternoon; businesses reopen by 4 PM.',
      transportAdvice: 'Do not plan highway travel on Holi morning. Taxis and tourist transport resume late afternoon.',
      lodgingAdvice: 'Wear inexpensive clothes that can be discarded. Secure mobile phones and cameras in waterproof pouches.',
    },
    bestDestinations: [
      {
        slug: 'kathmandu',
        name: 'Kathmandu Durbar Square',
        whyVisit: 'The epicenter of public celebrations where thousands of locals and travelers gather with music and powder.',
      },
      {
        slug: 'pokhara',
        name: 'Pokhara Lakeside',
        whyVisit: 'Friendly lakeside street festival with mountain backdrop and organized live music concerts.',
      },
      {
        slug: 'janakpur',
        name: 'Janakpur',
        whyVisit: 'Experience the deep Maithili cultural traditions of Terai Holi with classical folk songs (Hori) and sweets.',
      },
    ],
    faqs: [
      {
        question: 'Are natural skin-safe colors used?',
        answer: 'Most vendors sell herbal powders (gulal). Wearing coconut oil on exposed skin and hair before joining helps wash colors off easily.',
      },
    ],
  },
  {
    slug: 'buddha-jayanti',
    name: 'Buddha Jayanti',
    nepaliName: 'बुद्ध जयन्ती',
    category: 'religious_pilgrimage',
    heroImage: '/images/lumbini.webp',
    dates: {
      year2026: {
        ad: 'May 1, 2026',
        bs: '18 Baishakh 2083',
        durationDays: 1,
        mainDay: 'May 1, 2026',
      },
      year2025: {
        ad: 'May 12, 2025',
        bs: '29 Baishakh 2082',
        durationDays: 1,
        mainDay: 'May 12, 2025',
      },
    },
    tagline: 'Honouring the Triple Blessed Day: the birth, enlightenment, and Mahaparinirvana of Siddhartha Gautama Buddha.',
    significance:
      'Lumbini in southern Nepal is the revered birthplace of Shakyamuni Buddha. Buddha Jayanti on the full moon of Baishakh is observed with serene processions, oil lamps, and meditation.',
    culturalPractices: [
      'Processions carrying relics around the sacred Mayadevi Temple in Lumbini.',
      'Circumambulation (Kora) of the massive Boudhanath and Swayambhunath stupas in Kathmandu.',
      'Lighting thousands of golden butter lamps at sunset.',
      'Monastic chanting and peace rallies promoting non-violence.',
    ],
    travelImpact: {
      crowdLevel: 'Moderate',
      closureWarning: 'Public holiday. Monasteries and stupas are busy but open to respectful visitors.',
      transportAdvice: 'Buses and domestic flights to Bhairahawa / Lumbini should be reserved early.',
      lodgingAdvice: 'Hotels in Lumbini fill with international pilgrims; book in advance.',
    },
    bestDestinations: [
      {
        slug: 'lumbini',
        name: 'Lumbini Sacred Garden',
        whyVisit: 'The authentic birthplace of Buddha with monasteries built by Buddhist nations from around the world.',
      },
      {
        slug: 'kathmandu',
        name: 'Boudhanath & Swayambhunath',
        whyVisit: 'Kathmandu’s iconic stupas surrounded by thousands of devotees spinning prayer wheels and chanting.',
      },
    ],
    faqs: [
      {
        question: 'Can non-Buddhists enter monasteries during Buddha Jayanti?',
        answer: 'Yes, visitors of all backgrounds are welcomed warmly. Dress modestly with shoulders and knees covered, and remove shoes before entering temple sanctums.',
      },
    ],
  },
  {
    slug: 'indra-jatra',
    name: 'Indra Jatra (Yenya)',
    nepaliName: 'इन्द्रजात्रा (येँयाः)',
    category: 'cultural_spectacle',
    heroImage: '/images/kathmandu.webp',
    dates: {
      year2026: {
        ad: 'September 25, 2026',
        bs: '9 Ashwin 2083',
        durationDays: 8,
        mainDay: 'September 25, 2026 (Kumari Chariot Day)',
      },
      year2025: {
        ad: 'September 6, 2025',
        bs: '21 Bhadra 2082',
        durationDays: 8,
        mainDay: 'September 6, 2025',
      },
    },
    tagline: 'Kathmandu’s most theatrical street festival featuring chariot processions of the Living Goddess and masked demon dances.',
    significance:
      'Indra Jatra honours Indra, the Vedic god of rain, thanking him for the harvest. The festival also features the appearance of the Living Goddess (Kumari) in her royal golden chariot through ancient Kathmandu.',
    culturalPractices: [
      'Pulling the three-tiered chariot of Royal Kumari, Ganesh, and Bhairav through packed historic alleys.',
      'Majipa Lakhey masked demon dances with fearsome red masks and flowing hair.',
      'Display of the gigantic Sweta Bhairab mask dispensing consecrated local liquor (Aila) to the crowd.',
    ],
    travelImpact: {
      crowdLevel: 'High',
      closureWarning: 'Local public holiday in Kathmandu Valley. Historic alleys closed to traffic.',
      transportAdvice: 'Walk on foot to Basantapur Durbar Square by early afternoon to secure viewing spots.',
      lodgingAdvice: 'Thamel hotels are within 15 minutes walking distance to festival squares.',
    },
    bestDestinations: [
      {
        slug: 'kathmandu',
        name: 'Kathmandu Durbar Square',
        whyVisit: 'The heart of Indra Jatra where the President and international diplomats witness the Kumari blessing.',
      },
    ],
    faqs: [
      {
        question: 'Who is the Living Goddess Kumari?',
        answer: 'The Kumari is a young prepubescent Newar girl revered as the living incarnation of Goddess Taleju. Indra Jatra is one of the rare occasions she leaves her temple palace.',
      },
    ],
  },
  {
    slug: 'maha-shivaratri',
    name: 'Maha Shivaratri',
    nepaliName: 'महाशिवरात्रि',
    category: 'religious_pilgrimage',
    heroImage: '/images/pashupatinath.webp',
    dates: {
      year2026: {
        ad: 'February 15, 2026',
        bs: '3 Falgun 2082',
        durationDays: 1,
        mainDay: 'February 15, 2026',
      },
      year2025: {
        ad: 'February 26, 2025',
        bs: '14 Falgun 2081',
        durationDays: 1,
        mainDay: 'February 26, 2025',
      },
    },
    tagline: 'The Great Night of Shiva drawing a million devotees and holy sadhus to sacred Pashupatinath.',
    significance:
      'Celebrates Lord Shiva’s cosmic dance (Tandava) and his divine marriage with Parvati. Pashupatinath Temple on the Bagmati River is the most revered Shiva shrine in the Himalayas.',
    culturalPractices: [
      'Hundreds of thousands of devotees queue for hours from 3 AM to offer milk, bael leaves, and water at Pashupatinath.',
      'Sadhus (Naga Babas, Aghoris) gather in courtyards chanting mantras around sacred wood fires (Dhuni).',
      'Devotees observe all-night vigils (Jagaran) and light evening bonfires in neighborhoods.',
    ],
    travelImpact: {
      crowdLevel: 'Extreme',
      closureWarning: 'National public holiday. Massive security deployment and pedestrian-only zones around Gaushala.',
      transportAdvice: 'Roads within 2 km of Pashupatinath are closed to private vehicles.',
      lodgingAdvice: 'Book Kathmandu hotels in advance as hundreds of thousands of Indian pilgrims visit.',
    },
    bestDestinations: [
      {
        slug: 'kathmandu',
        name: 'Pashupatinath Temple',
        whyVisit: 'Witness South Asia’s most intense gathering of holy ascetics, riverbank rituals, and evening Maha Aarti.',
      },
    ],
    faqs: [
      {
        question: 'Can non-Hindus enter Pashupatinath on Shivaratri?',
        answer: 'Non-Hindus cannot enter the inner temple sanctum, but can freely explore the surrounding temple complex, Ghats, Sadhus’ encampments, and watch rituals from across the river bank.',
      },
    ],
  },
]

export function getStaticEventsForYear(year: number): CalendarEvent[] {
  return VERIFIED_CALENDAR_EVENTS_2026.filter((e) => e.year_ad === year || e.year_bs === year)
}

export function getFestivalGuideBySlug(slug: string): FestivalGuide | null {
  return FESTIVAL_GUIDES.find((f) => f.slug === slug) ?? null
}
