# Aurora Planner v18 — decision-first UX

Static EN/ES GitHub Pages deployment. Upload all seven files preserving directories.

Changes: calendar before configuration; one compact recommendation with observation-mode selector; tour booking collapsed; car-area choice shown only to drivers; map with three initial locations and expandable alternatives; technical details below. Regional nightly labels are consistent across modes. Personal advice changes based on the chosen mode.

**Important:** the 30/60/90-minute driving concept is intentionally NOT displayed as verified minutes because the application has no road routing service. Instead the selector uses rough area bands. These do not establish driving time, safe access, or tour itinerary. Tour reach is conservatively limited to existing level 2 areas; the operator decides the actual route. Walking mode uses Tromsø only, without promising transit or viewpoint accessibility.

Cloud forecasts: Open-Meteo. Solar data: NOAA. Forecasts are not sighting probabilities. No moonlight or site-specific light pollution model.


## v19
- NOAA Kp matched to actual clear-sky hours during the overnight period, including Norwegian daylight-saving offsets.
- Nearby usable locations preferred; longer trips require substantially better clear windows. Tour reach limited to existing level-2 weather locations.
- Collapsible map and hidden empty forecast sections; retry for missing weather.
- Drive settings are approximate geographic coverage, never road travel minutes.
- EN/ES text and accessibility improvements.
- No verified route times, real tour itineraries, moon/light pollution, or guarantee of seeing aurora.
