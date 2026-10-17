import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { CLASSES, getClass } from '@/lib/data';
import { DAEVANION_BY_SLUG } from '@/lib/daevanion';
import { METABUILD_BY_SLUG } from '@/lib/metabuild';
import ClassTabs from '@/components/ClassTabs';
import JsonLd from '@/components/JsonLd';
import { faqPageJsonLd } from '@/lib/seo';
import { DifficultyPips, TierBadge } from '@/components/ClassFilters';
import { withBase } from '@/lib/asset';

export const dynamicParams = false;

export function generateStaticParams() {
  return CLASSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cls = getClass(slug);
  if (!cls) return {};
  return {
    title: `${cls.name} — ${cls.role} Build Guide`,
    description: `${cls.tagline} Skill chains, 2-key macros, Arcana & Daevanion priority and gear progression for ${cls.name} (${cls.weapons.join(' / ')}) in AION 2 Global.`,
  };
}

export default async function ClassPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cls = getClass(slug);
  if (!cls) notFound();

  const faq = [
    {
      q: `Is ${cls.name} good for PvE in AION 2?`,
      a: `${cls.name} is rated ${cls.tiers.pve}-tier for PvE expeditions and ${cls.tiers.raid}-tier in 10-man raids. ${cls.overview}`,
    },
    {
      q: `What weapons does ${cls.name} use?`,
      a: `${cls.name} uses ${cls.weapons.join(' and ')} and fills the ${cls.role} role in a party.`,
    },
    {
      q: `How hard is ${cls.name} to play?`,
      a: `${cls.name} has a difficulty rating of ${cls.difficulty}/5. ${cls.playstyle}`,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JsonLd data={faqPageJsonLd(faq)} />

      <nav className="flex items-center gap-1.5 text-xs text-zinc-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-zinc-300">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <Link href="/classes/" className="hover:text-zinc-300">
          Classes
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <span className="text-zinc-300">{cls.name}</span>
      </nav>

      <header className="mt-6">
        <div className="flex flex-wrap items-start gap-5">
          <img
            src={withBase(`/portraits/${cls.slug}.webp`)}
            alt={`${cls.name} portrait`}
            width={96}
            height={96}
            className="h-24 w-24 rounded-lg border border-zinc-700 bg-zinc-900 object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-50">{cls.name}</h1>
            <p className="mt-2 text-sm text-zinc-400">
              {cls.role} · {cls.weapons.join(' / ')}
            </p>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">{cls.tagline}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-2">
            Difficulty <DifficultyPips value={cls.difficulty} /> {cls.difficulty}/5
          </span>
          <span className="flex items-center gap-1.5">
            PvE <TierBadge tier={cls.tiers.pve} />
          </span>
          <span className="flex items-center gap-1.5">
            Raid <TierBadge tier={cls.tiers.raid} />
          </span>
          <span className="flex items-center gap-1.5">
            Abyss PvP <TierBadge tier={cls.tiers.pvp} />
          </span>
        </div>
      </header>

      <div className="mt-8">
        <ClassTabs
          cls={cls}
          daevanion={DAEVANION_BY_SLUG[cls.slug]}
          meta={METABUILD_BY_SLUG[cls.slug]}
        />
      </div>

      <p className="mt-6 text-[11px] leading-4 text-zinc-600">
        Daevanion boards, meta build data and portraits adapted from{' '}
        <a href="https://aion2-meta.com" target="_blank" rel="noreferrer" className="text-sky-400 hover:text-sky-300">aion2-meta.com</a>{' '}
        and{' '}
        <a href="https://daevaguides.com" target="_blank" rel="noreferrer" className="text-sky-400 hover:text-sky-300">daevaguides.com</a>. Game assets © NCSOFT.
      </p>
    </div>
  );
}
