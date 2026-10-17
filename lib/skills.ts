// Flat skill lookup used by <SkillTooltip id="..." />.
// Convention: id = "<class-slug>-<slugified-chain-name>"
//   e.g. "templar-aegis-protocol"

import { CLASSES } from './data';

export interface SkillEntry {
  id: string;
  name: string;
  className: string;
  classSlug: string;
  description: string;
  steps: string[];
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const SKILLS: SkillEntry[] = CLASSES.flatMap((c) =>
  c.skillChains.map((ch) => ({
    id: `${c.slug}-${slugify(ch.name)}`,
    name: ch.name,
    className: c.name,
    classSlug: c.slug,
    description: ch.description,
    steps: ch.steps,
  })),
);

export const SKILL_BY_ID: Map<string, SkillEntry> = new Map(SKILLS.map((s) => [s.id, s]));

export function skillId(classSlug: string, chainName: string): string {
  return `${classSlug}-${slugify(chainName)}`;
}
