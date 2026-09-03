import type { FeatureCollection, Polygon } from 'geojson'

export interface ProvinceProperties {
  id: string
  name: string
  nepaliName: string
  capital: string
  color: string
  highlightColor: string
  areaKm2: number
  keyDestinations: string[]
}

/**
 * Lightweight, simplified GeoJSON Polygon boundaries for Nepal's 7 Provinces.
 * Optimized for fast client-side rendering (< 35KB) while maintaining accurate
 * provincial division lines across the Himalayas and Terai.
 */
export const NEPAL_PROVINCES_GEOJSON: FeatureCollection<Polygon, ProvinceProperties> = {
  type: 'FeatureCollection',
  features: [
    // 1. Koshi Province (Eastern Nepal)
    {
      type: 'Feature',
      id: 'koshi',
      properties: {
        id: 'koshi',
        name: 'Koshi Province',
        nepaliName: 'कोशी प्रदेश',
        capital: 'Biratnagar',
        color: 'rgba(59, 130, 246, 0.08)',
        highlightColor: '#3b82f6',
        areaKm2: 25905,
        keyDestinations: ['Everest Base Camp', 'Namche Bazaar', 'Ilam', 'Kanchenjunga'],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [86.35, 27.95],
            [86.85, 28.05],
            [87.35, 27.95],
            [88.12, 27.85],
            [88.19, 27.28],
            [88.12, 26.65],
            [88.05, 26.35],
            [87.25, 26.38],
            [86.88, 26.55],
            [86.55, 26.85],
            [86.42, 27.42],
            [86.35, 27.95],
          ],
        ],
      },
    },

    // 2. Madhesh Province (Southern Terai)
    {
      type: 'Feature',
      id: 'madhesh',
      properties: {
        id: 'madhesh',
        name: 'Madhesh Province',
        nepaliName: 'मधेश प्रदेश',
        capital: 'Janakpur',
        color: 'rgba(245, 158, 11, 0.08)',
        highlightColor: '#f59e0b',
        areaKm2: 9661,
        keyDestinations: ['Janakpurdham', 'Birgunj', 'Parsa National Park'],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [84.75, 27.15],
            [85.35, 27.10],
            [85.85, 27.05],
            [86.42, 26.95],
            [86.88, 26.55],
            [86.55, 26.40],
            [85.45, 26.55],
            [84.85, 26.85],
            [84.75, 27.15],
          ],
        ],
      },
    },

    // 3. Bagmati Province (Central Nepal / Capital)
    {
      type: 'Feature',
      id: 'bagmati',
      properties: {
        id: 'bagmati',
        name: 'Bagmati Province',
        nepaliName: 'बागमती प्रदेश',
        capital: 'Hetauda',
        color: 'rgba(16, 185, 129, 0.08)',
        highlightColor: '#10b981',
        areaKm2: 20300,
        keyDestinations: ['Kathmandu', 'Patan', 'Bhaktapur', 'Chitwan', 'Nagarkot', 'Langtang'],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [84.62, 28.25],
            [85.25, 28.38],
            [85.85, 28.28],
            [86.35, 27.95],
            [86.42, 27.42],
            [86.42, 26.95],
            [85.85, 27.05],
            [84.75, 27.15],
            [84.35, 27.45],
            [84.45, 27.95],
            [84.62, 28.25],
          ],
        ],
      },
    },

    // 4. Gandaki Province (Annapurna & Lakes)
    {
      type: 'Feature',
      id: 'gandaki',
      properties: {
        id: 'gandaki',
        name: 'Gandaki Province',
        nepaliName: 'गण्डकी प्रदेश',
        capital: 'Pokhara',
        color: 'rgba(14, 165, 233, 0.08)',
        highlightColor: '#0ea5e9',
        areaKm2: 21504,
        keyDestinations: ['Pokhara', 'Annapurna Sanctuary', 'Mustang', 'Muktinath', 'Bandipur', 'Manang'],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [83.45, 29.30],
            [84.15, 29.28],
            [84.62, 28.25],
            [84.45, 27.95],
            [84.35, 27.45],
            [83.85, 27.65],
            [83.35, 28.15],
            [83.15, 28.75],
            [83.45, 29.30],
          ],
        ],
      },
    },

    // 5. Lumbini Province (Buddha Birthplace & Western Terai)
    {
      type: 'Feature',
      id: 'lumbini',
      properties: {
        id: 'lumbini',
        name: 'Lumbini Province',
        nepaliName: 'लुम्बिनी प्रदेश',
        capital: 'Deukhuri',
        color: 'rgba(234, 88, 12, 0.08)',
        highlightColor: '#ea580c',
        areaKm2: 22288,
        keyDestinations: ['Lumbini', 'Bhairahawa', 'Palpa Tansen', 'Bardia', 'Nepalgunj'],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [82.25, 28.55],
            [83.15, 28.45],
            [83.35, 28.15],
            [83.85, 27.65],
            [84.35, 27.45],
            [83.55, 27.35],
            [82.65, 27.55],
            [81.45, 27.95],
            [81.35, 28.35],
            [82.25, 28.55],
          ],
        ],
      },
    },

    // 6. Karnali Province (Wild Lakes & High Trans-Himalaya)
    {
      type: 'Feature',
      id: 'karnali',
      properties: {
        id: 'karnali',
        name: 'Karnali Province',
        nepaliName: 'कर्णाली प्रदेश',
        capital: 'Birendranagar',
        color: 'rgba(139, 92, 246, 0.08)',
        highlightColor: '#8b5cf6',
        areaKm2: 27984,
        keyDestinations: ['Rara Lake', 'Shey Phoksundo Lake', 'Dolpo', 'Jumla'],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [81.55, 30.35],
            [82.85, 30.15],
            [83.45, 29.30],
            [83.15, 28.75],
            [82.25, 28.55],
            [81.45, 28.65],
            [81.25, 29.45],
            [81.55, 30.35],
          ],
        ],
      },
    },

    // 7. Sudurpashchim Province (Far-Western Highlands & Plains)
    {
      type: 'Feature',
      id: 'sudurpashchim',
      properties: {
        id: 'sudurpashchim',
        name: 'Sudurpashchim Province',
        nepaliName: 'सुदूरपश्चिम प्रदेश',
        capital: 'Godawari',
        color: 'rgba(236, 72, 153, 0.08)',
        highlightColor: '#ec4899',
        areaKm2: 19539,
        keyDestinations: ['Khaptad National Park', 'Shuklaphanta', 'Banbasa Gate', 'Dhangadhi'],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [80.15, 30.15],
            [81.55, 30.35],
            [81.25, 29.45],
            [81.45, 28.65],
            [81.35, 28.35],
            [80.35, 28.65],
            [80.05, 28.95],
            [80.15, 29.75],
            [80.15, 30.15],
          ],
        ],
      },
    },
  ],
}
