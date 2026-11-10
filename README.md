# Aurora Planner 🌌

**Plan your Northern Lights experience in Tromsø, Norway.** Compare upcoming nights, find clearer skies around Tromsø, and keep your aurora-tour plans in one place.

**[Open Aurora Planner](https://carrilloalex.github.io/tromso-aurora-planner/)** · [English](https://carrilloalex.github.io/tromso-aurora-planner/en/) · [Español](https://carrilloalex.github.io/tromso-aurora-planner/es/)

## What you can do

- **Explore upcoming nights:** browse a continuous, mobile-friendly date timeline and review forecast conditions.
- **Compare places:** see hourly cloud-cover percentages for forecast locations around Tromsø, including a location list and map markers when the map service is available.
- **Find clear-sky windows:** inspect how cloud cover changes throughout the night. Percentages refer to **forecast cloud cover**, **not the chance of seeing auroras**.
- **Check solar activity:** view NOAA solar-wind measurements (including Bz, Bt, speed and density) and Kp information when available. Live measurements describe current conditions; they are not forecasts for distant nights.
- **Plan your trip:** save travel dates, tour bookings and cancellation deadlines locally in your browser.
- **Use it in English or Spanish:** dedicated `/en/` and `/es/` pages.

## How it works

**Explore** helps you choose a night and compare the weather at different locations. **My Trip** helps you organize bookings and dates. Forecasts are estimates, especially farther in advance. Aurora visibility also depends on geomagnetic activity, darkness and local conditions; clear skies never guarantee a sighting.

## Data and attribution

- [Open-Meteo](https://open-meteo.com/) — weather forecasts, including cloud cover.
- [NOAA Space Weather Prediction Center](https://www.swpc.noaa.gov/) — solar-wind and geomagnetic data.
- [OpenStreetMap](https://www.openstreetmap.org/) contributors — map tiles, displayed using [Leaflet](https://leafletjs.com/) when external assets load.

This site needs an internet connection for live forecasts and map tiles. If a data provider is unavailable, some forecasts or map features may not display. Approximate travel times are not live road directions; always check local road and weather conditions before setting out.

## Run locally

This is a static website. No build step or API key is required for the included client-side implementation.

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`. Network access is required to load live data and external map assets.

## Deploy on GitHub Pages

1. Upload the **contents** of this repository to the root of your GitHub repository.
2. In **Settings → Pages**, select **Deploy from a branch**, branch `main`, folder `/(root)`.
3. Visit the [live site](https://carrilloalex.github.io/tromso-aurora-planner/) and check the English and Spanish pages.

### Repository structure

```text
.
├── index.html        # Language-aware entry point
├── en/
│   └── index.html    # English application
├── es/
│   └── index.html    # Spanish application
├── robots.txt
├── sitemap.xml
├── .nojekyll
└── README.md
```

## Privacy

Trip preferences and booking information are stored in your browser's local storage. The site requests public forecast data from external services; it does not require an account.

## Feedback

Found a bug or have an idea? [Open a GitHub issue](https://github.com/carrilloalex/tromso-aurora-planner/issues).

---

*Aurora Planner is an independent planning tool, not an aurora sighting guarantee or a substitute for local safety guidance.*


### Solar data compatibility

The live solar wind panel uses NOAA SWPC RTSW 1-minute JSON feeds (`/json/rtsw/rtsw_mag_1m.json` and `/json/rtsw/rtsw_wind_1m.json`). Measurements are observations, not forecasts for future nights. If NOAA is unavailable, the weather forecast remains usable.


## v16
Single-page Explore experience. Optional date filtering; legacy trip data remains in browser storage but is no longer shown. Recommendations distinguish clear-sky forecasts from solar activity. Solar wind observations are relevant only for immediate conditions; NOAA Kp forecasts are used for near-term nights when available. No aurora probability is inferred from cloud percentages.
