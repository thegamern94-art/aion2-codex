import Link from 'next/link';
import { DUNGEONS, TIER_ORDER } from '@/lib/data';
import type { Dungeon } from '@/types/game';

export default function GearGateTable({ dungeons = DUNGEONS }: { dungeons?: Dungeon[] }) {
  const sorted = [...dungeons].sort(
    (a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier) || a.ilvlGate - b.ilvlGate,
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/80 text-left text-xs uppercase tracking-wider text-zinc-400">
            <th className="px-4 py-2.5 font-medium">Content</th>
            <th className="px-4 py-2.5 font-medium">Type</th>
            <th className="px-4 py-2.5 font-medium">Players</th>
            <th className="px-4 py-2.5 font-medium">Gate (GS)</th>
            <th className="px-4 py-2.5 font-medium">Check</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((d) => (
            <tr key={d.slug} className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-900/40">
              <td className="px-4 py-2.5 font-medium text-zinc-200">{d.name}</td>
              <td className="px-4 py-2.5 text-zinc-400">
                {d.tier} {d.kind}
              </td>
              <td className="px-4 py-2.5 font-mono tabular-nums text-zinc-300">{d.players}</td>
              <td className="px-4 py-2.5 font-mono tabular-nums text-amber-300">{d.ilvlGate}</td>
              <td className="px-4 py-2.5">
                <Link
                  href={`/tools/gear-check/#${d.slug}`}
                  className="text-sky-400 underline-offset-2 hover:text-sky-300 hover:underline"
                >
                  Gear check →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
