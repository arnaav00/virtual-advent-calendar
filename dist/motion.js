const TAU = Math.PI * 2;
export const LAP_SECONDS = 20;
export const FLIGHT_SECONDS = 34;
export const CROSSING_SECONDS = FLIGHT_SECONDS * .72;

// A broad parabolic arc, with the sleigh tilted along its direction of travel.
// The reset and pause happen beyond the edges of the illustration.
export function santaPose(seconds) {
  const t = Math.min((seconds % FLIGHT_SECONDS) / CROSSING_SECONDS, 1);
  return {
    x: -400 + 2170 * t,
    y: 240 - 560 * t * (1 - t),
    rotation: Math.atan2(560 * (2 * t - 1), 2170) * 180 / Math.PI
  };
}

// A continuous oval with a front-facing figure: no mirror flips or width changes.
// During each push one blade stays on the ice while the other recovers.
export function skaterPose(seconds) {
  const angle = seconds / LAP_SECONDS * TAU;
  const stride = seconds / 2.5 * TAU;
  const push = Math.sin(stride);
  const feet = [-1, 1].map(side => {
    const recovery = Math.max(0, side * push);
    const extension = Math.max(0, -side * push);
    return { x: side * (7 + 13 * extension), y: -3 * recovery,
      kneeX: side * (5 + 5 * extension), kneeY: -15 + recovery * 2 };
  });
  return {
    x: 735 - 195 * Math.cos(angle), y: 828 - 25 * Math.sin(angle),
    scale: .94 - .04 * Math.sin(angle),
    lean: 4 * Math.cos(angle) + 2 * push,
    dip: 1.2 * (1 - Math.cos(stride * 2)),
    scarf: 4 * Math.sin(stride + .6), feet
  };
}
