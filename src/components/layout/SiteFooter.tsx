import Link from "next/link";

import { siteConfig } from "@/content";
import { configuredLinks, mailtoHref, publicEmail } from "@/lib/links";

export function SiteFooter() {
  const links = configuredLinks();
  const mailto = mailtoHref();
  const email = publicEmail();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-14">
      <div className="frame">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-h4 text-ink">
              {siteConfig.name}
              <span aria-hidden="true" className="text-signal">
                .
              </span>
            </p>
            <p className="mt-3 text-caption text-ink-faint">
              Ideas become systems. Systems become products.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <p className="eyebrow">Elsewhere</p>
            {mailto && email ? (
              <a
                href={mailto}
                className="text-caption text-ink-muted transition-colors duration-[--dur-fast] hover:text-signal"
              >
                {email}
              </a>
            ) : null}
            {links.map((link) => (
              <a
                key={link.key}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-caption text-ink-muted transition-colors duration-[--dur-fast] hover:text-signal"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <nav aria-label="Sections" className="flex flex-col gap-3">
            <p className="eyebrow">On this site</p>
            <Link
              href="/work"
              className="text-caption text-ink-muted transition-colors duration-[--dur-fast] hover:text-signal"
            >
              All work
            </Link>
            <Link
              href="/#method"
              className="text-caption text-ink-muted transition-colors duration-[--dur-fast] hover:text-signal"
            >
              Engineering method
            </Link>
            <Link
              href="/#contact"
              className="text-caption text-ink-muted transition-colors duration-[--dur-fast] hover:text-signal"
            >
              Contact
            </Link>
          </nav>
        </div>

        <p className="mt-12 border-t border-line pt-6 text-micro text-ink-faint">
          © {year} {siteConfig.name}. Built with Next.js, React Three Fiber and a
          written specification.
        </p>
      </div>
    </footer>
  );
}
