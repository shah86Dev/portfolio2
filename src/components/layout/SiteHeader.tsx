"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { useScrolledPast } from "@/lib/hooks";

const links = [
  { href: "/#universe", label: "Universe" },
  { href: "/#about", label: "About" },
  { href: "/#work", label: "Work" },
  { href: "/#method", label: "Method" },
  { href: "/#capabilities", label: "Capabilities" },
  { href: "/#contact", label: "Contact" },
] as const;

interface Props {
  /** Passed from the layout so this island never imports the content graph. */
  brand: string;
}

export function SiteHeader({ brand }: Props) {
  const scrolled = useScrolledPast(24);
  const [open, setOpen] = useState(false);

  // Close the mobile menu on Escape — a menu you cannot dismiss with the
  // keyboard is a trap.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={[
        "sticky top-0 z-40 border-b transition-colors duration-[--dur-base]",
        scrolled || open
          ? "border-line bg-void/85 backdrop-blur-md"
          : "border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="frame flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-h4 tracking-tight text-ink"
          onClick={() => setOpen(false)}
        >
          {brand}
          <span aria-hidden="true" className="text-signal">
            .
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-caption text-ink-muted transition-colors duration-[--dur-fast] hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-sm border border-line text-ink"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Menu aria-hidden="true" className="h-5 w-5" />
          )}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="border-t border-line md:hidden"
        >
          <ul className="frame flex flex-col py-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-body text-ink-muted transition-colors duration-[--dur-fast] hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
