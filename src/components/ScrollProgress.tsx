"use client";

import { useEffect, useState } from "react";

/**
 * A hairline gold bar pinned to the top of the viewport that fills as the page
 * scrolls. Purely decorative — it never intercepts pointer events.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollable > 0 ? doc.scrollTop / scrollable : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px]"
    >
      <div
        className="h-full origin-left bg-[linear-gradient(90deg,var(--color-champagne-deep),var(--color-champagne-bright),var(--color-champagne))] shadow-[0_0_14px_rgba(194,160,106,0.65)]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
