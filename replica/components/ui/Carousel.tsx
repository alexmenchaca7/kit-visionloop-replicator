"use client";

import {
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { emblaPresets, type EmblaPreset } from "@/lib/embla-config";

type Props = {
  preset: EmblaPreset;
  children: ReactNode;
  ariaLabel: string;
  showArrows?: boolean;
  showScrollbar?: boolean;
  className?: string;
};

export default function Carousel({
  preset,
  children,
  ariaLabel,
  showArrows = true,
  showScrollbar = true,
  className,
}: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel(emblaPresets[preset]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrollbarWidth, setScrollbarWidth] = useState(20);

  const updateState = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    const p = emblaApi.scrollProgress();
    setProgress(Math.max(0, Math.min(1, p)));
    const slides = emblaApi.scrollSnapList().length;
    setScrollbarWidth(Math.max(15, 100 / Math.max(slides, 1)));
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateState();
    emblaApi.on("select", updateState);
    emblaApi.on("reInit", updateState);
    emblaApi.on("scroll", updateState);
    return () => {
      emblaApi.off("select", updateState);
      emblaApi.off("reInit", updateState);
      emblaApi.off("scroll", updateState);
    };
  }, [emblaApi, updateState]);

  // Respect prefers-reduced-motion: disable autoplay-like easing,
  // Embla already honors scroll instantly when user prefers no motion via duration.
  useEffect(() => {
    if (!emblaApi) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) emblaApi.reInit({ duration: 0 });
  }, [emblaApi]);

  const onPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const onNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onNext();
    }
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={cn("group/carousel outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-2xl", className)}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6 lg:gap-8 touch-pan-y will-change-transform" aria-live="polite">
          {children}
        </div>
      </div>

      {(showArrows || showScrollbar) && (
        <div className="mt-8 flex items-center gap-6">
          {showScrollbar && (
            <div
              className="relative h-[3px] flex-1 rounded-full bg-ink/10 overflow-hidden"
              aria-hidden
            >
              <div
                className="absolute top-0 left-0 h-full rounded-full bg-brand transition-transform duration-200 ease-out"
                style={{
                  width: `${scrollbarWidth}%`,
                  transform: `translateX(${(progress * (100 - scrollbarWidth)) / scrollbarWidth * 100}%)`,
                }}
              />
            </div>
          )}
          {showArrows && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onPrev}
                disabled={!canPrev}
                aria-label="Previous slide"
                className="inline-flex size-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-all hover:bg-brand hover:text-white hover:border-brand disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink disabled:hover:border-ink/15"
              >
                <ArrowLeft className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={!canNext}
                aria-label="Next slide"
                className="inline-flex size-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-all hover:bg-brand hover:text-white hover:border-brand disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink disabled:hover:border-ink/15"
              >
                <ArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
