import NepaliDate from 'nepali-date-converter'

export interface NepaliMonthMeta {
  index: number // 1..12
  nameEn: string
  nameNp: string
  transliteration: string
  approxGregorian: string
  season: 'spring' | 'summer_monsoon' | 'autumn' | 'winter'
}

export const NEPALI_MONTHS: NepaliMonthMeta[] = [
  { index: 1, nameEn: 'Baishakh', nameNp: 'बैशाख', transliteration: 'Baisakh', approxGregorian: 'Mid Apr – Mid May', season: 'spring' },
  { index: 2, nameEn: 'Jestha', nameNp: 'जेठ', transliteration: 'Jestha', approxGregorian: 'Mid May – Mid Jun', season: 'spring' },
  { index: 3, nameEn: 'Ashadh', nameNp: 'असार', transliteration: 'Asar', approxGregorian: 'Mid Jun – Mid Jul', season: 'summer_monsoon' },
  { index: 4, nameEn: 'Shrawan', nameNp: 'साउन', transliteration: 'Sawan', approxGregorian: 'Mid Jul – Mid Aug', season: 'summer_monsoon' },
  { index: 5, nameEn: 'Bhadra', nameNp: 'भदौ', transliteration: 'Bhadau', approxGregorian: 'Mid Aug – Mid Sep', season: 'summer_monsoon' },
  { index: 6, nameEn: 'Ashwin', nameNp: 'असोज', transliteration: 'Asoj', approxGregorian: 'Mid Sep – Mid Oct', season: 'autumn' },
  { index: 7, nameEn: 'Kartik', nameNp: 'कार्तिक', transliteration: 'Kartik', approxGregorian: 'Mid Oct – Mid Nov', season: 'autumn' },
  { index: 8, nameEn: 'Mangsir', nameNp: 'मंसिर', transliteration: 'Mangsir', approxGregorian: 'Mid Nov – Mid Dec', season: 'autumn' },
  { index: 9, nameEn: 'Poush', nameNp: 'पुस', transliteration: 'Poush', approxGregorian: 'Mid Dec – Mid Jan', season: 'winter' },
  { index: 10, nameEn: 'Magh', nameNp: 'माघ', transliteration: 'Magh', approxGregorian: 'Mid Jan – Mid Feb', season: 'winter' },
  { index: 11, nameEn: 'Falgun', nameNp: 'फागुन', transliteration: 'Phalgun', approxGregorian: 'Mid Feb – Mid Mar', season: 'winter' },
  { index: 12, nameEn: 'Chaitra', nameNp: 'चैत', transliteration: 'Chaitra', approxGregorian: 'Mid Mar – Mid Apr', season: 'spring' },
]

export const GREGORIAN_MONTHS = [
  { index: 1, name: 'January', slug: 'january', short: 'Jan', season: 'winter' },
  { index: 2, name: 'February', slug: 'february', short: 'Feb', season: 'winter' },
  { index: 3, name: 'March', slug: 'march', short: 'Mar', season: 'spring' },
  { index: 4, name: 'April', slug: 'april', short: 'Apr', season: 'spring' },
  { index: 5, name: 'May', slug: 'may', short: 'May', season: 'spring' },
  { index: 6, name: 'June', slug: 'june', short: 'Jun', season: 'summer_monsoon' },
  { index: 7, name: 'July', slug: 'july', short: 'Jul', season: 'summer_monsoon' },
  { index: 8, name: 'August', slug: 'august', short: 'Aug', season: 'summer_monsoon' },
  { index: 9, name: 'September', slug: 'september', short: 'Sep', season: 'autumn' },
  { index: 10, name: 'October', slug: 'october', short: 'Oct', season: 'autumn' },
  { index: 11, name: 'November', slug: 'november', short: 'Nov', season: 'autumn' },
  { index: 12, name: 'December', slug: 'december', short: 'Dec', season: 'winter' },
] as const

const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९']

/** Converts Arabic numbers to Devanagari numerals (e.g. 2083 -> २०८३) */
export function toDevanagariDigits(value: number | string): string {
  return String(value)
    .split('')
    .map((char) => {
      const digit = parseInt(char, 10)
      return !isNaN(digit) ? DEVANAGARI_DIGITS[digit] : char
    })
    .join('')
}

export interface BsDateResult {
  year: number
  month: number // 1..12
  day: number
  monthNameEn: string
  monthNameNp: string
  formatted: string // "2083-07-03"
  formattedNp: string // "२०८३ कार्तिक ३"
  formattedEn: string // "3 Kartik 2083"
}

export interface AdDateResult {
  date: Date
  year: number
  month: number // 1..12
  day: number
  formatted: string // "YYYY-MM-DD"
  monthNameEn: string
  formattedEn: string // "Oct 20, 2026"
}

/** Converts Gregorian (AD) date to Bikram Sambat (BS) */
export function adToBs(dateInput: Date | string): BsDateResult {
  let jsDate: Date
  if (typeof dateInput === 'string') {
    const parts = dateInput.split('-').map(Number)
    if (parts.length >= 3) {
      jsDate = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0)
    } else {
      jsDate = new Date(dateInput)
    }
  } else {
    jsDate = dateInput
  }

  const np = new NepaliDate(jsDate)
  const year = np.getYear()
  const month = np.getMonth() + 1 // 1..12
  const day = np.getDate()

  const monthMeta = NEPALI_MONTHS[month - 1] ?? NEPALI_MONTHS[0]
  const monthNameEn = monthMeta.nameEn
  const monthNameNp = monthMeta.nameNp

  const formatted = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const formattedNp = `${toDevanagariDigits(year)} ${monthNameNp} ${toDevanagariDigits(day)}`
  const formattedEn = `${day} ${monthNameEn} ${year}`

  return {
    year,
    month,
    day,
    monthNameEn,
    monthNameNp,
    formatted,
    formattedNp,
    formattedEn,
  }
}

/** Converts Bikram Sambat (BS) date to Gregorian (AD) */
export function bsToAd(bsYear: number, bsMonth: number, bsDay: number): AdDateResult {
  // NepaliDate month is 0-indexed in constructor
  const np = new NepaliDate(bsYear, bsMonth - 1, bsDay)
  const jsDate = np.toJsDate()

  const year = jsDate.getFullYear()
  const month = jsDate.getMonth() + 1
  const day = jsDate.getDate()

  const formatted = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const monthMeta = GREGORIAN_MONTHS[month - 1] ?? GREGORIAN_MONTHS[0]
  const formattedEn = `${monthMeta.short} ${day}, ${year}`

  return {
    date: jsDate,
    year,
    month,
    day,
    formatted,
    monthNameEn: monthMeta.name,
    formattedEn,
  }
}

export interface CalendarDayItem {
  dayAd: number
  dateAd: string // "YYYY-MM-DD"
  isCurrentMonth: boolean
  isToday: boolean
  dayOfWeek: number // 0 (Sun) .. 6 (Sat)
  bs: BsDateResult
}

/** Generates calendar grid cells for a given Gregorian year and month (1..12) */
export function getMonthCalendarGrid(yearAd: number, monthAd1to12: number): CalendarDayItem[] {
  const daysInMonth = new Date(yearAd, monthAd1to12, 0).getDate()
  const firstDayOfWeek = new Date(yearAd, monthAd1to12 - 1, 1).getDay() // 0 = Sunday

  const now = new Date()
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  const items: CalendarDayItem[] = []

  // 1. Previous month padding days
  const prevMonthDays = new Date(yearAd, monthAd1to12 - 1, 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i
    const prevMonth = monthAd1to12 === 1 ? 12 : monthAd1to12 - 1
    const prevYear = monthAd1to12 === 1 ? yearAd - 1 : yearAd
    const dateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const bs = adToBs(dateStr)
    const dow = new Date(prevYear, prevMonth - 1, day).getDay()

    items.push({
      dayAd: day,
      dateAd: dateStr,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      dayOfWeek: dow,
      bs,
    })
  }

  // 2. Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${yearAd}-${String(monthAd1to12).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const bs = adToBs(dateStr)
    const dow = new Date(yearAd, monthAd1to12 - 1, day).getDay()

    items.push({
      dayAd: day,
      dateAd: dateStr,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      dayOfWeek: dow,
      bs,
    })
  }

  // 3. Next month padding days to complete 35 or 42 grid slots
  const remaining = (7 - (items.length % 7)) % 7
  for (let day = 1; day <= remaining; day++) {
    const nextMonth = monthAd1to12 === 12 ? 1 : monthAd1to12 + 1
    const nextYear = monthAd1to12 === 12 ? yearAd + 1 : yearAd
    const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const bs = adToBs(dateStr)
    const dow = new Date(nextYear, nextMonth - 1, day).getDay()

    items.push({
      dayAd: day,
      dateAd: dateStr,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      dayOfWeek: dow,
      bs,
    })
  }

  return items
}
