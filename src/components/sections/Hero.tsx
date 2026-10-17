import { ArrowDown, ArrowRight } from "lucide-react";

import { EngineeringUniverse } from "@/components/universe/EngineeringUniverse";
import { Cta } from "@/components/ui/Cta";
import { Reveal } from "@/components/ui/Reveal";
import { projectTitles, siteConfig, universeStages } from "@/content";

/**
 * The opening.
 *
 * Everything a visitor needs in the first five seconds is plain server-rendered
 * HTML: the name, the positioning, and two actions. The Engineering Universe
 * sits beneath it and loads separately — the hero is readable long before any
 * of it arrives.
 */
export function Hero() {
  return (
    <section
      id="universe"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pb-20 pt-14 md:pb-28 md:pt-20"
    >
      {/* Decorative field. Masked at the edges so it never fights the text. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-field mask-fade-edges opacity-50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-18rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-signal) 13%, transparent) 0%, transparent 65%)",
        }}
      />

      <div className="frame relative">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-12">
          <div className="md:col-span-4 lg:col-span-3">
            <p className="eyebrow">The Digital Frontier</p>
            <p className="mt-3 font-mono text-caption text-ink-faint">
              Ideas become systems.
              <br />
              Systems become products.
            </p>
          </div>

          <div className="md:col-span-8 lg:col-span-9">
            <h1 id="hero-heading" className="text-h1 text-ink">
              {siteConfig.headline}
            </h1>
            <p className="measure mt-6 text-lead text-ink-muted">
              {siteConfig.supportingStatement}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Cta href="/#work">
                Explore projects
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Cta>
              <Cta href="/#contact" variant="ghost">
                Contact me
              </Cta>
            </div>
          </div>
        </div>

        {/* ---- The Engineering Universe ---------------------------------- */}
        <Reveal className="mt-16 md:mt-24" delay={0.05}>
          <div className="grid gap-x-10 gap-y-6 md:grid-cols-12">
            <div className="md:col-span-4 lg:col-span-3">
              <p className="eyebrow">The Engineering Universe</p>
              <p className="mt-3 text-caption text-ink-muted">
                Six stages between an idea and something a person can use.
                Choose any one to see what it produces — and what stays a
                human decision.
              </p>
            </div>
            <div className="md:col-span-8 lg:col-span-9">
              <EngineeringUniverse
                stages={universeStages}
                projectTitles={projectTitles}
              />
            </div>
          </div>
        </Reveal>

        <p className="mt-14 flex items-center gap-2 font-mono text-micro uppercase tracking-[0.14em] text-ink-faint">
          <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
          Keep scrolling for the work
        </p>
      </div>
    </section>
  );
}
