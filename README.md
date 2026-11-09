# Aurora Planner — GitHub Pages

Ready for `https://carrilloalex.github.io/tromso-aurora-planner/`.

## Deploy

1. Back up your current repository files.
2. Upload the **contents** of this ZIP to the root of the `tromso-aurora-planner` repository, keeping the `en/` and `es/` folders.
3. In **Settings → Pages**, choose **Deploy from a branch**, `main`, `/(root)`.
4. Check `/`, `/en/`, `/es/`, and `/sitemap.xml`.
5. Submit `sitemap.xml` to Google Search Console.

English is the default. `/` redirects by browser language or saved preference. Explicit `/en/` and `/es/` URLs are stable and indexable.

The existing app logic and Open-Meteo calls are retained from Aurora Planner v10. Weather requests require internet access.

SEO: the HTML includes localized visible FAQ text, canonical and hreflang links, and structured data. Dynamic forecast results remain JavaScript-generated.

## V11 — continuous date timeline

- Explore now uses a single continuous horizontal date timeline, with no seven-day page changes.
- Upcoming mode includes the next 16 calendar nights; trip mode shows all configured trip nights (including dates without forecasts).
- Swipe on mobile, use the left/right scroll controls on desktop, or use trackpad horizontal scrolling.
- Tap a night to select it; swiping alone does not change the selected forecast.
- The best-night shortcut evaluates the entire displayed date range.
- Shared trip bookings, weather data, and bilingual URLs are unchanged.

QA: HTML structure and JavaScript syntax verified for all three pages. Real-browser visual and live Open-Meteo checks are still required after deployment.
