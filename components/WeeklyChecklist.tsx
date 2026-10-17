'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Plus, RotateCcw, X } from 'lucide-react';
import type { ChecklistData, ChecklistItem } from '@/types/game';
import { useSchedule } from './use-schedule';

interface PersistedState {
  week: string;
  chars: Record<string, Record<string, boolean>>;
  server: Record<string, boolean>;
}

const LS_ROSTER = 'codex:roster';
const LS_STATE = 'codex:checklist';

/** ISO timestamp of the most recent Wednesday 07:00 UTC — the weekly reset anchor. */
function currentWeekKey(now: Date): string {
  const daysSinceWed = (now.getUTCDay() - 3 + 7) % 7;
  let candidate = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() - daysSinceWed,
    7,
    0,
    0,
  );
  if (candidate > now.getTime()) candidate -= 7 * 86_400_000;
  return new Date(candidate).toISOString();
}

export default function WeeklyChecklist({ data }: { data: ChecklistData }) {
  const schedule = useSchedule();
  const [mounted, setMounted] = useState(false);
  const [roster, setRoster] = useState<string[]>([]);
  const [state, setState] = useState<PersistedState>({ week: '', chars: {}, server: {} });
  const [newChar, setNewChar] = useState('');

  useEffect(() => {
    const week = currentWeekKey(new Date());
    let roster: string[] = ['Main'];
    try {
      const storedRoster = JSON.parse(localStorage.getItem(LS_ROSTER) ?? 'null');
      if (Array.isArray(storedRoster) && storedRoster.length > 0) roster = storedRoster;
    } catch {
      // corrupted storage — fall back to default
    }
    let next: PersistedState = { week, chars: {}, server: {} };
    try {
      const stored = JSON.parse(localStorage.getItem(LS_STATE) ?? 'null');
      if (stored && stored.week === week) next = stored as PersistedState;
    } catch {
      // corrupted storage — start fresh for this week
    }
    setRoster(roster);
    setState(next);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(LS_ROSTER, JSON.stringify(roster));
    localStorage.setItem(LS_STATE, JSON.stringify(state));
  }, [mounted, roster, state]);

  const byCategory = useMemo(() => {
    const map = new Map<string, ChecklistItem[]>();
    for (const cat of data.categories) {
      map.set(
        cat.id,
        data.items.filter((i) => i.category === cat.id),
      );
    }
    return map;
  }, [data]);

  const charItems = useMemo(() => data.items.filter((i) => i.scope === 'character'), [data]);
  const serverItems = useMemo(() => data.items.filter((i) => i.scope === 'server'), [data]);

  function toggleChar(item: ChecklistItem, char: string) {
    setState((s) => ({
      ...s,
      chars: {
        ...s.chars,
        [char]: { ...(s.chars[char] ?? {}), [item.id]: !s.chars[char]?.[item.id] },
      },
    }));
  }

  function toggleServer(item: ChecklistItem) {
    setState((s) => ({ ...s, server: { ...s.server, [item.id]: !s.server[item.id] } }));
  }

  function addChar() {
    const name = newChar.trim();
    if (!name || roster.length >= 8 || roster.some((c) => c.toLowerCase() === name.toLowerCase())) return;
    setRoster((r) => [...r, name]);
    setNewChar('');
  }

  function removeChar(char: string) {
    setRoster((r) => r.filter((c) => c !== char));
    setState((s) => {
      const chars = { ...s.chars };
      delete chars[char];
      return { ...s, chars };
    });
  }

  function manualReset() {
    setState({ week: currentWeekKey(new Date()), chars: {}, server: {} });
  }

  const charDone = (c: string) => charItems.filter((i) => state.chars[c]?.[i.id]).length;
  const serverDone = serverItems.filter((i) => state.server[i.id]).length;
  const totalPossible = charItems.length * roster.length + serverItems.length;
  const totalDone = roster.reduce((acc, c) => acc + charDone(c), 0) + serverDone;
  const pct = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

  return (
    <div>
      {/* Summary bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="min-w-48 flex-1">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Weekly progress</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-amber-400 transition-all"
                style={{ width: `${pct}%` }}
                aria-hidden
              />
            </div>
            <span className="font-mono text-sm tabular-nums text-zinc-200">{pct}%</span>
          </div>
        </div>
        <div className="text-xs text-zinc-500">
          <p>
            Resets in{' '}
            <span className="font-mono tabular-nums text-amber-300">{schedule?.weekly ?? '--:--:--'}</span>{' '}
            (Wednesday 07:00 UTC)
          </p>
          <button
            onClick={manualReset}
            className="mt-1 inline-flex items-center gap-1 text-sky-400 hover:text-sky-300"
          >
            <RotateCcw className="h-3 w-3" aria-hidden /> Clear now
          </button>
        </div>
      </div>

      {/* Roster manager */}
      <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <p className="text-xs uppercase tracking-wider text-zinc-500">
          Roster — per-character caps ({roster.length}/8)
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {mounted &&
            roster.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/80 py-1 pl-3 pr-1.5 text-xs text-zinc-200"
              >
                {c}
                {roster.length > 1 && (
                  <button
                    onClick={() => removeChar(c)}
                    className="rounded-full p-0.5 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-200"
                    aria-label={`Remove ${c}`}
                  >
                    <X className="h-3 w-3" aria-hidden />
                  </button>
                )}
              </span>
            ))}
          <span className="flex items-center gap-1">
            <input
              value={newChar}
              onChange={(e) => setNewChar(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addChar()}
              placeholder="Add character…"
              className="w-36 rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-amber-500/60"
            />
            <button
              onClick={addChar}
              disabled={roster.length >= 8 || !newChar.trim()}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:border-zinc-600 disabled:opacity-40"
            >
              <Plus className="h-3 w-3" aria-hidden /> Add
            </button>
          </span>
        </div>
        <p className="mt-3 text-[11px] leading-4 text-zinc-600">{data.resetNote}</p>
      </div>

      {/* Categories */}
      {!mounted ? (
        <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900/40 p-8 text-center text-sm text-zinc-500">
          Loading your checklist…
        </div>
      ) : (
        data.categories.map((cat) => {
          const items = byCategory.get(cat.id) ?? [];
          if (items.length === 0) return null;
          return (
            <section key={cat.id} className="mt-8">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-400">
                {cat.label}
              </h3>
              <div className="overflow-x-auto rounded-lg border border-zinc-800">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/80 text-left text-xs uppercase tracking-wider text-zinc-400">
                      <th className="px-4 py-2.5 font-medium">Cap</th>
                      <th className="px-4 py-2.5 font-medium">Scope</th>
                      {roster.map((c) => (
                        <th key={c} className="px-2 py-2.5 text-center font-medium">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-zinc-800/60 align-top last:border-0 hover:bg-zinc-900/40">
                        <td className="px-4 py-3">
                          <p className="font-medium text-zinc-200">{item.label}</p>
                          <p className="mt-0.5 font-mono text-[11px] text-amber-300/90">{item.cap}</p>
                          {item.hint && <p className="mt-1 max-w-xl text-[11px] leading-4 text-zinc-500">{item.hint}</p>}
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-500">
                          {item.scope === 'character' ? 'per character' : 'per server'}
                        </td>
                        {item.scope === 'character' ? (
                          roster.map((c) => {
                            const done = Boolean(state.chars[c]?.[item.id]);
                            return (
                              <td key={c} className="px-2 py-3 text-center">
                                <button
                                  onClick={() => toggleChar(item, c)}
                                  aria-pressed={done}
                                  aria-label={`${item.label} — ${c}`}
                                  className={`inline-flex h-6 w-6 items-center justify-center rounded-md border transition ${
                                    done
                                      ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300'
                                      : 'border-zinc-700 bg-zinc-900 text-transparent hover:border-zinc-500'
                                  }`}
                                >
                                  <Check className="h-3.5 w-3.5" aria-hidden />
                                </button>
                              </td>
                            );
                          })
                        ) : (
                          <td colSpan={roster.length} className="px-2 py-3 text-center">
                            <button
                              onClick={() => toggleServer(item)}
                              aria-pressed={Boolean(state.server[item.id])}
                              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs transition ${
                                state.server[item.id]
                                  ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300'
                                  : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500'
                              }`}
                            >
                              <Check className="h-3.5 w-3.5" aria-hidden />
                              {state.server[item.id] ? 'Done (server-wide)' : 'Mark done'}
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })
      )}

      {/* Odyle note */}
      <div className="mt-8 rounded-lg border border-sky-500/30 bg-sky-500/5 p-4 text-xs leading-5 text-sky-100/80">
        <strong className="font-semibold text-sky-300">Odyle Energy budget:</strong> cap{' '}
        {data.odyne.base.toLocaleString()} ({data.odyne.membership.toLocaleString()} with membership),{' '}
        {data.odyne.regen}. Plan cubes around it — Exploration 20–30 per cube, Conquest 40.
      </div>
    </div>
  );
}
