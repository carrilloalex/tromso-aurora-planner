# Aurora Planner v13.0 + v13.1

## Implemented
- NOAA solar wind readings (Bz, Bt, speed, density) and Bz trend over the last hour.
- Kp data endpoint, with observed/forecast context when provided.
- Explicit time-horizon messaging; current solar values never score a future night.
- Clear-sky window detection and an hourly cloud timeline.
- Interactive Leaflet / OpenStreetMap geographical map with 19:00–02:00 hour slider.
- Reach-filtered weather forecast point markers and a location comparison.
- Additional narrow-mobile responsive CSS for fields, cards and dialogs.
- Preserved Explore/My Trip, bilingual pages, bookings, SEO and existing forecast logic.

## Not implemented / requires another data provider
- Continuous georeferenced cloud-cover raster and animated cloud layers.
- Forecast auroral oval as a time-aligned map overlay.
- Actual road travel times, driving directions or road-safety information.
- A calibrated probability of seeing aurora.

## QA
- All three HTML pages' inline JavaScript and the new v13.js pass Node syntax checks.
- Browser automation was attempted but the local test server was blocked by the browser environment (ERR_BLOCKED_BY_ADMINISTRATOR). Visual and real-device validation remains outstanding.
- Live NOAA/Open-Meteo requests could not be validated from this environment; the UI handles unavailable data.
