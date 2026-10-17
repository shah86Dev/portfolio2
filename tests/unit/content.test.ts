import { describe, expect, it } from "vitest";

import {
  capabilityGroups,
  experiments,
  findPlaceholderPaths,
  getProject,
  methodStages,
  projects,
  publishedProjects,
  siteConfig,
  statusLabels,
  universeStages,
} from "@/content";
import { projectStatuses } from "@/content/schema";

/**
 * Content integrity tests.
 *
 * These enforce docs/constitution.md §2 mechanically. If one of them fails,
 * something dishonest or unfinished was about to be published.
 */

describe("site configuration", () => {
  it("parses and exposes a usable absolute site URL", () => {
    expect(() => new URL(siteConfig.siteUrl)).not.toThrow();
    expect(siteConfig.siteUrl.endsWith("/")).toBe(false);
  });

  it("has a name, headline and at least one bio paragraph", () => {
    expect(siteConfig.name.length).toBeGreaterThan(0);
    expect(siteConfig.headline.length).toBeGreaterThan(0);
    expect(siteConfig.bio.length).toBeGreaterThan(0);
  });

  it("makes no claim about years of experience", () => {
    const prose = [siteConfig.headline, siteConfig.supportingStatement, ...siteConfig.bio]
      .join(" ")
      .toLowerCase();
    expect(prose).not.toMatch(/\d+\s*\+?\s*years?\s+(of\s+)?experience/);
  });
});

describe("projects", () => {
  it("has unique slugs", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("publishes at least one project", () => {
    expect(publishedProjects.length).toBeGreaterThan(0);
  });

  it("never claims a deployment without a reachable URL", () => {
    for (const project of projects) {
      if (project.status === "deployed") {
        expect(project.liveUrl, `${project.slug} is marked deployed`).toBeTruthy();
      }
    }
  });

  it("uses only the declared statuses", () => {
    for (const project of projects) {
      expect(projectStatuses).toContain(project.status);
      expect(statusLabels[project.status]).toBeTruthy();
    }
  });

  it("contains no placeholder text in anything published", () => {
    for (const project of publishedProjects) {
      expect(
        findPlaceholderPaths(project),
        `placeholders remain in ${project.slug}`,
      ).toEqual([]);
    }
  });

  it("documents evidence and limitations for every published project", () => {
    for (const project of publishedProjects) {
      expect(project.evidence.length, project.slug).toBeGreaterThan(0);
      expect(project.caseStudy.limitations.length, project.slug).toBeGreaterThan(0);
      expect(project.caseStudy.objectives.length, project.slug).toBeGreaterThan(0);
    }
  });

  it("hides unpublished projects from every rendered list", () => {
    const unpublished = projects.filter((project) => !project.published);
    expect(unpublished.length).toBeGreaterThan(0);
    for (const project of unpublished) {
      expect(getProject(project.slug)).toBeUndefined();
      expect(publishedProjects).not.toContain(project);
    }
  });
});

describe("method stages", () => {
  it("provides exactly six universe nodes", () => {
    expect(universeStages).toHaveLength(6);
  });

  it("numbers every stage uniquely and in order", () => {
    const ordinals = methodStages.map((stage) => stage.ordinal);
    expect(new Set(ordinals).size).toBe(ordinals.length);
    expect(ordinals).toEqual([...ordinals].sort());
  });

  it("only references projects that are actually published", () => {
    for (const stage of methodStages) {
      if (!stage.relatedProjectSlug) continue;
      expect(
        getProject(stage.relatedProjectSlug),
        `stage "${stage.id}" references a missing or unpublished project`,
      ).toBeDefined();
    }
  });

  it("names a human control for every stage", () => {
    for (const stage of methodStages) {
      expect(stage.humanControl.length, stage.id).toBeGreaterThan(0);
    }
  });
});

describe("capabilities", () => {
  it("marks every item applied or learning, with no numeric score", () => {
    for (const group of capabilityGroups) {
      for (const item of group.items) {
        expect(["applied", "learning"]).toContain(item.level);
        expect(item).not.toHaveProperty("percentage");
        expect(item).not.toHaveProperty("proficiency");
      }
    }
  });

  it("backs every applied capability with a published project", () => {
    for (const group of capabilityGroups) {
      for (const item of group.items) {
        if (item.level !== "applied") continue;
        expect(
          item.evidenceSlug,
          `"${item.name}" is marked applied without evidence`,
        ).toBeTruthy();
        expect(
          getProject(item.evidenceSlug as string),
          `"${item.name}" points at a project that is not published`,
        ).toBeDefined();
      }
    }
  });
});

describe("experiments", () => {
  it("gives every experiment an honest status line", () => {
    for (const experiment of experiments) {
      expect(experiment.status.length, experiment.id).toBeGreaterThan(0);
      expect(findPlaceholderPaths(experiment)).toEqual([]);
    }
  });
});
