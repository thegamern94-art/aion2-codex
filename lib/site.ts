// Site-wide constants. NEXT_PUBLIC_BASE_PATH / NEXT_PUBLIC_SITE_URL are set at
// build time (locally optional; required in the GitHub Actions Pages workflow).

export const SITE = {
  name: 'AION 2 Codex',
  shortName: 'Codex',
  tagline: 'Fast guides, build planner & databases for the AION 2 Global PC build.',
  description:
    'AION 2 Codex — instant class build matrix, expedition & raid readiness checks, Space-Time Rift schedules, 2-key macros and live EU/NA reset timers for the AION 2 Global PC build (launched Oct 5, 2026).',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://aion2codex.example').replace(/\/$/, ''),
  updated: '2026-10-17',
} as const;

export function absoluteUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.url}${SITE.basePath}${clean}`;
}
