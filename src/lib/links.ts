import { isPlaceholder, siteConfig } from "@/content";

export interface ExternalLink {
  key: "github" | "linkedin" | "whatsapp";
  label: string;
  href: string;
}

/**
 * The social links that are actually configured.
 *
 * An unset or placeholder value produces no link at all — the site never
 * renders a dead profile icon or a "coming soon" social button.
 */
export function configuredLinks(): ExternalLink[] {
  const { github, linkedin, whatsapp } = siteConfig.contact;

  const candidates: ExternalLink[] = [
    github ? { key: "github" as const, label: "GitHub", href: github } : null,
    linkedin ? { key: "linkedin" as const, label: "LinkedIn", href: linkedin } : null,
    whatsapp ? { key: "whatsapp" as const, label: "WhatsApp", href: whatsapp } : null,
  ].filter((link): link is ExternalLink => link !== null);

  return candidates.filter((link) => !isPlaceholder(link.href));
}

/** The mailto URL for the contact actions, with the subject pre-filled. */
export function mailtoHref(): string | null {
  const { email, emailSubject } = siteConfig.contact;
  if (isPlaceholder(email)) return null;
  return `mailto:${email}?subject=${encodeURIComponent(emailSubject)}`;
}

/** The email address, or null while it is still a placeholder. */
export function publicEmail(): string | null {
  const { email } = siteConfig.contact;
  return isPlaceholder(email) ? null : email;
}
