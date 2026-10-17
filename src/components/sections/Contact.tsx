import { ArrowUpRight, Mail } from "lucide-react";

import { CopyEmailButton } from "@/components/contact/CopyEmailButton";
import { Cta } from "@/components/ui/Cta";
import { siteConfig } from "@/content";
import { configuredLinks, mailtoHref, publicEmail } from "@/lib/links";

/**
 * Contact.
 *
 * There is no form. A form that posts nowhere is a lie told politely, and no
 * delivery mechanism has been built or tested. Every control here does
 * exactly what it says: open a mail client, copy an address, open a profile.
 */
export function Contact() {
  const email = publicEmail();
  const mailto = mailtoHref();
  const links = configuredLinks();

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-line py-20 md:py-28"
    >
      <div className="frame">
        <div className="relative overflow-hidden rounded-lg border border-line bg-surface">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 grid-field opacity-30"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--color-signal) 16%, transparent) 0%, transparent 70%)",
            }}
          />

          <div className="relative grid gap-10 p-8 md:grid-cols-12 md:p-12 lg:p-16">
            <div className="md:col-span-7">
              <p className="eyebrow">06 — Contact</p>
              <h2 id="contact-heading" className="mt-3 text-h2 text-ink">
                Tell me what you are trying to build.
              </h2>
              <p className="measure mt-5 text-lead text-ink-muted">
                The most useful first message is the problem, not the
                specification — what is painful today, who it is painful for,
                and what you have tried. The specification is the part I can
                help with.
              </p>

              {siteConfig.location ? (
                <p className="mt-4 font-mono text-micro uppercase tracking-[0.14em] text-ink-faint">
                  {siteConfig.location}
                </p>
              ) : null}
            </div>

            <div className="md:col-span-5">
              {email && mailto ? (
                <div className="rounded-md border border-line bg-void/60 p-6">
                  <p className="eyebrow">Email</p>
                  <p className="mt-2 break-all font-mono text-caption text-ink">
                    {email}
                  </p>

                  <div className="mt-5 flex flex-col gap-3">
                    <Cta href={mailto} external>
                      <Mail aria-hidden="true" className="h-4 w-4" />
                      Start an email
                    </Cta>
                    <CopyEmailButton email={email} />
                  </div>
                </div>
              ) : (
                <div className="rounded-md border border-line bg-void/60 p-6">
                  <p className="text-caption text-ink-muted">
                    Contact details have not been configured yet. Set them in{" "}
                    <code className="font-mono text-micro text-signal">
                      src/content/site.config.ts
                    </code>
                    .
                  </p>
                </div>
              )}

              {links.length > 0 ? (
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                  {links.map((link) => (
                    <li key={link.key}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-caption text-ink-muted transition-colors duration-[--dur-fast] hover:text-signal"
                      >
                        {link.label}
                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-3.5 w-3.5 transition-transform duration-[--dur-fast] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
