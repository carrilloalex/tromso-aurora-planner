# Aurora Planner v17.1

Static bilingual Tromsø aurora planner for GitHub Pages. Upload all seven files preserving folders.

## Changes
- Observation mode: Tour (default), Car, No car. Tour search and optional locally stored tour date/time.
- Single compact nightly labels: Excellent, Favorable, Potential, Unfavorable, Uncertain.
- Labels use hourly clouds at reachable forecast points and NOAA predicted Kp when available. Elevated means Kp >= 5 (NOAA G1 threshold), not guaranteed aurora.
- Short clear breaks are considered. Horizon >3 days avoids claims of elevated solar activity.
- Main recommendation combines sky, aurora signal, forecast window, and selected mode.
- Tour operator routes cannot be predicted. No-car mode conservatively uses Tromsø only.

## Limitations
Moon position and local light pollution are NOT yet modeled; no live transit, road safety, route or tour availability data. NOAA forecasts are not sighting probabilities. The single-label rules are heuristic, not scientifically calibrated.
