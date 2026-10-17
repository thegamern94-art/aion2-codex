'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Repeat, Skull, XCircle } from 'lucide-react';
import type { Dungeon, GearTransferInfo } from '@/types/game';
import { TIER_ORDER } from '@/lib/data';

export default function GearCheck({
  dungeons,
  transfer,
}: {
  dungeons: Dungeon[];
  transfer: GearTransferInfo;
}) {
  const sorted = useMemo(
    () =>
      [...dungeons].sort(
        (a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier) || a.ilvlGate - b.ilvlGate,
      ),
    [dungeons],
  );

  const [slug, setSlug] = useState(sorted[0]?.slug ?? '');
  const [ilvl, setIlvl] = useState<number>(0);

  // Deep-link support: /tools/gear-check/#dungeon-slug preselects content.
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.replace('#', ''));
    if (hash && sorted.some((d) => d.slug === hash)) setSlug(hash);
  }, [sorted]);

  const selected = sorted.find((d) => d.slug === slug) ?? sorted[0];
  const gate = selected?.ilvlGate ?? 0;
  const delta = ilvl - gate;
  const hasInput = ilvl > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[340px,1fr]">
      <div className="space-y-4">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-zinc-500">Content</span>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-500/60"
          >
            {sorted.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.tier} · {d.name} (ilvl {d.ilvlGate})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-wider text-zinc-500">Your Gear Score</span>
          <input
            type="number"
            min={0}
            value={ilvl || ''}
            onChange={(e) => setIlvl(Math.max(0, parseInt(e.target.value, 10) || 0))}
            placeholder="e.g. 1400"
            className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono tabular-nums text-sm text-zinc-100 outline-none focus:border-amber-500/60"
          />
        </label>

        <div
          aria-live="polite"
          className={
            !hasInput
              ? 'rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-400'
              : delta >= 0
                ? 'rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-4'
                : 'rounded-lg border border-red-500/40 bg-red-500/5 p-4'
          }
        >
          {!hasInput ? (
            <p>Enter your Gear Score to check readiness.</p>
          ) : delta >= 0 ? (
            <p className="flex items-start gap-2 text-sm text-emerald-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>
                <strong className="font-semibold">Ready.</strong> You clear the Gear Score {gate} gate by{' '}
                {delta}. Meet the party comp and you’re set.
              </span>
            </p>
          ) : (
            <p className="flex items-start gap-2 text-sm text-red-300">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>
                <strong className="font-semibold">Gate locked.</strong> You need{' '}
                <span className="font-mono tabular-nums">+{Math.abs(delta)}</span> more GS to enter{' '}
                {selected?.name}. See the Gear Transfer rules below before over-upgrading early gear.
              </span>
            </p>
          )}
        </div>

        <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-300">
            <Repeat className="h-4 w-4" aria-hidden />
            Gear Transfer — the ilvl 70 rule
          </p>
          <p className="mt-2 text-xs leading-5 text-zinc-400">{transfer.summary}</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-5 text-zinc-400">
            {transfer.rules.slice(0, 3).map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        {selected && (
          <div className="card-corners rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-zinc-100">{selected.name}</h3>
              <span className="rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
                {selected.tier} {selected.kind} · {selected.players} players · GS {selected.ilvlGate}
              </span>
            </div>
            {selected.gates && (
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                Gates — Exploration: {selected.gates.exploration} · Conquest: {selected.gates.conquest}
                {selected.gates.hard ? ` · Hard: ${selected.gates.hard}` : ''}
              </p>
            )}

            <h4 className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <Skull className="h-3.5 w-3.5 text-red-400" aria-hidden />
              30-Second Boss Cheat Sheet
            </h4>
            <div className="mt-3 space-y-3">
              {selected.bosses.map((b) => (
                <div key={b.name} className="rounded-md border border-zinc-800 bg-zinc-950/60 p-3">
                  <p className="text-sm font-medium text-zinc-200">{b.name}</p>
                  <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-5 text-zinc-400">
                    {b.tldr.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {selected.transferNote && (
              <p className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs leading-5 text-amber-200/90">
                {selected.transferNote}
              </p>
            )}

            <h4 className="mt-5 text-xs font-semibold uppercase tracking-wider text-zinc-400">Rewards</h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {selected.rewards.map((r) => (
                <span
                  key={r}
                  className="rounded-full border border-zinc-700 bg-zinc-800/60 px-2.5 py-0.5 text-xs text-zinc-300"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
