/** Stable motion durations. Use sparingly; preserve reduced-motion friendliness. */
export const motion = {
  duration: {
    fastMs: 120,
    baseMs: 180,
    slowMs: 260,
  },
  pressScale: 0.97,
  pressedOpacity: 0.86,
} as const;
