# ✦ Aurora Planner

**Plan smarter northern lights nights in Tromsø, Norway.**

Aurora Planner is a free, bilingual trip-planning web app that helps you compare upcoming nights, find potentially clearer areas within reach of an aurora-chasing tour, and keep your tour bookings organized.

**[Open Aurora Planner →](https://carrilloalex.github.io/tromso-aurora-planner/)** · [English](https://carrilloalex.github.io/tromso-aurora-planner/en/) · [Español](https://carrilloalex.github.io/tromso-aurora-planner/es/)

> **Important:** Aurora Planner is a planning aid, not a guarantee of seeing the northern lights. Clear skies are only one factor; auroral activity, darkness, local conditions, road safety, and tour operators' decisions also matter.

## What you can do

- **Compare upcoming nights** using weather-informed conditions across Tromsø and surrounding areas.
- **Browse dates continuously**: swipe on mobile or scroll through the timeline on desktop; tap a date to inspect it.
- **Spot promising nights** with a shortcut to the strongest weather-based opportunity in the displayed period.
- **Explore possible tour areas** based on approximate one-way travel ranges from Tromsø, with cloud cover, wind, and temperature details.
- **Plan before forecasts exist**: organize a trip months ahead without mistaking missing weather data for bad weather.
- **Manage your trip**: track tour reservations, cancellation deadlines, and nights when you saw auroras.
- **Use it in English or Spanish**, with browser-language detection and a manual language switch.

## How it works

### Explore

Explore works **without entering travel dates**. The app displays a continuous timeline of upcoming nights within the weather forecast horizon. Select a night to view a weather-based assessment, possible tour areas, and more detailed conditions.

If you have configured a trip, you can also switch to its dates. Dates beyond the forecast horizon are clearly marked as **not yet available**—not as unfavorable.

### My Trip

Add your travel dates and organize excursions, bookings, and cancellation deadlines. My Trip is optional and does not restrict Explore.

### Forecast availability

The app uses forecast data for approximately **the next 16 days**, subject to data availability. Forecasts become more actionable as your trip approaches; long-range weather trends are less certain. The app does **not** predict aurora sightings months in advance or calculate a verified probability of seeing auroras.

## Languages

| URL | Behavior |
| --- | --- |
| [`/`](https://carrilloalex.github.io/tromso-aurora-planner/) | Detects browser language or saved preference; defaults to English |
| [`/en/`](https://carrilloalex.github.io/tromso-aurora-planner/en/) | English |
| [`/es/`](https://carrilloalex.github.io/tromso-aurora-planner/es/) | Español |

Direct language URLs remain stable. The site includes localized metadata, canonical links, `hreflang` references, and a sitemap for search engines.

## Data and limitations

Weather forecasts are requested from **[Open-Meteo](https://open-meteo.com/)**. The app considers weather conditions at multiple locations, but:

- **Cloud forecasts are not aurora forecasts.** Even a clear night does not guarantee a sighting.
- Forecasts can change, especially further into the future.
- Driving times and reachable areas are **approximate**, not live routes or commitments from tour operators.
- Actual visibility depends on geomagnetic activity, darkness, local cloud conditions, and other factors.
- Always follow your guide's advice and check road and weather warnings before traveling.

For additional context, consult [Yr](https://www.yr.no/), [NOAA Space Weather Prediction Center](https://www.swpc.noaa.gov/), and [Norwegian Public Roads Administration](https://www.vegvesen.no/trafikk).

## Privacy and storage

Trip details and preferences are stored **locally in your browser** using `localStorage`. They are not automatically synchronized between devices or browsers, and clearing browser storage may erase them. Weather data requires an internet connection to Open-Meteo.

## Run locally

This is a static HTML/CSS/JavaScript site. No build process or backend is required.

1. Clone or download this repository.
2. From the repository root, run a local web server:

   ```bash
   python3 -m http.server 8000
   ```

3. Open `http://localhost:8000/en/` or `http://localhost:8000/es/` in your browser.

The live site's SEO metadata points to the production GitHub Pages URLs. If you fork the project, update those URLs to match your deployment.

## Deploy to GitHub Pages

The repository is structured for the project site:

```text
.
├── index.html        # Language-aware entry point
├── en/
│   └── index.html    # English
├── es/
│   └── index.html    # Spanish
├── sitemap.xml
├── robots.txt
├── .nojekyll
└── README.md
```

1. Push the files to the `main` branch of `tromso-aurora-planner`.
2. In **Settings → Pages**, choose **Deploy from a branch**, then `main` and `/(root)`.
3. Once deployed, verify `/`, `/en/`, `/es/`, and `/sitemap.xml`.
4. Optionally submit the sitemap in [Google Search Console](https://search.google.com/search-console/about).

> **Maintainer note:** The current deployment contains separate HTML documents for the entry point and each language. When changing application behavior, keep all three pages consistent.

## Contributing

Bug reports and suggestions are welcome through [GitHub Issues](https://github.com/carrilloalex/tromso-aurora-planner/issues). When reporting a problem, include the page language, browser/device, steps to reproduce, and whether the affected date is inside the forecast horizon. Please don't include personal booking information.

---

Made for planning aurora nights in **Tromsø, Norway**. ✦
