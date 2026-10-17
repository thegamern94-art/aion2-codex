import type { Metadata } from 'next';
import Link from 'next/link';
import { ARCANA } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Arcana Codex — Cards, Sets & the Gold Chalice Route',
  description:
    'The AION 2 Arcana system: 9 card slots, mixable 2-piece/4-piece set bonuses (Primal Vigor, Guardian, Frenzy, Pure Blood), transmutation costs (5 crystals + 2M Kinah per guaranteed skill), crystal sources, and the community "gold Chalice first" route.',
};

export default function ArcanaPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">System Codex</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">Arcana Codex</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
        Arcana is AION 2’s card system: stat bonuses plus <strong className="text-zinc-300">skill-level
        bonuses</strong> from set effects. Cards occupy nine named slots and 2-piece/4-piece set
        bonuses mix freely across sets.
      </p>

      {/* Slots */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">The 9 slots</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {ARCANA.slots.map((s) => (
            <span
              key={s}
              className="rounded-full border border-zinc-700 bg-zinc-800/60 px-3.5 py-1 font-mono text-xs text-amber-300"
            >
              {s}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          Scales slot was added Feb 25, 2026 on KR/TW (Harmonious Crystals) — verify Global parity.
        </p>
      </section>

      {/* Sets */}
      <section className="mt-10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">Documented sets</h2>
        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 text-left text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-4 py-2.5 font-medium">Set</th>
                <th className="px-4 py-2.5 font-medium">Pieces</th>
                <th className="px-4 py-2.5 font-medium">Effect</th>
              </tr>
            </thead>
            <tbody>
              {ARCANA.sets.map((s) => (
                <tr key={s.name} className="border-b border-zinc-800/60 align-top last:border-0 hover:bg-zinc-900/40">
                  <td className="px-4 py-3 font-medium text-zinc-200">{s.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-400">{s.pieces}</td>
                  <td className="px-4 py-3 text-zinc-400">{s.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Transmutation */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="card-corners rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400">Transmutation</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-300">{ARCANA.transmutation.guaranteed1}</p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">{ARCANA.transmutation.guaranteed2}</p>
          <p className="mt-3 text-xs leading-5 text-zinc-500">
            The transmutation cooldown was removed in the Feb 25, 2026 KR update — verify on Global.
          </p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400">Crystal sources</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-zinc-300">
            {ARCANA.transmutation.crystalSources.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Chalice route */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">The “gold Chalice first” route</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-zinc-300">
          {ARCANA.chaliceRoute.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </section>

      {/* Stat priority */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Stat priority (community)</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-zinc-300">
          {ARCANA.statPriority.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-zinc-500">
          Per-class nuance lives in each{' '}
          <Link href="/classes/" className="text-sky-400 hover:text-sky-300">
            class codex tab
          </Link>{' '}
          (e.g. Frontal amps for Templar/Gladiator, Rear for Assassin).
        </p>
      </section>

      {/* Caveats */}
      <div className="mt-10 rounded-lg border border-amber-500/40 bg-amber-500/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Caveats</p>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-5 text-zinc-400">
          {ARCANA.caveats.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
