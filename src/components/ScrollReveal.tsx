"use client";

import { useEffect } from "react";

/**
 * Observes every `.reveal` element on the page, including ones added later by
 * client-side navigation, and reveals them once as they enter the viewport.
 */
export function ScrollReveal() {
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches || !("IntersectionObserver" in window)) {
      document.documentElement.classList.remove("js");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );

    const seen = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((node) => {
        if (seen.has(node)) return;
        seen.add(node);
        observer.observe(node);
      });
    };

    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
