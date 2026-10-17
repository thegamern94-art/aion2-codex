import GearCheck from '@/components/GearCheck';
import GearGateTable from '@/components/GearGateTable';
import { DUNGEONS, SYSTEMS } from '@/lib/data';

export const metadata = {
  title: 'Gear Check — Expedition & Raid ilvl Gates',
  description:
    'Pick a 1-star, 2-star or 3-star Expedition (or a 10-man Raid), enter your item level and get an instant readiness verdict with 30-second boss cheat sheets and the ilvl 70 Gear Transfer rules.',
};

export default function GearCheckPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Interactive Tool</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">Gear Check</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
        Select content, drop in your item level and see whether you clear the gate — plus what the
        bosses actually do in 30 seconds or less.
      </p>
      <div className="mt-8">
        <GearCheck dungeons={DUNGEONS} transfer={SYSTEMS.gearTransfer} />
      </div>
      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-zinc-100">All ilvl gates</h2>
        <GearGateTable />
      </section>
    </div>
  );
}
