import type {
  DestinationMapMarker,
  BorderCrossingMapMarker,
} from '@/lib/supabase/types'
import type { AlertMapMarker } from './types'

/**
 * Verified NepaYatra Fallback Map Dataset.
 *
 * Ensures the interactive map, mini-maps, route planner, and homepage
 * always render rich, verified Nepal destinations and India-Nepal border
 * crossings instantly (< 100ms), even when Supabase is offline, paused,
 * or slow to respond.
 */

export const FALLBACK_DESTINATIONS: DestinationMapMarker[] = [
  // ── Bagmati Province ──
  {
    id: 'dest-kathmandu',
    name: 'Kathmandu Valley',
    slug: 'kathmandu-valley',
    latitude: 27.7172,
    longitude: 85.324,
    category: 'heritage',
    province: 'bagmati',
    featured: true,
    short_description:
      'Historic capital of Nepal with 7 UNESCO World Heritage monuments, ancient pagoda temples, and rich Newari culture.',
  },
  {
    id: 'dest-patan',
    name: 'Patan (Lalitpur)',
    slug: 'patan-durbar-square',
    latitude: 27.6744,
    longitude: 85.3253,
    category: 'cultural',
    province: 'bagmati',
    featured: false,
    short_description:
      'The city of fine arts, Krishna Mandir, golden temple, and medieval courtyard architecture.',
  },
  {
    id: 'dest-bhaktapur',
    name: 'Bhaktapur Durbar Square',
    slug: 'bhaktapur',
    latitude: 27.671,
    longitude: 85.4298,
    category: 'heritage',
    province: 'bagmati',
    featured: true,
    short_description:
      'City of Devotees featuring the 55-Window Palace, Nyatapola Temple, and traditional pottery squares.',
  },
  {
    id: 'dest-nagarkot',
    name: 'Nagarkot',
    slug: 'nagarkot',
    latitude: 27.7174,
    longitude: 85.5204,
    category: 'scenic',
    province: 'bagmati',
    featured: false,
    short_description:
      'Famed Himalayan hill station offering panoramic sunrise views across to Mount Everest.',
  },
  {
    id: 'dest-chitwan',
    name: 'Chitwan National Park',
    slug: 'chitwan-national-park',
    latitude: 27.5341,
    longitude: 84.4533,
    category: 'wildlife',
    province: 'bagmati',
    featured: true,
    short_description:
      'UNESCO subtropical wilderness sanctuary, home to single-horned rhinos, Royal Bengal tigers, and Tharu culture.',
  },
  {
    id: 'dest-langtang',
    name: 'Langtang Valley',
    slug: 'langtang-valley',
    latitude: 28.2167,
    longitude: 85.5667,
    category: 'trekking',
    province: 'bagmati',
    featured: false,
    short_description:
      'The Valley of Glaciers, rich in Tamang heritage, alpine yak pastures, and views of Langtang Lirung (7,227m).',
  },

  // ── Gandaki Province ──
  {
    id: 'dest-pokhara',
    name: 'Pokhara & Phewa Lake',
    slug: 'pokhara',
    latitude: 28.2096,
    longitude: 83.9856,
    category: 'scenic',
    province: 'gandaki',
    featured: true,
    short_description:
      'Nepal’s premier adventure haven framed by the reflected peaks of Annapurna and Machapuchare.',
  },
  {
    id: 'dest-ghandruk',
    name: 'Ghandruk Village',
    slug: 'ghandruk',
    latitude: 28.375,
    longitude: 83.808,
    category: 'cultural',
    province: 'gandaki',
    featured: false,
    short_description:
      'Traditional stone Gurung heritage village with sweeping Annapurna vistas and rhododendron trails.',
  },
  {
    id: 'dest-abc',
    name: 'Annapurna Base Camp',
    slug: 'annapurna-base-camp',
    latitude: 28.5303,
    longitude: 83.878,
    category: 'trekking',
    province: 'gandaki',
    featured: true,
    short_description:
      'Iconic high-altitude mountain sanctuary enclosed by Annapurna I (8,091m) and Machapuchare.',
  },
  {
    id: 'dest-mustang',
    name: 'Upper Mustang (Lo Manthang)',
    slug: 'upper-mustang',
    latitude: 29.1822,
    longitude: 83.9567,
    category: 'adventure',
    province: 'gandaki',
    featured: true,
    short_description:
      'Walled ancient Kingdom of Lo in a trans-Himalayan desert with medieval Buddhist cave monasteries.',
  },
  {
    id: 'dest-muktinath',
    name: 'Muktinath Temple',
    slug: 'muktinath',
    latitude: 28.8167,
    longitude: 83.8694,
    category: 'religious',
    province: 'gandaki',
    featured: true,
    short_description:
      'Sacred pilgrimage shrine at 3,710m revered by Hindus and Buddhists, featuring 108 holy water spouts.',
  },
  {
    id: 'dest-bandipur',
    name: 'Bandipur Heritage Town',
    slug: 'bandipur',
    latitude: 27.9304,
    longitude: 84.4172,
    category: 'heritage',
    province: 'gandaki',
    featured: false,
    short_description:
      'Preserved 18th-century Newari hilltop outpost with cobblestone pedestrian streets and mountain views.',
  },
  {
    id: 'dest-manang',
    name: 'Manang & Tilicho Lake',
    slug: 'manang-tilicho',
    latitude: 28.6656,
    longitude: 84.0225,
    category: 'trekking',
    province: 'gandaki',
    featured: false,
    short_description:
      'High mountain valley on the Annapurna Circuit; gateway to Tilicho Lake (4,919m), one of the highest glacial lakes.',
  },

  // ── Lumbini Province ──
  {
    id: 'dest-lumbini',
    name: 'Lumbini Sacred Garden',
    slug: 'lumbini',
    latitude: 27.4833,
    longitude: 83.275,
    category: 'religious',
    province: 'lumbini',
    featured: true,
    short_description:
      'Holy birthplace of Siddhartha Gautama Buddha, Maya Devi Temple, and ancient Ashoka Pillar.',
  },
  {
    id: 'dest-palpa',
    name: 'Tansen (Palpa)',
    slug: 'palpa-tansen',
    latitude: 27.8667,
    longitude: 83.55,
    category: 'cultural',
    province: 'lumbini',
    featured: false,
    short_description:
      'Hill town known for traditional Dhaka weaving and Rani Mahal on the Kali Gandaki River.',
  },
  {
    id: 'dest-bardia',
    name: 'Bardia National Park',
    slug: 'bardia-national-park',
    latitude: 28.528,
    longitude: 81.334,
    category: 'wildlife',
    province: 'lumbini',
    featured: true,
    short_description:
      'Nepal’s largest untouched western wilderness sanctuary with high chances of wild tiger sightings.',
  },

  // ── Koshi Province ──
  {
    id: 'dest-ebc',
    name: 'Everest Base Camp (EBC)',
    slug: 'everest-base-camp',
    latitude: 28.0042,
    longitude: 86.8569,
    category: 'trekking',
    province: 'koshi',
    featured: true,
    short_description:
      'World-famous Himalayan route beneath Mount Everest (8,848m) with legendary Sherpa monasteries.',
  },
  {
    id: 'dest-namche',
    name: 'Namche Bazaar',
    slug: 'namche-bazaar',
    latitude: 27.8069,
    longitude: 86.714,
    category: 'cultural',
    province: 'koshi',
    featured: false,
    short_description:
      'Vibrant Sherpa trading hub set in a high natural amphitheater with bakeries and Everest vistas.',
  },
  {
    id: 'dest-ilam',
    name: 'Ilam Tea Gardens',
    slug: 'ilam-tea-gardens',
    latitude: 26.91,
    longitude: 87.9267,
    category: 'scenic',
    province: 'koshi',
    featured: false,
    short_description:
      'Rolling green hills carpeted with organic orthodox tea gardens facing Mount Kanchenjunga.',
  },
  {
    id: 'dest-kanchenjunga',
    name: 'Kanchenjunga Base Camp',
    slug: 'kanchenjunga-base-camp',
    latitude: 27.7025,
    longitude: 88.1475,
    category: 'trekking',
    province: 'koshi',
    featured: false,
    short_description:
      'Pristine eastern wilderness below the world’s third-highest peak (8,586m).',
  },

  // ── Madhesh Province ──
  {
    id: 'dest-janakpur',
    name: 'Janakpurdham (Janaki Mandir)',
    slug: 'janakpur',
    latitude: 26.7288,
    longitude: 85.9244,
    category: 'religious',
    province: 'madhesh',
    featured: true,
    short_description:
      'Ancient capital of Mithila and birthplace of Goddess Sita, famous for the magnificent marble Janaki Temple.',
  },

  // ── Karnali Province ──
  {
    id: 'dest-rara',
    name: 'Rara Lake',
    slug: 'rara-lake',
    latitude: 29.5333,
    longitude: 82.0833,
    category: 'scenic',
    province: 'karnali',
    featured: true,
    short_description:
      'The Queen of Lakes — Nepal’s largest alpine freshwater lake surrounded by deep blue water and pine forests.',
  },
  {
    id: 'dest-shey-phoksundo',
    name: 'Shey Phoksundo Lake (Dolpo)',
    slug: 'shey-phoksundo',
    latitude: 29.2167,
    longitude: 82.95,
    category: 'adventure',
    province: 'karnali',
    featured: true,
    short_description:
      'Ethereal turquoise alpine lake in Upper Dolpo, home to snow leopards and ancient Bon Buddhist culture.',
  },

  // ── Sudurpashchim Province ──
  {
    id: 'dest-khaptad',
    name: 'Khaptad National Park',
    slug: 'khaptad-national-park',
    latitude: 29.3833,
    longitude: 81.1667,
    category: 'scenic',
    province: 'sudurpashchim',
    featured: false,
    short_description:
      'Spiritual high-altitude plateau of rolling meadows (Patans), wildflowers, and meditation ashrams.',
  },
  {
    id: 'dest-shuklaphanta',
    name: 'Shuklaphanta National Park',
    slug: 'shuklaphanta',
    latitude: 28.85,
    longitude: 80.2333,
    category: 'wildlife',
    province: 'sudurpashchim',
    featured: false,
    short_description:
      'Vast grasslands in western Terai holding the world’s largest herd of swamp deer (Barasingha).',
  },
]

export const FALLBACK_BORDER_CROSSINGS: BorderCrossingMapMarker[] = [
  {
    id: 'border-sunauli',
    crossing_name: 'Sunauli / Belahiya',
    india_side: 'Gorakhpur / Maharajganj (UP)',
    nepal_side: 'Bhairahawa / Belahiya',
    latitude: 27.472,
    longitude: 83.468,
    featured: true,
    description:
      'Most popular overland crossing for Indian tourists visiting Pokhara, Lumbini, and Kathmandu. 24/7 customs clearance with Bhansar permit.',
  },
  {
    id: 'border-raxaul',
    crossing_name: 'Raxaul / Birgunj',
    india_side: 'Raxaul (Bihar)',
    nepal_side: 'Birgunj',
    latitude: 27.0136,
    longitude: 84.8778,
    featured: true,
    description:
      'Primary commercial gateway and direct entry route toward Kathmandu via Tribhuvan Highway / Fast Track corridor.',
  },
  {
    id: 'border-kakarbhitta',
    crossing_name: 'Panitanki / Kakarbhitta',
    india_side: 'Siliguri / Panitanki (West Bengal)',
    nepal_side: 'Kakarbhitta / Mechinagar',
    latitude: 26.65,
    longitude: 88.16,
    featured: true,
    description:
      'Eastern gateway connecting Darjeeling, Sikkim, and Kolkata directly to eastern Nepal tea hills (Ilam) and Kathmandu.',
  },
  {
    id: 'border-rupaidiha',
    crossing_name: 'Rupaidiha / Nepalgunj',
    india_side: 'Bahraich / Lucknow (UP)',
    nepal_side: 'Nepalgunj',
    latitude: 27.97,
    longitude: 81.615,
    featured: false,
    description:
      'Gateway for western Nepal wilderness tours (Bardia, Rara Lake) and Kailash-Mansarovar pilgrimages.',
  },
  {
    id: 'border-banbasa',
    crossing_name: 'Banbasa / Gaddachowki',
    india_side: 'Banbasa (Uttarakhand)',
    nepal_side: 'Mahendranagar / Bhimdatta',
    latitude: 28.97,
    longitude: 80.12,
    featured: false,
    description:
      'Far-western checkpoint across Sharda Barrage connecting Delhi and Uttarakhand to Shuklaphanta and Khaptad.',
  },
  {
    id: 'border-jogbani',
    crossing_name: 'Jogbani / Biratnagar',
    india_side: 'Jogbani (Bihar)',
    nepal_side: 'Biratnagar',
    latitude: 26.43,
    longitude: 87.27,
    featured: false,
    description:
      'Direct crossing into eastern industrial hub, Koshi Tappu Wildlife Reserve, and eastern tea country.',
  },
]

export const FALLBACK_ALERTS: AlertMapMarker[] = [
  {
    id: 'alert-high-altitude',
    title: 'High Altitude Travel Advisory',
    message:
      'Acclimatization recommended above 3,000m in Mustang, Manang, and Khumbu regions. Keep warm layers accessible.',
    severity: 'info',
    region: 'Mustang',
    longitude: 83.88,
    latitude: 28.81,
  },
  {
    id: 'alert-prithvi-highway',
    title: 'Prithvi Highway Road Improvement Works',
    message:
      'Mugling–Pokhara road widening works underway. Expect minor delays during peak transit hours. Private jeeps and tourist buses operate normally.',
    severity: 'info',
    region: 'Gandaki',
    longitude: 84.1,
    latitude: 28.0,
  },
  {
    id: 'alert-border-bhansar',
    title: 'Bhansar Vehicle Entry Registration Reminder',
    message:
      'Indian-registered private vehicles (cars/bikes) must obtain Bhansar (customs permit) at the border entry gate. Valid RC and driving license required.',
    severity: 'info',
    region: 'Lumbini',
    longitude: 83.468,
    latitude: 27.472,
  },
]
