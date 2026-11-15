# Little Snowglobe

A dependency-free advent-calendar scaffold: an original SVG winter village with 24 numbered windows and day 25 on the central door beneath its wreath.

Run `npm run dev` from this directory and open http://127.0.0.1:4173. The static website is in `dist/`; it can also be hosted directly without a build step.

- `dist/app.js`: scene illustration, day coordinates, door behavior, and snowfall.
- `dist/motion.js`: continuous skating path and grounded push/recovery stride.
- `dist/styles.css`: palette, viewport fitting, and hinged shutter transitions.
- `dist/index.html`: accessible page shell.

Hover or keyboard-focus a window or the central door to peek inside. Click/tap to keep it open; click it again, click outside, or press Escape to reset. All interiors are intentionally empty black placeholders. Visible content contains only numbers 1–25.

Pointed Christmas bulbs with green sockets glow together in red, blue, green, and yellow phases along every roof. A scarf-wearing skater circles the pond every 20 seconds with alternating blade pushes and knee bends, without mirroring or squashing at turns. Santa's sleigh and two reindeer with individually articulated legs cross the sky on a 34-second loop. Snoopy and Woodstock rest on a red, snowy doghouse beside the pond. Snow has twice the original particle count and radius. There are no stars, chimney smoke, or numbered ground gifts. Reduced-motion preferences stop the idle motion and shutter transitions; animation pauses while the page is hidden.

Run `npm test` to verify skating support-blade contact, pond bounds, and continuity at the loop seam. Run `npm run check` for the application syntax check.

The scene scales as a single 1440 × 900 illustration to fit landscape laptop screens without scrolling. No external assets, fonts, dependencies, analytics, or storage are required. Future day content can be connected using each button's `data-day` value.
