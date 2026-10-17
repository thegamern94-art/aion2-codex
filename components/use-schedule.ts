'use client';

// Live schedule hooks — tick every second on the client.
// Server render returns null so countdowns hydrate from "--:--:--" (no mismatch).

import { useEffect, useMemo, useState } from 'react';
import { SYSTEMS } from '@/lib/data';
import { formatCountdown, nextDailyUtc, nextWeeklyOnDaysUtc, nextWeeklyUtc, nextWindowUtc } from '@/lib/reset';

export function useNow(intervalMs = 1000): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export interface ScheduleSnapshot {
  eu: string;
  na: string;
  weekly: string;
  rift: string;
  siege: string | null;
  riftWindows: string[];
  event: { name: string; label: string; countdown: string } | null;
}

export function computeSchedule(now: Date): ScheduleSnapshot {
  const { resets, rift, events } = SYSTEMS;

  let event: ScheduleSnapshot['event'] = null;
  const active = events.find(
    (e) => new Date(e.start).getTime() <= now.getTime() && now.getTime() <= new Date(e.end).getTime(),
  );
  if (active) {
    event = {
      name: active.name,
      label: 'Ends in',
      countdown: formatCountdown(new Date(active.end).getTime() - now.getTime()),
    };
  } else {
    const upcoming = events
      .map((e) => ({ e, t: new Date(e.start).getTime() }))
      .filter((x) => x.t > now.getTime())
      .sort((a, b) => a.t - b.t)[0];
    if (upcoming) {
      event = {
        name: upcoming.e.name,
        label: 'Starts in',
        countdown: formatCountdown(upcoming.t - now.getTime()),
      };
    }
  }

  return {
    eu: formatCountdown(nextDailyUtc(resets.eu.utc, now).getTime() - now.getTime()),
    na: formatCountdown(nextDailyUtc(resets.na.utc, now).getTime() - now.getTime()),
    weekly: formatCountdown(
      nextWeeklyUtc(resets.weekly.utc, resets.weekly.weekday ?? 'Thursday', now).getTime() - now.getTime(),
    ),
    rift: formatCountdown(nextWindowUtc(rift.windowsUtc, now).getTime() - now.getTime()),
    siege: SYSTEMS.sieges
      ? formatCountdown(
          nextWeeklyOnDaysUtc(SYSTEMS.sieges.timeUtc, SYSTEMS.sieges.daysUtc, now).getTime() - now.getTime(),
        )
      : null,
    riftWindows: rift.windowsUtc,
    event,
  };
}

export function useSchedule(): ScheduleSnapshot | null {
  const now = useNow();
  return useMemo(() => (now ? computeSchedule(now) : null), [now]);
}
