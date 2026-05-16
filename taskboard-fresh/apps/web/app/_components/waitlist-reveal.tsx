"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, CustomEase);

// design-system.md §9 — the canonical "snappy" easing curve.
CustomEase.create("ds", "0.16, 1, 0.3, 1");

export function WaitlistReveal({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-animate]");

      // §9: respect reduced motion — no transforms/transitions, just show.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([...items, "[data-glow]", "[data-card]"], {
          clearProps: "all",
        });
        return;
      }

      const tl = gsap.timeline();

      // Decorative accent glow: ease in, then a slow perpetual breathe.
      tl.from(
        "[data-glow]",
        { opacity: 0, scale: 0.8, duration: 0.6, ease: "ds" },
        0,
      )
        .to("[data-glow]", {
          scale: 1.08,
          opacity: 0.85,
          duration: 4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
        // Card lifts in.
        .from(
          "[data-card]",
          { opacity: 0, y: 16, scale: 0.985, duration: 0.55, ease: "ds" },
          0.05,
        )
        // Contents stagger up (durations stay in the §9 150–350ms band-ish).
        .from(
          items,
          {
            opacity: 0,
            y: 14,
            duration: 0.45,
            ease: "ds",
            stagger: 0.07,
          },
          0.18,
        );
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
