import Link from 'next/link';
import { Repeat, Skull, Users } from 'lucide-react';
import { DUNGEONS, SYSTEMS, TIER_ORDER, dungeonsByTier } from '@/lib/data';
import GearGateTable from '@/components/GearGateTable';

export const metadata = {
  title: 'Dungeons & Raids — ilvl Gates & Boss Cheat Sheets',
  description:
    'Every AION 2 Global expedition and raid: 1-star, 2-star and 3-star Expeditions plus 10-man Raids with item level gates, 30-second boss cheat sheets and Gear Transfer notes.',
};

export default function DungeonsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Endgame Content</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">Dungeons &amp; Raids</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
        Expeditions are 1–5 player dungeons with two optional mini-bosses feeding the final loot cube.
        Launch content runs 1-Star through 3-Star (Krao Cave, Draupnir, Urugugu Canyon, Vakron Sky
        Island, Fire Temple, Ferocious Horn Den); post-launch 4★+ expeditions and 10-player Sanctuary
        Raids sit above them. Every gate below links into the{' '}
        <Link href="/tools/gear-check/" className="text-sky-400 hover:text-sky-300">
          gear checker
        </Link>{' '}
        for a readiness verdict and boss TL;DRs.
      </p>

      <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-xs leading-5 text-zinc-500">
        Gate values follow the client-extracted table published Oct 2026 (metabot.gg). game8’s older
        list shows different numbers — the community flags this discrepancy, so treat gates as
        “verify in-game” until an official table exists.
      </div>

      <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
        <p className="flex items-start gap-2 text-sm leading-6 text-amber-200/90">
          <Repeat className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
          <span>
            <strong className="font-semibold">Gear Transfer note:</strong>{' '}
            {SYSTEMS.gearTransfer.summary}
          </span>
        </p>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-zinc-100">Gate table</h2>
        <GearGateTable />
      </section>

      {TIER_ORDER.map((tier) => {
        const list = dungeonsByTier(tier);
        if (list.length === 0) return null;
        return (
          <section key={tier} className="mt-12">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
              {tier} {tier === 'Raid' ? 'Raids' : 'Expeditions'}
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {list.map((d) => (
                <Link
                  key={d.slug}
                  href={`/tools/gear-check/#${d.slug}`}
                  className="card-corners group rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-amber-500/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-medium text-zinc-100 group-hover:text-amber-300">{d.name}</h3>
                    <span className="shrink-0 rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 font-mono text-xs text-amber-300">
                      ilvl {d.ilvlGate}
                    </span>
                  </div>
                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" aria-hidden /> {d.players} players
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Skull className="h-3.5 w-3.5" aria-hidden /> {d.bosses.length} bosses
                    </span>
                    <span className="uppercase">{d.kind}</span>
                  </p>
                  <p className="mt-3 text-xs leading-5 text-zinc-400">
                    First boss: <span className="text-zinc-300">{d.bosses[0]?.name}</span> —{' '}
                    {d.bosses[0]?.tldr[0]}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {d.rewards.slice(0, 4).map((r) => (
                      <span
                        key={r}
                        className="rounded-full border border-zinc-700 bg-zinc-800/60 px-2 py-0.5 text-[11px] text-zinc-400"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <p className="mt-12 text-xs text-zinc-600">
        Content list reflects the {DUNGEONS.length} entries in the Codex database (Global build,
        Oct 2026). English mechanic write-ups are still missing for several post-launch dungeons —
        those entries say so honestly instead of inventing mechanics.
      </p>
    </div>
  );
}
