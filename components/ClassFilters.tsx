'use client';

import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';
import type { ClassInfo, MetaTier, Role } from '@/types/game';

const ROLES: (Role | 'All')[] = ['All', 'Tank', 'Melee DPS', 'Ranged DPS', 'Magic DPS', 'Healer', 'Support'];
const TIERS: (MetaTier | 'All')[] = ['All', 'S', 'A', 'B', 'C'];
const MODES = [
  { key: 'pve', label: 'PvE Expeditions' },
  { key: 'raid', label: '10-Man Raids' },
  { key: 'pvp', label: 'Abyss PvP' },
] as const;
type ModeKey = (typeof MODES)[number]['key'];

const DIFFS = [
  { key: 'all', label: 'Any' },
  { key: 'easy', label: 'Easy (≤2)' },
  { key: 'medium', label: 'Medium (3)' },
  { key: 'hard', label: 'Hard (4+)' },
] as const;
type DiffKey = (typeof DIFFS)[number]['key'];

export function DifficultyPips({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5" title={`Difficulty ${value}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-3 rounded-sm ${i <= value ? 'bg-amber-400' : 'bg-zinc-700'}`}
          aria-hidden
        />
      ))}
    </span>
  );
}

export function TierBadge({ tier: t }: { tier: MetaTier }) {
  const color =
    t === 'S'
      ? 'border-amber-400/60 bg-amber-400/10 text-amber-300'
      : t === 'A'
        ? 'border-sky-400/50 bg-sky-400/10 text-sky-300'
        : t === 'B'
          ? 'border-zinc-500/50 bg-zinc-500/10 text-zinc-300'
          : 'border-zinc-700 bg-zinc-800/60 text-zinc-500';
  return (
    <span className={`inline-flex h-6 min-w-6 items-center justify-center rounded border px-1.5 font-mono text-xs font-bold ${color}`}>
      {t}
    </span>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? 'rounded-full border border-amber-500/60 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300'
          : 'rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
      }
    >
      {children}
    </button>
  );
}

export default function ClassFilters({ classes }: { classes: ClassInfo[] }) {
  const [role, setRole] = useState<Role | 'All'>('All');
  const [diff, setDiff] = useState<DiffKey>('all');
  const [tier, setTier] = useState<MetaTier | 'All'>('All');
  const [mode, setMode] = useState<ModeKey>('pve');

  const filtered = useMemo(
    () =>
      classes.filter((c) => {
        if (role !== 'All' && c.role !== role) return false;
        if (tier !== 'All' && c.tiers[mode] !== tier) return false;
        if (diff === 'easy' && c.difficulty > 2) return false;
        if (diff === 'medium' && c.difficulty !== 3) return false;
        if (diff === 'hard' && c.difficulty < 4) return false;
        return true;
      }),
    [classes, role, diff, tier, mode],
  );

  return (
    <div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-20 shrink-0 text-xs uppercase tracking-wider text-zinc-500">Mode</span>
          {MODES.map((m) => (
            <Chip key={m.key} active={mode === m.key} onClick={() => setMode(m.key)}>
              {m.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-20 shrink-0 text-xs uppercase tracking-wider text-zinc-500">Role</span>
          {ROLES.map((r) => (
            <Chip key={r} active={role === r} onClick={() => setRole(r)}>
              {r}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-20 shrink-0 text-xs uppercase tracking-wider text-zinc-500">Difficulty</span>
          {DIFFS.map((o) => (
            <Chip key={o.key} active={diff === o.key} onClick={() => setDiff(o.key)}>
              {o.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-20 shrink-0 text-xs uppercase tracking-wider text-zinc-500">Meta Tier</span>
          {TIERS.map((t) => (
            <Chip key={t} active={tier === t} onClick={() => setTier(t)}>
              {t}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mt-5 text-sm text-zinc-500" aria-live="polite">
        {filtered.length} of {classes.length} classes
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Link
            key={c.slug}
            href={`/classes/${c.slug}/`}
            className="card-corners group rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-amber-500/40 hover:bg-zinc-900/70"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-zinc-100 group-hover:text-amber-300">{c.name}</h3>
                <p className="truncate text-xs text-zinc-500">
                  {c.role} · {c.weapons.join(' / ')}
                </p>
              </div>
              <TierBadge tier={c.tiers[mode]} />
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-zinc-400">{c.tagline}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
              <span className="flex items-center gap-2">
                Difficulty <DifficultyPips value={c.difficulty} />
              </span>
              <span className="font-mono uppercase">
                {mode} {c.tiers[mode]}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
