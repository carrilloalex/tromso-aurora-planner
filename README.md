# Aurora Planner v21 — JTBD fixes

A bilingual, mobile-first, static aurora planning site for Tromsø. Deploy the seven files to GitHub Pages, preserving the `en/` and `es/` folders.

## Changes since v20
- The calendar keeps its **regional** outlook; the main recommendation, cloud-hour strip, location and map all use the **same mode-specific** weather-point selection.
- Clear distinction between regional potential and what is accessible within the chosen search zone; never presents a distant regional point as the user's local recommendation.
- Conservative nearby-first site selection: a viable nearer forecast point beats a farther one; no destination is recommended if none has useful clear periods.
- Map ranking begins with the selected recommended point, and the map only shows forecast points within the selected zone.
- The main card gives practical next steps for guided tours, driving and staying in Tromsø. Guidance does not claim verified access.
- A discreet 'best forecast night' marker highlights the strongest near-term night when enough information exists; not a guarantee of aurora sightings.
- Travel-date selector rejects past dates, dates outside the 16-day forecast, reversed ranges and ranges longer than 16 nights.
- Missing-data states never imply that skies will be cloudy; copy reviewed in English and Spanish.

## Forecasts and limitations
- Open-Meteo hourly cloud cover for 12 regional weather points; NOAA SWPC 3-hour Kp forecast matched to local night hours when available.
- 8+ day forecasts are uncertain; Kp is not a probability of seeing auroras.
- Search zones are rough geographic groupings, **not** verified drive times, routes, safety assessments, accessible walking locations, or operator itineraries. Verify all travel independently.
- A weather point is not an approved or safe viewing destination.
- Network APIs, map tiles and actual Safari rendering require live deployment QA. Automated tests used mocked weather/Kp and controlled network failures.
