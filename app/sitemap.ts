import type { MetadataRoute } from 'next';
import { CLASSES } from '@/lib/data';
import { GUIDES, guideHref } from '@/lib/guides-meta';
import { absoluteUrl, SITE } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date(SITE.updated);

  const staticRoutes = [
    '/',
    '/classes/',
    '/dungeons/',
    '/tools/gear-check/',
    '/tools/enhancement/',
    '/checklist/',
    '/guides/',
    '/arcana/',
    '/kinah/',
    '/roadmap/',
    '/events/',
    '/codes/',
  ];

  return [
    ...staticRoutes.map((p) => ({
      url: absoluteUrl(p),
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: p === '/' ? 1 : 0.8,
    })),
    ...CLASSES.map((c) => ({
      url: absoluteUrl(`/classes/${c.slug}/`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...GUIDES.map((g) => ({
      url: absoluteUrl(guideHref(g)),
      lastModified: new Date(g.updated),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
