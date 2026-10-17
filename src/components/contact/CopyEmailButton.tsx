"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

interface Props {
  email: string;
}

/**
 * Copies the address to the clipboard.
 *
 * It reports what actually happened: if the Clipboard API is unavailable or
 * refused, it says so rather than showing a tick. A control that lies about
 * succeeding is worse than no control. (docs/constitution.md §7.3)
 */
export function CopyEmailButton({ email }: Props) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), 2400);
    return () => window.clearTimeout(timer);
  }, [state]);

  const copy = async () => {
    try {
      if (!navigator.clipboard) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center justify-center gap-2 rounded-sm border border-line-strong px-5 py-3 font-display text-caption text-ink transition-colors duration-[--dur-fast] hover:border-signal-dim hover:bg-surface"
      >
        {state === "copied" ? (
          <Check aria-hidden="true" className="h-4 w-4 text-signal" />
        ) : (
          <Copy aria-hidden="true" className="h-4 w-4" />
        )}
        Copy address
      </button>

      {/* Announced to screen readers as well as shown. */}
      <p aria-live="polite" className="min-h-[1.2em] text-micro text-ink-faint">
        {state === "copied"
          ? "Address copied to the clipboard."
          : state === "failed"
            ? "Could not copy — please select the address above instead."
            : ""}
      </p>
    </div>
  );
}
