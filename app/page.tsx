import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { CLASSES, DUNGEONS, SYSTEMS } from '@/lib/data';
import { GUIDES, guideHref } from '@/lib/guides-meta';
import { TierBadge } from '@/components/ClassFilters';
import GearGateTable from '@/components/GearGateTable';
import TimerPanel from '@/components/TimerPanel';
import JsonLd from '@/components/JsonLd';
import { faqPageJsonLd } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = {
  title: 'AION 2 Codex — Classes, Dungeons, Live Reset Timers & Guides',
  description: SITE.description,
};

const FAQ = [
  {
    q: 'What is AION 2 Codex?',
    a: 'A fast, fan-made guide, build planner and database for the AION 2 Global PC build — a class build matrix for all 8 launch classes, expedition and raid readiness checks, Space-Time Rift schedules, 2-key macros and live EU/NA reset timers.',
  },
  {
    q: 'When do EU and NA servers reset?',
    a: `Daily reset hits at ${SYSTEMS.resets.eu.utc} UTC on all Global servers — EU and NA share the same instant (16:00 in-game server time, since every Global server runs a UTC+9 clock). The weekly reset lands every ${SYSTEMS.resets.weekly.weekday} at the same hour, and the live timers in the header count down to the next reset.`,
  },
  {
    q: 'What is the Gear Transfer ilvl 70 rule?',
    a: SYSTEMS.gearTransfer.summary,
  },
  {
    q: 'Which class should I play first?',
    a: 'Start from the role you enjoy: Templar and Gladiator hold the front line, Assassin and Ranger dish out DPS, Sorcerer and Spiritmaster bring magic damage and summons, Cleric and Chanter keep the party alive. Our class build matrix rates every class for PvE, raids and Abyss PvP with difficulty pips.',
  },
];

export default function HomePage() {
  return (
    <div>
      <JsonLd data={faqPageJsonLd(FAQ)} />

      {/* Hero */}
      <section className="bg-grid border-b border-zinc-800/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            AION 2 · Global PC Build
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl">
            The fast codex for <span className="text-amber-400">AION 2</span> players
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            {SITE.tagline} Live reset timers, an 8-class build matrix, Gear Score gate checks and
            copy-paste macro slots — everything pre-rendered for instant loads.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/classes/"
              className="inline-flex items-center gap-2 rounded-md border border-amber-500/60 bg-amber-500/15 px-4 py-2 text-sm font-medium text-amber-300 transition hover:bg-amber-500/25"
            >
              Browse Classes <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/tools/gear-check/"
              className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-zinc-100"
            >
              Open Gear Check
            </Link>
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-zinc-500">
            <div>
              <dt className="inline">Classes&nbsp;</dt>
              <dd className="inline font-mono text-zinc-200">{CLASSES.length}</dd>
            </div>
            <div>
              <dt className="inline">Dungeons &amp; raids&nbsp;</dt>
              <dd className="inline font-mono text-zinc-200">{DUNGEONS.length}</dd>
            </div>
            <div>
              <dt className="inline">Guides&nbsp;</dt>
              <dd className="inline font-mono text-zinc-200">{GUIDES.length}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14 sm:px-6">
        <section>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-100">Daily driver tools</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Built for the weekly loop — track every cap, price every enhance, plan every alt.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              { href: '/checklist/', title: 'Weekly Checklist', desc: 'Every cap, per character — auto-resets Wednesday 07:00 UTC.' },
              { href: '/tools/enhancement/', title: 'Enhancement Calculator', desc: 'Expected attempts, stones and Kinah with pity-aware math.' },
              { href: '/kinah/', title: 'Kinah Hub', desc: 'Verified income sources, sinks, and the alt multiplier.' },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="card-corners group rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-amber-500/40"
              >
                <h3 className="font-medium text-zinc-100 group-hover:text-amber-300">{t.title}</h3>
                <p className="mt-2 text-xs leading-5 text-zinc-500">{t.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-100">Live schedule</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Countdowns tick in your browser — times are UTC-based from the systems database.
          </p>
          <div className="mt-5">
            <TimerPanel />
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-100">The 8 launch classes</h2>
              <p className="mt-1 text-sm text-zinc-500">PvE expedition meta tier shown — filter the full matrix by role, difficulty and mode.</p>
            </div>
            <Link href="/classes/" className="shrink-0 text-sm text-sky-400 hover:text-sky-300">
              Full matrix →
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CLASSES.map((c) => (
              <Link
                key={c.slug}
                href={`/classes/${c.slug}/`}
                className="group rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 transition hover:border-amber-500/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-zinc-100 group-hover:text-amber-300">{c.name}</h3>
                  <TierBadge tier={c.tiers.pve} />
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  {c.role} · {c.weapons.join(' / ')}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-100">Featured guides</h2>
              <p className="mt-1 text-sm text-zinc-500">Written with the Codex MDX engine — alerts, macro boxes and tooltips included.</p>
            </div>
            <Link href="/guides/" className="shrink-0 text-sm text-sky-400 hover:text-sky-300">
              All guides →
            </Link>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {GUIDES.map((g) => (
              <Link
                key={`${g.category}/${g.slug}`}
                href={guideHref(g)}
                className="card-corners group rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-amber-500/40"
              >
                <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
                  <BookOpen className="h-3.5 w-3.5" aria-hidden /> {g.category}
                </p>
                <h3 className="mt-2 font-medium leading-6 text-zinc-100 group-hover:text-amber-300">{g.title}</h3>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">{g.description}</p>
                <p className="mt-3 text-[11px] text-zinc-600">
                  Updated {g.updated} · {g.readingMinutes} min
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-100">Expedition &amp; raid Gear Score gates</h2>
          <p className="mb-5 mt-1 text-sm text-zinc-500">
            Every gate at a glance — open any row in the gear checker for boss cheat sheets.
          </p>
          <GearGateTable />
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-100">FAQ</h2>
          <div className="mt-5 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                <summary className="cursor-pointer text-sm font-medium text-zinc-200">{f.q}</summary>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
