import type { SiteConfig } from "./schema";

/**
 * ============================================================================
 *  THE ONE FILE TO EDIT FOR PERSONAL DETAILS
 * ============================================================================
 *
 *  Everything a visitor reads about Shahzaib as a person comes from here.
 *  No component hard-codes a name, a claim, or a contact address.
 *
 *  Items marked  ⟵ CHECK THIS  are either drafted copy or defaults that
 *  Shahzaib should confirm before the site goes public. They are honest
 *  (nothing here is invented biography), but they are a draft, not a verified
 *  CV. See docs/content-guide.md.
 *
 *  Rules this file must keep (docs/constitution.md §2):
 *   - no employment history, qualifications, years of experience
 *   - no client names, awards, testimonials or metrics
 *   - anything unknown is written as "TODO: ..." and is not rendered
 * ============================================================================
 */

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const siteConfigInput: SiteConfig = {
  name: "Shahzaib",
  brandTitle: "Shahzaib — AI-Assisted Software Engineering",

  // ⟵ CHECK THIS: drafted positioning copy, not a verified biography.
  headline: "I turn ideas into intelligent digital products.",
  supportingStatement:
    "Exploring the intersection of AI-assisted engineering, thoughtful architecture, and interactive web experiences.",

  // ⟵ CHECK THIS: describes how you work. It deliberately makes no claim
  // about where you have worked, for how long, or for whom.
  bio: [
    "I build software the same way I'd want it built for me: start from the problem, write the specification down, then let implementation follow from it. Most of my work now happens with AI coding agents doing the typing — which only works if the thinking in front of them is sharp.",
    "That means the specification is the real artefact. It states who the user is, what the system must do, what it must never do, and how we will know it works. The agent writes against that. I review against that. Tests enforce it. When the spec is wrong, the code is wrong in an obvious, fixable way instead of a subtle one.",
    "I care about the parts people feel: whether the thing is fast, whether it works without a mouse, whether it still works when the fancy layer fails to load. A product that only works on a good laptop with a good connection is a demo, not a product.",
  ],

  seoDescription:
    "Shahzaib builds software products with AI-assisted engineering and written specifications — conversational AI agents, Next.js interfaces, and spec-driven production pipelines.",

  siteUrl,

  contact: {
    // ⟵ CHECK THIS: defaulted to the address on this machine's Claude account.
    // Replace it if you want a different address shown publicly.
    email: "shahzaib8620@gmail.com",
    emailSubject: "Project enquiry via shahzaib.dev",

    // Add these when you want them linked. Omitted keys simply do not render —
    // the site never shows a dead or placeholder social link.
    //   github: "https://github.com/your-handle",
    //   linkedin: "https://www.linkedin.com/in/your-handle",
    //   whatsapp: "https://wa.me/923000000000",   // public display only
  },
};
