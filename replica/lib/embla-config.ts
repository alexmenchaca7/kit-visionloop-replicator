import type { EmblaOptionsType } from "embla-carousel";

export const emblaPresets = {
  // Mirrors the Virya site Swiper config: drag-free horizontal, snaps trimmed,
  // visible scrollbar, 32px gap. Cards are ~308px wide → ~4 visible at 1320 container.
  expertise: {
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
    loop: false,
    skipSnaps: false,
    duration: 28,
  } satisfies EmblaOptionsType,

  projects: {
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
    loop: false,
    skipSnaps: false,
    duration: 26,
  } satisfies EmblaOptionsType,

  news: {
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
    loop: false,
    skipSnaps: false,
    duration: 28,
  } satisfies EmblaOptionsType,
} as const;

export type EmblaPreset = keyof typeof emblaPresets;
