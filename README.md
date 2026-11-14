# Little Snowglobe

A dependency-free advent-calendar scaffold: an original SVG winter village, 25 interactive doors, and canvas snowfall.

Run `npm run dev` from this directory and open http://127.0.0.1:4173. The static website is in `dist/`; it can also be hosted directly without a build step.

- `dist/app.js`: scene illustration, day coordinates, door behavior, and snowfall.
- `dist/styles.css`: palette, viewport fitting, and hinged shutter transitions.
- `dist/index.html`: accessible page shell.

Hover or keyboard-focus a door to peek inside. Click/tap to keep it open; click it again, click outside, or press Escape to reset. All interiors are intentionally empty black placeholders. Visible content contains only numbers 1–25. Reduced-motion preferences disable continuous snowfall and animated transitions.

The scene scales as a single 1440 × 900 illustration to fit landscape laptop screens without scrolling. No external assets, fonts, dependencies, analytics, or storage are required. Future day content can be connected using each button's `data-day` value.
