/**
 * Verified travel practicalities, access directions, trekking details,
 * and contextual link mappings for Nepal destination detail pages.
 *
 * Designed to enrich destination pages with genuine search-intent content
 * (e.g. Ghandruk direction from Pokhara, Lumbini access, permits, altitude).
 */

export interface DestinationTransitPracticalities {
  slug: string
  subtitle: string
  howToReachSummary: string
  accessSteps: { step: number; title: string; detail: string }[]
  idealDuration: string
  permitsRequired?: string[]
  nearbyHubs: { name: string; slug: string; distanceNote: string }[]
  relatedPackageSlugs: string[]
  relatedGuideSlugs: string[]
  relatedBorderSlug?: string
}

export const DESTINATION_GUIDE_DATA: Record<string, DestinationTransitPracticalities> = {
  ghandruk: {
    slug: 'ghandruk',
    subtitle: 'Gurung Heritage Village & Annapurna Trekking Hub',
    howToReachSummary:
      'Ghandruk is located in the Gandaki Province, approximately 55 km northwest of Pokhara. It is accessible by road from Pokhara to Kimche or Nayapul, followed by a scenic walk up traditional stone steps.',
    accessSteps: [
      {
        step: 1,
        title: 'Pokhara to Nayapul / Kimche (Drive)',
        detail:
          'Take a private taxi or shared jeep from Pokhara Lakeside through Lumle to Nayapul (1.5 hrs, ~40 km) or continue along the rough road up to Kimche / Ghandruk Phedi (approx. 2.5–3 hours total, fare NPR 600–1,000 shared or NPR 4,000–6,000 private car).',
      },
      {
        step: 2,
        title: 'Kimche to Ghandruk Village (Hike)',
        detail:
          'From Kimche, walk up the well-maintained stone stair trail to Ghandruk village (approx. 1 to 1.5 hours, elevation gain ~300 m). If walking from Nayapul via Birethanti, the full trek takes 4 to 5 hours.',
      },
      {
        step: 3,
        title: 'Onward Trek Connections',
        detail:
          'From Ghandruk, trails connect north toward Chomrong and Annapurna Base Camp (ABC), or west toward Tadapani and the Ghorepani–Poon Hill loop (3–4 hrs uphill through rhododendron forests).',
      },
    ],
    idealDuration: '2 to 3 days (or as a key stop on 7–10 day ABC trek)',
    permitsRequired: [
      'ACAP (Annapurna Conservation Area Permit) — NPR 3,000 (approx. ₹1,875 INR)',
      'TIMS Card (Trekkers’ Information Management System) — NPR 2,000',
      'Both permits are obtainable in Pokhara at the Nepal Tourism Board office.',
    ],
    nearbyHubs: [
      { name: 'Pokhara', slug: 'pokhara', distanceNote: '55 km southeast (2.5–3 hrs road + hike)' },
      { name: 'Annapurna Base Camp', slug: 'annapurna-base-camp', distanceNote: 'Trek north via Chomrong (3–4 days)' },
    ],
    relatedPackageSlugs: ['annapurna-base-camp-trek'],
    relatedGuideSlugs: ['nepal-trekking-beginners-guide'],
  },

  lumbini: {
    slug: 'lumbini',
    subtitle: 'Sacred Birthplace of Lord Buddha & UNESCO Pilgrimage Site',
    howToReachSummary:
      'Lumbini is situated in the Terai lowlands of Rupandehi District, just 22 km west of the India–Nepal border at Sunauli–Bhairahawa. It is easily reached by road or domestic flight.',
    accessSteps: [
      {
        step: 1,
        title: 'From Sunauli Border / Bhairahawa',
        detail:
          'Take a local auto-rickshaw or taxi directly from Bhairahawa / Sunauli border to the Lumbini Sacred Garden (22 km, 30–40 mins, fare NPR 300–500).',
      },
      {
        step: 2,
        title: 'From Pokhara or Kathmandu',
        detail:
          'From Pokhara: 165 km via Siddhartha Highway (4.5–5 hrs by tourist bus). From Kathmandu: 280 km (7–8 hrs by bus, or take a 30-minute domestic flight to Gautam Buddha International Airport in Bhairahawa).',
      },
    ],
    idealDuration: '1 to 2 days',
    nearbyHubs: [
      { name: 'Pokhara', slug: 'pokhara', distanceNote: '165 km north (4.5–5 hrs by road)' },
      { name: 'Chitwan', slug: 'chitwan', distanceNote: '115 km east (3.5 hrs by road)' },
      { name: 'Kathmandu', slug: 'kathmandu', distanceNote: '280 km east (7–8 hrs bus or 30-min flight)' },
    ],
    relatedPackageSlugs: ['nepal-pilgrimage-circuit'],
    relatedGuideSlugs: ['indian-citizen-nepal-entry-guide'],
    relatedBorderSlug: 'sunauli-bhairahawa',
  },

  'annapurna-base-camp': {
    slug: 'annapurna-base-camp',
    subtitle: '4,130m High-Altitude Glacial Sanctuary in the Annapurna Range',
    howToReachSummary:
      'The Annapurna Base Camp (ABC) trek begins from Pokhara’s road trailheads (Nayapul, Kimche, or Siwai) and follows the Modi Khola valley deep into the mountain amphitheatre.',
    accessSteps: [
      {
        step: 1,
        title: 'Pokhara to Trailhead',
        detail:
          'Drive from Pokhara to Siwai or Kimche via Nayapul (2.5–3 hours by jeep).',
      },
      {
        step: 2,
        title: 'Trek through Gurung Villages to Sanctuary',
        detail:
          'Trek via Ghandruk or Chomrong → Bamboo → Dovan → Deurali → Machapuchare Base Camp (MBC, 3,700m) to reach Annapurna Base Camp (ABC, 4,130m).',
      },
    ],
    idealDuration: '7 to 10 days return from Pokhara',
    permitsRequired: [
      'ACAP (Annapurna Conservation Area Permit)',
      'TIMS Card (Trekkers’ Information Management System)',
    ],
    nearbyHubs: [
      { name: 'Ghandruk', slug: 'ghandruk', distanceNote: 'Key village on the lower trail' },
      { name: 'Pokhara', slug: 'pokhara', distanceNote: 'Starting & ending city for the trek' },
    ],
    relatedPackageSlugs: ['annapurna-base-camp-trek'],
    relatedGuideSlugs: ['nepal-trekking-beginners-guide'],
  },

  mustang: {
    slug: 'mustang',
    subtitle: 'The Forbidden Kingdom — Walled City of Lo Manthang & High Plateau',
    howToReachSummary:
      'Upper Mustang is located in the rain-shadow of the Himalayas. The standard approach is a flight from Pokhara to Jomsom, followed by a 4WD jeep journey or multi-day trek north to Lo Manthang.',
    accessSteps: [
      {
        step: 1,
        title: 'Pokhara to Jomsom (Flight)',
        detail:
          'Take a 20-minute morning mountain flight from Pokhara Airport (PKR) to Jomsom (JMO). Flights depart early before afternoon mountain winds arise.',
      },
      {
        step: 2,
        title: 'Jomsom to Lo Manthang (4WD Jeep / Trek)',
        detail:
          'Hire a 4WD jeep from Jomsom through Kagbeni, Charang, and the Kali Gandaki canyon to the walled capital of Lo Manthang (4–5 hours on mountain tracks).',
      },
    ],
    idealDuration: '8 to 12 days',
    permitsRequired: [
      'Restricted Area Permit (RAP) — USD 500 for 10 days (issued in Kathmandu/Pokhara with a licensed guide)',
      'ACAP (Annapurna Conservation Area Permit)',
    ],
    nearbyHubs: [
      { name: 'Pokhara', slug: 'pokhara', distanceNote: '20-min flight to Jomsom trailhead' },
      { name: 'Muktinath', slug: 'muktinath', distanceNote: 'Sacred temple town near Jomsom / Lower Mustang' },
    ],
    relatedPackageSlugs: ['upper-mustang-expedition'],
    relatedGuideSlugs: ['nepal-trekking-beginners-guide'],
  },

  pokhara: {
    slug: 'pokhara',
    subtitle: 'Lakeside City, Annapurna Panoramas & Nepal’s Adventure Gateway',
    howToReachSummary:
      'Pokhara is located 200 km west of Kathmandu in the Gandaki Province. It is connected by frequent domestic flights and tourist buses, as well as direct road links from Indian border crossings at Sunauli and Birgunj.',
    accessSteps: [
      {
        step: 1,
        title: 'From Kathmandu',
        detail:
          'By flight: 25 minutes from Tribhuvan International Airport (multiple departures daily). By road: 6.5–7 hours by deluxe tourist bus along the Prithvi Highway.',
      },
      {
        step: 2,
        title: 'From India (Sunauli Border)',
        detail:
          'Direct tourist buses from Bhairahawa / Sunauli border to Pokhara Lakeside take 4.5–5 hours via the Siddhartha Highway (165 km).',
      },
    ],
    idealDuration: '3 to 5 days',
    nearbyHubs: [
      { name: 'Ghandruk', slug: 'ghandruk', distanceNote: '55 km northwest (trekking hub)' },
      { name: 'Annapurna Base Camp', slug: 'annapurna-base-camp', distanceNote: 'Sanctuary trek gateway' },
      { name: 'Sarangkot', slug: 'sarangkot', distanceNote: '30 mins (sunrise & paragliding viewpoint)' },
      { name: 'Chitwan', slug: 'chitwan', distanceNote: '155 km southeast (4.5 hrs by bus)' },
      { name: 'Kathmandu', slug: 'kathmandu', distanceNote: '200 km east (25-min flight or 6.5-hr bus)' },
    ],
    relatedPackageSlugs: ['golden-triangle-nepal', 'annapurna-base-camp-trek'],
    relatedGuideSlugs: ['nepal-trekking-beginners-guide', 'nepal-trip-cost-budget-guide-indian-travelers'],
    relatedBorderSlug: 'sunauli-bhairahawa',
  },

  kathmandu: {
    slug: 'kathmandu',
    subtitle: 'Capital City, 7 UNESCO World Heritage Sites & Cultural Epicenter',
    howToReachSummary:
      'Kathmandu is Nepal’s primary transport hub with Tribhuvan International Airport (KTM) and direct road connections to the Raxaul–Birgunj border (130 km).',
    accessSteps: [
      {
        step: 1,
        title: 'By Air',
        detail:
          'Direct flights connect Kathmandu to Delhi, Mumbai, Kolkata, Varanasi, Bengaluru, and major international hubs.',
      },
      {
        step: 2,
        title: 'Overland from India via Raxaul–Birgunj',
        detail:
          'From the Raxaul–Birgunj border, regular deluxe buses and private taxis take 4.5–5 hours (130 km) along the Tribhuvan Highway through Hetauda.',
      },
    ],
    idealDuration: '3 to 5 days',
    nearbyHubs: [
      { name: 'Bhaktapur', slug: 'bhaktapur', distanceNote: '13 km east (medieval Newari heritage)' },
      { name: 'Patan', slug: 'patan', distanceNote: '5 km south (Durbar Square & bronze craft)' },
      { name: 'Nagarkot', slug: 'nagarkot', distanceNote: '28 km east (Himalayan sunrise viewpoint)' },
      { name: 'Pokhara', slug: 'pokhara', distanceNote: '200 km west (25-min flight or 6.5-hr bus)' },
      { name: 'Chitwan', slug: 'chitwan', distanceNote: '150 km southwest (4.5 hrs by bus)' },
      { name: 'Birgunj', slug: 'birgunj', distanceNote: '130 km south (Raxaul border gateway)' },
    ],
    relatedPackageSlugs: ['golden-triangle-nepal', 'nepal-pilgrimage-circuit'],
    relatedGuideSlugs: ['indian-citizen-nepal-entry-guide', 'nepal-trip-cost-budget-guide-indian-travelers'],
    relatedBorderSlug: 'raxaul-birgunj',
  },

  chitwan: {
    slug: 'chitwan',
    subtitle: 'UNESCO National Park — One-Horned Rhinos, Royal Bengal Tigers & Tharu Culture',
    howToReachSummary:
      'Chitwan National Park (Sauraha gateway) is situated in the subtropical Terai lowlands, centrally placed between Kathmandu, Pokhara, and the Birgunj border.',
    accessSteps: [
      {
        step: 1,
        title: 'From Kathmandu or Pokhara',
        detail:
          'Tourist buses depart daily at 7:00 AM from Kathmandu Thamel and Pokhara Lakeside, reaching Sauraha in 4.5–5 hours (150 km, fare NPR 700–1,200).',
      },
      {
        step: 2,
        title: 'From Raxaul–Birgunj Border',
        detail:
          'Direct road journey from Birgunj to Sauraha takes approx. 3 hours (100 km by bus or jeep).',
      },
    ],
    idealDuration: '2 to 3 days',
    nearbyHubs: [
      { name: 'Kathmandu', slug: 'kathmandu', distanceNote: '150 km northeast (4.5 hrs by bus)' },
      { name: 'Pokhara', slug: 'pokhara', distanceNote: '155 km northwest (4.5 hrs by bus)' },
      { name: 'Birgunj', slug: 'birgunj', distanceNote: '100 km southeast (3 hrs by road)' },
      { name: 'Lumbini', slug: 'lumbini', distanceNote: '115 km west (3.5 hrs by road)' },
    ],
    relatedPackageSlugs: ['golden-triangle-nepal'],
    relatedGuideSlugs: ['nepal-trip-cost-budget-guide-indian-travelers'],
    relatedBorderSlug: 'raxaul-birgunj',
  },

  birgunj: {
    slug: 'birgunj',
    subtitle: 'Main Commercial Hub & Principal India–Nepal Border Gateway',
    howToReachSummary:
      'Birgunj is situated directly opposite Raxaul (Bihar, India). It is the premier overland arrival point connecting Indian road and train networks to Kathmandu, Chitwan, and Janakpur.',
    accessSteps: [
      {
        step: 1,
        title: 'Cross from Raxaul (Bihar)',
        detail:
          'Take a cycle-rickshaw or e-rickshaw across the border gate from Raxaul Railway Station into Birgunj town (3 km, 10–15 mins, ₹30–50 INR).',
      },
      {
        step: 2,
        title: 'Onward Transport from Birgunj Bus Park',
        detail:
          'Board morning tourist buses or taxis to Kathmandu (130 km, 4.5–5 hrs) or Chitwan (100 km, 3 hrs).',
      },
    ],
    idealDuration: 'Transit hub (1 day or same-day onward transit)',
    nearbyHubs: [
      { name: 'Kathmandu', slug: 'kathmandu', distanceNote: '130 km north via Hetauda (4.5–5 hrs)' },
      { name: 'Chitwan', slug: 'chitwan', distanceNote: '100 km northwest (3 hrs)' },
      { name: 'Janakpur', slug: 'janakpur', distanceNote: '140 km east (4 hrs)' },
    ],
    relatedPackageSlugs: ['golden-triangle-nepal'],
    relatedGuideSlugs: ['indian-citizen-nepal-entry-guide'],
    relatedBorderSlug: 'raxaul-birgunj',
  },

  ilam: {
    slug: 'ilam',
    subtitle: 'Rolling Tea Gardens, Misty Hills & Kanchenjunga Panoramas',
    howToReachSummary:
      'Ilam is located in the eastern hills of Koshi Province, approximately 35 km north of the Panitanki–Kakarbhitta border crossing with India (near Siliguri/Darjeeling).',
    accessSteps: [
      {
        step: 1,
        title: 'From Panitanki–Kakarbhitta Border (or Siliguri)',
        detail:
          'From Kakarbhitta, take a shared jeep or bus up the Mechi Highway to Ilam Bazaar (35 km, 1.5 hours, NPR 300–500).',
      },
      {
        step: 2,
        title: 'From Kathmandu',
        detail:
          'Take a domestic flight from Kathmandu to Bhadrapur Airport (45 mins), then a 2-hour taxi drive to Ilam, or an overnight bus (14 hrs).',
      },
    ],
    idealDuration: '2 to 3 days',
    nearbyHubs: [
      { name: 'Biratnagar', slug: 'biratnagar', distanceNote: '120 km southwest (3.5 hrs)' },
    ],
    relatedPackageSlugs: [],
    relatedGuideSlugs: ['nepal-trip-cost-budget-guide-indian-travelers'],
    relatedBorderSlug: 'panitanki-kakarbhitta',
  },

  nagarkot: {
    slug: 'nagarkot',
    subtitle: 'Himalayan Sunrise Viewpoint & Peaceful Valley Hill Station',
    howToReachSummary:
      'Nagarkot sits at 2,175 metres elevation on the eastern rim of the Kathmandu Valley, just 28 km from central Kathmandu and 15 km from Bhaktapur.',
    accessSteps: [
      {
        step: 1,
        title: 'From Kathmandu or Bhaktapur',
        detail:
          'Take a private taxi (1.5 hrs from Kathmandu Thamel, 45 mins from Bhaktapur) or local bus from Bhaktapur Kamalbinayak bus park.',
      },
    ],
    idealDuration: '1 to 2 days (overnight stay for sunrise recommended)',
    nearbyHubs: [
      { name: 'Bhaktapur', slug: 'bhaktapur', distanceNote: '15 km west (45 mins)' },
      { name: 'Kathmandu', slug: 'kathmandu', distanceNote: '28 km west (1.5 hrs)' },
      { name: 'Dhulikhel', slug: 'dhulikhel', distanceNote: '25 km south via mountain ridge' },
    ],
    relatedPackageSlugs: ['golden-triangle-nepal'],
    relatedGuideSlugs: ['nepal-trip-cost-budget-guide-indian-travelers'],
  },
}

export function getDestinationGuideData(slug: string): DestinationTransitPracticalities | null {
  return DESTINATION_GUIDE_DATA[slug] ?? null
}
