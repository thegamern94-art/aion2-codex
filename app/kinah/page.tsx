import type { Metadata } from 'next';
import Link from 'next/link';
import { KINAH } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Kinah Hub — Farming, Regular vs Bound, and the Alt Multiplier',
  description:
    'How to make Kinah in AION 2 Global: Regular vs Bound Kinah explained, verified income sources (Duties ~250k/day, Conquest ~200k, Ludra raid ~1M), the sinks that eat it, and the alt-roster multiplier.',
};

const CURRENCY_STYLE: Record<string, string> = {
  Regular: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
  Bound: 'border-sky-500/50 bg-sky-500/10 text-sky-300',
  Both: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
};

export default function KinahPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Economy</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">Kinah Hub</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
        Kinah anxiety is real: an ilvl-86 helm costs ≈775k to take to +10, and endgame enhancement
        averages ≈15M per piece. Here’s where the money actually comes from — and what silently eats it.
      </p>

      {/* Regular vs Bound */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {KINAH.regularVsBound.map((line, i) => (
          <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 text-sm leading-6 text-zinc-300">
            {line}
          </div>
        ))}
      </section>

      {/* Sources */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-100">Income sources</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 text-left text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-4 py-2.5 font-medium">Source</th>
                <th className="px-4 py-2.5 font-medium">Amount</th>
                <th className="px-4 py-2.5 font-medium">Type</th>
                <th className="px-4 py-2.5 font-medium">Cadence / notes</th>
              </tr>
            </thead>
            <tbody>
              {KINAH.sources.map((s) => (
                <tr key={s.name} className="border-b border-zinc-800/60 align-top last:border-0 hover:bg-zinc-900/40">
                  <td className="px-4 py-3 font-medium text-zinc-200">{s.name}</td>
                  <td className="px-4 py-3 font-mono tabular-nums text-amber-300">{s.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${CURRENCY_STYLE[s.currency]}`}>
                      {s.currency}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs leading-5 text-zinc-400">
                    {s.cadence}
                    {s.note && <span className="block text-zinc-600">{s.note}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-zinc-600">
          Numbers are community-measured on Global (Oct 2026) or client-derived; where sources
          conflict (e.g. Duty caps per server vs per character) we say so instead of averaging.
        </p>
      </section>

      {/* Sinks */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-100">Sinks — where it all goes</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-300">
          {KINAH.sinks.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>

      {/* Alts */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-100">The alt multiplier</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-300">
          {KINAH.altStrategy.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-zinc-500">
          Track the whole roster with the{' '}
          <Link href="/checklist/" className="text-sky-400 hover:text-sky-300">
            Weekly Checklist
          </Link>{' '}
          — per-character caps are exactly where alt value comes from.
        </p>
      </section>
    </div>
  );
}
