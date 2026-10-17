import { CLASSES, DUNGEONS, SYSTEMS } from './data';
import { GUIDES, guideHref } from './guides-meta';

export type SearchType = 'class' | 'dungeon' | 'guide' | 'system' | 'tool' | 'codes';

export interface SearchEntry {
  type: SearchType;
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
}

export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const c of CLASSES) {
    entries.push({
      type: 'class',
      title: c.name,
      subtitle: `${c.role} · ${c.weapons.join(' / ')}`,
      href: `/classes/${c.slug}/`,
      keywords: [c.name, c.role, c.weapons.join(' '), c.tagline, 'class', 'build'].join(' '),
    });
  }

  for (const d of DUNGEONS) {
    entries.push({
      type: 'dungeon',
      title: d.name,
      subtitle: `${d.tier} ${d.kind} · ${d.players} players · GS ${d.ilvlGate}`,
      href: `/tools/gear-check/#${d.slug}`,
      keywords: [d.name, d.tier, d.kind, 'dungeon', 'expedition', 'raid', 'gate', 'gear score', 'gs', String(d.ilvlGate)].join(' '),
    });
  }

  for (const g of GUIDES) {
    entries.push({
      type: 'guide',
      title: g.title,
      subtitle: `Guide · ${g.category}`,
      href: guideHref(g),
      keywords: [g.title, g.category, g.description, 'guide'].join(' '),
    });
  }

  entries.push(
    {
      type: 'system',
      title: 'Daily & Weekly Reset Times',
      subtitle: 'EU / NA server schedule',
      href: '/',
      keywords: 'reset daily weekly eu na timer schedule utc',
    },
    {
      type: 'system',
      title: 'Space-Time Rift Windows',
      subtitle: 'Open-world event schedule',
      href: '/guides/survival/space-time-rifts-abyss-survival/',
      keywords: ['space-time rift', SYSTEMS.rift.name, 'schedule', 'window', 'abyss'].join(' '),
    },
    {
      type: 'system',
      title: 'Gear Transfer (ilvl 70)',
      subtitle: 'Upgrade investment rules',
      href: '/guides/progression/gear-transfer-ilvl-70-guide/',
      keywords: 'gear transfer ilvl 70 upgrade investment kinah',
    },
    {
      type: 'tool',
      title: 'Gear Check — ilvl Gate Calculator',
      subtitle: 'Am I ready for this dungeon?',
      href: '/tools/gear-check/',
      keywords: 'gear check ilvl gate calculator ready expedition raid',
    },
    {
      type: 'tool',
      title: 'Class Build Matrix',
      subtitle: 'All 8 launch classes, filterable',
      href: '/classes/',
      keywords: 'classes matrix tier list filter builds',
    },
    {
      type: 'codes',
      title: 'Redeem Codes',
      subtitle: 'Coupons & freebies board',
      href: '/codes/',
      keywords: 'codes redeem coupon free reward kinah',
    },
  );

  return entries;
}

/** Lightweight relevance score: title hits weigh most. */
export function scoreEntry(entry: SearchEntry, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  const title = entry.title.toLowerCase();
  const hay = `${title} ${entry.subtitle.toLowerCase()} ${entry.keywords.toLowerCase()}`;
  if (title.startsWith(q)) return 100;
  if (title.includes(q)) return 60;
  if (hay.includes(q)) return 30;
  // all-words match
  const words = q.split(/\s+/);
  if (words.every((w) => hay.includes(w))) return 20;
  return 0;
}
