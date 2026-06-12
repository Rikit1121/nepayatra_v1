-- ============================================================
-- Migration : 20260612000003_seed
-- Project   : NepaYatra
-- Purpose   : Development and staging seed data
--             Realistic Nepal travel content for Indian travelers
--
-- UUID strategy: Fixed UUIDs for destinations and crossings so that
-- destination_connections FK references are stable across re-seeds.
-- ============================================================

-- ============================================================
-- DESTINATIONS
-- ============================================================

insert into public.destinations
  (id, name, slug, short_description, full_description, category, province,
   latitude, longitude, altitude_meters, best_season, featured,
   seo_title, seo_description)
values

-- ── Core / City Destinations ──────────────────────────────

('10000000-0000-0000-0000-000000000001',
 'Kathmandu',
 'kathmandu',
 'Nepal''s vibrant capital blending ancient temples, UNESCO World Heritage Sites, and a thriving backpacker scene in the heart of the Himalayas.',
 'Kathmandu is the cultural, political, and economic heart of Nepal. Perched in a valley at 1,400 metres, the city is home to seven UNESCO World Heritage Sites including Pashupatinath Temple, Boudhanath Stupa, and the historic Durbar Squares of Kathmandu, Bhaktapur, and Patan. The bustling Thamel neighbourhood is the base for most Indian travellers, offering easy access to trekking agencies, restaurants, and gear shops. The city is the main gateway for most Nepal visits — all major international and domestic flights connect through Tribhuvan International Airport.',
 'cultural', 'bagmati',
 27.717200, 85.324000, 1400,
 ARRAY['September','October','November','March','April','May'],
 true,
 'Kathmandu Travel Guide for Indian Travelers | NepaYatra',
 'Complete guide to visiting Kathmandu — temples, heritage sites, food, transport, and tips for Indian travelers crossing from Raxaul or by air.'),

('10000000-0000-0000-0000-000000000002',
 'Bhaktapur',
 'bhaktapur',
 'A living medieval city of terracotta architecture, woodcarved temples, and potters'' squares — the best-preserved Newari town in the Kathmandu Valley.',
 'Bhaktapur, also called Bhadgaon or the "City of Devotees", is a UNESCO World Heritage Site located 13 km east of Kathmandu. The medieval city retains its 15th-century character with narrow brick lanes, intricately carved wooden windows, and three distinct Durbar Squares. The Nyatapola Temple — Nepal''s tallest pagoda at five stories — dominates the skyline. The city is famous for the Juju Dhau (king curd), a thick buffalo-milk yoghurt sold in clay pots, and the Bhaktapur Pottery Square where traditional wheel-thrown pottery is still made. Entry requires a separate ticket (₹1,500 for SAARC nationals).',
 'heritage', 'bagmati',
 27.672000, 85.429800, 1401,
 ARRAY['September','October','November','March','April','May'],
 true,
 'Bhaktapur Day Trip Guide | NepaYatra',
 'Explore Bhaktapur''s medieval Durbar Square, Nyatapola Temple, and pottery square. A must-visit UNESCO heritage town near Kathmandu.'),

('10000000-0000-0000-0000-000000000003',
 'Patan',
 'patan',
 'Known as the "City of Fine Arts", Patan''s Durbar Square is ringed by exquisite Newari temples, courtyards, and the finest bronze-work in Nepal.',
 'Patan (Lalitpur) lies just south of Kathmandu across the Bagmati River, yet feels like an entirely different world. Its UNESCO-listed Durbar Square contains the Krishna Mandir, a stunning 17th-century stone temple with scenes from the Mahabharata and Ramayana carved around its two lower levels. The adjacent Patan Museum, ranked among Asia''s best, houses a superb collection of Hindu and Buddhist bronzes. Patan''s metalsmith tradition is centuries old — the neighbourhood of Mahabouddha is lined with workshops producing fine bronze and copper statues. Patan is easily combined with Kathmandu as a half-day or full-day trip.',
 'heritage', 'bagmati',
 27.666700, 85.316700, 1350,
 ARRAY['September','October','November','March','April','May'],
 true,
 'Patan (Lalitpur) Travel Guide | NepaYatra',
 'Discover Patan''s Durbar Square, Patan Museum, and renowned metalsmith quarter. A half-day trip from Kathmandu with unrivalled Newari heritage.'),

('10000000-0000-0000-0000-000000000004',
 'Pokhara',
 'pokhara',
 'Nepal''s adventure capital on the shores of Phewa Lake, with a dramatic backdrop of the Annapurna and Dhaulagiri ranges reflected in the still water.',
 'Pokhara is Nepal''s second largest city and the primary gateway for the Annapurna Conservation Area, one of the world''s most popular trekking regions. Situated at 827 metres, the city enjoys a warmer, more subtropical climate than Kathmandu. Phewa Lake is the centrepiece — visitors hire rowboats to the Tal Barahi Temple on its island, while the lakeside Baidam promenade is lined with restaurants and cafés offering views of Machapuchare (Fishtail Mountain). The city is the hub for paragliding, zip-lining, white-water rafting, and ultra-trail running. The Pokhara Regional Museum and the International Mountain Museum are worth half a day each.',
 'scenic', 'gandaki',
 28.209600, 83.985600, 827,
 ARRAY['September','October','November','March','April','May'],
 true,
 'Pokhara Travel Guide for Indian Travelers | NepaYatra',
 'Complete guide to Pokhara — Phewa Lake, Annapurna views, paragliding, and the lakeside district. 6-hour bus or 25-minute flight from Kathmandu.'),

('10000000-0000-0000-0000-000000000005',
 'Chitwan',
 'chitwan',
 'Home to one-horned rhinoceroses, Bengal tigers, and wild elephants in a UNESCO-listed national park — the top wildlife destination in Nepal.',
 'Chitwan National Park, designated a UNESCO World Heritage Site in 1984, is Nepal''s oldest and most visited national park. Covering 952 km² in the subtropical Terai lowlands, the park shelters over 600 one-horned rhinoceroses, around 120 Bengal tigers, wild elephants, gharial crocodiles, and 543 species of birds. The gateway town of Sauraha offers jungle safaris by jeep, elephant, dugout canoe, and on foot. An authentic Tharu cultural show in the evenings gives a glimpse into the indigenous Tharu community''s dances and traditions. Chitwan is equally accessible from Kathmandu and Pokhara, making it an ideal add-on for any Nepal itinerary.',
 'wildlife', 'bagmati',
 27.529100, 84.354200, 100,
 ARRAY['October','November','December','January','February','March'],
 true,
 'Chitwan National Park Guide | NepaYatra',
 'Plan your Chitwan National Park visit — rhino safaris, tiger tracking, canoe rides, and Tharu culture. 4–5 hours from Kathmandu or Pokhara.'),

('10000000-0000-0000-0000-000000000006',
 'Janakpur',
 'janakpur',
 'The holy city of Sita, birthplace of the goddess in Hindu mythology, and home to the magnificent Janaki Mandir — a major pilgrimage site for Indian devotees.',
 'Janakpur is one of the most significant Hindu pilgrimage cities in Nepal and holds special importance for Indian devotees as the birthplace of Goddess Sita and the venue of her marriage to Lord Ram. The Janaki Mandir, built in 1911 in Mughal-Rajput style and dedicated to Sita, is the centrepiece. The city hosts large fairs during Vivah Panchami (November/December) that draw hundreds of thousands of pilgrims from both India and Nepal. Janakpur is also the cultural capital of the Maithili community and is known for Mithila painting — a folk art tradition recognised by UNESCO. The recently restored Janakpur–Jaynagar narrow-gauge railway connects the city to Bihar, though service is intermittent.',
 'religious', 'madhesh',
 26.728600, 85.925900, 70,
 ARRAY['October','November','February','March','April'],
 true,
 'Janakpur Pilgrimage Guide | NepaYatra',
 'Visit Janakpur — Goddess Sita''s birthplace, Janaki Mandir, and Mithila painting. Nepal''s holiest city for Indian Hindu pilgrims.'),

('10000000-0000-0000-0000-000000000007',
 'Lumbini',
 'lumbini',
 'The birthplace of Lord Buddha and a UNESCO World Heritage Site — a serene pilgrimage park surrounded by monasteries from Buddhist nations worldwide.',
 'Lumbini is revered as the birthplace of Siddhartha Gautama — the Buddha — who was born here in 563 BCE. A UNESCO World Heritage Site since 1997, the Lumbini Garden contains the Maya Devi Temple marking the exact birth spot, the Ashoka Pillar erected by Emperor Ashoka in 249 BCE, and the sacred Puskarini pond where the Buddha''s mother bathed. Surrounding the central garden, the Lumbini Development Zone contains over 20 monasteries built by Buddhist nations including India, China, Japan, Myanmar, and Korea. The zone is divided into the East Monastic Zone (Theravada) and the West (Mahayana and Vajrayana). Lumbini is approximately 280 km west of Kathmandu and 22 km from the Indian border at Sunauli.',
 'religious', 'lumbini',
 27.483300, 83.283300, 95,
 ARRAY['October','November','December','February','March','April'],
 true,
 'Lumbini Buddhist Pilgrimage Guide | NepaYatra',
 'Complete guide to Lumbini — Buddha''s birthplace, Maya Devi Temple, Ashoka Pillar, and international monasteries. Entry via Sunauli border.'),

-- ── Scenic / Hill Station Destinations ───────────────────

('10000000-0000-0000-0000-000000000008',
 'Nagarkot',
 'nagarkot',
 'A hilltop escape east of Kathmandu offering the widest panorama of the Himalayan range from Dhaulagiri in the west to Kanchenjunga in the east.',
 'Nagarkot sits at 2,175 metres on the eastern rim of the Kathmandu Valley, 28 km from the city. It is famous for spectacular sunrise views over eight of the world''s fourteen 8,000-metre peaks, including Everest, Lhotse, and Cho Oyu. On clear days the panorama spans over 200 km of the Himalayan arc. Nagarkot makes an excellent overnight trip from Kathmandu — many visitors arrive by late afternoon, watch the sunset, stay at one of the hilltop resorts, and then catch the sunrise the next morning before hiking or taking the bus back. The downhill walk through Changu Narayan to Bhaktapur (3–4 hours) is a popular trekking day out.',
 'scenic', 'bagmati',
 27.716700, 85.516700, 2175,
 ARRAY['September','October','November','December','March','April'],
 false,
 'Nagarkot Sunrise & Himalayan View Guide | NepaYatra',
 'Visit Nagarkot for the best Himalayan sunrise in the Kathmandu Valley. See Everest and 7 other 8,000m peaks from just 28 km from Kathmandu.'),

('10000000-0000-0000-0000-000000000009',
 'Dhulikhel',
 'dhulikhel',
 'A preserved Newari hill town with panoramic Himalayan views, tranquil mountain lodges, and a convenient day-trip distance from Kathmandu.',
 'Dhulikhel is a compact Newari hill town at 1,550 metres, 30 km east of Kathmandu on the Arniko Highway. Less visited than Nagarkot but offering equally good Himalayan panoramas — on clear days you can see peaks from Ganesh Himal to Numbur. The old town has well-preserved Newari houses, stone-paved lanes, and small temples. Dhulikhel is popular with cyclists coming from Kathmandu along the valley road, and with those who want a quiet hilltop base without the tourist infrastructure of Nagarkot. The sunrise point above town requires a 20-minute walk from the main square.',
 'scenic', 'bagmati',
 27.624100, 85.546300, 1550,
 ARRAY['September','October','November','March','April','May'],
 false,
 'Dhulikhel Travel Guide | NepaYatra',
 'Discover Dhulikhel — a peaceful Newari hill town with Himalayan views, 30 km from Kathmandu. Perfect day trip or overnight escape.'),

('10000000-0000-0000-0000-000000000010',
 'Bandipur',
 'bandipur',
 'A perfectly preserved hilltop bazaar town where time stands still — Newari architecture, mountain views, and a complete absence of motor vehicles on the main street.',
 'Bandipur is a hilltop trading town in the Gandaki Province, situated at 1,030 metres between Kathmandu and Pokhara. The entire town centre is a pedestrian zone of immaculately maintained Newari brick houses, traditional inns, and temples that have stood since the 18th century when Bandipur was a thriving trade junction on the India–Tibet route. The cobblestone bazaar street is lined with carved wooden balconies and houses converted into boutique guest houses. From the Thani Mai hilltop shrine above town, views of Manaslu, Annapurna, and Dhaulagiri are outstanding. Bandipur is an easy stop when travelling between Kathmandu and Pokhara — 20 minutes off the main highway.',
 'heritage', 'gandaki',
 27.933300, 84.416700, 1030,
 ARRAY['September','October','November','March','April','May'],
 false,
 'Bandipur Hill Town Guide | NepaYatra',
 'Explore Bandipur — Nepal''s best-preserved hilltop bazaar town. Newari architecture, mountain views, and zero motor vehicles. Stop en route Kathmandu–Pokhara.'),

('10000000-0000-0000-0000-000000000011',
 'Sarangkot',
 'sarangkot',
 'The premier sunrise viewpoint above Pokhara, famous for Annapurna panoramas and as the launch point for Nepal''s most popular paragliding flights.',
 'Sarangkot rises to 1,600 metres on a ridge north of Pokhara Lake, offering the best foreground view of the Annapurna and Dhaulagiri massifs. Most visitors make the pre-dawn drive or hike (1.5 hours from Pokhara lakeside) to catch the sunrise behind Machapuchare and Annapurna South. The viewpoint tower gives an unobstructed 180-degree sweep of the range. Sarangkot is also the official launch point for tandem paragliding over Pokhara''s lakes — typically a 20–30 minute flight landing on the Lakeside promenade. The hike from Sarangkot to Naudanda, continuing on the Australian Camp trail, is a rewarding half-day walk through Gurung villages.',
 'scenic', 'gandaki',
 28.250000, 83.933300, 1600,
 ARRAY['September','October','November','March','April'],
 false,
 'Sarangkot Sunrise & Paragliding Guide | NepaYatra',
 'Sarangkot offers the best Annapurna sunrise views near Pokhara. Paragliding launch point with flights over Phewa Lake. 30 min from lakeside.'),

('10000000-0000-0000-0000-000000000012',
 'Ilam',
 'ilam',
 'Nepal''s tea garden region in the far east — lush rolling hills covered with Darjeeling-style tea estates, mist, and views of Kanchenjunga.',
 'Ilam is the tea capital of Nepal, located in the far eastern hills of Koshi Province near the Indian border with Darjeeling. At 1,200 metres, the town is surrounded by manicured tea gardens producing some of Nepal''s finest first-flush teas. The Mai Pokhari wetland, a Ramsar-listed sacred lake surrounded by forest, is a short drive from town. The Antu Hill viewpoint provides sunrise views of Kanchenjunga, the world''s third-highest peak. Ilam is part of the eastern tea trail — a walking route through tea gardens, cardamom farms, and traditional Rai and Limbu villages. The town is 35 km from the Panitanki–Kakarbhitta border crossing.',
 'scenic', 'koshi',
 26.916700, 87.916700, 1200,
 ARRAY['March','April','May','September','October','November'],
 false,
 'Ilam Tea Gardens Guide | NepaYatra',
 'Explore Ilam — Nepal''s tea garden region with Darjeeling-style estates, Kanchenjunga views, and the sacred Mai Pokhari lake. Near Kakarbhitta border.'),

('10000000-0000-0000-0000-000000000013',
 'Rara Lake',
 'rara-lake',
 'Nepal''s largest and deepest lake, a remote sapphire jewel at 2,990 metres in the Karnali highlands — pristine wilderness visited by fewer than 3,000 tourists per year.',
 'Rara Lake in Mugu District, Karnali Province, is Nepal''s largest lake (10.8 km²) and among its most pristine. At 2,990 metres above sea level, the deep azure lake is ringed by thick Himalayan forest and the peaks of Rara National Park. Wildlife includes musk deer, red pandas, snow leopards, and migratory water birds. The remote location means few visitors — access requires either a domestic flight to Jumla followed by a 2–3 day trek, or a longer overland journey from Surkhet. The remoteness is precisely the appeal for travellers seeking complete wilderness without crowds. The lake is visible from its shores as a brilliant turquoise sheet surrounded by dark conifer forests.',
 'scenic', 'karnali',
 29.533300, 82.083300, 2990,
 ARRAY['May','June','September','October','November'],
 false,
 'Rara Lake Trekking Guide | NepaYatra',
 'Trek to Rara Lake — Nepal''s largest, most remote lake in the Karnali Highlands. Pristine wilderness, wildlife, and sapphire blue waters.'),

-- ── Religious Destinations ────────────────────────────────

('10000000-0000-0000-0000-000000000014',
 'Muktinath',
 'muktinath',
 'A sacred site revered by both Hindus and Buddhists at 3,800 metres — pilgrims from across India visit the eternal flame, the 108 water spouts, and the ancient temple.',
 'Muktinath Temple, at 3,800 metres in the Mustang district, is one of the most sacred sites in Hinduism and Tibetan Buddhism. For Hindus it is one of the 108 Divya Desams (sacred Vishnu temples) and is dedicated to Mukti Nath, the Lord of Liberation. For Tibetan Buddhists it is the site of the sky-element dhatu and is venerated as a Dakini Palace. The temple complex includes 108 stone water spouts shaped like cow heads, from which ice-cold water flows year-round — devotees traditionally bathe under all 108. The nearby eternal flame (dhungdung) burns from natural gas venting through rock. Muktinath is accessible by jeep from Jomsom (30 minutes) or on foot via the classic Annapurna Circuit.',
 'religious', 'gandaki',
 28.818300, 83.870000, 3800,
 ARRAY['May','June','July','September','October'],
 true,
 'Muktinath Temple Pilgrimage Guide | NepaYatra',
 'Plan your Muktinath pilgrimage — 108 water spouts, eternal flame, and high-altitude Vishnu temple at 3,800m. Fly Pokhara–Jomsom or trek the Annapurna Circuit.'),

('10000000-0000-0000-0000-000000000015',
 'Pashupatinath',
 'pashupatinath',
 'Nepal''s holiest Hindu temple on the banks of the Bagmati River — a UNESCO World Heritage complex of golden spires, cremation ghats, and devout pilgrimage.',
 'The Pashupatinath Temple complex on the banks of the Bagmati River in Kathmandu is Nepal''s holiest Hindu shrine and a UNESCO World Heritage Site. Dedicated to Pashupatinath (Lord Shiva as lord of all living beings), the main temple''s golden roof and silver doors are visible from the ghats below. The surrounding complex contains 518 mini-temples and houses one of the four most important Shivalinga in the world. The riverside ghats serve as cremation sites, and witnessing the sacred funeral rites here is a moving and deeply spiritual experience. The temple precinct is open to Hindus only, though non-Hindu visitors can observe freely from the eastern bank of the Bagmati. The annual Maha Shivaratri festival draws over one million pilgrims.',
 'religious', 'bagmati',
 27.710500, 85.348400, 1390,
 ARRAY['September','October','November','February','March','April'],
 true,
 'Pashupatinath Temple Guide | NepaYatra',
 'Visit Pashupatinath — Nepal''s holiest Hindu temple and UNESCO site in Kathmandu. Bagmati River ghats, cremation rites, and Maha Shivaratri festival.'),

-- ── Adventure & Trekking Destinations ────────────────────

('10000000-0000-0000-0000-000000000016',
 'Mustang',
 'mustang',
 'The forbidden kingdom — a high-altitude Tibetan plateau encircled by desert cliffs, medieval cave monasteries, and the walled city of Lo Manthang.',
 'Upper Mustang (Lo Manthang) was closed to foreign visitors until 1992 and retains an extraordinary Tibetan character largely unchanged for centuries. The walled city of Lo Manthang, capital of the ancient Kingdom of Lo, contains the royal palace, three major gompas (monasteries), and whitewashed houses of the Lo-pa people. The landscape is otherworldly — ochre cliffs, eroded canyons in deep reds and yellows, and sky caves carved into vertical walls that contain ancient Buddhist murals and mummies. A special restricted area permit (USD 500 for 10 days) is required beyond Kagbeni. The classic approach is a domestic flight from Pokhara to Jomsom followed by a jeep or multi-day trek north through the Kali Gandaki valley.',
 'adventure', 'gandaki',
 28.996800, 83.847300, 3840,
 ARRAY['May','June','July','September','October'],
 true,
 'Mustang & Lo Manthang Travel Guide | NepaYatra',
 'Explore the forbidden kingdom of Upper Mustang — cave monasteries, walled city of Lo Manthang, and Tibetan plateau landscapes. Restricted permit required.'),

('10000000-0000-0000-0000-000000000017',
 'Manang',
 'manang',
 'A high-altitude Tibetan-influenced village on the classic Annapurna Circuit route, surrounded by glaciers, ice lakes, and towering peaks.',
 'Manang village at 3,500 metres is the main acclimatisation stop on the Annapurna Circuit trek. The village retains a strong Tibetan Buddhist character with whitewashed chortens, fluttering prayer flags, and gompa monasteries perched on the hillside. The surrounding landscape includes the turquoise Gangapurna Lake, the Annapurna III and Gangapurna glaciers, and the dramatic Thorong La Pass (5,416 m) just to the north. The daily Himalayan Rescue Association lecture on altitude sickness is essential for all trekkers passing through. From Manang, the Milarepa Cave (2-hour return hike) and the Ice Lake (4-hour return hike to 4,600 m) are outstanding day excursions.',
 'trekking', 'gandaki',
 28.666700, 84.016700, 3500,
 ARRAY['April','May','September','October','November'],
 false,
 'Manang Annapurna Circuit Guide | NepaYatra',
 'Plan your Manang acclimatisation stop on the Annapurna Circuit — Gangapurna Lake, Ice Lake hike, and Thorong La Pass preparation.'),

('10000000-0000-0000-0000-000000000018',
 'Ghandruk',
 'ghandruk',
 'A large Gurung village at 1,940 metres with close-up Annapurna views, stone-paved lanes, traditional wooden inns, and the starting point for numerous short treks.',
 'Ghandruk is the largest Gurung village in Nepal and a premier trekking hub in the lower Annapurna region. Sitting at 1,940 metres on a wide south-facing terrace, the village has close-up, dramatic views of Annapurna South, Hiunchuli, and Machapuchare (Fishtail). The stone-paved village lanes connect traditional Gurung houses, many of which have been converted to comfortable lodges. The Open-Air Gurung Museum provides insight into the Gurung community''s military tradition (the Gurkhas) and daily life. Ghandruk is the crossroads of multiple trekking routes: the short Ghandruk Loop (2–3 days from Pokhara), the Annapurna Base Camp approach (continuing north), and the Jomsom Trek (heading west).',
 'trekking', 'gandaki',
 28.383300, 83.800000, 1940,
 ARRAY['October','November','March','April','May'],
 false,
 'Ghandruk Trekking Guide | NepaYatra',
 'Trek to Ghandruk — Nepal''s best Gurung village with Annapurna South views. Gateway to Annapurna Base Camp and the Annapurna Sanctuary.'),

('10000000-0000-0000-0000-000000000019',
 'Annapurna Base Camp',
 'annapurna-base-camp',
 'A glacial amphitheatre at 4,130 metres encircled by the Annapurna Massif — the most dramatic mountain sanctuary reachable on a standard Nepal trek.',
 'Annapurna Base Camp (ABC) sits at 4,130 metres in the Annapurna Sanctuary, a glacial basin ringed on all sides by peaks above 6,000 metres including Annapurna I (8,091 m), Annapurna South, Machapuchare, and Hiunchuli. The classic route begins in Nayapul (1.5 hours from Pokhara by road) and takes 7–12 days return through rhododendron forests, Modi Khola valley, Chomrong, and Deurali. The final approach crosses the Modi Glacier moraine and arrives in the sanctuary at dawn to witness the sun strike the surrounding peaks — one of the most moving sights in trekking. Permits required: ACAP (Annapurna Conservation Area) and TIMS card, both obtainable in Pokhara.',
 'trekking', 'gandaki',
 28.533300, 83.866700, 4130,
 ARRAY['October','November','March','April'],
 true,
 'Annapurna Base Camp Trek Guide | NepaYatra',
 'Plan your Annapurna Base Camp trek — complete guide to the 7–12 day route, permits, best season, and what to expect in the 4,130m Himalayan sanctuary.'),

-- ── Wildlife Destinations ─────────────────────────────────

('10000000-0000-0000-0000-000000000020',
 'Bardia National Park',
 'bardia-national-park',
 'Nepal''s largest national park in the western Terai — home to wild tigers, rhinos, and elephants in a remote wilderness with far fewer visitors than Chitwan.',
 'Bardia National Park covers 968 km² in the remote far-western Terai and is Nepal''s largest and most pristine national park. It is home to around 50 Bengal tigers, over 100 one-horned rhinoceroses, wild elephants, Gangetic dolphins in the Karnali River, and hundreds of bird species. Unlike the heavily touristed Chitwan, Bardia receives only a fraction of the visitors — making wildlife sightings and the jungle experience feel genuinely wild. Jeep safaris, canoe trips on the Karnali, and multi-day jungle walks with experienced naturalist guides are the main activities. The best approach is by overnight bus or flight from Kathmandu to Nepalgunj (1 hour), then a 3-hour drive to Thakurdwara village.',
 'wildlife', 'lumbini',
 28.333300, 81.500000, 150,
 ARRAY['October','November','December','January','February','March'],
 false,
 'Bardia National Park Safari Guide | NepaYatra',
 'Visit Bardia National Park — Nepal''s wildest tiger reserve with far fewer crowds than Chitwan. Bengal tigers, rhinos, and Karnali River dolphin watching.'),

-- ── Gateway / Route Planner Node ─────────────────────────

('10000000-0000-0000-0000-000000000021',
 'Birgunj',
 'birgunj',
 'The principal land entry point for Indian travelers entering Nepal, directly connected to Raxaul (Bihar) across the busiest Nepal–India border crossing.',
 'Birgunj is the main commercial gateway between India and Nepal, located on the Terai plains of Madhesh Province directly opposite Raxaul in Bihar. For Indian travellers, it is the most common land entry into Nepal — the border at Raxaul–Birgunj handles the highest volume of cross-border traffic. Birgunj itself is primarily a transit and commercial town; most travellers continue onward to Kathmandu (130 km north, 4–5 hours by bus) or other destinations without stopping. The border is open 24 hours for pedestrians and vehicles. The town has regular bus connections to Kathmandu, Pokhara, Janakpur, and Chitwan. A new fast highway connecting Birgunj to Kathmandu via the Hetauda–Bhimphedi section has reduced road journey times.',
 'cultural', 'madhesh',
 27.013300, 84.886100, 80,
 ARRAY['October','November','December','February','March','April'],
 false,
 'Birgunj Entry Point Guide | NepaYatra',
 'Entering Nepal from Raxaul via Birgunj — border procedures, bus connections to Kathmandu, and travel tips for Indian travelers.');

-- ============================================================
-- BORDER CROSSINGS
-- ============================================================

insert into public.border_crossings
  (id, crossing_name, india_side, nepal_side, description, latitude, longitude,
   operating_notes, featured)
values

('20000000-0000-0000-0000-000000000001',
 'Raxaul–Birgunj',
 'Raxaul, East Champaran, Bihar',
 'Birgunj, Parsa District, Madhesh Province',
 'The busiest Nepal–India land border crossing, connecting Bihar''s Raxaul to Nepal''s commercial hub of Birgunj. Used by millions of travelers and the majority of overland freight between the two countries.',
 27.013300, 84.869700,
 E'Operating Hours: Open 24 hours for pedestrian and vehicle crossing.\n\nRequired Documents (Indian citizens): Valid Indian passport or Voter ID card. No visa required for Indian nationals.\n\nTransport from Raxaul: Auto-rickshaw or cycle-rickshaw to the border gate (10 min). Buses and shared jeeps from Birgunj bus park to Kathmandu (4–5 hrs, ₹500–800).\n\nVehicles: Private cars, buses, motorcycles, and commercial trucks all permitted. Vehicles must complete customs formalities at the dry port.\n\nSeasonal Notes: Road is operational year-round. Minor congestion during major Indian and Nepali festivals. The Pathlaiya–Hetauda highway section is being upgraded; allow extra travel time for construction delays.',
 true),

('20000000-0000-0000-0000-000000000002',
 'Sunauli–Bhairahawa',
 'Sunauli, Maharajganj, Uttar Pradesh',
 'Bhairahawa (Siddharthanagar), Rupandehi District, Lumbini Province',
 'The preferred crossing for pilgrims visiting Lumbini (22 km) and travelers heading to Pokhara. Direct bus services run from Gorakhpur through Sunauli into Nepal.',
 27.506800, 83.441700,
 E'Operating Hours: Open 24 hours.\n\nRequired Documents: Valid Indian passport or Voter ID card. Indian nationals do not require a Nepal visa.\n\nConnections from Bhairahawa: Lumbini (22 km, 30 min by auto-rickshaw). Pokhara (165 km, 4–5 hrs by tourist bus). Kathmandu (280 km, 7–8 hrs by tourist bus).\n\nFrom India: Regular buses from Gorakhpur to Sunauli border (90 km, 2 hrs). Also accessible from Varanasi (230 km).\n\nNote: The town of Bhairahawa (also called Siddharthanagar or Nautanwa on the Indian side) has a domestic airport with flights to Kathmandu.',
 true),

('20000000-0000-0000-0000-000000000003',
 'Jogbani–Biratnagar',
 'Jogbani, Araria, Bihar',
 'Biratnagar, Morang District, Koshi Province',
 'The main crossing for eastern Nepal, connecting Jogbani in Bihar to Biratnagar — Nepal''s second largest city and an industrial hub with a domestic airport.',
 26.401500, 87.269000,
 E'Operating Hours: Open 24 hours.\n\nRequired Documents: Valid Indian passport or Voter ID card. No visa required for Indian nationals.\n\nConnections from Biratnagar: Domestic flights to Kathmandu (1 hr, several daily). Bus to Kathmandu (12–14 hrs). Ideal base for eastern Nepal destinations: Ilam (3 hrs by road), Koshi Tappu Wildlife Reserve (1 hr).\n\nFrom India: Buses and trains from Patna or Forbesganj to Jogbani. Auto-rickshaw from Jogbani to the Nepal border gate.',
 false),

('20000000-0000-0000-0000-000000000004',
 'Panitanki–Kakarbhitta',
 'Panitanki, Darjeeling, West Bengal',
 'Kakarbhitta, Jhapa District, Koshi Province',
 'The main crossing for travelers arriving from Darjeeling, Sikkim, or West Bengal. Kakarbhitta is connected to all major Nepal cities by overnight bus and is the starting point for the eastern tea trail to Ilam.',
 26.735000, 88.147000,
 E'Operating Hours: Open 24 hours, though peak crossing hours are 6 AM to 6 PM.\n\nRequired Documents: Valid Indian passport or Voter ID card. No visa required for Indian nationals.\n\nConnections from Kakarbhitta: Ilam (35 km, 1.5 hrs by bus or shared taxi). Biratnagar (2 hrs). Kathmandu (12–14 hrs by overnight tourist bus). Pokhara (14–16 hrs direct overnight bus).\n\nFrom India: Siliguri (40 km) is the main hub — regular shared taxis and buses. Darjeeling is 75 km via Siliguri.',
 false),

('20000000-0000-0000-0000-000000000005',
 'Banbasa–Mahendranagar',
 'Banbasa, Champawat, Uttarakhand',
 'Mahendranagar, Kanchanpur District, Sudurpashchim Province',
 'The westernmost major crossing, connecting Uttarakhand''s Banbasa to Mahendranagar. Used primarily for access to Bardia National Park and the far-western Terai.',
 28.968000, 80.053400,
 E'Operating Hours: Open 24 hours.\n\nRequired Documents: Valid Indian passport or Voter ID card. No visa required for Indian nationals.\n\nConnections from Mahendranagar: Bardia National Park (190 km east, 3–4 hrs by bus). Nepalgunj (180 km east, 3–4 hrs). Overnight buses to Kathmandu (12–15 hrs).\n\nFrom India: Nainital (130 km), Haldwani (120 km), Bareilly (240 km) are the main approach cities via Tanakpur or Banbasa.\n\nNote: Road conditions west of Nepalgunj can be poor in the monsoon (July–September). Plan accordingly.',
 false);

-- ============================================================
-- DESTINATION CONNECTIONS (Route Planner Graph)
-- All connections are one-directional; reverse pairs inserted below.
-- ============================================================

insert into public.destination_connections
  (from_destination_id, to_destination_id, distance_km, travel_time_hours,
   recommended_transport, route_notes)
values

-- Birgunj → Kathmandu
('10000000-0000-0000-0000-000000000021',
 '10000000-0000-0000-0000-000000000001',
 130.0, 4.5,
 'Tourist Bus or Private Car',
 'The Mahendra Highway from Birgunj heads north through the Hetauda Churia Hills to Kathmandu. Journey time 4–5 hours by tourist bus (₹500–800). The upgraded expressway via Hetauda–Bhimphedi has improved road quality. Taxis from Birgunj gate charge ₹5,000–7,000 for the full journey.'),

-- Kathmandu → Birgunj (reverse)
('10000000-0000-0000-0000-000000000001',
 '10000000-0000-0000-0000-000000000021',
 130.0, 4.5,
 'Tourist Bus or Private Car',
 'Regular tourist buses from Kathmandu to Birgunj depart from Kalanki and the New Bus Park at Gongabu. Journey 4–5 hours. If exiting to India at Raxaul, take a prepaid taxi from the Birgunj bus park to the border gate.'),

-- Kathmandu → Pokhara
('10000000-0000-0000-0000-000000000001',
 '10000000-0000-0000-0000-000000000004',
 200.0, 6.5,
 'Tourist Bus or Domestic Flight',
 'By tourist bus: departs Kathmandu Thamel daily 7–8 AM, arrives Pokhara Lakeside 1:30–2:30 PM (6.5–7 hrs, ₹800–1,500). By domestic flight: Kathmandu (KTM) to Pokhara (PKR) is 25 minutes, several airlines daily (₹6,000–12,000). Buses follow the Prithvi Highway through Mugling junction.'),

-- Pokhara → Kathmandu (reverse)
('10000000-0000-0000-0000-000000000004',
 '10000000-0000-0000-0000-000000000001',
 200.0, 6.5,
 'Tourist Bus or Domestic Flight',
 'Tourist buses depart Pokhara Lakeside daily 7–8 AM, arriving Kathmandu Thamel by 1:30–2:30 PM. Book through any lakeside travel agent. Domestic flights 25 minutes — multiple daily departures from Pokhara Airport.'),

-- Kathmandu → Chitwan
('10000000-0000-0000-0000-000000000001',
 '10000000-0000-0000-0000-000000000005',
 150.0, 4.5,
 'Tourist Bus',
 'Tourist buses to Sauraha (Chitwan gateway) depart Kathmandu daily, journey 4–5 hours via the Prithvi Highway to Mugling then south on the Narayangadh–Muglin Highway. Tickets ₹700–1,200 available from Thamel agents. Many jungle resorts offer pickup from Bharatpur town (nearest airport, 30 min from Sauraha).'),

-- Chitwan → Kathmandu (reverse)
('10000000-0000-0000-0000-000000000005',
 '10000000-0000-0000-0000-000000000001',
 150.0, 4.5,
 'Tourist Bus',
 'Buses depart Sauraha early morning. Most resorts arrange Sauraha–Bharatpur transfers to connect with Kathmandu buses or the morning domestic flight from Bharatpur Airport (20 min to Kathmandu, ₹5,000–8,000).'),

-- Kathmandu → Janakpur
('10000000-0000-0000-0000-000000000001',
 '10000000-0000-0000-0000-000000000006',
 225.0, 7.5,
 'Bus or Domestic Flight',
 'By bus: 7–8 hours from Kathmandu New Bus Park via the Sindhuli Highway (scenic mountain road). Night buses available ₹900–1,200. By domestic flight: Kathmandu (KTM) to Janakpur (JKR) 35 minutes, Yeti Airlines and Buddha Air operate daily. Janakpur is an easy day trip from the Indian border at Jaleshwar (27 km) for pilgrims.'),

-- Janakpur → Kathmandu (reverse)
('10000000-0000-0000-0000-000000000006',
 '10000000-0000-0000-0000-000000000001',
 225.0, 7.5,
 'Bus or Domestic Flight',
 'Buses depart Janakpur bus park throughout the day. The scenic Sindhuli Highway passes through mid-hills and is well maintained. Domestic flights to Kathmandu are the quickest option if budget allows.'),

-- Pokhara → Chitwan
('10000000-0000-0000-0000-000000000004',
 '10000000-0000-0000-0000-000000000005',
 155.0, 4.5,
 'Tourist Bus',
 'Tourist buses depart Pokhara Lakeside daily for Sauraha / Bharatpur junction, 4–5 hours via the Prithvi Highway. Many travellers combine Pokhara and Chitwan on the same overland route between Kathmandu and the Terai. Tickets ₹700–1,100 at Lakeside agents.'),

-- Chitwan → Pokhara (reverse)
('10000000-0000-0000-0000-000000000005',
 '10000000-0000-0000-0000-000000000004',
 155.0, 4.5,
 'Tourist Bus',
 'Early morning departure from Sauraha to connect with Pokhara-bound buses at Bharatpur or Narayangadh junction. Alternatively, fly Bharatpur (BHR) to Pokhara (PKR) in 20 minutes.'),

-- Pokhara → Lumbini
('10000000-0000-0000-0000-000000000004',
 '10000000-0000-0000-0000-000000000007',
 165.0, 4.5,
 'Tourist Bus or Private Car',
 'Tourist buses from Pokhara Lakeside to Bhairahawa (Lumbini gateway) run daily, 4–5 hours. From Bhairahawa, Lumbini is 22 km (30 min by auto-rickshaw or taxi). Alternatively, hire a private car from Pokhara for door-to-door service (₹5,000–7,000).'),

-- Lumbini → Pokhara (reverse)
('10000000-0000-0000-0000-000000000007',
 '10000000-0000-0000-0000-000000000004',
 165.0, 4.5,
 'Tourist Bus or Private Car',
 'Buses depart from Bhairahawa bus park to Pokhara, 4–5 hours. Auto-rickshaws connect Lumbini Garden to Bhairahawa bus park (30 min, ₹200–300). Direct buses from the Lumbini zone to Pokhara are also available from some hotels.'),

-- Pokhara → Bandipur
('10000000-0000-0000-0000-000000000004',
 '10000000-0000-0000-0000-000000000010',
 60.0, 1.5,
 'Bus or Taxi',
 'Bandipur is 60 km east of Pokhara on the Prithvi Highway — take any Kathmandu-bound bus and alight at the Dumre junction, then a 20-minute shared taxi ride up the hill (₹100–150). Journey 1.5–2 hrs total. The hilltop town is perfectly placed as a stopover between Pokhara and Kathmandu.'),

-- Bandipur → Pokhara (reverse)
('10000000-0000-0000-0000-000000000010',
 '10000000-0000-0000-0000-000000000004',
 60.0, 1.5,
 'Bus or Taxi',
 'Shared taxis from Bandipur descend to Dumre (20 min, ₹100–150) where frequent westbound buses to Pokhara depart throughout the morning (₹300–500, 1–1.5 hrs).'),

-- Lumbini → Chitwan
('10000000-0000-0000-0000-000000000007',
 '10000000-0000-0000-0000-000000000005',
 115.0, 3.5,
 'Bus',
 'From Bhairahawa bus park: buses to Narayangadh/Bharatpur junction (2.5 hrs, ₹400–600), then local transport to Sauraha (30 min). Some direct Bhairahawa–Sauraha services are available through travel agents. A convenient route for the Lumbini–Chitwan–Kathmandu overland triangle.'),

-- Chitwan → Lumbini (reverse)
('10000000-0000-0000-0000-000000000005',
 '10000000-0000-0000-0000-000000000007',
 115.0, 3.5,
 'Bus',
 'From Sauraha: local transport to Narayangadh, then westbound buses to Bhairahawa/Butwal (2.5 hrs). Auto-rickshaw from Bhairahawa to Lumbini Garden (30 min, ₹150–250). Allow 4 hours total door-to-door.'),

-- Mustang → Pokhara
('10000000-0000-0000-0000-000000000016',
 '10000000-0000-0000-0000-000000000004',
 230.0, 8.0,
 'Jeep (seasonal) or Domestic Flight',
 'By road: Jeep from Lo Manthang to Jomsom (4–5 hrs on rough track), then Jomsom to Pokhara by road is possible in the dry season (Oct–May) via Beni, 4–5 more hours. Total 8–10 hours. By air: 20-min domestic flight from Jomsom (JMO) to Pokhara (PKR) operates in the morning only when winds permit — book in advance. The upper Mustang restricted permit (USD 500/10 days) must be arranged before departure.'),

-- Pokhara → Mustang
('10000000-0000-0000-0000-000000000004',
 '10000000-0000-0000-0000-000000000016',
 230.0, 8.0,
 'Domestic Flight to Jomsom then Jeep',
 'Morning flights from Pokhara (PKR) to Jomsom (JMO) operate before 10 AM (winds close by midday). Hire a jeep from Jomsom to Lo Manthang (4–5 hrs, USD 150–200/jeep shared). Restricted Area Permit required — arrange in Kathmandu or Pokhara 2–3 days ahead.'),

-- Manang → Pokhara
('10000000-0000-0000-0000-000000000017',
 '10000000-0000-0000-0000-000000000004',
 175.0, 6.0,
 'Jeep (seasonal) or Trek',
 'A seasonal jeep road from Manang descends through Pisang, Chame, and Besisahar to Dumre on the Prithvi Highway (4–5 hrs, USD 20–30/seat shared). Road passable March–November in dry weather. From Dumre, regular buses to Pokhara (1.5 hrs). In the trekking season, many walkers complete the Annapurna Circuit continuing to Jomsom and fly to Pokhara.'),

-- Pokhara → Manang
('10000000-0000-0000-0000-000000000004',
 '10000000-0000-0000-0000-000000000017',
 175.0, 6.0,
 'Jeep',
 'From Pokhara: take a bus or jeep to Besisahar (2 hrs, ₹500), then a local jeep up the Marsyangdi Valley to Manang (4–5 hrs, USD 15–25/seat). Road is passable in dry season. ACAP permit and TIMS card required — purchase at Nepal Tourism Board office in Pokhara before departure.');

-- ============================================================
-- PACKAGES (Sample)
-- ============================================================

insert into public.packages
  (title, slug, description, duration_days, price_inr_from, highlights,
   includes, excludes, difficulty, featured, seo_title, seo_description)
values

('Golden Triangle Nepal: Kathmandu, Pokhara & Chitwan',
 'golden-triangle-nepal',
 'The classic Nepal itinerary covering the country''s three unmissable destinations — heritage temples in Kathmandu, lakeside adventures in Pokhara, and wildlife safaris in Chitwan. Designed for Indian travelers seeking the best of Nepal in 8–10 days without missing anything essential.',
 9,
 35000,
 ARRAY['Guided tour of 7 UNESCO heritage sites in Kathmandu Valley',
       'Sunrise Himalayan panorama from Nagarkot',
       'Rowboat on Phewa Lake with Annapurna reflections',
       'Paragliding over Pokhara (optional)',
       'Jeep and elephant-back jungle safari in Chitwan',
       'Tharu cultural dance performance',
       'One-horned rhinoceros and possible tiger sighting'],
 ARRAY['All accommodation (twin/double room)',
       'Daily breakfast and dinner',
       'All ground transport between destinations',
       'Licensed English-speaking guide throughout',
       'Chitwan national park entry fees',
       'Kathmandu Valley sightseeing by private vehicle'],
 ARRAY['International/domestic flights',
       'Personal travel insurance',
       'Lunch and drinks',
       'Tips and gratuities',
       'Optional activities (paragliding, spa)'],
 'easy',
 true,
 'Golden Triangle Nepal Tour: Kathmandu, Pokhara & Chitwan | NepaYatra',
 '9-day Nepal tour from Kathmandu covering UNESCO heritage Kathmandu, lakeside Pokhara, and jungle safaris in Chitwan. Ideal for Indian travelers.'),

('Annapurna Base Camp Trek',
 'annapurna-base-camp-trek',
 'A complete 12-day trekking experience through Nepal''s most iconic trail — rhododendron forests, Gurung villages, glacial rivers, and the spectacular high-altitude Annapurna Sanctuary at 4,130 metres.',
 12,
 55000,
 ARRAY['Trek through rhododendron forests ablaze with colour in spring',
       'Overnight in authentic Gurung villages (Ghandruk, Chomrong)',
       'Sunrise view of Annapurna South and Machapuchare',
       'Dramatic entry into the Annapurna Sanctuary glacial bowl',
       'Dawn at Annapurna Base Camp surrounded by 7,000m+ peaks',
       'ACAP conservation area permit and TIMS card included'],
 ARRAY['11 nights accommodation (tea houses / lodges on trail)',
       'All meals during the trek (breakfast, lunch, dinner)',
       'Experienced certified trekking guide',
       'Porter service (1 porter per 2 trekkers, max 15 kg)',
       'All trek permits (ACAP + TIMS)',
       'Pokhara to Nayapul transport',
       'First aid kit and staff insurance'],
 ARRAY['International/domestic flights',
       'Pokhara accommodation before/after trek',
       'Personal travel and rescue insurance (mandatory)',
       'Sleeping bag and trekking gear (available to rent in Pokhara)',
       'Tips for guide and porter'],
 'moderate',
 true,
 'Annapurna Base Camp Trek Package | NepaYatra',
 '12-day guided Annapurna Base Camp trek from Pokhara. Includes all permits, certified guide, porter, tea house accommodation, and all meals on trail.'),

('Hindu & Buddhist Pilgrimage Circuit',
 'nepal-pilgrimage-circuit',
 'A spiritually enriching journey through Nepal''s holiest sites for Indian devotees — Pashupatinath, Janaki Mandir, Lumbini, and Muktinath. Covering four of Nepal''s most significant religious destinations in a single reverent itinerary.',
 8,
 28000,
 ARRAY['Morning puja at Pashupatinath and Bagmati river ghats',
       'Janaki Mandir darshan at Janakpur — birthplace of Goddess Sita',
       'Sacred Lumbini Garden — birthplace of Lord Buddha and Ashoka Pillar',
       'Pilgrimage to Muktinath at 3,800m — 108 holy water spouts',
       'Boudhanath Stupa circumambulation with Tibetan monks',
       'Swayambhunath (Monkey Temple) at dawn'],
 ARRAY['All accommodation (double room, clean and comfortable)',
       'All transport between pilgrimage sites',
       'Daily breakfast',
       'Dedicated pilgrimage guide with knowledge of Hindu and Buddhist traditions',
       'Entry fees to all temple complexes',
       'Pokhara–Jomsom domestic flight for Muktinath approach'],
 ARRAY['International flights to Kathmandu',
       'Personal travel insurance',
       'Lunch and dinner (except stated)',
       'Restricted Area Permit for Upper Mustang (if extending to Lo Manthang)'],
 'moderate',
 true,
 'Nepal Hindu & Buddhist Pilgrimage Circuit | NepaYatra',
 '8-day Nepal pilgrimage package: Pashupatinath, Janakpur, Lumbini, and Muktinath. Designed for Indian Hindu and Buddhist devotees.'),

('Mustang Forbidden Kingdom Expedition',
 'upper-mustang-expedition',
 'A rare journey into Upper Mustang — the last Tibetan Buddhist kingdom, closed to the world until 1992. Medieval walled cities, ancient cave monasteries, and a Martian landscape unlike anywhere else in the Himalayas.',
 10,
 125000,
 ARRAY['Fly from Pokhara to Jomsom on a 20-minute mountain flight',
       'Explore the walled city of Lo Manthang and the royal palace',
       'Visit 15th-century Thubchen and Jampa monasteries with ancient murals',
       'Sky caves with thousand-year-old Buddhist manuscripts',
       'Wind-carved canyon landscapes in ochre, red, and white',
       'Restricted Area Permit (USD 500) included'],
 ARRAY['Restricted Area Permit for Upper Mustang (USD 500, 10 days)',
       'ACAP conservation permit and TIMS card',
       'Pokhara–Jomsom–Pokhara domestic flights',
       'All accommodation in Lo Manthang and on route',
       'All meals on trek',
       'Licensed government guide with Upper Mustang expertise',
       'Porter service'],
 ARRAY['International/domestic flights to Kathmandu or Pokhara',
       'Personal rescue and travel insurance (mandatory in restricted area)',
       'Items of personal nature',
       'Extension beyond 10-day permit window'],
 'hard',
 false,
 'Upper Mustang Expedition: Forbidden Kingdom Trek | NepaYatra',
 '10-day Upper Mustang trek including restricted area permit. Explore Lo Manthang, ancient cave monasteries, and Tibetan landscapes. Fly Pokhara–Jomsom.');

-- ============================================================
-- FAQS
-- ============================================================

insert into public.faqs (category, question, answer, order_index)
values

('entry_requirements', 'Do Indian citizens need a passport to enter Nepal?', E'Indian citizens do **not** require a passport to enter Nepal. The following documents are accepted:\n\n- **Valid Indian Passport** (recommended for ease of travel)\n- **Voter ID Card** (with photo and address, issued by Election Commission of India)\n- **Aadhaar Card** — accepted at some crossings but not all\n\nChildren under 15 travelling with parents can be included on their parent''s documents but should ideally carry their own school ID or birth certificate.\n\n**Important:** Driving licences are **not** accepted as travel documents for entry into Nepal.', 1),

('entry_requirements', 'Do Indian citizens need a visa for Nepal?', E'**No visa is required.** Indian citizens enjoy free movement between India and Nepal under the 1950 Treaty of Peace and Friendship. There is no formal immigration process at land borders — Indians walk through the border checkposts with valid ID.\n\nAt the airport (Tribhuvan International, Kathmandu), Indian passport holders proceed through a dedicated lane and are not required to obtain a visa on arrival.\n\n**Duration of stay:** There is no fixed limit for Indian nationals. You may stay as long as you wish.', 2),

('entry_requirements', 'What documents do Indian citizens need to carry when entering Nepal?', E'The minimum requirement is one of the following government-issued photo IDs:\n\n1. Indian passport (valid or expired within 10 years — check current rules)\n2. Voter ID card\n3. Government-issued photo ID\n\n**Recommended to carry:**\n- Return bus/flight ticket (not mandatory but helpful)\n- Hotel confirmation for first night\n- Sufficient INR or USD cash — Indian Rupee notes of ₹100, ₹200, ₹500 denominations are accepted in Nepal (₹2,000 notes are **not** accepted)\n\n**Note:** Indian ₹2,000 notes have been demonetised in Nepal and are not accepted anywhere.', 3),

('currency', 'Can I use Indian Rupees in Nepal?', E'**Yes, Indian Rupees are widely accepted** across Nepal, particularly at hotels, restaurants, tourist shops, and at the border regions.\n\n**Important restrictions:**\n- ₹2,000 notes are **not accepted** anywhere in Nepal\n- ₹100, ₹200, and ₹500 notes are accepted\n- Coins are generally not accepted\n\n**Exchange rate:** 1 Indian Rupee ≈ 1.6 Nepali Rupees (the rate is fixed at NPR 1.60 per INR 1.00 — it does not fluctuate significantly).\n\n**ATMs:** Widely available in Kathmandu, Pokhara, and tourist areas. Most accept Visa, Mastercard, and international debit cards. Daily withdrawal limits vary (usually NPR 20,000–35,000 per transaction). Inform your Indian bank before travel.\n\n**UPI/Digital payments:** Not widely accepted yet outside major cities. Carry sufficient cash.', 1),

('currency', 'How much Nepali currency can I bring back to India?', E'Indian travelers returning from Nepal may carry a maximum of **NPR 25,000** (Nepali Rupees) back to India as per the Nepal Rastra Bank regulations.\n\nExcess Nepali currency should be exchanged back before crossing the border. Exchange counters are available at Tribhuvan Airport and at major border crossings (Birgunj, Bhairahawa, Kakarbhitta).\n\n**Unused INR:** You may carry unlimited Indian Rupees back to India as per the Reserve Bank of India''s general framework, subject to normal customs declaration rules for amounts above ₹25,000.', 2),

('transport', 'How do I travel from Kathmandu to Pokhara?', E'You have two main options:\n\n**By Tourist Bus (most popular)**\n- Duration: 6–7 hours\n- Cost: ₹500–1,200 (approximately NPR 800–2,000)\n- Departure: Daily from Kathmandu Thamel, 7–8 AM\n- Route: Prithvi Highway via Mugling and Abu Khaireni\n- Book through any Thamel travel agent or online\n\n**By Domestic Flight (fastest)**\n- Duration: 25 minutes\n- Cost: NPR 6,000–12,000 (USD 45–90)\n- Airlines: Buddha Air, Yeti Airlines, Shree Airlines\n- Multiple flights daily, morning departures recommended\n- Book online or at airport\n\n**By Private Car/Taxi**\n- Duration: 5–6 hours\n- Cost: NPR 10,000–15,000\n- Flexible departure and stops\n\nThe highway route through the Trisuli River valley is scenic. Avoid travelling at night due to winding mountain roads.', 1),

('transport', 'What is the best way to travel from Raxaul to Kathmandu?', E'The Raxaul–Birgunj border is the most common entry point for Indian overland travelers.\n\n**Step 1: Cross the border**\nWalk or take a cycle-rickshaw/auto-rickshaw from Raxaul to the Nepal immigration gate at Birgunj (10–15 min, ₹20–50). No immigration formalities for Indians.\n\n**Step 2: Birgunj to Kathmandu**\n- **Tourist Bus:** Multiple departures from Birgunj bus park throughout the morning. Journey 4–5 hours. Cost NPR 500–800.\n- **Local Bus:** Slightly cheaper but slower and less comfortable.\n- **Private Taxi:** NPR 6,000–8,000 for the whole car, 3.5–4 hours.\n\n**Total journey from Raxaul to Kathmandu:** 5–6 hours door-to-door.\n\n**Tip:** Arrive at Raxaul before 10 AM to ensure you reach Kathmandu before dark. The highway passes through scenic Hetauda hills.', 2),

('safety', 'Is Nepal safe for Indian tourists?', E'**Nepal is generally very safe for Indian tourists.** Indians are warmly welcomed and the cultural familiarity — shared religion, language (Hindi is understood in most tourist areas), and cuisine — makes Nepal feel comfortable and accessible.\n\n**Standard precautions:**\n- Use authorised taxis or ride-hailing apps (Pathao) in Kathmandu\n- Keep photocopies of your ID documents (separate from originals)\n- Avoid poorly lit areas in cities late at night\n- Use licensed trekking guides for high-altitude treks\n- Do not trek alone — always with a registered guide or group\n- Altitude sickness is a real risk above 3,000 metres — ascend slowly and acclimatise properly\n\n**Emergency Numbers:**\n- Nepal Police: 100\n- Tourist Police: 01-4247041\n- Ambulance: 102\n- Indian Embassy Kathmandu: +977-1-4410900', 1),

('safety', 'What are the altitude sickness risks for trekkers?', E'**Altitude sickness (Acute Mountain Sickness / AMS) is a serious risk** above 2,500 metres and must be taken seriously.\n\n**Symptoms of AMS:**\n- Headache, nausea, dizziness, fatigue\n- Loss of appetite and difficulty sleeping\n- Shortness of breath at rest\n\n**Danger signs (descend immediately):**\n- Confusion or disorientation\n- Severe headache not relieved by paracetamol\n- Inability to walk in a straight line\n- Blue lips or fingernails\n- Persistent cough with pink/frothy sputum\n\n**Prevention:**\n- Ascend no more than 300–500m per day above 3,000m\n- Take a rest day every 3 days of ascent\n- Drink 3–4 litres of water daily\n- Avoid alcohol and sleeping pills above 3,000m\n\n**Medication:** Diamox (Acetazolamide) is commonly used — consult your doctor before travel. Available at Kathmandu pharmacies.\n\n**Himalayan Rescue Association clinics** operate at Manang (Annapurna Circuit) and Pheriche (Everest region) during trekking season.', 2),

('general', 'What is the best time to visit Nepal?', E'Nepal has two main trekking and travel seasons:\n\n**Best Season 1: Autumn (October–November)**\n- Clear skies, excellent mountain visibility\n- Warm days, cool nights\n- Ideal for all trekking routes and wildlife safaris\n- Busy season — book accommodation in advance\n\n**Best Season 2: Spring (March–May)**\n- Rhododendrons bloom on trekking trails (March–April)\n- Good mountain views, especially in April\n- Warmer at lower elevations\n- Slightly more haze than autumn\n\n**Avoid: Monsoon (June–September)**\n- Heavy rainfall, landslides, leech-infested trails\n- Mountain views obscured by cloud\n- Some roads impassable\n- **Exception:** Upper Mustang and Upper Dolpo are rain-shadow areas — excellent during monsoon\n\n**Winter (December–February)**\n- Suitable for Terai / lowlands (Chitwan, Lumbini, Janakpur)\n- Kathmandu Valley is cold but clear\n- High passes and upper elevations snow-blocked\n- Low season = better prices and fewer crowds', 1),

('health', 'Do I need vaccinations before visiting Nepal?', E'**No mandatory vaccinations** are required for Indian nationals entering Nepal.\n\n**Recommended vaccinations** (consult your doctor 4–6 weeks before travel):\n- **Hepatitis A** — strongly recommended (waterborne illness risk)\n- **Typhoid** — recommended, especially for longer stays\n- **Hepatitis B** — recommended for extended stays\n- **Rabies** — consider if visiting wildlife areas or trekking\n- **Japanese Encephalitis** — if visiting rural Terai areas June–October\n- **Tetanus, Diphtheria** — ensure up to date\n\n**Malaria:** Risk in Terai lowlands (Chitwan, Bardia, Lumbini) June–September. Consult doctor about prophylaxis.\n\n**Water safety:** Drink only bottled or filtered water. Avoid ice in drinks outside reputable hotels. Stomach upsets are common — carry oral rehydration salts (ORS) and basic diarrhoea medication.\n\n**Travel insurance** covering medical evacuation is strongly recommended for trekkers.', 1);

-- ============================================================
-- ADVISORS
-- ============================================================

insert into public.advisors
  (name, title, bio, languages, whatsapp_number, phone_number, active)
values

('Rajesh Sharma',
 'Senior Cultural & Heritage Tour Guide',
 'A Kathmandu Valley native with 18 years of experience guiding Indian pilgrims and heritage travellers through Nepal''s UNESCO World Heritage Sites. Specialises in Hindu pilgrimage circuits — Pashupatinath, Janakpur, Muktinath — and has guided over 4,000 Indian visitors. Fluent in Hindi, Nepali, Maithili, and English.',
 ARRAY['Hindi','Nepali','Maithili','English'],
 '+977-9841-123456',
 '+977-1-4123456',
 true),

('Sunita Gurung',
 'Certified Trekking Guide & Annapurna Specialist',
 'A TAAN-certified trekking guide from Ghandruk village with 12 years of experience leading groups on the Annapurna Circuit, Annapurna Base Camp, and Poon Hill routes. Deep knowledge of Gurung culture and mountain communities. First female guide from her village and a strong advocate for responsible trekking. Speaks Hindi and can communicate with Indian trekking groups throughout.',
 ARRAY['Hindi','Nepali','English','Gurung'],
 '+977-9856-789012',
 null,
 true),

('Arjun Thapa',
 'Wildlife Safari Expert & Chitwan–Bardia Specialist',
 'Born in Sauraha village adjacent to Chitwan National Park, Arjun is a licensed naturalist with 15 years of experience leading jeep safaris, canoe excursions, and jungle walks. Proficient at tracking rhinoceroses, Bengal tigers, and sloth bears. Also offers Bardia National Park expeditions for the more adventurous. Holds NTNC naturalist certification and speaks conversational Hindi.',
 ARRAY['Nepali','English','Hindi'],
 '+977-9855-345678',
 '+977-56-589012',
 true);

-- ============================================================
-- KNOWLEDGE BASE
-- ============================================================

insert into public.knowledge_base
  (title, slug, category, summary, content, tags, reading_time_minutes, featured,
   seo_title, seo_description)
values

('Complete Entry Requirements Guide for Indian Citizens Visiting Nepal',
 'indian-citizen-nepal-entry-guide',
 'entry_requirements',
 'Everything Indian travelers need to know before crossing into Nepal — documents accepted, border procedures, what to expect at each crossing, and common mistakes to avoid.',
 E'# Entry Requirements for Indian Citizens Visiting Nepal\n\nNepal and India share one of the world''s most open bilateral travel arrangements. Indian citizens are permitted to enter Nepal without a visa and may stay indefinitely. This guide covers everything you need to know.\n\n## Documents Required\n\nIndian nationals may enter Nepal using any of the following:\n\n**Accepted Documents:**\n- Valid Indian Passport (expired passports may be accepted — check current border policies)\n- Voter ID Card (with photo, issued by Election Commission of India)\n- Government-issued Photo ID\n\n**Not Accepted:**\n- Driving Licence\n- PAN Card\n- ₹2,000 currency notes as any form of payment in Nepal\n\n## Border Crossing Procedure\n\n### Land Border Entry\n1. Approach the Nepal immigration checkpost\n2. Present your ID document to the immigration officer\n3. Register in the visitor log (name, ID number, purpose of visit)\n4. Cross the border — no stamp is required for Indian nationals at most crossings\n5. If you have a vehicle, complete customs/vehicle permit forms at the transport office\n\n### By Air (Tribhuvan International Airport, Kathmandu)\n1. Proceed to the Indian nationals'' designated immigration lane\n2. Present Indian passport\n3. No visa required, no fee payable\n4. Passport is stamped on entry\n\n## Currency Rules\n\n- Indian Rupees (₹100, ₹200, ₹500 denominations) are accepted throughout Nepal\n- **₹2,000 notes are NOT accepted** anywhere in Nepal — exchange them before departure\n- Coins are generally not accepted\n- Exchange rate: fixed at approximately NPR 1.60 per INR 1.00\n\n## What to Declare at Customs\n\n- Foreign currency above USD 5,000 (or equivalent) must be declared\n- Carrying Indian Rupees into Nepal is permitted without restriction\n- Prohibited items: firearms, narcotics, pornographic materials\n- Restricted: antiques (strict export controls), wildlife products\n\n## Returning to India\n\n- No re-entry visa required for Indian nationals\n- You may carry up to NPR 25,000 back to India\n- Items purchased in Nepal are subject to Indian customs duties above the duty-free allowance\n\n## Important Contacts\n\n**Indian Embassy, Kathmandu:** +977-1-4410900 | [indembktm.gov.in](https://www.indembktm.gov.in)\n**Tourist Police, Thamel:** +977-1-4247041\n**Emergency:** 100 (Police), 102 (Ambulance)',
 ARRAY['passport','voter-id','border-crossing','visa','entry','documents','indian-citizens'],
 8, true,
 'Nepal Entry Requirements for Indian Citizens 2026 | NepaYatra',
 'Complete guide: Can Indians visit Nepal without passport? Documents needed, border procedures, currency rules, and what to expect at Raxaul, Sunauli, and other crossings.'),

('Nepal Budget Guide for Indian Travelers: How Much Does a Nepal Trip Cost?',
 'nepal-trip-cost-budget-guide-indian-travelers',
 'currency',
 'A realistic cost breakdown for Indian travelers visiting Nepal — daily expenses, accommodation costs, transport, food, trekking permits, and how far your rupees go.',
 E'# Nepal Trip Budget Guide for Indian Travelers\n\nNepal offers exceptional value for Indian travelers. The favourable exchange rate (NPR 1.60 per INR 1.00) and shared cultural context mean that India-familiar comforts are available at very accessible prices.\n\n## Daily Budget Estimates (per person)\n\n| Travel Style | Daily Budget (INR) | What it includes |\n|---|---|---|\n| Budget | ₹1,500–2,500 | Dormitory / basic guesthouse, local daal-bhaat meals, local buses |\n| Mid-range | ₹3,000–5,000 | Clean hotel with breakfast, tourist restaurants, tourist buses |\n| Comfortable | ₹6,000–10,000 | 3–4 star hotel, all meals included, private transport |\n| Luxury | ₹12,000+ | 5-star heritage hotels, private guide, domestic flights |\n\n## Accommodation Costs\n\n**Kathmandu / Pokhara:**\n- Budget guesthouses: NPR 800–1,500/night (₹500–950)\n- Mid-range hotels: NPR 2,500–5,000/night (₹1,500–3,000)\n- 4-star hotels: NPR 8,000–15,000/night (₹5,000–9,500)\n- 5-star luxury: NPR 20,000+/night (₹12,500+)\n\n**Trekking tea houses:**\n- Basic room: NPR 200–600/night (₹125–375) — meals are the income source\n- Room is often discounted or free if you eat dinner and breakfast at the lodge\n\n## Food Costs\n\n**Local Nepali restaurants:**\n- Daal-Bhaat-Tarkari (set meal): NPR 250–400 (₹155–250)\n- Momos (steamed dumplings): NPR 150–250 (₹95–155)\n- Masala chai: NPR 50–80 (₹30–50)\n\n**Tourist restaurants (Thamel, Pokhara Lakeside):**\n- Main course: NPR 400–800 (₹250–500)\n- Buffet breakfast: NPR 500–900 (₹300–560)\n\n## Transport Costs\n\n- Kathmandu → Pokhara (tourist bus): NPR 800–2,000 (₹500–1,250)\n- Kathmandu → Chitwan (tourist bus): NPR 700–1,200 (₹440–750)\n- Domestic flight (Pokhara–Jomsom): NPR 12,000–18,000 (₹7,500–11,000)\n- Kathmandu city taxi: NPR 300–600 per trip (₹185–375)\n\n## Trekking Costs\n\n**Permits:**\n- ACAP permit (Annapurna area): NPR 3,000 (₹1,875)\n- TIMS card: NPR 2,000 (₹1,250)\n- SAARC nationals** pay the same as foreigners for most permits\n\n**Trekking guide:** USD 25–35/day (NPR 3,300–4,600)\n**Porter:** USD 15–20/day (NPR 2,000–2,650)\n\n## Sample Trip Budgets\n\n**10-day mid-range Nepal trip (Kathmandu + Pokhara + Chitwan):**\n- Flights: ₹8,000–15,000 (from Delhi or Varanasi)\n- Accommodation (9 nights): ₹20,000–35,000\n- Food: ₹12,000–18,000\n- Transport: ₹5,000–8,000\n- Activities and entry fees: ₹8,000–12,000\n- **Total: ₹53,000–88,000 for one person**\n\n**7-day trekking trip (Annapurna Base Camp):**\n- Pokhara accommodation (2 nights): ₹4,000\n- Trek (7 days all-inclusive with guide): ₹35,000–50,000\n- Permits: ₹3,200\n- **Total: ₹42,000–57,000 per person**',
 ARRAY['budget','cost','price','money','rupees','exchange-rate','accommodation','food','transport'],
 12, true,
 'Nepal Trip Cost for Indian Travelers 2026 | Budget Guide | NepaYatra',
 'How much does a Nepal trip cost from India? Complete 2026 budget guide with daily expenses, hotel prices, food costs, trekking permit fees, and sample trip budgets in INR.'),

('Trekking in Nepal: A Complete Beginner''s Guide for Indian Trekkers',
 'nepal-trekking-beginners-guide',
 'trekking',
 'First time trekking in Nepal? This guide covers everything: choosing the right route, required permits, what to pack, altitude sickness prevention, fitness preparation, and budget planning.',
 E'# Nepal Trekking: Complete Beginner''s Guide for Indian Trekkers\n\nNepal is the world''s premier trekking destination with over 5,000 km of marked trekking routes. This guide covers everything an Indian traveller needs to know before lacing up their boots.\n\n## Choosing the Right Trek\n\n### Easy (No prior trekking experience needed)\n- **Poon Hill Trek** — 4–5 days, 3,210m max elevation, excellent Annapurna panorama\n- **Ghorepani Loop** — 4 days, passes through rhododendron forests\n- **Chitwan–Bardia jungle walks** — flat terrain, wildlife-focused\n\n### Moderate (Basic fitness required, some high-altitude exposure)\n- **Annapurna Base Camp** — 7–12 days, 4,130m max, classic Himalayan sanctuary\n- **Langtang Valley** — 7–10 days, 3,800m max, quieter trails\n- **Ghandruk Loop** — 3–4 days, excellent acclimatisation trek\n\n### Challenging (Good fitness, altitude experience helpful)\n- **Annapurna Circuit** — 12–21 days, crosses Thorong La Pass at 5,416m\n- **Everest Base Camp** — 14–16 days, 5,364m, world-famous route\n\n### Restricted Permits Required\n- **Upper Mustang** — USD 500 for 10 days (in addition to ACAP)\n- **Dolpo** — USD 500–1,000 depending on zone\n\n## Permits Required\n\n**For Annapurna region:**\n1. ACAP (Annapurna Conservation Area Permit) — NPR 3,000\n2. TIMS Card (Trekkers'' Information Management System) — NPR 2,000\n\nBoth available at Nepal Tourism Board office in Pokhara (Tourism Service Centre, Damside) or Kathmandu (Bhrikutimandap).\n\n**For Everest region:**\n1. Sagarmatha National Park permit — NPR 3,000\n2. TIMS Card — NPR 2,000\n3. Khumbu Pasang Lhamu Rural Municipality permit — NPR 2,000\n\n## What to Pack\n\n### Essential Gear\n- Trekking boots (broken in before the trek — crucial)\n- Layering system: moisture-wicking base layer, fleece mid-layer, waterproof outer shell\n- Thermal underwear for elevations above 3,000m\n- Good sleeping bag rated to -10°C for high-altitude treks\n- Trekking poles (strong recommendation for all routes)\n- Head torch with spare batteries\n- High-SPF sunscreen and UV-protective sunglasses\n- First aid kit with altitude sickness medication\n\n### Hire or Buy in Pokhara / Kathmandu\n- Most gear is available to rent or buy cheaply in Thamel (Kathmandu) and Lakeside (Pokhara)\n- Sleeping bags: NPR 100–200/day to rent\n- Trekking poles: NPR 50–100/day\n- Down jackets: NPR 100–150/day\n\n## Hiring a Guide and Porter\n\n**Do you need a guide?**\nSince 2023, Nepal requires all foreign trekkers on major routes to hire a registered guide. This applies to all non-SAARC nationals.\n\n*For Indian nationals, hiring is currently optional but strongly recommended above 3,000m for safety reasons.*\n\n**Guide costs:** USD 25–35/day (NPR 3,300–4,600)\n**Porter costs:** USD 15–20/day (carries up to 15 kg)\n**Book through:** TAAN-registered agencies in Pokhara or Kathmandu\n\n## Altitude Sickness\n\nAcute Mountain Sickness (AMS) affects most people above 2,500m to some degree. The key rules:\n\n1. **Ascend slowly** — never gain more than 300–500m elevation per day above 3,000m\n2. **Rest days** — take a full rest day every 3 days of ascent\n3. **Hydrate** — drink 3–4 litres of water daily\n4. **Never ascend with symptoms** — if you have a headache, rest for 24 hours\n5. **Diamox** — consult your doctor about preventive medication\n\n**The golden rule: if in doubt, go down.** Descending 500m almost always relieves symptoms rapidly.',
 ARRAY['trekking','beginner','annapurna','permits','gear','altitude','guide','porter'],
 15, true,
 'Nepal Trekking Guide for Beginners 2026 | Indian Travelers | NepaYatra',
 'Complete Nepal trekking guide for Indian beginners: best routes, required permits, what to pack, altitude sickness, guide costs, and fitness tips. Updated 2026.');

-- ============================================================
-- TRAVEL ALERTS (sample — one active alert)
-- ============================================================

insert into public.travel_alerts
  (title, message, severity, starts_at, expires_at, affected_regions, active)
values

('Monsoon Season Advisory: Landslide Risk on Mountain Roads',
 E'**July–September Monsoon Season Advisory**\n\nHeavy monsoon rainfall has increased landslide risk on all mountain highways in Nepal. Travelers planning overland journeys between Kathmandu, Pokhara, and the Terai should exercise caution.\n\n**Affected routes:**\n- Prithvi Highway (Kathmandu–Pokhara) — delays possible at Mugling and Abu Khaireni sections\n- BP Koirala Highway (Kathmandu–Chitwan via Sindhuli) — multiple landslide-prone sections\n- Mountain access roads to Manang, Mustang, and trekking trailheads\n\n**Recommendations:**\n- Check road conditions before departure with your hotel or bus company\n- Allow extra travel time for all road journeys\n- Consider domestic flights as an alternative for Kathmandu–Pokhara and Kathmandu–Chitwan\n- Do not attempt mountain trekking routes during heavy rain without an experienced guide\n- Carry a 1-day emergency supply of water, food, and medication when travelling by road\n\n**Updates:** Road conditions are updated daily by the Nepal Department of Roads. Your NepaYatra contact can provide current status.',
 'warning',
 '2026-07-01 00:00:00+05:45',
 '2026-09-30 23:59:59+05:45',
 ARRAY['gandaki','bagmati','koshi'],
 true);

-- ============================================================
-- SITE SETTINGS
-- ============================================================

insert into public.site_settings (setting_key, setting_value, value_type, setting_group)
values

-- General
('site_name',            'NepaYatra',                                                              'text',      'general'),
('site_tagline',         'Your Complete Nepal Travel Guide for Indian Travelers',                  'text',      'general'),
('site_description',     'NepaYatra is Nepal''s most comprehensive travel information platform for Indian visitors — destinations, border crossings, pilgrimage routes, trekking guides, and travel planning tools.',
                                                                                                   'text',      'general'),
('site_language',        'en',                                                                     'text',      'general'),
('site_timezone',        'Asia/Kathmandu',                                                         'text',      'general'),

-- SEO defaults
('seo_title_template',   '%s | NepaYatra — Nepal Travel Guide',                                   'text',      'seo'),
('seo_default_title',    'NepaYatra — Nepal Travel Guide for Indian Travelers',                    'text',      'seo'),
('seo_default_description', 'Plan your Nepal trip with NepaYatra — destinations, border crossings, packages, trekking guides, and travel alerts for Indian travelers.', 'text', 'seo'),
('seo_og_image_url',     '',                                                                       'image_url', 'seo'),
('seo_twitter_handle',   '@nepayatra',                                                             'text',      'seo'),
('seo_canonical_base',   'https://nepayatra.com',                                                  'text',      'seo'),

-- Contact
('contact_email',        'hello@nepayatra.com',                                                    'text',      'contact'),
('contact_phone',        '+977-1-4000000',                                                         'text',      'contact'),
('contact_whatsapp',     '+977-9800000000',                                                        'text',      'contact'),
('contact_address',      'Thamel, Kathmandu, Nepal',                                               'text',      'contact'),

-- Social media
('social_facebook',      'https://facebook.com/nepayatra',                                         'text',      'social'),
('social_instagram',     'https://instagram.com/nepayatra',                                        'text',      'social'),
('social_youtube',       'https://youtube.com/@nepayatra',                                         'text',      'social'),
('social_twitter',       'https://twitter.com/nepayatra',                                          'text',      'social'),

-- Homepage configuration
('homepage_hero_headline',  'Discover Nepal — India''s Closest Himalayan Neighbour',              'text',      'homepage'),
('homepage_hero_subheadline', 'Complete travel guides, border crossings, pilgrimage routes, and trekking information for Indian travelers', 'text', 'homepage'),
('homepage_hero_cta_primary',   'Explore Destinations',                                            'text',      'homepage'),
('homepage_hero_cta_secondary', 'Plan My Route',                                                   'text',      'homepage'),
('homepage_featured_destinations_count', '6',                                                      'number',    'homepage'),
('homepage_featured_packages_count',     '3',                                                      'number',    'homepage'),
('homepage_show_travel_alerts',          'true',                                                   'boolean',   'homepage'),
('homepage_show_knowledge_base',         'true',                                                   'boolean',   'homepage');
