import { z } from "zod";

/**
 * Content schemas.
 *
 * Every content module is parsed through one of these at module-evaluation
 * time (see `src/content/index.ts`). A malformed or dishonest content file
 * therefore fails `next build` rather than reaching a visitor.
 */

/** Marks a value Shahzaib still needs to supply. Never rendered. */
export const PLACEHOLDER_PREFIX = "TODO:";

export const isPlaceholder = (value: string | undefined | null): boolean =>
  typeof value === "string" && value.trimStart().startsWith(PLACEHOLDER_PREFIX);

/** A string that may legitimately still be a placeholder. */
const fillable = z.string().min(1);

/** A string that must be real before it can be published. */
const resolved = z
  .string()
  .min(1)
  .refine((v) => !isPlaceholder(v), {
    message: `value is still a ${PLACEHOLDER_PREFIX} placeholder`,
  });

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case");

/* -------------------------------------------------------------------------
   Project status
   ------------------------------------------------------------------------- */

export const projectStatuses = [
  "in-progress",
  "prototype",
  "implemented",
  "deployed",
] as const;

export const projectStatusSchema = z.enum(projectStatuses);
export type ProjectStatus = z.infer<typeof projectStatusSchema>;

/* -------------------------------------------------------------------------
   Site / brand configuration
   ------------------------------------------------------------------------- */

export const siteConfigSchema = z.object({
  name: resolved,
  brandTitle: resolved,
  headline: resolved,
  supportingStatement: resolved,
  /** Short bio paragraphs for the About section. */
  bio: z.array(resolved).min(1),
  /** One-sentence description used for SEO and the OG card. */
  seoDescription: resolved,
  location: fillable.optional(),
  /**
   * Production origin, e.g. "https://shahzaib.dev". Read from
   * NEXT_PUBLIC_SITE_URL when set; otherwise the local fallback.
   */
  siteUrl: z.url(),
  contact: z.object({
    email: fillable,
    /** Subject line pre-filled on the mailto: link. */
    emailSubject: z.string().min(1),
    github: fillable.optional(),
    linkedin: fillable.optional(),
    /**
     * Only set this if the number is intended for public display.
     * Rendered as a wa.me link when present.
     */
    whatsapp: fillable.optional(),
  }),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;

/* -------------------------------------------------------------------------
   Projects
   ------------------------------------------------------------------------- */

const evidenceSchema = z.object({
  /** What was actually inspected to justify the claims on this page. */
  label: fillable,
  detail: fillable,
});

const caseStudySchema = z.object({
  problem: fillable,
  users: fillable,
  solution: fillable,
  contribution: fillable,
  architecture: z.array(fillable).min(1),
  verification: z.array(fillable).min(1),
  /**
   * Measured results. Leave empty when nothing has been measured — the case
   * study then renders `objectives` instead. Constitution §2.2.
   */
  outcomes: z.array(fillable),
  objectives: z.array(fillable).min(1),
  limitations: z.array(fillable).min(1),
});

export const projectSchema = z.object({
  slug,
  title: fillable,
  /** One line, used on cards and in metadata. */
  summary: fillable,
  status: projectStatusSchema,
  /** Year or range, e.g. "2025". Omit rather than guess. */
  period: fillable.optional(),
  /** Technologies genuinely present in the project. */
  stack: z.array(fillable).min(1),
  /** Public URL. Required for status "deployed" (enforced below). */
  liveUrl: z.url().optional(),
  repoUrl: z.url().optional(),
  /** Screenshot under /public. Must be a real capture of the real thing. */
  image: z
    .object({
      src: z.string().startsWith("/"),
      alt: fillable,
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    })
    .optional(),
  /** Which Engineering Universe stage this project best illustrates. */
  stageId: z.string().optional(),
  evidence: z.array(evidenceSchema).min(1),
  caseStudy: caseStudySchema,
  /**
   * Projects without supporting evidence stay in this file but do not render.
   * Flip to true once the entry is filled in truthfully.
   */
  published: z.boolean(),
});

export type Project = z.infer<typeof projectSchema>;

/**
 * Walks an arbitrary content value and reports the dotted path of every
 * string still carrying the placeholder prefix. Used to guarantee that no
 * `TODO:` ever reaches a rendered page.
 */
export function findPlaceholderPaths(value: unknown, base = ""): string[] {
  if (typeof value === "string") {
    return isPlaceholder(value) ? [base || "(root)"] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => findPlaceholderPaths(item, `${base}[${i}]`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      findPlaceholderPaths(child, base ? `${base}.${key}` : key),
    );
  }
  return [];
}

export const projectsSchema = z
  .array(projectSchema)
  .superRefine((projects, ctx) => {
    const seen = new Set<string>();
    for (const [index, project] of projects.entries()) {
      if (seen.has(project.slug)) {
        ctx.addIssue({
          code: "custom",
          path: [index, "slug"],
          message: `duplicate slug "${project.slug}"`,
        });
      }
      seen.add(project.slug);

      if (project.status === "deployed" && !project.liveUrl) {
        ctx.addIssue({
          code: "custom",
          path: [index, "liveUrl"],
          message:
            'status "deployed" requires a liveUrl — do not claim a deployment that cannot be visited',
        });
      }

      // Unpublished entries may hold placeholders; published ones may not.
      if (project.published) {
        for (const placeholderPath of findPlaceholderPaths(project)) {
          ctx.addIssue({
            code: "custom",
            path: [index, placeholderPath],
            message: `published project "${project.slug}" still contains a ${PLACEHOLDER_PREFIX} placeholder at ${placeholderPath}`,
          });
        }
      }
    }
  });

/* -------------------------------------------------------------------------
   Engineering method / universe stages
   ------------------------------------------------------------------------- */

export const methodStageSchema = z.object({
  id: slug,
  /** Short label shown on the node, e.g. "Discover". */
  label: resolved,
  /** Two-digit ordinal shown alongside the label, e.g. "01". */
  ordinal: z.string().regex(/^\d{2}$/),
  /** One line that fits on a card. */
  summary: resolved,
  description: resolved,
  deliverables: z.array(resolved).min(1),
  /** What a human (not the agent) is responsible for at this stage. */
  humanControl: resolved,
  /** Slug of a project that demonstrates this stage, if one does. */
  relatedProjectSlug: z.string().optional(),
  /**
   * Whether this stage is one of the six nodes in the 3D universe.
   * The Method section shows all eight stages.
   */
  inUniverse: z.boolean(),
});

export type MethodStage = z.infer<typeof methodStageSchema>;

export const methodStagesSchema = z
  .array(methodStageSchema)
  .superRefine((stages, ctx) => {
    const seen = new Set<string>();
    for (const [index, stage] of stages.entries()) {
      if (seen.has(stage.id)) {
        ctx.addIssue({
          code: "custom",
          path: [index, "id"],
          message: `duplicate stage id "${stage.id}"`,
        });
      }
      seen.add(stage.id);
    }

    const universeCount = stages.filter((s) => s.inUniverse).length;
    if (universeCount !== 6) {
      ctx.addIssue({
        code: "custom",
        message: `the Engineering Universe is built for exactly 6 nodes, found ${universeCount}`,
      });
    }
  });

/* -------------------------------------------------------------------------
   Capabilities
   ------------------------------------------------------------------------- */

/**
 * `applied` — used in a project documented on this site.
 * `learning` — actively being learned; not yet demonstrated here.
 * No percentages, no proficiency scores. Constitution §2.1.
 */
export const capabilityLevels = ["applied", "learning"] as const;
export const capabilityLevelSchema = z.enum(capabilityLevels);
export type CapabilityLevel = z.infer<typeof capabilityLevelSchema>;

export const capabilityGroupSchema = z.object({
  id: slug,
  title: resolved,
  description: resolved,
  items: z
    .array(
      z.object({
        name: resolved,
        level: capabilityLevelSchema,
        /** Slug of a project where this was applied. Required when applied. */
        evidenceSlug: z.string().optional(),
      }),
    )
    .min(1),
});

export type CapabilityGroup = z.infer<typeof capabilityGroupSchema>;

export const capabilityGroupsSchema = z.array(capabilityGroupSchema).min(1);

/* -------------------------------------------------------------------------
   Experiments
   ------------------------------------------------------------------------- */

export const experimentSchema = z.object({
  id: slug,
  title: resolved,
  description: resolved,
  /** An honest, present-tense status line. */
  status: resolved,
  tags: z.array(resolved).min(1),
  url: z.url().optional(),
});

export type Experiment = z.infer<typeof experimentSchema>;

export const experimentsSchema = z.array(experimentSchema);
