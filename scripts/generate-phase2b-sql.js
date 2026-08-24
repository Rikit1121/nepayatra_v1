const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'mnt', 'data', 'nepayatra_phase2b_data', 'source');
const accoms = JSON.parse(fs.readFileSync(path.join(dataDir, 'accommodations.json'), 'utf8'));
const acts = JSON.parse(fs.readFileSync(path.join(dataDir, 'activities.json'), 'utf8'));
const trans = JSON.parse(fs.readFileSync(path.join(dataDir, 'transport.json'), 'utf8'));
const flights = JSON.parse(fs.readFileSync(path.join(dataDir, 'flights.json'), 'utf8'));
const daily = JSON.parse(fs.readFileSync(path.join(dataDir, 'daily_costs.json'), 'utf8'));

const destMap = {
  kathmandu: '10000000-0000-0000-0000-000000000001',
  bhaktapur: '10000000-0000-0000-0000-000000000002',
  patan: '10000000-0000-0000-0000-000000000003',
  pokhara: '10000000-0000-0000-0000-000000000004',
  chitwan: '10000000-0000-0000-0000-000000000005',
  janakpur: '10000000-0000-0000-0000-000000000006',
  lumbini: '10000000-0000-0000-0000-000000000007',
  nagarkot: '10000000-0000-0000-0000-000000000008',
  dhulikhel: '10000000-0000-0000-0000-000000000009',
  bandipur: '10000000-0000-0000-0000-000000000010',
  sarangkot: '10000000-0000-0000-0000-000000000011',
  ilam: '10000000-0000-0000-0000-000000000012',
  'rara-lake': '10000000-0000-0000-0000-000000000013',
  muktinath: '10000000-0000-0000-0000-000000000014',
  pashupatinath: '10000000-0000-0000-0000-000000000015',
  mustang: '10000000-0000-0000-0000-000000000016',
  manang: '10000000-0000-0000-0000-000000000017',
  ghandruk: '10000000-0000-0000-0000-000000000018',
  'annapurna-base-camp': '10000000-0000-0000-0000-000000000019',
  'bardia-national-park': '10000000-0000-0000-0000-000000000020',
  birgunj: '10000000-0000-0000-0000-000000000021',
  bhairahawa: '10000000-0000-0000-0000-000000000007', // Lumbini
  nepalgunj: '10000000-0000-0000-0000-000000000020', // Bardia
};

function mapTier(cat, min, max) {
  const c = (cat || '').toLowerCase();
  if (c.includes('hostel') || c.includes('budget') || c.includes('guesthouse')) return 'budget';
  if (c.includes('5-star') || c.includes('luxury')) return 'luxury';
  if (c.includes('4-star') || c.includes('4/5-star') || c.includes('4.5/5-star') || c.includes('premium')) return 'premium';
  if (c.includes('3-star') || c.includes('mid-range') || c.includes('3/4-star') || c.includes('3.5/4-star')) return 'mid_range';
  if (max <= 2500) return 'budget';
  if (max <= 6000) return 'mid_range';
  if (max <= 15000) return 'premium';
  return 'luxury';
}

function escapeSql(str) {
  if (str == null) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

let sql = '';
sql += '-- ============================================================\n';
sql += '-- Migration : 20260819000031_phase2b_real_travel_data\n';
sql += '-- Project   : NepaYatra\n';
sql += '-- Purpose   : Real structured reference travel data from Nepal Travel Budget Guide 2025\n';
sql += '-- ============================================================\n\n';

// 1. DAILY COST ESTIMATES
sql += '-- 1. DAILY COST ESTIMATES (National & Regional benchmarks)\n';
daily.forEach(d => {
  const foodCost = Math.round((d.food_min_npr + d.food_max_npr) / 2);
  const miscCost = Math.round((d.activities_misc_min_npr + d.activities_misc_max_npr) / 2);
  const notes = `Food: NPR ${d.food_min_npr}-${d.food_max_npr}, Misc: NPR ${d.activities_misc_min_npr}-${d.activities_misc_max_npr}`;
  sql += `insert into public.daily_cost_estimates (region_name, travel_tier, estimated_daily_food_cost, estimated_daily_misc_cost, currency, notes, source, source_date, public_visible)\n`;
  sql += `values (${escapeSql('National Benchmark')}, ${escapeSql(d.tier)}, ${foodCost}, ${miscCost}, 'NPR', ${escapeSql(notes)}, ${escapeSql(d.source)}, ${escapeSql(d.source_date)}, true)\n`;
  sql += `on conflict do nothing;\n\n`;
});

// 2. ACCOMMODATIONS
sql += '-- 2. ACCOMMODATIONS (163 properties with source ranges)\n';
let importedAccoms = 0;
accoms.forEach(a => {
  const destId = destMap[a.destination_key];
  if (!destId) return; // Unmapped transit town
  const tier = mapTier(a.source_category, a.price_min_npr, a.price_max_npr);
  const notes = `${a.source_category} | Pricing unit: ${a.pricing_unit}`;
  sql += `insert into public.accommodations (destination_id, name, tier, estimated_price_min, estimated_price_max, currency, notes, source, source_date, public_visible)\n`;
  sql += `values (${escapeSql(destId)}, ${escapeSql(a.name)}, ${escapeSql(tier)}, ${a.price_min_npr}, ${a.price_max_npr}, 'NPR', ${escapeSql(notes)}, ${escapeSql(a.source)}, ${escapeSql(a.source_date)}, true);\n`;
  importedAccoms++;
});

// 3. TRANSPORT OPTIONS
sql += '\n-- 3. TRANSPORT OPTIONS (Intercity corridors & vehicle types)\n';
const nameToDest = {
  Kathmandu: '10000000-0000-0000-0000-000000000001',
  Bhaktapur: '10000000-0000-0000-0000-000000000002',
  Patan: '10000000-0000-0000-0000-000000000003',
  Pokhara: '10000000-0000-0000-0000-000000000004',
  Chitwan: '10000000-0000-0000-0000-000000000005',
  Janakpur: '10000000-0000-0000-0000-000000000006',
  Lumbini: '10000000-0000-0000-0000-000000000007',
  Nagarkot: '10000000-0000-0000-0000-000000000008',
  Dhulikhel: '10000000-0000-0000-0000-000000000009',
  Bandipur: '10000000-0000-0000-0000-000000000010',
  Ilam: '10000000-0000-0000-0000-000000000012',
  Birgunj: '10000000-0000-0000-0000-000000000021',
};

function mapTransportType(type) {
  if (type === 'tourist_bus' || type === 'tourist_deluxe_bus' || type === 'vip_night_bus' || type === 'deluxe_bus') return 'tourist_bus';
  if (type === 'regular_bus' || type === 'local_bus') return 'bus';
  if (type === 'jeep' || type === 'shared_jeep') return 'shared_jeep';
  if (type === 'private_vehicle' || type === 'pathao_car_indrive') return 'private_vehicle';
  if (type === 'taxi') return 'taxi';
  return 'other';
}

function parseDuration(dStr) {
  if (!dStr) return 4.0;
  const match = dStr.match(/(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?/);
  if (!match) return 4.0;
  if (match[2]) return (parseFloat(match[1]) + parseFloat(match[2])) / 2;
  return parseFloat(match[1]);
}

let importedTrans = 0;
const intercity = trans.filter(t => t.origin && t.destination && nameToDest[t.origin] && nameToDest[t.destination]);
intercity.forEach(t => {
  const oId = nameToDest[t.origin];
  const dId = nameToDest[t.destination];
  const tType = mapTransportType(t.type);
  const duration = parseDuration(t.duration);
  const notes = `${t.type.replace(/_/g, ' ').toUpperCase()} (${t.duration || ''})`;
  
  // Forward leg
  sql += `insert into public.transport_options (origin_destination_id, destination_destination_id, transport_type, pricing_unit, vehicle_capacity, estimated_cost_min, estimated_cost_max, currency, duration_hours, duration_text, route_notes, source, source_date, public_visible)\n`;
  sql += `values (${escapeSql(oId)}, ${escapeSql(dId)}, ${escapeSql(tType)}, 'per_person', NULL, ${t.min_npr}, ${t.max_npr}, 'NPR', ${duration}, ${escapeSql(t.duration)}, ${escapeSql(notes)}, 'Nepal Travel Budget Guide 2025', '2025-08-01', true);\n`;
  importedTrans++;

  // Reverse leg
  sql += `insert into public.transport_options (origin_destination_id, destination_destination_id, transport_type, pricing_unit, vehicle_capacity, estimated_cost_min, estimated_cost_max, currency, duration_hours, duration_text, route_notes, source, source_date, public_visible)\n`;
  sql += `values (${escapeSql(dId)}, ${escapeSql(oId)}, ${escapeSql(tType)}, 'per_person', NULL, ${t.min_npr}, ${t.max_npr}, 'NPR', ${duration}, ${escapeSql(t.duration)}, ${escapeSql(notes)}, 'Nepal Travel Budget Guide 2025', '2025-08-01', true);\n`;
  importedTrans++;
});

// Private vehicle and taxi reference pricing on major corridors
const privateCorridors = [
  { origin: 'Kathmandu', destination: 'Pokhara', car_min: 10000, car_max: 14000, jeep_min: 14000, jeep_max: 18000, dur: '5-6h' },
  { origin: 'Kathmandu', destination: 'Chitwan', car_min: 8000, car_max: 12000, jeep_min: 12000, jeep_max: 16000, dur: '4-5h' },
  { origin: 'Kathmandu', destination: 'Nagarkot', car_min: 2500, car_max: 4000, jeep_min: 4000, jeep_max: 5500, dur: '1-1.5h' },
  { origin: 'Kathmandu', destination: 'Dhulikhel', car_min: 2500, car_max: 4000, jeep_min: 4000, jeep_max: 5500, dur: '1-1.5h' },
  { origin: 'Kathmandu', destination: 'Bandipur', car_min: 9000, car_max: 13000, jeep_min: 13000, jeep_max: 17000, dur: '3.5-4.5h' },
  { origin: 'Pokhara', destination: 'Chitwan', car_min: 7000, car_max: 10000, jeep_min: 10000, jeep_max: 14000, dur: '3.5-4.5h' },
  { origin: 'Pokhara', destination: 'Bandipur', car_min: 5000, car_max: 8000, jeep_min: 8000, jeep_max: 11000, dur: '2-3h' },
  { origin: 'Pokhara', destination: 'Lumbini', car_min: 10000, car_max: 14000, jeep_min: 14000, jeep_max: 18000, dur: '5-6h' },
];

privateCorridors.forEach(c => {
  const oId = nameToDest[c.origin];
  const dId = nameToDest[c.destination];
  const dur = parseDuration(c.dur);

  // Private car (forward & reverse)
  sql += `insert into public.transport_options (origin_destination_id, destination_destination_id, transport_type, pricing_unit, vehicle_capacity, estimated_cost_min, estimated_cost_max, currency, duration_hours, duration_text, route_notes, source, source_date, public_visible)\n`;
  sql += `values (${escapeSql(oId)}, ${escapeSql(dId)}, 'private_vehicle', 'per_vehicle', 4, ${c.car_min}, ${c.car_max}, 'NPR', ${dur}, ${escapeSql(c.dur)}, 'Private Sedan / Car', 'Nepal Travel Budget Guide 2025', '2025-08-01', true);\n`;
  sql += `insert into public.transport_options (origin_destination_id, destination_destination_id, transport_type, pricing_unit, vehicle_capacity, estimated_cost_min, estimated_cost_max, currency, duration_hours, duration_text, route_notes, source, source_date, public_visible)\n`;
  sql += `values (${escapeSql(dId)}, ${escapeSql(oId)}, 'private_vehicle', 'per_vehicle', 4, ${c.car_min}, ${c.car_max}, 'NPR', ${dur}, ${escapeSql(c.dur)}, 'Private Sedan / Car', 'Nepal Travel Budget Guide 2025', '2025-08-01', true);\n`;
  importedTrans += 2;

  // Private Scorpio / Jeep (forward & reverse)
  sql += `insert into public.transport_options (origin_destination_id, destination_destination_id, transport_type, pricing_unit, vehicle_capacity, estimated_cost_min, estimated_cost_max, currency, duration_hours, duration_text, route_notes, source, source_date, public_visible)\n`;
  sql += `values (${escapeSql(oId)}, ${escapeSql(dId)}, 'jeep', 'per_vehicle', 6, ${c.jeep_min}, ${c.jeep_max}, 'NPR', ${dur}, ${escapeSql(c.dur)}, 'Private Scorpio / Jeep (6 Pax)', 'Nepal Travel Budget Guide 2025', '2025-08-01', true);\n`;
  sql += `insert into public.transport_options (origin_destination_id, destination_destination_id, transport_type, pricing_unit, vehicle_capacity, estimated_cost_min, estimated_cost_max, currency, duration_hours, duration_text, route_notes, source, source_date, public_visible)\n`;
  sql += `values (${escapeSql(dId)}, ${escapeSql(oId)}, 'jeep', 'per_vehicle', 6, ${c.jeep_min}, ${c.jeep_max}, 'NPR', ${dur}, ${escapeSql(c.dur)}, 'Private Scorpio / Jeep (6 Pax)', 'Nepal Travel Budget Guide 2025', '2025-08-01', true);\n`;
  importedTrans += 2;
});

// 4. DOMESTIC FLIGHTS
sql += '\n-- 4. DOMESTIC FLIGHTS (13 routes with SAARC & Foreigner fares)\n';
const airportMap = {
  KTM: { id: '10000000-0000-0000-0000-000000000001', city: 'Kathmandu' },
  PKR: { id: '10000000-0000-0000-0000-000000000004', city: 'Pokhara' },
  BHR: { id: '10000000-0000-0000-0000-000000000005', city: 'Bharatpur (Chitwan)' },
  JKR: { id: '10000000-0000-0000-0000-000000000006', city: 'Janakpur' },
  BWA: { id: '10000000-0000-0000-0000-000000000007', city: 'Bhairahawa (Lumbini)' },
  BIR: { id: null, city: 'Biratnagar' },
  KEP: { id: '10000000-0000-0000-0000-000000000020', city: 'Nepalgunj' },
  JMO: { id: '10000000-0000-0000-0000-000000000014', city: 'Jomsom (Muktinath)' },
  LUA: { id: null, city: 'Lukla' },
  SIMA: { id: '10000000-0000-0000-0000-000000000021', city: 'Simara (Birgunj)' },
  TMI: { id: null, city: 'Tumlingtar' },
  DHI: { id: null, city: 'Dhangadhi' },
  'KTM/RHP': { id: '10000000-0000-0000-0000-000000000001', city: 'Kathmandu / Ramechhap' },
  EVEREST_SCENIC: { id: '10000000-0000-0000-0000-000000000001', city: 'Everest Scenic Flight' },
};

let importedFlights = 0;
flights.forEach(f => {
  const orig = airportMap[f.origin] || { id: null, city: f.origin };
  const dest = airportMap[f.destination] || { id: null, city: f.destination };
  const airlinesArr = "ARRAY[" + f.airlines.map(a => escapeSql(a)).join(',') + "]";
  const notes = `Flight duration: ${f.duration_minutes} mins | Foreigner: USD ${f.foreigner_min_usd}-${f.foreigner_max_usd}`;

  // Forward flight
  sql += `insert into public.domestic_flights (origin_destination_id, origin_city, origin_airport_code, destination_destination_id, destination_city, destination_airport_code, estimated_cost_min, estimated_cost_max, estimated_cost_foreigner_min, estimated_cost_foreigner_max, foreigner_currency, currency, duration_minutes, airlines, flight_notes, source, source_date, public_visible)\n`;
  sql += `values (${escapeSql(orig.id)}, ${escapeSql(orig.city)}, ${escapeSql(f.origin)}, ${escapeSql(dest.id)}, ${escapeSql(dest.city)}, ${escapeSql(f.destination)}, ${f.saarc_min_npr}, ${f.saarc_max_npr}, ${f.foreigner_min_usd}, ${f.foreigner_max_usd}, 'USD', 'NPR', ${f.duration_minutes}, ${airlinesArr}, ${escapeSql(notes)}, 'Nepal Travel Budget Guide 2025', '2025-08-01', true);\n`;
  importedFlights++;

  // Reverse flight if not scenic
  if (f.destination !== 'EVEREST_SCENIC') {
    sql += `insert into public.domestic_flights (origin_destination_id, origin_city, origin_airport_code, destination_destination_id, destination_city, destination_airport_code, estimated_cost_min, estimated_cost_max, estimated_cost_foreigner_min, estimated_cost_foreigner_max, foreigner_currency, currency, duration_minutes, airlines, flight_notes, source, source_date, public_visible)\n`;
    sql += `values (${escapeSql(dest.id)}, ${escapeSql(dest.city)}, ${escapeSql(f.destination)}, ${escapeSql(orig.id)}, ${escapeSql(orig.city)}, ${escapeSql(f.origin)}, ${f.saarc_min_npr}, ${f.saarc_max_npr}, ${f.foreigner_min_usd}, ${f.foreigner_max_usd}, 'USD', 'NPR', ${f.duration_minutes}, ${airlinesArr}, ${escapeSql(notes)}, 'Nepal Travel Budget Guide 2025', '2025-08-01', true);\n`;
    importedFlights++;
  }
});

// 5. ACTIVITIES
sql += '\n-- 5. ACTIVITIES (Sightseeing, permits & adventures)\n';
function mapActCategory(type) {
  if (type === 'attraction') return 'cultural';
  if (type === 'national_park') return 'wildlife';
  if (type === 'permit') return 'trekking';
  if (type === 'adventure') return 'adventure';
  if (type === 'activity') return 'nature';
  return 'sightseeing';
}

let importedActs = 0;
acts.forEach(act => {
  let destId = destMap[act.destination_key];
  if (!destId) {
    if (act.destination_key === 'everest') destId = '10000000-0000-0000-0000-000000000019'; // ABC/Trek
    else if (act.destination_key === 'trekking') destId = '10000000-0000-0000-0000-000000000004'; // Pokhara
    else if (act.destination_key === 'trishuli') destId = '10000000-0000-0000-0000-000000000001'; // Kathmandu
    else if (act.destination_key === 'kushma') destId = '10000000-0000-0000-0000-000000000004'; // Pokhara
    else if (act.destination_key === 'bhote_koshi') destId = '10000000-0000-0000-0000-000000000001'; // Kathmandu
    else if (act.destination_key === 'nepal') destId = '10000000-0000-0000-0000-000000000004'; // Pokhara
  }
  if (!destId) return;

  const cat = mapActCategory(act.type);
  let minCost = 0, maxCost = 0;
  if (act.price_min_npr != null) {
    minCost = act.price_min_npr;
    maxCost = act.price_max_npr != null ? act.price_max_npr : minCost;
  } else if (act.saarc_npr != null) {
    minCost = act.saarc_npr;
    maxCost = act.saarc_npr;
  } else if (act.saarc_npr_min != null) {
    minCost = act.saarc_npr_min;
    maxCost = act.saarc_npr_max;
  } else if (act.foreigner_npr != null) {
    minCost = act.foreigner_npr;
    maxCost = act.foreigner_npr;
  }

  const desc = `${(act.type || '').toUpperCase()} | Unit: ${act.pricing_unit || 'per_person'}${act.notes ? ' (' + act.notes + ')' : ''}`;
  sql += `insert into public.activities (destination_id, name, category, estimated_cost, estimated_cost_max, currency, description, source, source_date, public_visible)\n`;
  sql += `values (${escapeSql(destId)}, ${escapeSql(act.name)}, ${escapeSql(cat)}, ${minCost}, ${maxCost}, 'NPR', ${escapeSql(desc)}, 'Nepal Travel Budget Guide 2025', '2025-08-01', true);\n`;
  importedActs++;
});

const outPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260819000031_phase2b_real_travel_data.sql');
fs.writeFileSync(outPath, sql, 'utf8');

console.log('Migration generated successfully:');
console.log('  Accommodations:', importedAccoms);
console.log('  Transport Options:', importedTrans);
console.log('  Domestic Flights:', importedFlights);
console.log('  Activities:', importedActs);
console.log('  Daily Cost Estimates:', daily.length);
console.log('  File written to:', outPath);
