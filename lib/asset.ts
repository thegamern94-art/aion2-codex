// Prefix static assets with the GitHub Pages basePath when building for a project site.
// NEXT_PUBLIC_BASE_PATH is inlined at build time, so this works in client components too.
export function withBase(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${base}${path}`;
}
