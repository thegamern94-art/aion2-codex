import classesJson from '@/data/classes.json';
import dungeonsJson from '@/data/dungeons.json';
import systemsJson from '@/data/systems.json';
import codesJson from '@/data/codes.json';
import type {
  ClassInfo,
  CodesData,
  ContentTier,
  Dungeon,
  SystemData,
} from '@/types/game';

export const CLASSES = classesJson.classes as unknown as ClassInfo[];
export const DUNGEONS = dungeonsJson.dungeons as unknown as Dungeon[];
export const SYSTEMS = systemsJson as unknown as SystemData;
export const CODES = codesJson as unknown as CodesData;

export const TIER_ORDER: ContentTier[] = ['1-star', '2-star', '3-star', '4-star+', 'Raid'];

export function getClass(slug: string): ClassInfo | undefined {
  return CLASSES.find((c) => c.slug === slug);
}

export function dungeonsByTier(tier: ContentTier): Dungeon[] {
  return DUNGEONS.filter((d) => d.tier === tier);
}
