'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { ClassInfo } from '@/types/game';
import MacroCopyBox from './MacroCopyBox';
import { DifficultyPips, TierBadge } from './ClassFilters';

const TABS = ['Overview', 'Skill Chains & 2-Key Macros', 'Arcana & Daevanion', 'Gear Progression'] as const;
type Tab = (typeof TABS)[number];

export default function ClassTabs({ cls }: { cls: ClassInfo }) {
  const [tab, setTab] = useState<Tab>('Overview');

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto border-b border-zinc-800" role="tablist" aria-label="Class sections">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm transition ${
              tab === t
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="py-8">
        {tab === 'Overview' && <Overview cls={cls} />}
        {tab === 'Skill Chains & 2-Key Macros' && <Skills cls={cls} />}
        {tab === 'Arcana & Daevanion' && <Priorities cls={cls} />}
        {tab === 'Gear Progression' && <Gear cls={cls} />}
      </div>
    </div>
  );
}

function Overview({ cls }: { cls: ClassInfo }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Role" value={cls.role} />
        <Fact label="Weapons" value={cls.weapons.join(' / ')} />
        <Fact
          label="Difficulty"
          value={<span className="flex items-center gap-2">{cls.difficulty}/5 <DifficultyPips value={cls.difficulty} /></span>}
        />
        <Fact
          label="Meta Tiers"
          value={
            <span className="flex items-center gap-1.5">
              <span title="PvE Expeditions" className="text-xs text-zinc-500">PvE</span> <TierBadge tier={cls.tiers.pve} />
              <span title="10-Man Raids" className="ml-1 text-xs text-zinc-500">Raid</span> <TierBadge tier={cls.tiers.raid} />
              <span title="Abyss PvP" className="ml-1 text-xs text-zinc-500">PvP</span> <TierBadge tier={cls.tiers.pvp} />
            </span>
          }
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Playstyle</h3>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-300">{cls.playstyle}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">Strengths</h3>
          <ul className="mt-3 space-y-2">
            {cls.strengths.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-zinc-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-red-400">Weaknesses</h3>
          <ul className="mt-3 space-y-2">
            {cls.weaknesses.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-zinc-300">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
      <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-1.5 text-sm font-medium text-zinc-200">{value}</p>
    </div>
  );
}

function Skills({ cls }: { cls: ClassInfo }) {
  return (
    <div className="space-y-10">
      {cls.skillChains.map((ch) => (
        <div key={ch.name}>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-zinc-100">{ch.name}</h3>
            <span className="flex gap-1">
              {ch.keys.map((k) => (
                <kbd key={k} className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 font-mono text-[11px] text-amber-300">
                  {k}
                </kbd>
              ))}
            </span>
          </div>
          <p className="mt-1.5 max-w-3xl text-sm leading-6 text-zinc-400">{ch.description}</p>
          <ol className="mt-3 max-w-3xl list-decimal space-y-1.5 pl-5 text-sm leading-6 text-zinc-300">
            {ch.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          <ul className="mt-3 space-y-1">
            {ch.tips.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-5 text-zinc-500">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400/80" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">2-Key Macros</h3>
        {cls.macros.map((m) => (
          <MacroCopyBox key={m.name} name={m.name} keys={m.keys} lines={m.lines} useCase={m.useCase} />
        ))}
      </div>
    </div>
  );
}

function Priorities({ cls }: { cls: ClassInfo }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card-corners rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">Arcana Priority</h3>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-zinc-300">
          {cls.arcana.priority.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ol>
        <p className="mt-4 border-t border-zinc-800 pt-3 text-xs leading-5 text-zinc-500">{cls.arcana.notes}</p>
      </div>
      <div className="card-corners rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">Daevanion Priority</h3>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-zinc-300">
          {cls.daevanion.priority.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ol>
        <p className="mt-4 border-t border-zinc-800 pt-3 text-xs leading-5 text-zinc-500">{cls.daevanion.notes}</p>
      </div>
    </div>
  );
}

function Gear({ cls }: { cls: ClassInfo }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/80 text-left text-xs uppercase tracking-wider text-zinc-400">
            <th className="px-4 py-2.5 font-medium">Stage</th>
            <th className="px-4 py-2.5 font-medium">ilvl</th>
            <th className="px-4 py-2.5 font-medium">Focus</th>
            <th className="px-4 py-2.5 font-medium">Notes</th>
          </tr>
        </thead>
        <tbody>
          {cls.gearProgression.map((g) => (
            <tr key={g.stage} className="border-b border-zinc-800/60 last:border-0 align-top hover:bg-zinc-900/40">
              <td className="px-4 py-3 font-medium text-zinc-200">{g.stage}</td>
              <td className="px-4 py-3 font-mono tabular-nums text-amber-300">{g.ilvl}</td>
              <td className="px-4 py-3 text-zinc-400">{g.focus}</td>
              <td className="px-4 py-3 text-zinc-400">{g.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
