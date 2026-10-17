'use client';

import Link from 'next/link';
import { useSchedule } from './use-schedule';

// Live active/upcoming event banner for the Events hub.
export default function EventBanner() {
  const s = useSchedule();
  if (!s?.event) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-500">
        No live event tracked right now — see the schedule below for what’s next.
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-base font-semibold text-amber-300">
          <span aria-hidden>🎃</span> {s.event.name}
        </p>
        <p className="font-mono text-sm tabular-nums text-amber-200">
          {s.event.label} {s.event.countdown}
        </p>
      </div>
      <p className="mt-2 text-xs text-amber-200/70">
        Full breakdown below — coin math, Candy Keys and the shop priority table.
      </p>
    </div>
  );
}
