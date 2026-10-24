import { SamplePreset } from '../types';

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'indore-soybean',
    title: 'Central India: Soybean & Black Soil Belt',
    crop: 'Yellow Soybean',
    region: 'Indore Mandi & Ujjain APMC, Madhya Pradesh',
    country: 'India',
    currency: 'INR (₹/quintal)',
    issue: 'Yellowing of lower leaves and stem girdle beetle infestation signs after intermittent rain',
    feedData: `[AGMARKNET LIVE SPOT BULLETIN - 23 OCT 2026]
Market: Indore Mandi (Madhya Pradesh)
Commodity: Yellow Soybean (Grade FAQ)
Arrivals: 4,200 bags (approx 420 Metric Tonnes)
Min Price: ₹4,650 / quintal
Max Price: ₹5,120 / quintal
Modal Price: ₹4,890 / quintal (+₹65 from yesterday, firm buyer demand from solvent extraction plants)
Nearby Comparison:
- Ujjain APMC: Modal ₹4,820 / quintal (arrivals 2,800 bags)
- Dewas Mandi: Modal ₹4,870 / quintal (arrivals 1,950 bags)
Moisture Level: 11.2% average (Mandis deducting if moisture > 12%)

[IMD REGIONAL AGRO-MET WEATHER RADAR - MALWA DIVISION]
Current Temp: 29°C | Night Min: 18°C | Relative Humidity: 78% morning, dropping to 48% evening
Forecast Next 48 Hours: Scattered cloudy spells with 35% chance of localized thunder showers on Saturday evening. Wind gusts up to 18 km/h NW.
Dew deposition expected during early dawn hours. 

[ICAR-IISR REGIONAL PLANT PROTECTION BULLETIN]
Girdle beetle (Oberia brevis) and Semilooper larvae active in late-sown soybean pockets.
Farmers reporting yellow mosaic symptoms transmitted by whiteflies in low-drainage plots.
Official recommendations: Avoid chemical spray during rainy gusts; spray Chlorantraniliprole 18.5% SC @ 150ml/ha or organic Neem seed kernel extract (NSKE 5%) if infestation below ETL. Ensure clearing waterlogged field furrows.`,
  },
  {
    id: 'us-corn-belt',
    title: 'US Midwest: Yellow Dent Corn #2',
    crop: 'Yellow Dent Corn #2',
    region: 'Des Moines & Central Iowa Grain Elevators',
    country: 'United States',
    currency: 'USD ($/bushel)',
    issue: 'High drying fuel costs, Tar Spot fungal lesions appearing on upper canopy before harvest window',
    feedData: `[CME / USDA CASH GRAIN TICKER - OCT 23, 2026]
Location: Des Moines River Valley Terminal & Elevators
Commodity: Yellow Dent Corn #2
Cash Spot Bid: $4.48 / bushel (+$0.06 on strong Gulf export demand)
Basis: -0.18 under Dec '26 futures ($4.66)
Range: $4.42 - $4.55 / bushel across central Iowa commercial elevators
Average Harvest Moisture: 17.8% (Commercial drying discount: $0.04/pt above 15.0%)
Truck Wait Time at Terminal: 45 minutes; Rail hopper car allocation stable.

[NOAA NATIONAL WEATHER SERVICE DES MOINES RADAR]
Current Conditions: 58°F (14°C), Barometer: 29.98 inHg, Wind: 14 mph WSW
Alert: Moderate Freeze Warning issued for Sunday night (forecast low 29°F / -1.6°C).
Friday-Saturday: Sunny, dry, excellent field combine traction. Wind drying index high.
Sunday afternoon: Cold front passing, wind shift to NNW 22 mph with gusts to 32 mph.

[IOWA STATE UNIVERSITY EXTENSION FIELD CROP PATHOLOGY]
Tar Spot (Phyllachora maydis) detected in late-planted hybrid plots across Story and Polk counties.
Black raised stromata coalescing on ear leaves. Late-season stalk rot risk elevated due to premature drydown.
Management Directive: For corn at black layer (R6), fungicide applications are NOT economically justified. Prioritize combining lodged fields first before Sunday night freeze and high winds. Check moisture twice daily; dry down slowly to prevent stress cracking.`,
  },
  {
    id: 'nashik-onion',
    title: 'Western India: Lasalgaon Onion & Tomato',
    crop: 'Red Onion (Garva / Kharif)',
    region: 'Lasalgaon APMC & Pimpalgaon Mandi, Nashik, Maharashtra',
    country: 'India',
    currency: 'INR (₹/quintal)',
    issue: 'Purple blotch fungal spots and thrips population rising in nursery beds',
    feedData: `[LASALGAON APMC SPOT MARKET SHEET - 23 OCT 2026]
Commodity: Red Onion (Summer Garva stored & early Kharif arrival)
Total Arrivals: 18,500 quintals (320 tractor trolleys)
Quality: Super/Extra Bold: ₹2,950 / quintal
Medium Bold: ₹2,450 / quintal
Low/Patti Quality: ₹1,400 / quintal
Average Modal Price: ₹2,550 / quintal (down ₹110 due to increased arrivals of damp onions)
Pimpalgaon Baswant APMC Modal: ₹2,600 / quintal
Kalwan APMC Modal: ₹2,480 / quintal

[MAHARASHTRA STATE AGRO WEATHER DESK]
Max Temp: 32°C, Min Temp: 19°C.
Humidity: 85% RH at 07:00 AM, 55% at 02:00 PM. Foggy mornings in Godavari basin.
Forecast: Dry weather next 3 days, strong sunny afternoons. No rain alert for Nashik district.

[DOGR (DIRECTORATE OF ONION & GARLIC RESEARCH) ADVISORY]
Purple Blotch (Alternaria porri) and Stemphylium blight reported in early Kharif crop due to high morning fog and moisture. Thrips tabaci count at 12 nymphs/plant.
Remedy: Organic: Foliar spray of Trichoderma harzianum @ 5g/liter with sticker or 2% Pongamia oil.
Standard IPM: Spray Mancozeb 75% WP @ 2.5g/L + Fipronil 5% SC @ 1.5ml/L during morning hours when winds are calm (<8 km/h). Use agricultural spreader. Dry harvested onions under shade before packing in mesh bags.`,
  },
  {
    id: 'kenya-rift-maize',
    title: 'East Africa: White Maize & Coffee',
    crop: 'White Maize (Dry Grain)',
    region: 'Nakuru & Eldoret Commodity Hubs, Kenya',
    country: 'Kenya',
    currency: 'KES (KSh / 90kg bag)',
    issue: 'Fall Armyworm leaf whorl damage in late vegetative maize crop',
    feedData: `[MINISTRY OF AGRICULTURE & NAKURU CEREALS EXCHANGE - 23 OCT 2026]
Commodity: Dry White Maize (Grade 1 & 2)
Unit: 90kg bag
Nakuru Market Spot Price: KSh 3,850 - 4,100 per 90kg bag
Modal Price: KSh 3,950 / bag (Market firm with millers restocking)
Eldoret Grain Hub Modal: KSh 3,900 / 90kg bag
Kitale Market: KSh 3,820 / 90kg bag
Moisture requirement: Max 13.5% for NCPB storage receipting.

[KENYA METEOROLOGICAL DEPARTMENT (KMD) AGRO-FORECAST]
Short Rains Outlook: Moderate precipitation expected over Rift Valley highlands (15-25mm rainfall probability 60% over next 48 hours).
Temperatures: Daytime highs 24°C, Night lows 13°C.
Soil moisture: Optimal to saturated in low-lying terraces.

[KALRO / FAO FALL ARMYWORM SURVEILLANCE DESK]
Fall Armyworm (Spodoptera frugiperda) window funnel damage reported in 22% of scouted smallholder plots.
Window-pane leaf feeding and frass visible in whorls.
Recommended Protocol: Handpick caterpillars where feasible; apply wood ash mixed with fine sand (1:1 ratio) directly into plant whorls for organic suppression. For biological control, apply Bacillus thuringiensis (Bt) or Neem-based Azadirachtin. For standard IPM: Emamectin Benzoate 5% SG @ 4g per 20L knapsack. Spray during evening (5:00 PM - 6:30 PM) when larvae emerge to feed.`,
  },
  {
    id: 'punjab-basmati',
    title: 'Northern India: Pusa 1121 Basmati Paddy',
    crop: 'Basmati Paddy (Pusa 1121 & 1718)',
    region: 'Khanna Mandi & Taraori APMC, Punjab & Haryana',
    country: 'India',
    currency: 'INR (₹/quintal)',
    issue: 'High moisture at harvest, Neck Blast fungus in grain filling stage',
    feedData: `[PUNJAB MANDI BOARD LIVE AUCTION SHEET - 23 OCT 2026]
Location: Khanna Mandi (Asia's Largest Grain Market)
Commodity: 1121 Basmati Paddy (Combine Harvested)
Arrivals: 34,000 quintals today
Auction Bids:
Minimum: ₹3,720 / quintal
Maximum: ₹4,180 / quintal (Super dry, long grain aromatic lot)
Modal Price: ₹3,940 / quintal (+₹45 day-on-day due to active private basmati export house buyers)
Taraori Mandi (Haryana) Modal: ₹3,980 / quintal
Amritsar Mandi Modal: ₹3,910 / quintal
Average Paddy Moisture in current arrivals: 16.5% (Target standard: 14.0%)

[PAU LUDHIANA AGRO-METEOROLOGY DEPARTMENT]
Max Temp: 31°C, Min Temp: 16°C. Clear sky, high solar radiation index.
AQI Alert: Elevated particulate matter in evening hours.
Wind: Calm (4-6 km/h from NW).
No rainfall predicted for the next 7 days across Punjab and Haryana plains.

[PAU LUDHIANA PLANT PATHOLOGY ADVISORY - BULLETIN 42]
Neck Blast (Pyricularia oryzae) risk elevated in late-transplanted 1121 basmati where excessive urea was applied.
Brownish lesions visible at panicle node causing chaffy grains.
Advisory: Stop further nitrogen/urea application immediately. If crop is within 15 days of harvest, do NOT spray chemical fungicides due to strict export MRL (Maximum Residue Limit) tests for Basmati shipments.
If crop is 25+ days from harvest and blast exceeds threshold: Spray Tricyclazole 75% WP @ 120g/acre or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 200ml/acre in 200 liters of water. Harvest during mid-day when morning dew has completely evaporated.`,
  },
];
