import type { ComponentType } from 'react';
import type { MDXProps } from 'mdx/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import GearTransferGuide from '@/content/guides/progression/gear-transfer-ilvl-70-guide.mdx';
import RiftsGuide from '@/content/guides/survival/space-time-rifts-abyss-survival.mdx';
import MacrosGuide from '@/content/guides/combat/best-2-key-macros-all-classes.mdx';
import { GUIDES, guideHref } from '@/lib/guides-meta';
import { mdxComponents } from '@/mdx-components';
import JsonLd from '@/components/JsonLd';
import { faqPageJsonLd } from '@/lib/seo';
import { SITE } from '@/lib/site';

// Keep in sync with lib/guides-meta.ts
const CONTENT: Record<string, ComponentType<MDXProps>> = {
  'progression/gear-transfer-ilvl-70-guide': GearTransferGuide,
  'survival/space-time-rifts-abyss-survival': RiftsGuide,
  'combat/best-2-key-macros-all-classes': MacrosGuide,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ category: g.category, slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const meta = GUIDES.find((g) => g.category === category && g.slug === slug);
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description, type: 'article' },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const meta = GUIDES.find((g) => g.category === category && g.slug === slug);
  if (!meta) notFound();
  const Content = CONTENT[`${category}/${slug}`];
  if (!Content) notFound();

  const href = guideHref(meta);
  const others = GUIDES.filter((g) => g !== meta);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <JsonLd data={faqPageJsonLd(meta.faq)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: meta.title,
          description: meta.description,
          dateModified: meta.updated,
          url: `${SITE.url}${SITE.basePath}${href}`,
          author: { '@type': 'Organization', name: SITE.name },
          publisher: { '@type': 'Organization', name: SITE.name },
        }}
      />

      <nav className="flex items-center gap-1.5 text-xs text-zinc-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-zinc-300">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <Link href="/guides/" className="hover:text-zinc-300">
          Guides
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <span className="capitalize text-zinc-300">{meta.category}</span>
      </nav>

      <header className="mt-6">
        <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-amber-300">
          {meta.category}
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50">{meta.title}</h1>
        <p className="mt-3 text-base leading-7 text-zinc-400">{meta.description}</p>
        <p className="mt-3 text-xs text-zinc-600">
          Updated {meta.updated} · {meta.readingMinutes} min read
        </p>
      </header>

      <div className="guide-prose mt-10">
        <Content components={mdxComponents} />
      </div>

      <section className="mt-14 rounded-lg border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Questions this guide answers
        </h2>
        <div className="mt-4 space-y-3">
          {meta.faq.map((f) => (
            <details key={f.q} className="rounded-md border border-zinc-800 bg-zinc-950/60 p-4">
              <summary className="cursor-pointer text-sm font-medium text-zinc-200">{f.q}</summary>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <nav className="mt-10 flex flex-wrap gap-3" aria-label="More guides">
        {others.map((g) => (
          <Link
            key={`${g.category}/${g.slug}`}
            href={guideHref(g)}
            className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-300 transition hover:border-amber-500/40 hover:text-amber-300"
          >
            {g.title} →
          </Link>
        ))}
      </nav>
    </article>
  );
}
