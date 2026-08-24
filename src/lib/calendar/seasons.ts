export interface SeasonMeta {
  id: 'autumn' | 'spring' | 'winter' | 'monsoon'
  name: string
  nepaliName: string
  monthsAd: number[] // 1..12
  monthNames: string[]
  monthsBs: string
  climateOverview: string
  trekkingCondition: 'Optimal' | 'Good' | 'Moderate' | 'Challenging'
  wildlifeCondition: 'Optimal' | 'Good' | 'Moderate' | 'Limited'
  pros: string[]
  cons: string[]
  topDestinations: string[]
}

export const SEASONS: Record<string, SeasonMeta> = {
  autumn: {
    id: 'autumn',
    name: 'Autumn (Peak Season)',
    nepaliName: 'शरद ऋतु',
    monthsAd: [9, 10, 11],
    monthNames: ['September', 'October', 'November'],
    monthsBs: 'Bhadra to Mangsir',
    climateOverview: 'Crystal-clear post-monsoon Himalayan skies, mild daytime temperatures (18°C–25°C), and negligible rainfall.',
    trekkingCondition: 'Optimal',
    wildlifeCondition: 'Good',
    pros: [
      'Unrivaled mountain visibility across all ranges',
      'Dashain & Tihar festive atmosphere throughout the nation',
      'Safe, dry trails and fully operational mountain lodges',
    ],
    cons: [
      'Highest demand for flights, guides, and teahouses',
      'Peak pricing for domestic flights and private jeeps',
    ],
    topDestinations: ['pokhara', 'kathmandu', 'ghandruk', 'chitwan', 'nagarkot'],
  },
  spring: {
    id: 'spring',
    name: 'Spring (Rhododendron Season)',
    nepaliName: 'वसन्त ऋतु',
    monthsAd: [3, 4, 5],
    monthNames: ['March', 'April', 'May'],
    monthsBs: 'Falgun to Jestha',
    climateOverview: 'Comfortably warm days (20°C–28°C), lengthening daylight, and hillsides ablaze with blooming red rhododendrons (Lali Gurans).',
    trekkingCondition: 'Optimal',
    wildlifeCondition: 'Optimal',
    pros: [
      'Spectacular blooming forests and colorful alpine landscapes',
      'Prime wildlife viewing in Chitwan & Bardia as tall grass dries',
      'High mountain passes (Thorong La, Larkya La) clear of deep winter snow',
    ],
    cons: [
      'Occasional afternoon haze in lower valleys before pre-monsoon rains',
      'Warm temperatures in southern Terai plains (30°C+ in May)',
    ],
    topDestinations: ['pokhara', 'ghandruk', 'chitwan', 'lumbini', 'kathmandu'],
  },
  winter: {
    id: 'winter',
    name: 'Winter (Lowland & Cultural Season)',
    nepaliName: 'हिउँद / शिशिर ऋतु',
    monthsAd: [12, 1, 2],
    monthNames: ['December', 'January', 'February'],
    monthsBs: 'Mangsir to Falgun',
    climateOverview: 'Crisp, sunny daytime weather in valleys (15°C–20°C) with cold nights (0°C–5°C) and heavy snow in high alpine regions.',
    trekkingCondition: 'Moderate',
    wildlifeCondition: 'Good',
    pros: [
      'Clear blue skies with fewer tourists in Kathmandu and Pokhara',
      'Excellent for cultural sightseeing, wildlife safaris, and low-altitude treks',
      'Competitive hotel rates and uncrowded heritage sites',
    ],
    cons: [
      'High altitude passes (>4,000m) closed by snow',
      'Cold nights requiring down jackets and thermal layers',
      'Morning fog in southern Terai (Janakpur, Birgunj) burning off by midday',
    ],
    topDestinations: ['kathmandu', 'pokhara', 'chitwan', 'lumbini', 'janakpur'],
  },
  monsoon: {
    id: 'monsoon',
    name: 'Summer / Monsoon (Rain-Shadow Season)',
    nepaliName: 'वर्षा ऋतु',
    monthsAd: [6, 7, 8],
    monthNames: ['June', 'July', 'August'],
    monthsBs: 'Jestha to Bhadra',
    climateOverview: 'Heavy afternoon/evening rains, lush emerald terraced hillsides, misty valleys, and warm humid temperatures.',
    trekkingCondition: 'Challenging',
    wildlifeCondition: 'Moderate',
    pros: [
      'Upper Mustang and Dolpo lie in the trans-Himalayan rain-shadow with dry, sunny trekking weather',
      'Vibrant agricultural life with rice planting festivals (Ropai)',
      'Lowest lodging rates and lush green scenery with roaring waterfalls',
    ],
    cons: [
      'Highway landslides and road travel delays along mountain routes',
      'Leeches on forested lower trails; obscured mountain summits',
    ],
    topDestinations: ['kathmandu', 'bhaktapur', 'patan', 'pokhara'],
  },
}

export function getSeasonForMonth(monthAd1to12: number): SeasonMeta {
  if ([9, 10, 11].includes(monthAd1to12)) return SEASONS.autumn
  if ([3, 4, 5].includes(monthAd1to12)) return SEASONS.spring
  if ([12, 1, 2].includes(monthAd1to12)) return SEASONS.winter
  return SEASONS.monsoon
}
