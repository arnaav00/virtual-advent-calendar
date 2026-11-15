# Little Snowglobe

A dependency-free advent-calendar scaffold: an original SVG winter village with 24 numbered windows and day 25 on the central door beneath its wreath.

Run `npm run dev` from this directory and open http://localhost:4173. The static website is in `dist/`; it can also be hosted directly without a build step.

- `dist/app.js`: scene illustration, day coordinates, door behavior, and snowfall.
- `dist/motion.js`: continuous skating path, grounded push/recovery stride, and curved sleigh flight.
- `dist/interactions.js`: skater pause, snowman tumble, falling tree snow, and Snoopy dance.
- `dist/styles.css`: palette, viewport fitting, and hinged shutter transitions.
- `dist/index.html`: accessible page shell.
- `dist/snowball-game.js` and `dist/game-model.js`: T-toggle snowball game, chimney cats, independent projectiles, and hit timing.
- `dist/santa-gifts.js`: colored presents dropping behind the houses when Santa is clicked.

Hover or keyboard-focus a window or the central door to peek inside. Click/tap to keep it open; click it again, click outside, or press Escape to reset. All interiors are intentionally empty black placeholders. Visible content contains only numbers 1–25. Windows read left-to-right and top-to-bottom within each house: 1–4, 5–10, 11–15, 16–20, and 21–24; day 25 remains beneath the central wreath.

Pointed Christmas bulbs with green sockets share one continuous cable across all five houses. Fixed red, blue, green, and yellow bulbs repeat along the cable; each color group glows alone for 0.5 seconds, in that order, on a two-second loop. A scarf-wearing skater circles the pond every 20 seconds with alternating blade pushes and knee bends, without mirroring or squashing at turns. Santa's sleigh is pulled by a softly illustrated Appa, with six galloping legs, a swaying tail, his arrow marking, and a glowing red nose. They follow a broad arc across the sky, tilting with the curve, on a continuous 22-second loop with no offscreen pause. Snoopy and Woodstock rest on a red, snowy doghouse beside the pond. Snow has twice the original particle count and radius. There are no stars, chimney smoke, or numbered ground gifts. Reduced-motion preferences stop the idle motion and shutter transitions; animation pauses while the page is hidden.

Run `npm test` to verify skating support-blade contact, pond bounds, continuity at the loop seam, and the sleigh arc and roof clearance. Run `npm run check` for the application syntax check.

The scene scales as a single 1440 × 900 illustration to fit landscape laptop screens without scrolling. Assets are bundled locally; no runtime external requests, fonts, dependencies, analytics, or storage are required. Future day content can be connected using each button's `data-day` value.

Easter eggs: hover over the skater to pause her with one hand on her hip and the other waving; click the snowman to tumble his body, head, carrot, scarf, arms, and hat separately, then rebuild after a one-second rest. Click either big front tree to shake loose clumps of snow that accelerate downward, scatter on landing, and settle back onto the branches after one second. Click the wreath above day 25 to shake it and release two flapping turtle doves that take off and exit opposite screen edges. Click Snoopy for a five-second happy dance beside the doghouse while Woodstock stays on the roof. Clickable surprises also support Enter and Space; the skater supports keyboard focus. Repeated clicks are ignored until each animation finishes.

The caption-free Snoopy dance GIF is bundled locally from https://tenor.com/view/happysnoopy-snoopy-gif-20406733 (https://media1.tenor.com/m/IVzgNDAofuQAAAAC/happysnoopy-snoopy.gif). Its green background is removed by an SVG filter at render time; the source GIF remains unmodified.

Press T to toggle the unscored snowball game; Escape also exits. A white ring-and-cross reticle replaces the cursor. Each left-button press launches one independent snowball from the viewport's bottom center (holding does not repeat). Orange, black, and white cats appear in random chimneys every second, rising for 0.2s, staying for 1.5s, and ducking for 0.2s. At most two are active, with no shared chimney. Hits are resolved on arrival, with a small forgiving margin around visible cats, a snowy flinch, and a recorded meow. Game mode consumes other click actions; normal advent interactions return when it ends. The game pauses in hidden tabs and clears on exit.

Meow recording: “Meow.ogg”, Silas the cat by Dan Crosby (Dcrosby), https://commons.wikimedia.org/wiki/File:Meow.ogg — CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/). Original audio is bundled unmodified, with playback volume lowered. Attribution is also shipped in `dist/assets/meow-license.txt`.
