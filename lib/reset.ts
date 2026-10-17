// Pure UTC countdown helpers — shared by the live header and the home timer panel.
// All schedule times in the data files are stored as UTC "HH:MM".

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export function parseHm(hm: string): { h: number; m: number } {
  const [h, m] = hm.split(':').map((n) => parseInt(n, 10));
  return { h: h || 0, m: m || 0 };
}

function atUtc(base: Date, h: number, m: number): Date {
  return new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), h, m, 0, 0));
}

/** Next occurrence of a daily UTC time. */
export function nextDailyUtc(hm: string, now: Date): Date {
  const { h, m } = parseHm(hm);
  let next = atUtc(now, h, m);
  if (next.getTime() <= now.getTime()) next = new Date(next.getTime() + 86_400_000);
  return next;
}

/** Next occurrence of a weekly UTC time on the given weekday name. */
export function nextWeeklyUtc(hm: string, weekday: string, now: Date): Date {
  const { h, m } = parseHm(hm);
  const target = WEEKDAYS.findIndex((d) => d.toLowerCase() === weekday.toLowerCase());
  const idx = target === -1 ? 4 : target; // default Thursday
  const daysAhead = (idx - now.getUTCDay() + 7) % 7;
  let next = atUtc(new Date(now.getTime() + daysAhead * 86_400_000), h, m);
  if (next.getTime() <= now.getTime()) next = new Date(next.getTime() + 7 * 86_400_000);
  return next;
}

/** Next occurrence from a list of daily UTC "HH:MM" windows. */
export function nextWindowUtc(windows: string[], now: Date): Date {
  let best: Date | null = null;
  for (const dayOffset of [0, 1]) {
    for (const w of windows) {
      const { h, m } = parseHm(w);
      const candidate = atUtc(new Date(now.getTime() + dayOffset * 86_400_000), h, m);
      if (candidate.getTime() > now.getTime() && (best === null || candidate < best)) best = candidate;
    }
  }
  return best ?? new Date(now.getTime() + 86_400_000);
}

/** Next occurrence of a weekly UTC time on one of the given weekday names (e.g. sieges Mon/Thu/Sat). */
export function nextWeeklyOnDaysUtc(hm: string, days: string[], now: Date): Date {
  const { h, m } = parseHm(hm);
  const targets = days
    .map((d) => WEEKDAYS.findIndex((w) => w.toLowerCase() === d.toLowerCase()))
    .filter((i) => i >= 0);
  const list = targets.length > 0 ? targets : [1, 4, 6];
  let best: Date | null = null;
  for (const idx of list) {
    const daysAhead = (idx - now.getUTCDay() + 7) % 7;
    let candidate = atUtc(new Date(now.getTime() + daysAhead * 86_400_000), h, m);
    if (candidate.getTime() <= now.getTime()) candidate = new Date(candidate.getTime() + 7 * 86_400_000);
    if (best === null || candidate < best) best = candidate;
  }
  return best ?? new Date(now.getTime() + 86_400_000);
}

/** "2d 03:04:05" or "03:04:05" */
export function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const total = Math.floor(ms / 1000);
  const d = Math.floor(total / 86400);
  const hh = String(Math.floor((total % 86400) / 3600)).padStart(2, '0');
  const mm = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const ss = String(total % 60).padStart(2, '0');
  return d > 0 ? `${d}d ${hh}:${mm}:${ss}` : `${hh}:${mm}:${ss}`;
}

export { WEEKDAYS };
