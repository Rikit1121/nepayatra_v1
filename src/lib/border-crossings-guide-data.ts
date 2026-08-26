/**
 * Verified logistics, step-by-step transit guides, onward routes,
 * and travel FAQs for India–Nepal overland border crossings.
 *
 * Used to enrich border crossing landing pages (/border-crossings/[slug])
 * with authoritative data addressing Search Console user intent.
 */

export interface OnwardRoute {
  destination: string
  slug: string
  distanceKm: number
  travelTime: string
  recommendedTransport: string
  estimatedFare: string
}

export interface BorderFaq {
  question: string
  answer: string
}

export interface BorderTransitGuide {
  slug: string
  shortSummary: string
  borderDistanceNote: string
  operatingHours: string
  nearestIndianHub: string
  nepaliTransitHub: string
  acceptedIdDocuments: string[]
  vehicleRules: string
  currencyRules: string
  stepByStepGuide: { step: number; title: string; detail: string }[]
  onwardRoutes: OnwardRoute[]
  faqs: BorderFaq[]
  relatedGuideSlugs: string[]
  recommendedDestinations: { name: string; slug: string; note: string }[]
}

export const BORDER_TRANSIT_DATA: Record<string, BorderTransitGuide> = {
  'raxaul-birgunj': {
    slug: 'raxaul-birgunj',
    shortSummary:
      'The Raxaul–Birgunj border crossing connects East Champaran in Bihar (India) with Parsa District in Madhesh Province (Nepal). It is the busiest and most direct overland gateway for travelers traveling from Delhi, Bihar, Kolkata, and Uttar Pradesh to Kathmandu and Chitwan.',
    borderDistanceNote: 'Approx. 3 km between Raxaul Railway Station and Birgunj Border Gate (10–15 min by e-rickshaw or cycle-rickshaw).',
    operatingHours: 'Open 24 hours daily for pedestrian and vehicle crossing. Customs and immigration processing counters operate throughout standard hours.',
    nearestIndianHub: 'Raxaul Junction (RXL) — direct train connections from Delhi, Patna, Kolkata, and Varanasi.',
    nepaliTransitHub: 'Birgunj Bus Park (New Bus Park / Ghantaghar) — regular departures to Kathmandu, Pokhara, Chitwan, and Janakpur.',
    acceptedIdDocuments: [
      'Valid Indian Passport (recommended)',
      'Voter ID Card (Election Commission of India)',
      'No visa required for Indian citizens',
    ],
    vehicleRules:
      'Indian private cars, SUVs, and motorcycles can cross into Nepal at Birgunj. A temporary vehicle customs permit (Bhansar pass) must be obtained at the customs gate. Carry original RC, driving licence, valid insurance, and PUC certificate.',
    currencyRules:
      'Indian Rupee (INR) notes of ₹100, ₹200, and ₹500 denominations are widely accepted in Birgunj and across Nepal. ₹2,000 notes are banned. Fixed official rate: 1 INR = 1.60 NPR.',
    stepByStepGuide: [
      {
        step: 1,
        title: 'Arrive at Raxaul',
        detail:
          'Reach Raxaul Junction by train or bus from Patna/Delhi. Take a cycle-rickshaw or e-rickshaw (₹30–50 INR) directly to the Nepal border gate (Maitri Pul / Shankaracharya Gate).',
      },
      {
        step: 2,
        title: 'Pass Through Checkpoint & Customs',
        detail:
          'Indian pedestrians walk through the border gate showing Voter ID or Passport if requested. If driving a private vehicle, pull over at the Bhansar customs office to get a vehicle entry permit.',
      },
      {
        step: 3,
        title: 'Transit into Birgunj Town',
        detail:
          'Take a local e-rickshaw or auto to the Birgunj Bus Park (10–15 mins). Here you can buy a local SIM card (Ncell or Nepal Telecom) with your ID and exchange currency if needed.',
      },
      {
        step: 4,
        title: 'Board Onward Transport to Kathmandu or Chitwan',
        detail:
          'Board a deluxe/tourist bus, shared HiAce van, or hire a private taxi toward Kathmandu (4.5–5 hrs) or Chitwan (3 hrs). Morning departures before 10 AM are recommended.',
      },
    ],
    onwardRoutes: [
      {
        destination: 'Kathmandu',
        slug: 'kathmandu',
        distanceKm: 130,
        travelTime: '4.5–5 hours',
        recommendedTransport: 'Tourist Bus, Deluxe Coach, or Private Taxi',
        estimatedFare: 'NPR 500–800 (Bus) / NPR 6,000–8,000 (Taxi)',
      },
      {
        destination: 'Chitwan',
        slug: 'chitwan',
        distanceKm: 100,
        travelTime: '3 hours',
        recommendedTransport: 'Bus or Shared Jeep',
        estimatedFare: 'NPR 400–600',
      },
      {
        destination: 'Pokhara',
        slug: 'pokhara',
        distanceKm: 240,
        travelTime: '7–8 hours',
        recommendedTransport: 'Direct Deluxe Bus via Narayangadh',
        estimatedFare: 'NPR 1,000–1,500',
      },
      {
        destination: 'Janakpur',
        slug: 'janakpur',
        distanceKm: 140,
        travelTime: '4 hours',
        recommendedTransport: 'Bus along East-West Highway',
        estimatedFare: 'NPR 500–700',
      },
    ],
    faqs: [
      {
        question: 'What is the distance from Raxaul to Birgunj?',
        answer:
          'The distance between Raxaul Railway Station (Bihar, India) and the Birgunj Border Gate (Nepal) is approximately 3 km. Local cycle-rickshaws and e-rickshaws take 10–15 minutes and charge ₹30–50 INR per passenger.',
      },
      {
        question: 'What are the opening times for the Raxaul–Birgunj border?',
        answer:
          'The Raxaul–Birgunj border is open 24 hours a day for pedestrian and passenger vehicle movement. Commercial customs and vehicle permit processing counters operate from early morning until late evening (typically 6:00 AM to 10:00 PM).',
      },
      {
        question: 'How do I travel from Raxaul/Birgunj to Kathmandu?',
        answer:
          'From Birgunj Bus Park, regular tourist buses, deluxe coaches, and microbuses depart for Kathmandu throughout the day. The journey takes 4.5 to 5 hours along the Tribhuvan Highway and Hetauda corridor (fare: NPR 500–800). Private taxis are also available (3.5–4 hours, approx. NPR 6,000–8,000).',
      },
      {
        question: 'Do Indian citizens need a passport to cross at Raxaul?',
        answer:
          'No, a passport is not mandatory for Indian citizens. You can enter Nepal using a valid Voter ID card (issued by the Election Commission of India) or an Indian Passport. No visa is required for Indian nationals.',
      },
      {
        question: 'Can I bring an Indian private car or motorcycle into Nepal at Raxaul?',
        answer:
          'Yes. Private Indian cars, SUVs, and motorcycles can enter Nepal through Birgunj. You must stop at the Nepal Customs (Bhansar) office at the border to obtain a temporary vehicle permit (Bhansar pass) and pay the daily permit fee (approx. NPR 500–600/day for cars, NPR 150–200/day for motorcycles). Ensure you carry your original RC, valid driving licence, vehicle insurance, and pollution certificate.',
      },
      {
        question: 'Are Indian Rupees accepted in Birgunj and along the route to Kathmandu?',
        answer:
          'Yes. Indian Rupee notes of ₹100, ₹200, and ₹500 denominations are widely accepted in Birgunj, roadside dhabas, hotels, and throughout Nepal at the official fixed exchange rate of 1 INR = 1.60 NPR. Please note that ₹2,000 notes are strictly banned and not accepted anywhere in Nepal.',
      },
    ],
    relatedGuideSlugs: [
      'indian-citizen-nepal-entry-guide',
      'nepal-trip-cost-budget-guide-indian-travelers',
    ],
    recommendedDestinations: [
      { name: 'Birgunj', slug: 'birgunj', note: 'Immediate transit hub opposite Raxaul' },
      { name: 'Kathmandu', slug: 'kathmandu', note: '130 km north via scenic Hetauda highway' },
      { name: 'Chitwan', slug: 'chitwan', note: '100 km northwest for wildlife safaris' },
      { name: 'Pokhara', slug: 'pokhara', note: '240 km northwest via Narayangadh' },
    ],
  },

  'sunauli-bhairahawa': {
    slug: 'sunauli-bhairahawa',
    shortSummary:
      'The Sunauli–Bhairahawa border crossing connects Maharajganj District in Uttar Pradesh (India) with Rupandehi District in Lumbini Province (Nepal). It is the premier gateway for pilgrims visiting Lumbini (Buddha’s birthplace, just 22 km away) and travelers heading to Pokhara.',
    borderDistanceNote: 'Approx. 4 km between Sunauli Border and Bhairahawa Bus Park (10–15 min by auto-rickshaw).',
    operatingHours: 'Open 24 hours daily for pedestrian and vehicular crossing.',
    nearestIndianHub: 'Gorakhpur Junction (GKP, 90 km, 2–2.5 hrs by bus/taxi) and Varanasi (230 km).',
    nepaliTransitHub: 'Bhairahawa Bus Park / Gautam Buddha International Airport.',
    acceptedIdDocuments: [
      'Valid Indian Passport',
      'Voter ID Card (Election Commission of India)',
      'No visa required for Indian citizens',
    ],
    vehicleRules:
      'Indian private cars and motorbikes can enter after paying the Bhansar vehicle permit fee at the Bhairahawa customs checkpost.',
    currencyRules:
      'INR notes (₹100, ₹200, ₹500) accepted at 1 INR = 1.60 NPR. ₹2,000 notes prohibited.',
    stepByStepGuide: [
      {
        step: 1,
        title: 'Arrive at Gorakhpur / Sunauli',
        detail:
          'Take a bus or shared taxi from Gorakhpur Railway Station to Sunauli (90 km, 2 hrs).',
      },
      {
        step: 2,
        title: 'Cross the Checkpost',
        detail:
          'Walk across the Nepal gate into Bhairahawa (Siddharthanagar). Complete vehicle permit at customs if driving.',
      },
      {
        step: 3,
        title: 'Continue to Lumbini or Pokhara',
        detail:
          'Take a 30-minute auto-rickshaw directly to Lumbini (22 km) or catch a morning tourist bus to Pokhara (4–5 hrs).',
      },
    ],
    onwardRoutes: [
      {
        destination: 'Lumbini',
        slug: 'lumbini',
        distanceKm: 22,
        travelTime: '30–40 minutes',
        recommendedTransport: 'Auto-Rickshaw, Taxi, or Local Bus',
        estimatedFare: 'NPR 200–400',
      },
      {
        destination: 'Pokhara',
        slug: 'pokhara',
        distanceKm: 165,
        travelTime: '4.5–5 hours',
        recommendedTransport: 'Tourist Bus or Private Car via Siddhartha Highway',
        estimatedFare: 'NPR 800–1,200',
      },
      {
        destination: 'Kathmandu',
        slug: 'kathmandu',
        distanceKm: 280,
        travelTime: '7–8 hours (or 30-min flight from Bhairahawa BWA)',
        recommendedTransport: 'Deluxe Bus or Domestic Flight',
        estimatedFare: 'NPR 1,000–1,500 (Bus) / NPR 5,000+ (Flight)',
      },
    ],
    faqs: [
      {
        question: 'How far is Lumbini from the Sunauli border?',
        answer:
          'Lumbini is just 22 km from the Sunauli–Bhairahawa border. Auto-rickshaws and local taxis take 30 to 40 minutes and cost approximately NPR 300–500.',
      },
      {
        question: 'How do I reach Sunauli from Gorakhpur?',
        answer:
          'Regular buses and shared taxis run from Gorakhpur Railway Station directly to the Sunauli border gate (90 km, 2–2.5 hours, fare ₹120–250 INR).',
      },
      {
        question: 'Can I get a direct bus to Pokhara from Sunauli/Bhairahawa?',
        answer:
          'Yes, regular tourist and standard buses depart from the Bhairahawa bus terminal to Pokhara throughout the morning. The journey takes 4.5–5 hours via the scenic Siddhartha Highway (fare NPR 800–1,200).',
      },
    ],
    relatedGuideSlugs: [
      'indian-citizen-nepal-entry-guide',
      'nepal-trip-cost-budget-guide-indian-travelers',
    ],
    recommendedDestinations: [
      { name: 'Lumbini', slug: 'lumbini', note: '22 km from border — Birthplace of Lord Buddha' },
      { name: 'Pokhara', slug: 'pokhara', note: '165 km north via Siddhartha Highway' },
      { name: 'Kathmandu', slug: 'kathmandu', note: '280 km east or 30-min flight from Bhairahawa' },
    ],
  },

  'panitanki-kakarbhitta': {
    slug: 'panitanki-kakarbhitta',
    shortSummary:
      'The Panitanki–Kakarbhitta crossing connects Darjeeling District in West Bengal (India) with Jhapa District in Koshi Province (Nepal). It is the premier entry point for visitors traveling from Siliguri, Darjeeling, Sikkim, and Northeast India to the tea gardens of Ilam, Biratnagar, and beyond.',
    borderDistanceNote: 'Approx. 1.5 km across the Mechi Bridge connecting Panitanki (India) and Kakarbhitta (Nepal).',
    operatingHours: 'Open 24 hours daily. Peak crossing and transport hours are 6:00 AM to 7:00 PM.',
    nearestIndianHub: 'Siliguri (40 km, 1 hr) / New Jalpaiguri (NJP Railway Station) / Bagdogra Airport (IXB, 30 km).',
    nepaliTransitHub: 'Kakarbhitta Bus Terminal — direct overnight and daytime buses across Nepal.',
    acceptedIdDocuments: [
      'Valid Indian Passport',
      'Voter ID Card (Election Commission of India)',
      'No visa required for Indian citizens',
    ],
    vehicleRules:
      'Indian private cars and motorbikes can enter after completing customs formalities and paying the daily Bhansar fee at the Kakarbhitta gate.',
    currencyRules:
      'INR notes (₹100, ₹200, ₹500) accepted at 1 INR = 1.60 NPR. ₹2,000 notes banned.',
    stepByStepGuide: [
      {
        step: 1,
        title: 'Arrive at Siliguri / Panitanki',
        detail:
          'Take a shared taxi or auto from Siliguri / NJP / Bagdogra Airport to Panitanki border gate (30–40 km, 45–60 mins).',
      },
      {
        step: 2,
        title: 'Cross the Mechi Bridge',
        detail:
          'Walk or take an e-rickshaw across the Mechi Bridge into Kakarbhitta. Show ID at the police checkpost.',
      },
      {
        step: 3,
        title: 'Connect to Ilam or Kathmandu',
        detail:
          'Board a shared jeep or bus to the Ilam tea hills (35 km, 1.5 hrs) or an overnight coach to Kathmandu (12–14 hrs).',
      },
    ],
    onwardRoutes: [
      {
        destination: 'Ilam',
        slug: 'ilam',
        distanceKm: 35,
        travelTime: '1.5 hours',
        recommendedTransport: 'Shared Jeep or Local Bus',
        estimatedFare: 'NPR 300–500',
      },
      {
        destination: 'Biratnagar',
        slug: 'biratnagar',
        distanceKm: 90,
        travelTime: '2 hours',
        recommendedTransport: 'Bus or Taxi',
        estimatedFare: 'NPR 400–700',
      },
      {
        destination: 'Kathmandu',
        slug: 'kathmandu',
        distanceKm: 480,
        travelTime: '12–14 hours (or fly from Bhadrapur/Biratnagar, 45 mins)',
        recommendedTransport: 'Overnight Tourist Coach or Domestic Flight',
        estimatedFare: 'NPR 1,500–2,200 (Bus) / NPR 5,000+ (Flight)',
      },
    ],
    faqs: [
      {
        question: 'How do I reach Kakarbhitta from Siliguri or NJP?',
        answer:
          'Frequent shared jeeps, auto-rickshaws, and buses run from Siliguri Junction and NJP Station to Panitanki (approx. 40 km, 1 hour, ₹60–100 INR). From Panitanki, walk across the Mechi Bridge into Kakarbhitta.',
      },
      {
        question: 'How far is Ilam from the Kakarbhitta border?',
        answer:
          'Ilam is approximately 35 km north of Kakarbhitta. Shared jeeps and local buses take about 1.5 hours through winding scenic tea-covered hills (fare: NPR 300–500).',
      },
    ],
    relatedGuideSlugs: [
      'indian-citizen-nepal-entry-guide',
      'nepal-trip-cost-budget-guide-indian-travelers',
    ],
    recommendedDestinations: [
      { name: 'Ilam', slug: 'ilam', note: '35 km north — Nepal tea gardens & Kanchenjunga views' },
      { name: 'Kathmandu', slug: 'kathmandu', note: 'Overnight bus or flight via Bhadrapur Airport' },
    ],
  },

  'jogbani-biratnagar': {
    slug: 'jogbani-biratnagar',
    shortSummary:
      'The Jogbani–Biratnagar crossing connects Araria District in Bihar (India) with Morang District in Koshi Province (Nepal). It is the principal eastern commercial gateway, directly adjacent to Biratnagar — Nepal’s second largest city with domestic flight connections to Kathmandu.',
    borderDistanceNote: 'Approx. 2 km from Jogbani Railway Station to Biratnagar Customs Gate (5–10 min).',
    operatingHours: 'Open 24 hours daily.',
    nearestIndianHub: 'Jogbani Railway Station (JBN, Bihar) — direct trains from Kolkata, Katihar, and Patna.',
    nepaliTransitHub: 'Biratnagar Bus Terminal & Biratnagar Domestic Airport (BIR).',
    acceptedIdDocuments: [
      'Valid Indian Passport',
      'Voter ID Card (Election Commission of India)',
      'No visa required for Indian citizens',
    ],
    vehicleRules: 'Vehicle customs permits (Bhansar) available at Biratnagar dry port.',
    currencyRules: 'INR notes (₹100, ₹200, ₹500) accepted at 1 INR = 1.60 NPR.',
    stepByStepGuide: [
      {
        step: 1,
        title: 'Arrive at Jogbani',
        detail: 'Take a train or road transport to Jogbani Railway Station in Bihar.',
      },
      {
        step: 2,
        title: 'Cross into Biratnagar',
        detail: 'Take an e-rickshaw across the border checkpost into Biratnagar town (2 km).',
      },
      {
        step: 3,
        title: 'Onward Travel',
        detail: 'Take a 45-minute domestic flight from Biratnagar Airport to Kathmandu, or a bus to Ilam or Koshi Tappu.',
      },
    ],
    onwardRoutes: [
      {
        destination: 'Kathmandu',
        slug: 'kathmandu',
        distanceKm: 380,
        travelTime: '10–12 hours (or 45-min domestic flight from Biratnagar)',
        recommendedTransport: 'Domestic Flight or Overnight Bus',
        estimatedFare: 'NPR 1,200–1,800 (Bus) / NPR 4,500+ (Flight)',
      },
      {
        destination: 'Ilam',
        slug: 'ilam',
        distanceKm: 120,
        travelTime: '3.5 hours',
        recommendedTransport: 'Bus or Shared Jeep',
        estimatedFare: 'NPR 600–900',
      },
    ],
    faqs: [
      {
        question: 'Can I fly to Kathmandu from Biratnagar?',
        answer:
          'Yes. Biratnagar Domestic Airport (BIR) has multiple daily flights to Kathmandu operated by Buddha Air, Yeti Airlines, and Shree Airlines (flight duration: approx. 45 minutes).',
      },
    ],
    relatedGuideSlugs: ['indian-citizen-nepal-entry-guide'],
    recommendedDestinations: [
      { name: 'Ilam', slug: 'ilam', note: 'Scenic tea gardens 3.5 hrs by road' },
      { name: 'Kathmandu', slug: 'kathmandu', note: '45-min flight from Biratnagar Airport' },
    ],
  },

  'banbasa-mahendranagar': {
    slug: 'banbasa-mahendranagar',
    shortSummary:
      'The Banbasa–Mahendranagar (Gaddachauki) crossing connects Champawat District in Uttarakhand (India) with Kanchanpur District in Sudurpashchim Province (Nepal). It is the westernmost major border crossing, ideal for visiting Bardia National Park and far-western Nepal.',
    borderDistanceNote: 'Approx. 6 km across the Sharada Barrage from Banbasa to Mahendranagar (Bhimdatta).',
    operatingHours: 'Open 24 hours daily (Sharada Barrage bridge open to light vehicles and pedestrian movement).',
    nearestIndianHub: 'Tanakpur (10 km), Haldwani/Kathgodam (120 km), Bareilly (140 km), Nainital (130 km).',
    nepaliTransitHub: 'Mahendranagar (Bhimdatta) Bus Park.',
    acceptedIdDocuments: [
      'Valid Indian Passport',
      'Voter ID Card (Election Commission of India)',
      'No visa required for Indian citizens',
    ],
    vehicleRules: 'Vehicle customs permits (Bhansar) issued at Gaddachauki border customs.',
    currencyRules: 'INR notes (₹100, ₹200, ₹500) accepted at 1 INR = 1.60 NPR.',
    stepByStepGuide: [
      {
        step: 1,
        title: 'Arrive at Banbasa or Tanakpur',
        detail: 'Reach Banbasa or Tanakpur by bus or train from Delhi, Bareilly, or Uttarakhand hills.',
      },
      {
        step: 2,
        title: 'Cross Sharada Barrage to Gaddachauki',
        detail: 'Take a shared tempo or auto across the barrage into Nepal Gaddachauki checkpost.',
      },
      {
        step: 3,
        title: 'Transit to Bardia or Nepalgunj',
        detail: 'Board an eastbound bus along the East-West Highway toward Bardia National Park (3.5 hrs) or Nepalgunj (4 hrs).',
      },
    ],
    onwardRoutes: [
      {
        destination: 'Bardia National Park',
        slug: 'bardia-national-park',
        distanceKm: 190,
        travelTime: '3.5–4 hours',
        recommendedTransport: 'Bus or Private Jeep via East-West Highway',
        estimatedFare: 'NPR 600–900',
      },
      {
        destination: 'Kathmandu',
        slug: 'kathmandu',
        distanceKm: 690,
        travelTime: '15–17 hours (or fly from Dhangadhi/Nepalgunj)',
        recommendedTransport: 'Overnight Deluxe Bus or Flight from Dhangadhi',
        estimatedFare: 'NPR 1,800–2,500 (Bus) / NPR 6,000+ (Flight)',
      },
    ],
    faqs: [
      {
        question: 'How do I visit Bardia National Park from India via Banbasa?',
        answer:
          'After crossing into Mahendranagar from Banbasa, take an eastbound bus along the Mahendra Highway to Ambassa junction (approx. 190 km, 3.5–4 hours). From Ambassa, local jeeps or resort pickups transfer you 15 km to Thakurdwara village at Bardia National Park entrance.',
      },
    ],
    relatedGuideSlugs: ['indian-citizen-nepal-entry-guide'],
    recommendedDestinations: [
      { name: 'Bardia National Park', slug: 'bardia-national-park', note: '190 km east — wild tigers, rhinos & jungle safaris' },
    ],
  },
}

export function getBorderTransitData(slug: string): BorderTransitGuide | null {
  return BORDER_TRANSIT_DATA[slug] ?? null
}
