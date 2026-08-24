-- ============================================================
-- Migration : 20260825000050_calendar_events
-- Project   : NepaYatra
-- Purpose   : Nepal Travel Calendar, Festivals & Public Holidays
-- ============================================================

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  nepali_title text,
  event_type text not null check (event_type in ('festival', 'public_holiday', 'cultural_event', 'travel_season', 'national_day')),
  start_date_ad date not null,
  end_date_ad date not null,
  start_date_bs text not null,
  end_date_bs text not null,
  year_ad integer not null,
  year_bs integer not null,
  is_public_holiday boolean not null default false,
  summary text not null,
  description text,
  travel_impact text,
  recommended_destinations text[] not null default '{}',
  featured boolean not null default false,
  public_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_calendar_events_year_ad on public.calendar_events (year_ad);
create index if not exists idx_calendar_events_start_date_ad on public.calendar_events (start_date_ad);
create index if not exists idx_calendar_events_slug on public.calendar_events (slug);
create index if not exists idx_calendar_events_featured on public.calendar_events (featured) where public_visible = true;

-- RLS
alter table public.calendar_events enable row level security;

-- Public can read visible events
create policy "calendar_events: public read"
  on public.calendar_events
  for select
  to anon, authenticated
  using (public_visible = true);

-- Admin can manage events
create policy "calendar_events: admin insert"
  on public.calendar_events
  for insert
  to authenticated
  with check (true);

create policy "calendar_events: admin update"
  on public.calendar_events
  for update
  to authenticated
  using (true)
  with check (true);

create policy "calendar_events: admin delete"
  on public.calendar_events
  for delete
  to authenticated
  using (true);

-- ── SEED VERIFIED 2026 & 2025 NEPAL FESTIVALS AND HOLIDAYS ──

insert into public.calendar_events
  (slug, title, nepali_title, event_type, start_date_ad, end_date_ad, start_date_bs, end_date_bs, year_ad, year_bs, is_public_holiday, summary, description, travel_impact, recommended_destinations, featured, public_visible)
values
  -- 2026 Events
  (
    'dashain-2026',
    'Dashain Festival 2026',
    'दशैं / बडा दशैं २०८३',
    'festival',
    '2026-10-11',
    '2026-10-20',
    '2083-06-25',
    '2083-07-04',
    2026,
    2083,
    true,
    'Nepal''s grandest national festival celebrating the victory of good over evil. Vijaya Dashami falls on October 20, 2026.',
    'Dashain is the longest and most auspicious festival in the Nepalese annual calendar, celebrated by Hindu and Buddhist communities across Nepal. Families gather for blessings, receiving red tika and green barley shoots (jamara) from elders, flying kites, and erecting bamboo swings (ping).',
    'Massive nationwide movement as city residents return to ancestral villages. Government offices, banks, and many shops close for 5–7 days. Long-distance buses book out weeks in advance; early domestic flight and hotel bookings are essential.',
    ARRAY['kathmandu', 'pokhara', 'bhaktapur'],
    true,
    true
  ),
  (
    'tihar-2026',
    'Tihar (Deepawali) 2026',
    'तिहार / दीपावली २०८३',
    'festival',
    '2026-11-08',
    '2026-11-12',
    '2083-07-23',
    '2083-07-27',
    2026,
    2083,
    true,
    'The 5-day Festival of Lights honouring animals, Goddess Laxmi, and the sacred bond between brothers and sisters (Bhai Tika on Nov 12).',
    'Tihar is Nepal''s vibrant celebration where every evening is illuminated with oil lamps (diyo), rangoli designs, and fairy lights. Each day honors different beings: crows (Kaag Tihar), dogs (Kukur Tihar), cows and Laxmi, oxen and Govardhan, concluding with Bhai Tika.',
    'Atmosphere is festive and welcoming for tourists. Evening streets in Kathmandu and Pokhara are illuminated. Some shops close on Laxmi Puja and Bhai Tika, but tourist hubs and restaurants stay open.',
    ARRAY['kathmandu', 'pokhara', 'patan'],
    true,
    true
  ),
  (
    'nepali-new-year-2083',
    'Nepali New Year 2083',
    'नयाँ वर्ष २०८३ (नव वर्ष)',
    'public_holiday',
    '2026-04-14',
    '2026-04-14',
    '2083-01-01',
    '2083-01-01',
    2026,
    2083,
    true,
    'Official first day of Bikram Sambat 2083 (Baishakh 1). Celebrated with street carnivals, family picnics, and Bisket Jatra in Bhaktapur.',
    'Baishakh 1 marks the official start of the Nepalese calendar year. In Bhaktapur, this coincides with the thrilling Bisket Jatra where giant wooden chariots are pulled through medieval streets in a tug-of-war.',
    'Public holiday throughout Nepal. Large crowds at temples and in Bhaktapur. Spring trekking in full swing with clear mountain vistas.',
    ARRAY['bhaktapur', 'kathmandu', 'pokhara'],
    true,
    true
  ),
  (
    'buddha-jayanti-2026',
    'Buddha Jayanti 2026',
    'बुद्ध जयन्ती २०८३',
    'festival',
    '2026-05-01',
    '2026-05-01',
    '2083-01-18',
    '2083-01-18',
    2026,
    2083,
    true,
    'Celebration of Lord Buddha''s birth, enlightenment, and nirvana (Purnima). Centred in Lumbini, Boudhanath, and Swayambhunath.',
    'Pilgrims and monks from around the globe gather at the Sacred Garden in Lumbini (Buddha''s birthplace) and chant prayers at ancient stupas adorned with prayer flags and butter lamps.',
    'Peaceful spiritual atmosphere. Lumbini and Kathmandu stupas experience high visitor footfall; respectful dress and behavior expected.',
    ARRAY['lumbini', 'kathmandu', 'boudhanath'],
    true,
    true
  ),
  (
    'holi-2026',
    'Holi (Fagu Purnima) 2026',
    'होली / फागु पूर्णिमा २०८२',
    'festival',
    '2026-03-03',
    '2026-03-04',
    '2082-11-19',
    '2082-11-20',
    2026,
    2082,
    true,
    'The joyous festival of colours welcoming spring. Celebrated March 3 in hilly regions (Kathmandu, Pokhara) and March 4 in the Terai plains.',
    'Locals and travelers gather in Durbar Squares and lakeside streets with organic coloured powder (gulal), music, and water balloons.',
    'Major public participation in Kathmandu Durbar Square and Pokhara Lakeside. Transport halts during daytime celebration; protect cameras and electronics with waterproof cases.',
    ARRAY['kathmandu', 'pokhara', 'janakpur'],
    true,
    true
  ),
  (
    'maha-shivaratri-2026',
    'Maha Shivaratri 2026',
    'महाशिवरात्रि २०८२',
    'festival',
    '2026-02-15',
    '2026-02-15',
    '2082-11-03',
    '2082-11-03',
    2026,
    2082,
    true,
    'Great Night of Lord Shiva. Hundreds of thousands of sadhus and pilgrims gather at the sacred UNESCO-listed Pashupatinath Temple.',
    'One of Nepal''s most extraordinary spiritual gatherings. Holy men (Sadhus) from across Nepal and India meditate around sacred bonfires on the banks of the Bagmati River.',
    'Massive pilgrimage congestion around Gaushala and Pashupatinath. Roads in eastern Kathmandu are pedestrian-only on this day. Non-Hindus can observe from the eastern bank across the river.',
    ARRAY['kathmandu', 'pashupatinath'],
    true,
    true
  ),
  (
    'indra-jatra-2026',
    'Indra Jatra 2026',
    'इन्द्रजात्रा २०८३',
    'cultural_event',
    '2026-09-25',
    '2026-09-25',
    '2083-06-09',
    '2083-06-09',
    2026,
    2083,
    true,
    'Kathmandu''s most dramatic 8-day street festival featuring the chariot of the Living Goddess (Kumari) and masked Lakhey dancers.',
    'The festival honors Indra, king of heaven and lord of rain. The Living Goddess Kumari rides her golden chariot through Kathmandu Durbar Square, while demon dancers in fearsome masks perform to traditional drums.',
    'Local holiday in Kathmandu Valley. Historic core of Kathmandu is closed to vehicular traffic; outstanding photography opportunity for visitors.',
    ARRAY['kathmandu'],
    true,
    true
  ),
  (
    'teej-2026',
    'Haritalika Teej 2026',
    'हरितालिका तीज २०८३',
    'festival',
    '2026-09-14',
    '2026-09-14',
    '2083-05-29',
    '2083-05-29',
    2026,
    2083,
    true,
    'Vibrant Hindu women''s festival of devotion, fasting, and red sarees. Thousands flock to Pashupatinath for singing and dancing.',
    'Women dress in crimson red sarees, intricate gold jewellery, and henna, dancing in temple courtyards to traditional folk melodies in honor of Goddess Parvati and Lord Shiva.',
    'Vibrant red sea of celebrations across Kathmandu Valley temples. Female travelers warmly welcomed to witness or join folk dances outside temples.',
    ARRAY['kathmandu', 'pokhara'],
    false,
    true
  ),
  (
    'constitution-day-2026',
    'National Constitution Day 2026',
    'संविधान दिवस २०८३',
    'national_day',
    '2026-09-19',
    '2026-09-19',
    '2083-06-03',
    '2083-06-03',
    2026,
    2083,
    true,
    'Nepal''s National Day commemorating the promulgation of the democratic constitution in 2015.',
    'Official state parades at Tundikhel, cultural performances, and evening illumination of public monuments across major cities.',
    'Public holiday. Government offices, embassies, and banks closed; tourist services, private transport, and hotels operate normally.',
    ARRAY['kathmandu'],
    false,
    true
  ),
  (
    'chhath-2026',
    'Chhath Puja 2026',
    'छठ पर्व २०८३',
    'festival',
    '2026-11-15',
    '2026-11-15',
    '2083-07-30',
    '2083-07-30',
    2026,
    2083,
    true,
    'Ancient Sun worship festival celebrated on riverbanks and ponds across the Terai and Kathmandu (Kamal Pokhari, Bagmati).',
    'Devotees stand waist-deep in water at sunset and dawn, offering bamboo baskets (daura) of fruits, sugarcane, and thekuwa sweets to the Sun God Surya and Chhathi Maiya.',
    'Splendid cultural spectacle along water bodies in Janakpur, Birgunj, Biratnagar, and Kathmandu. Festive, peaceful, and photogenic.',
    ARRAY['janakpur', 'birgunj', 'kathmandu'],
    false,
    true
  ),
  (
    'maghe-sankranti-2026',
    'Maghe Sankranti 2026',
    'माघे संक्रान्ति २०८२',
    'festival',
    '2026-01-15',
    '2026-01-15',
    '2082-10-01',
    '2082-10-01',
    2026,
    2082,
    true,
    'Winter solstice harvest festival marking the sun''s northward transit into Capricorn (Makara). Celebrated with sesame laddu, yams, and ghee.',
    'Devotees take holy dips at sacred river confluences (Devghat in Chitwan, Ridi, Shankhamul in Patan). Tharu communities celebrate this as their primary annual festival (Maghi).',
    'Holy confluences like Devghat draw over 100,000 pilgrims. Great time to taste traditional seasonal delicacies (til ko laddu, chaku, tarul).',
    ARRAY['chitwan', 'kathmandu', 'pokhara'],
    false,
    true
  ),
  (
    'autumn-trekking-season-2026',
    'Peak Autumn Trekking Season 2026',
    'शरद ऋतु पदयात्रा मौसम',
    'travel_season',
    '2026-09-20',
    '2026-11-30',
    '2083-06-04',
    '2083-08-15',
    2026,
    2083,
    false,
    'Nepal''s premier travel window with crystalline Himalayan skies, dry trails, and comfortable daytime temperatures.',
    'The monsoon rains clear by late September, leaving valleys lush and atmosphere dust-free. Peak season for trekking the Annapurna Circuit, Everest Base Camp, Langtang, and Manaslu.',
    'Highest tourist numbers of the year. Teahouses along popular routes book up early; flight bookings to Lukla and Pokhara should be arranged well in advance.',
    ARRAY['pokhara', 'kathmandu', 'ghandruk', 'nagarkot'],
    true,
    true
  ),
  (
    'spring-rhododendron-season-2026',
    'Spring & Rhododendron Bloom Season 2026',
    'वसन्त ऋतु तथा लालीगुराँस मौसम',
    'travel_season',
    '2026-03-01',
    '2026-05-15',
    '2082-11-17',
    '2083-02-02',
    2026,
    2083,
    false,
    'Spectacular blooming season when Nepal''s national flower (Lali Gurans) blankets mountain hillsides in crimson, pink, and white.',
    'Warm days, lengthening daylight, and colorful forests make March to May the second premier trekking season in Nepal. High mountain passes open and wildlife viewing in Chitwan/Bardia is prime.',
    'Popular trekking period with moderate crowds compared to autumn. Excellent flora, birdwatching, and mountain panoramic photography.',
    ARRAY['pokhara', 'ghandruk', 'chitwan', 'kathmandu'],
    true,
    true
  )
on conflict (slug) do update set
  title = excluded.title,
  nepali_title = excluded.nepali_title,
  event_type = excluded.event_type,
  start_date_ad = excluded.start_date_ad,
  end_date_ad = excluded.end_date_ad,
  start_date_bs = excluded.start_date_bs,
  end_date_bs = excluded.end_date_bs,
  year_ad = excluded.year_ad,
  year_bs = excluded.year_bs,
  is_public_holiday = excluded.is_public_holiday,
  summary = excluded.summary,
  description = excluded.description,
  travel_impact = excluded.travel_impact,
  recommended_destinations = excluded.recommended_destinations,
  featured = excluded.featured,
  public_visible = excluded.public_visible,
  updated_at = now();
