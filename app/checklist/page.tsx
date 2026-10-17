import type { Metadata } from 'next';
import WeeklyChecklist from '@/components/WeeklyChecklist';
import { CHECKLIST } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Weekly Checklist — Every Cap, Every Character',
  description:
    'Interactive AION 2 weekly checklist: Exploration and Conquest cubes, Sanctuary raid attempts, Transcendence, Ascension Trial, Abyss entry hours, shop caps and event currencies — per character, auto-resetting Wednesday 07:00 UTC. Progress saved in your browser.',
};

export default function ChecklistPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Daily Driver</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">Weekly Checklist</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
        Every cap that resets on Wednesday 07:00 UTC, tracked per character. Add your whole roster —
        per-character caps (Exploration cubes, Ascension Trial, Superior stones) get a checkbox per
        toon; server-wide caps (Candy Keys, Daily Dungeon pool, Sealed Wings morph) get one.
      </p>
      <p className="mt-2 text-xs text-zinc-600">
        Your progress lives in this browser only (localStorage) — no account, nothing uploaded.
      </p>
      <div className="mt-8">
        <WeeklyChecklist data={CHECKLIST} />
      </div>
    </div>
  );
}
