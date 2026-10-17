'use client';

import { Globe2, Hourglass, Skull } from 'lucide-react';
import { useSchedule } from './use-schedule';

// Large live-timer panel for the home page.
export default function TimerPanel() {
  const s = useSchedule();

  const items = [
    { icon: Globe2, label: 'EU Daily Reset', value: s?.eu ?? '--:--:--' },
    { icon: Globe2, label: 'NA Daily Reset', value: s?.na ?? '--:--:--' },
    { icon: Hourglass, label: 'Weekly Reset', value: s?.weekly ?? '--:--:--' },
    { icon: Skull, label: 'Next Space-Time Rift', value: s?.rift ?? '--:--:--' },
  ];

  return (
    <section aria-label="Live timers" className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="card-corners rounded-lg border border-zinc-800 bg-zinc-900/40 p-4"
          >
            <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500">
              <Icon className="h-3.5 w-3.5 text-amber-400" aria-hidden />
              {label}
            </p>
            <p className="mt-2 font-mono text-2xl tabular-nums text-zinc-100">{value}</p>
          </div>
        ))}
      </div>

      {s?.event && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-amber-300">
              <span aria-hidden>🎃</span> {s.event.name}
            </p>
            <p className="font-mono text-sm tabular-nums text-amber-200">
              {s.event.label} {s.event.countdown}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
