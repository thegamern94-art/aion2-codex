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
      title: 'Weekly Checklist — every cap, every character',
      subtitle: 'Multi-alt reset tracker',
      href: '/checklist/',
      keywords: 'weekly checklist reset caps odyle sanctuary conquest transcendence ascension trial subjugation abyss entry stones candy keys roster alts',
    },
    {
      type: 'tool',
      title: 'Enhancement Calculator',
      subtitle: 'Expected attempts, stones & Kinah',
      href: '/tools/enhancement/',
      keywords: 'enhancement calculator pity rates stones kinah amplify potential cost expected attempts',
    },
    {
      type: 'system',
      title: 'Arcana Codex',
      subtitle: 'Cards, sets & the gold Chalice route',
      href: '/arcana/',
      keywords: 'arcana cards chalice parchment bell mirror scales key hourglass dice lantern sets primal vigor guardian frenzy pure blood transmutation crystals',
    },
    {
      type: 'system',
      title: 'Kinah Hub',
      subtitle: 'Farming, Regular vs Bound, alt multiplier',
      href: '/kinah/',
      keywords: 'kinah gold farming duties conquest ludra raid regular bound alts sinks income',
    },
    {
      type: 'tool',
      title: 'Progression Roadmap',
      subtitle: 'Level 1 to Sanctuary raids',
      href: '/roadmap/',
      keywords: 'roadmap progression leveling fresh 45 gear score 1400 2100 2800 alts what now endgame',
    },
    {
      type: 'system',
      title: 'Events Hub',
      subtitle: 'Halloween & recurring timers',
      href: '/events/',
      keywords: 'events halloween trick or treat pumpkin coins candy keys shop siege timers',
    },
    {
      type: 'tool',
      title: 'Class Build Matrix',
      subtitle: 'All 8 launch classes, filterable',
      href: '/classes/',
      keywords: 'classes matrix tier list filter builds codex stat priority manastones',
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
