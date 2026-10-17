'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { EnhancementData, EnhStep, EnhTier } from '@/types/game';

/** Expected attempts for one step, accounting for +pity% per failure at the same step. */
function expectedAttempts(rate: number, pity: number, cap: number | null): number {
  let survive = 1;
  let e = 0;
  const maxK = cap ?? 400;
  for (let k = 1; k <= maxK; k++) {
    const p = Math.min(rate + (pity * (k - 1)) / 100, 1);
    e += k * survive * p;
    survive *= 1 - p;
    if (survive <= 1e-9) break;
  }
  return e;
}

function stepAttempts(steps: EnhStep[]): number[] {
  return steps.map((s) => (s.rate === null ? 1 : expectedAttempts(s.rate, s.pityPerFail, s.capAttempts)));
}

export default function EnhancementCalculator({ data }: { data: EnhancementData }) {
  const [mode, setMode] = useState<'unique' | 'amplify'>('unique');
  const [tierIdx, setTierIdx] = useState(2); // ilvl 86 (documented anchor)
  const [target, setTarget] = useState(15);

  const tier: EnhTier = data.tiers[tierIdx];

  const steps = useMemo(() => {
    if (mode === 'unique') {
      const from = Math.max(0, target - 10);
      return data.uniqueSteps.slice(0, from);
    }
    return data.amplifySteps.slice(0, Math.max(0, target - 15));
  }, [mode, target, data]);

  const guaranteed = mode === 'unique' ? data.guaranteedSteps : 0;
  const attemptsPerStep = stepAttempts(steps);
  const totalAttempts = guaranteed + attemptsPerStep.reduce((a, b) => a + b, 0);
  const totalStones = Math.round(totalAttempts * tier.stonesPerAttempt);
  const totalKinah = Math.round(totalAttempts * tier.kinahPerAttempt);
  const worstCase =
    mode === 'unique'
      ? data.guaranteedSteps + data.uniqueSteps.slice(0, Math.max(0, target - 10)).reduce((a, s) => a + (s.capAttempts ?? 0), 0)
      : null;

  const uniqueTargets = [10, 11, 12, 13, 14, 15];
  const amplifyTargets = [16, 17, 18, 19, 20];

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: 'unique', label: 'Enhancement (0 → +15)' },
            { key: 'amplify', label: 'Amplified (+15 → +20)' },
          ] as const
        ).map((m) => (
          <button
            key={m.key}
            onClick={() => {
              setMode(m.key);
              setTarget(m.key === 'unique' ? 15 : 20);
            }}
            aria-pressed={mode === m.key}
            className={
              mode === m.key
                ? 'rounded-full border border-amber-500/60 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-300'
                : 'rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1.5 text-sm text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
            }
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-zinc-500">Item tier</span>
          <select
            value={tierIdx}
            onChange={(e) => setTierIdx(parseInt(e.target.value, 10))}
            className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-500/60"
          >
            {data.tiers.map((t, i) => (
              <option key={t.ilvl} value={i}>
                {t.label}
                {t.estimated ? ' (estimated cost)' : ''}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-zinc-500">
            {mode === 'unique' ? 'Target enhancement' : 'Target Amplified level'}
          </span>
          <select
            value={target}
            onChange={(e) => setTarget(parseInt(e.target.value, 10))}
            className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-500/60"
          >
            {(mode === 'unique' ? uniqueTargets : amplifyTargets).map((t) => (
              <option key={t} value={t}>
                +{t}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Results */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card-corners rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Expected attempts</p>
          <p className="mt-2 font-mono text-2xl tabular-nums text-zinc-100">
            {mode === 'unique' ? guaranteed : 0}
            {attemptsPerStep.map((a, i) => (
              <span key={i} className="text-zinc-500">
                {' '}
                +{a.toFixed(2)}
              </span>
            ))}
          </p>
          <p className="mt-1 text-[11px] text-zinc-600">
            total ≈ <span className="font-mono text-zinc-300">{totalAttempts.toFixed(2)}</span>
            {worstCase !== null && <> · worst case {worstCase}</>}
            {mode === 'amplify' && <> · no hard cap (long tail)</>}
          </p>
        </div>
        <div className="card-corners rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Enhance Stones (flat model)</p>
          <p className="mt-2 font-mono text-2xl tabular-nums text-zinc-100">{totalStones.toLocaleString()}</p>
          <p className="mt-1 text-[11px] text-zinc-600">
            {tier.stonesPerAttempt.toLocaleString()} / attempt {tier.estimated ? '· estimated tier' : '· documented tier'}
          </p>
        </div>
        <div className="card-corners rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Kinah (flat model)</p>
          <p className="mt-2 font-mono text-2xl tabular-nums text-amber-300">{totalKinah.toLocaleString()}</p>
          <p className="mt-1 text-[11px] text-zinc-600">{tier.kinahPerAttempt.toLocaleString()} / attempt</p>
        </div>
      </div>

      {/* Per-step table */}
      {steps.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 text-left text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-4 py-2.5 font-medium">Step</th>
                <th className="px-4 py-2.5 font-medium">Base rate</th>
                <th className="px-4 py-2.5 font-medium">Pity / cap</th>
                <th className="px-4 py-2.5 font-medium">Expected attempts</th>
                <th className="px-4 py-2.5 font-medium">Stones</th>
                <th className="px-4 py-2.5 font-medium">Kinah</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((s, i) => {
                const a = attemptsPerStep[i];
                return (
                  <tr key={s.label} className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-900/40">
                    <td className="px-4 py-2.5 font-medium text-zinc-200">{s.label}</td>
                    <td className="px-4 py-2.5 font-mono tabular-nums text-zinc-300">
                      {s.rate === null ? 'guaranteed' : `${Math.round(s.rate * 100)}%`}
                    </td>
                    <td className="px-4 py-2.5 font-mono tabular-nums text-zinc-400">
                      +{s.pityPerFail}%/fail{s.capAttempts ? ` · cap ${s.capAttempts}` : ''}
                    </td>
                    <td className="px-4 py-2.5 font-mono tabular-nums text-amber-300">{a.toFixed(2)}</td>
                    <td className="px-4 py-2.5 font-mono tabular-nums text-zinc-300">
                      {Math.round(a * tier.stonesPerAttempt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 font-mono tabular-nums text-zinc-300">
                      {Math.round(a * tier.kinahPerAttempt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {mode === 'unique' && (
                <tr className="bg-zinc-900/60">
                  <td className="px-4 py-2.5 font-medium text-zinc-300">+0 → +10 (guaranteed)</td>
                  <td className="px-4 py-2.5 font-mono text-zinc-500">100%</td>
                  <td className="px-4 py-2.5 text-zinc-500">—</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-amber-300">{data.guaranteedSteps}</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-zinc-300">
                    {(data.guaranteedSteps * tier.stonesPerAttempt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-zinc-300">
                    {(data.guaranteedSteps * tier.kinahPerAttempt).toLocaleString()}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Potential */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 text-sm leading-6 text-zinc-300">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Potential (PvP-only)</p>
        <p className="mt-2">{data.potential.note}</p>
        <p className="mt-1 font-mono text-xs text-zinc-500">
          {data.potential.levels} levels × {data.potential.apPerLevel.toLocaleString()} AP + Potential Stones ={' '}
          {(data.potential.levels * data.potential.apPerLevel).toLocaleString()} AP to max
        </p>
      </div>

      {/* Caveats */}
      <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-4">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <AlertTriangle className="h-4 w-4" aria-hidden /> Read before budgeting
        </p>
        <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs leading-5 text-zinc-400">
          {data.notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
