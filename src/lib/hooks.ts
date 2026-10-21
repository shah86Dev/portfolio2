"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/* ==========================================================================
   Environment facts
   --------------------------------------------------------------------------
   These describe the browser, not the application, so they are read through
   `useSyncExternalStore`. That gives a correct server snapshot during
   hydration and avoids the extra render a setState-in-effect would cause.
   ========================================================================== */

const noopSubscribe = () => () => {};

/** One stable subscribe function per media query, as the store API requires. */
const mediaSubscribers = new Map<string, (onChange: () => void) => () => void>();

function mediaSubscriber(query: string) {
  let subscribe = mediaSubscribers.get(query);
  if (!subscribe) {
    subscribe = (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    };
    mediaSubscribers.set(query, subscribe);
  }
  return subscribe;
}

/**
 * Reads a media query.
 *
 * `serverValue` is also what hydration sees, so it is always the cautious
 * answer: assume reduced motion, assume a small screen.
 */
function useMediaQuery(query: string, serverValue: boolean): boolean {
  return useSyncExternalStore(
    mediaSubscriber(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/**
 * Tracks `prefers-reduced-motion: reduce`.
 *
 * Defaults to `true` before the browser has answered, so motion is opted into
 * once we know the visitor is happy with it — never opted out of after it has
 * already moved.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", true);
}

const COMPACT_QUERY = "(max-width: 767px), (pointer: coarse)";

/**
 * True when the viewport is narrow or the pointer is coarse.
 *
 * Phones get the lightweight SVG universe deliberately, rather than a 3D
 * scene a mid-range device would render badly.
 *
 * Deliberately resolved ONCE per page load and cached. If this tracked
 * resizes, dragging a window across 768px would unmount and remount the
 * WebGL canvas mid-session — which is both wasteful and a source of teardown
 * bugs. The 3D scene is responsive on its own; it does not need replacing
 * because the window changed size.
 */
let compactAtLoad: boolean | null = null;

export function useCompactExperience(): boolean {
  return useSyncExternalStore(
    // Subscribed to the query, but the snapshot is latched: crossing the
    // breakpoint later re-renders and gets the same cached answer, so a
    // resize never tears the canvas down. The subscription exists only so
    // the zero-width case below can recover once layout settles.
    mediaSubscriber(COMPACT_QUERY),
    () => {
      if (compactAtLoad !== null) return compactAtLoad;

      // A viewport of zero means the page has not been laid out yet — a
      // background tab, or an embedded frame before it is sized. Latching
      // that would wrongly mark a desktop as compact for the rest of the
      // session, so leave the answer uncached and ask again next render.
      if (window.innerWidth === 0) return true;

      compactAtLoad = window.matchMedia(COMPACT_QUERY).matches;
      return compactAtLoad;
    },
    () => true,
  );
}

export type WebGLStatus = "checking" | "ok" | "unsupported";

/** Cached because the answer cannot change, and the probe is not free. */
let webglStatus: WebGLStatus | null = null;

function probeWebGL(): WebGLStatus {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    if (!gl) return "unsupported";

    // Browsers cap live contexts; release the probe immediately so it cannot
    // starve the real canvas.
    const lose = (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context");
    lose?.loseContext();
    return "ok";
  } catch {
    return "unsupported";
  }
}

/** Probes for a usable WebGL context before anything tries to mount a canvas. */
export function useWebGLSupport(): WebGLStatus {
  return useSyncExternalStore(
    noopSubscribe,
    () => (webglStatus ??= probeWebGL()),
    () => "checking" as const,
  );
}

/* ==========================================================================
   Scroll / viewport observers
   ========================================================================== */

/**
 * True once the element has entered the viewport. Stays true afterwards.
 * Used to defer loading the 3D chunk until it is about to be seen.
 */
export function useHasBeenVisible(
  ref: React.RefObject<Element | null>,
  rootMargin = "200px",
): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || visible) return;

    if (typeof IntersectionObserver === "undefined") {
      // No observer: show it, but on the next frame rather than cascading a
      // second render out of this one.
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin, visible]);

  return visible;
}

/**
 * True while the element is intersecting the viewport, and false again once
 * it leaves. Unlike `useHasBeenVisible` this keeps tracking.
 *
 * Used to stop the WebGL frameloop when the scene is scrolled away. A canvas
 * that keeps rendering while the visitor reads the contact section is burning
 * their battery for a picture nobody is looking at.
 */
export function useIsOnScreen(
  ref: React.RefObject<Element | null>,
  rootMargin = "100px",
): boolean {
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setOnScreen(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (entry) setOnScreen(entry.isIntersecting);
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return onScreen;
}

/** Tracks whether the window has scrolled past a threshold. */
export function useScrolledPast(threshold = 24): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const update = () => setPast(window.scrollY > threshold);
    const frame = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, [threshold]);

  return past;
}
