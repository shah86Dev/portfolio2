import { capabilityGroupsInput } from "./capabilities";
import { experimentsInput } from "./experiments";
import { methodStagesInput } from "./method";
import { projectsInput } from "./projects";
import {
  capabilityGroupsSchema,
  experimentsSchema,
  methodStagesSchema,
  projectsSchema,
  siteConfigSchema,
  type MethodStage,
  type Project,
  type ProjectStatus,
} from "./schema";
import { siteConfigInput } from "./site.config";

/**
 * The validated content surface.
 *
 * Every content module is parsed here, at module-evaluation time. Because
 * every route imports from this file, a content error fails `next build`
 * rather than reaching a visitor.
 */

export const siteConfig = siteConfigSchema.parse(siteConfigInput);
export const projects = projectsSchema.parse(projectsInput);
export const methodStages = methodStagesSchema.parse(methodStagesInput);
export const capabilityGroups = capabilityGroupsSchema.parse(capabilityGroupsInput);
export const experiments = experimentsSchema.parse(experimentsInput);

/* -------------------------------------------------------------------------
   Derived views — computed once, imported everywhere.
   ------------------------------------------------------------------------- */

/** The only project list any component should render. */
export const publishedProjects: Project[] = projects.filter((p) => p.published);

/** The six nodes of the Engineering Universe, in orbit order. */
export const universeStages: MethodStage[] = methodStages.filter((s) => s.inUniverse);

export function getProject(slug: string): Project | undefined {
  return publishedProjects.find((p) => p.slug === slug);
}

/**
 * slug → title for every published project.
 *
 * Client components are passed this map instead of importing the content
 * modules. Importing `@/content` from a client component would pull the whole
 * content graph — every case study's prose, plus Zod — into the browser
 * bundle for the sake of one title. (docs/architecture.md §3)
 */
export const projectTitles: Record<string, string> = Object.fromEntries(
  publishedProjects.map((project) => [project.slug, project.title]),
);

export function getStage(id: string): MethodStage | undefined {
  return methodStages.find((s) => s.id === id);
}

/* -------------------------------------------------------------------------
   Presentation helpers for status, kept next to the data they describe.
   ------------------------------------------------------------------------- */

export const statusLabels: Record<ProjectStatus, string> = {
  "in-progress": "In progress",
  prototype: "Prototype",
  implemented: "Implemented",
  deployed: "Deployed",
};

/** A one-line explanation of what each status actually promises. */
export const statusMeanings: Record<ProjectStatus, string> = {
  "in-progress": "Being built now. Not finished.",
  prototype: "Proves the idea. Not built to be relied on.",
  implemented: "Built and working. Not deployed publicly.",
  deployed: "Live at a URL anyone can open.",
};

export const statusTokens: Record<ProjectStatus, string> = {
  "in-progress": "text-status-wip",
  prototype: "text-status-proto",
  implemented: "text-status-built",
  deployed: "text-status-live",
};

export {
  capabilityLevels,
  isPlaceholder,
  findPlaceholderPaths,
  projectStatuses,
  PLACEHOLDER_PREFIX,
} from "./schema";

export type {
  CapabilityGroup,
  CapabilityLevel,
  Experiment,
  MethodStage,
  Project,
  ProjectStatus,
  SiteConfig,
} from "./schema";
