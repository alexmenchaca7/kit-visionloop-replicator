/**
 * Design tokens — extracted from virya-energy.com/en/
 * FROZEN: do not modify without orchestrator approval.
 * Source of truth for colors, typography, spacing, motion.
 *
 * Note: values below are seed defaults; analysts will refine via
 * `references/pages/home/design-tokens.json` after the first crawl
 * and the orchestrator will sync this file before locking.
 */

export const colors = {
  // LOCKED from virya-energy.com computed styles
  brand: {
    DEFAULT: "#174338",
    50:  "#eef5f2",
    100: "#d2e6df",
    200: "#a7ccc0",
    300: "#7aae9f",
    400: "#508f7e",
    500: "#317365",
    600: "#235c50",
    700: "#1c4a40",
    800: "#174338",
    900: "#0f4338",
    950: "#0a2e26",
  },
  accent: {
    DEFAULT: "#ff5938",
    50:  "#fff1ed",
    100: "#ffded3",
    200: "#ffbca8",
    300: "#ff8e72",
    400: "#ff7053",
    500: "#ff5938",
    600: "#ee3911",
    700: "#c92907",
    800: "#a0250a",
    900: "#82240e",
  },
  ink: {
    DEFAULT: "#1f1e1e",
    muted: "#9f908d",
    soft: "#5b5757",
  },
  cream: "#eee8e2",
  creamSoft: "#f5f1ea",
  surface: { DEFAULT: "#ffffff", subtle: "#f9f9f9", muted: "#f2f2f2" },
} as const;

export const typography = {
  display: { family: "var(--font-display)", weights: [400, 500, 600, 700] },
  body:    { family: "var(--font-sans)", weights: [400, 500, 600, 700] },
  scale: {
    "display-xl": { size: "clamp(3rem, 6vw, 5rem)", lh: 1.05, weight: 600 },
    "display-lg": { size: "clamp(2.25rem, 4.5vw, 3.5rem)", lh: 1.1, weight: 600 },
    "h1":         { size: "clamp(2rem, 3.5vw, 3rem)", lh: 1.15, weight: 600 },
    "h2":         { size: "clamp(1.5rem, 2.5vw, 2.25rem)", lh: 1.2, weight: 600 },
    "h3":         { size: "1.5rem", lh: 1.3, weight: 600 },
    "body-lg":    { size: "1.125rem", lh: 1.6, weight: 400 },
    "body":       { size: "1rem", lh: 1.6, weight: 400 },
    "small":      { size: "0.875rem", lh: 1.5, weight: 400 },
  },
} as const;

export const radii = { sm: "0.375rem", md: "0.75rem", lg: "1rem", xl: "1.5rem", "2xl": "2rem", pill: "9999px" } as const;

export const spacing = {
  section: "clamp(4rem, 8vw, 7rem)",
  sectionInner: "clamp(2.5rem, 5vw, 4rem)",
} as const;

export const motion = {
  easeBrand: [0.22, 1, 0.36, 1] as const,
  duration: { fast: 0.25, base: 0.45, slow: 0.7 },
} as const;
