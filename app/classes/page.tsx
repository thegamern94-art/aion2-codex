import ClassFilters from '@/components/ClassFilters';
import { CLASSES } from '@/lib/data';

export const metadata = {
  title: 'Classes — Build Matrix',
  description:
    'All 8 AION 2 Global Launch classes in one filterable build matrix — Templar, Gladiator, Assassin, Ranger, Sorcerer, Spiritmaster, Cleric and Chanter, rated for PvE expeditions, 10-man raids and Abyss PvP.',
};

export default function ClassesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Build Matrix</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">Classes</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
        Every Global Launch class with community meta tiers for PvE expeditions, 10-man raids and
        Abyss PvP. Filter by role, difficulty and meta tier — open a class for skill chains,
        2-key macro slots, Arcana/Daevanion priority and gear progression.
      </p>
      <div className="mt-8 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-xs leading-5 text-zinc-500">
        Tier source: Mobalytics (Oct 15, 2026), cross-checked against game8 and BlueStacks — those
        sites disagree because they rank different things (raw damage vs group utility); we cite
        rather than average them. No raid-specific tier lists exist yet (the 10-player raids are days
        old), so the Raid column mirrors the PvE consensus. Meta shifts fast at launch — re-check weekly.
      </div>
      <div className="mt-8">
        <ClassFilters classes={CLASSES} />
      </div>

      <div className="mt-8 rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Coming to Global?</p>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
          <strong className="text-zinc-200">Brawler (Gauntlets)</strong> — the 9th class shipped on
          KR/TW with the “Chapter 1. Land of Sand and Frost” update (Jul 2026) and is slated for
          Global “Season 2” per community reports. No Global client evidence yet — we’ll publish a
          full Codex page the day it arrives.
        </p>
      </div>
    </div>
  );
}
