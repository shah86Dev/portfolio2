import { About } from "@/components/sections/About";
import { Capabilities } from "@/components/sections/Capabilities";
import { Contact } from "@/components/sections/Contact";
import { Experiments } from "@/components/sections/Experiments";
import { Hero } from "@/components/sections/Hero";
import { Method } from "@/components/sections/Method";
import { Work } from "@/components/sections/Work";
import { methodStages, projectTitles, siteConfig } from "@/content";
import { configuredLinks } from "@/lib/links";

/**
 * The home route is a Server Component. The only JavaScript it sends is the
 * client islands it composes: the header, the universe, the method rail, the
 * copy button and the reveal wrappers.
 */
export default function HomePage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    description: siteConfig.seoDescription,
    url: siteConfig.siteUrl,
    jobTitle: "Software engineer",
    sameAs: configuredLinks().map((link) => link.href),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Serialised from typed, schema-validated content — not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Hero />
      <About />
      <Work />
      <Method stages={methodStages} projectTitles={projectTitles} />
      <Capabilities />
      <Experiments />
      <Contact />
    </>
  );
}
