import type { Metadata } from 'next';
import Link from 'next/link';
import { ROADMAP } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Progression Roadmap — Level 1 to Sanctuary Raids',
  description:
    'The AION 2 Global progression roadmap: leveling 1–45 (Episode quests pay 97–99% of EXP), the fresh-45 weekly loop, ilvl 70 keeper gear, ilvl 86, Transcendence at 2,200 GS, and the Sanctuary raid ladder — plus the alt/priority guide.',
};

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">What now?</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">Progression Roadmap</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
        Every stage from character creation to the raid ladder, with the exact actions that matter at
        each step. “Am I ready?” questions belong in the{' '}
        <Link href="/tools/gear-check/" className="text-sky-400 hover:text-sky-300">
          Gear Check
        </Link>
        .
      </p>

      <div className="mt-10 space-y-6">
        {ROADMAP.stages.map((stage, idx) => (
          <section key={stage.id} className="card-corners relative rounded-lg border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-500/50 bg-amber-500/10 font-mono text-xs font-bold text-amber-300">
                {idx + 1}
              </span>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-100">{stage.title}</h2>
              <span className="rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 font-mono text-xs text-amber-300">
                {stage.range}
              </span>
              {stage.ilvl && (
                <span className="rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-400">
                  ilvl {stage.ilvl}
                </span>
              )}
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{stage.summary}</p>
            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm leading-6 text-zinc-300">
              {stage.actions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
            {stage.link && (
              <Link
                href={stage.link.href}
                className="mt-4 inline-flex text-sm text-sky-400 underline-offset-2 hover:text-sky-300 hover:underline"
              >
                {stage.link.label} →
              </Link>
            )}
          </section>
        ))}
      </div>

      <section className="mt-14 rounded-lg border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-100">The alt &amp; priority guide</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Alts are AION 2’s weekly-cap multiplier — and its biggest tedium trap. The honest version:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-300">
          {ROADMAP.altGuide.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
