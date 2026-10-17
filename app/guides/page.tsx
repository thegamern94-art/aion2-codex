import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { GUIDES, guideHref } from '@/lib/guides-meta';

export const metadata = {
  title: 'Guides',
  description:
    'Deep-dive AION 2 Global guides — Gear Transfer and the ilvl 70 rule, Space-Time Rifts & Abyss survival, and the best 2-key macros for all 8 classes.',
};

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Knowledge Base</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">Guides</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
        Written in MDX with the Codex component kit — boss alerts, copy-paste macro boxes, skill
        tooltips and gear gate tables.
      </p>

      <div className="mt-8 space-y-4">
        {GUIDES.map((g) => (
          <Link
            key={`${g.category}/${g.slug}`}
            href={guideHref(g)}
            className="card-corners group block rounded-lg border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-amber-500/40"
          >
            <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
              <BookOpen className="h-3.5 w-3.5" aria-hidden /> {g.category}
            </p>
            <h2 className="mt-2 text-lg font-medium text-zinc-100 group-hover:text-amber-300">{g.title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{g.description}</p>
            <p className="mt-3 text-xs text-zinc-600">
              Updated {g.updated} · {g.readingMinutes} min read
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
