# NepaYatra Phase 2B — Reference Travel Cost Dataset

This package converts the supplied **Nepal Travel Budget Guide 2025 (Updated August 2025 Edition)** into structured reference data for NepaYatra's budget engine.

## Important

These are **reference estimates**, not live prices, bookings, or availability. The source itself notes that prices vary with season, availability, negotiation, exchange rates and policy changes.

Primary source:
- `Nepal_Travel_Budget_Guide_2025.pdf`
- Updated August 2025 Edition

The source covers 146+ hotels, 43+ transport routes, 13 domestic flight routes and 15+ cities.

## Files

- `source/accommodations.json` — accommodation ranges extracted from the guide. Prices are stored as NPR per room/night unless the source explicitly indicates otherwise.
- `source/daily_costs.json` — daily budget benchmarks from the guide.
- `source/transport.json` — intercity and local transport reference ranges from the guide.
- `source/flights.json` — domestic flight fare ranges with SAARC NPR and foreigner USD fares.
- `source/activities.json` — attraction fees, trekking permits/guide rates, and adventure activities.
- `web_supplements/current_reference_examples.json` — a small set of current web reference examples used only to sanity-check/augment the older guide. These are clearly marked as supplemental.

## Data rules

- Never present these values as exact customer prices.
- Preserve min/max ranges.
- Respect pricing units: per person, per room/night, per vehicle, per day, per trip, per hour.
- Do not convert foreigner USD fares into NPR using a guessed exchange rate.
- Do not silently substitute fabricated values when source coverage is missing.
- `source` and `source_date` should be retained when importing into Supabase.
