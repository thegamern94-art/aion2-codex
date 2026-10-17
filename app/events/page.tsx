import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarClock, Clock, Store } from 'lucide-react';
import EventBanner from '@/components/EventBanner';
import { SYSTEMS } from '@/lib/data';
import type { EventDetail } from '@/types/game';

export const metadata: Metadata = {
  title: 'Events — Halloween Trick or Treat & Timers',
  description:
    'AION 2 Global event hub: the Halloween Trick or Treat event (Oct 14 – Nov 4, 2026) with the 620-Pumpkin-Coin math, Candy Key economy, shop priority table — plus live Space-Time Rift and Abyss Siege timers.',
};

export default function EventsPage() {
  const { events, rift, sieges } = SYSTEMS;
  const active = events.find((e) => new Date(e.start).getTime() <= Date.now() && Date.now() <= new Date(e.end).getTime());
  const detail: EventDetail | undefined = active?.detail ?? events[0]?.detail;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Live Service</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">Events</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
        The consolidated hub: active event breakdowns, the recurring timer schedule, and the codes
        board — the three things players actually open daily.
      </p>

      <div className="mt-8">
        <EventBanner />
      </div>

      {/* Recurring timers */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="card-corners rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
            <Clock className="h-4 w-4 text-amber-400" aria-hidden /> {rift.name}
          </p>
          <p className="mt-2 text-xs leading-5 text-zinc-400">{rift.description}</p>
          <p className="mt-3 font-mono text-xs text-amber-300">
            Every 3 h: {rift.windowsUtc.join(' · ')} UTC
          </p>
          <Link href="/guides/survival/space-time-rifts-abyss-survival/" className="mt-3 inline-flex text-xs text-sky-400 hover:text-sky-300">
            Survival guide →
          </Link>
        </div>
        {sieges && (
          <div className="card-corners rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
              <CalendarClock className="h-4 w-4 text-amber-400" aria-hidden /> {sieges.name}
            </p>
            <p className="mt-2 text-xs leading-5 text-zinc-400">{sieges.description}</p>
            <p className="mt-3 font-mono text-xs text-amber-300">
              {sieges.daysUtc.join(' / ')} · {sieges.timeUtc} UTC
            </p>
          </div>
        )}
      </section>

      {/* Active event deep-dive */}
      {events.map((e) => (
        <section key={e.name} className="mt-12">
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-100">{e.name}</h2>
            <span className="font-mono text-xs text-zinc-500">
              {new Date(e.start).toISOString().slice(0, 10)} → {new Date(e.end).toISOString().slice(0, 10)}
              {e.detail?.shopNote ? ` · shop until Nov 24` : ''}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-300">{e.summary}</p>

          {e.detail?.coinMath && (
            <>
              <h3 className="mt-8 text-sm font-semibold uppercase tracking-wider text-zinc-400">Pumpkin Coin math</h3>
              <div className="mt-3 overflow-x-auto rounded-lg border border-zinc-800">
                <table className="w-full min-w-[480px] text-sm">
                  <tbody>
                    {e.detail.coinMath.map((row) => (
                      <tr key={row.label} className="border-b border-zinc-800/60 last:border-0">
                        <td className="px-4 py-2.5 text-zinc-300">{row.label}</td>
                        <td className="px-4 py-2.5 text-right font-mono tabular-nums text-amber-300">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {e.detail?.candyKeys && (
            <>
              <h3 className="mt-8 text-sm font-semibold uppercase tracking-wider text-zinc-400">Candy Keys (the RNG layer)</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-zinc-300">
                {e.detail.candyKeys.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>
            </>
          )}

          {e.detail?.shop && (
            <>
              <h3 className="mt-8 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                <Store className="h-4 w-4 text-amber-400" aria-hidden /> Coin shop priorities
              </h3>
              <div className="mt-3 overflow-x-auto rounded-lg border border-zinc-800">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/80 text-left text-xs uppercase tracking-wider text-zinc-400">
                      <th className="px-4 py-2.5 font-medium">Item</th>
                      <th className="px-4 py-2.5 font-medium">Coins</th>
                      <th className="px-4 py-2.5 font-medium">Limit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {e.detail.shop.map((row) => (
                      <tr key={row.item} className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-900/40">
                        <td className="px-4 py-2.5 text-zinc-300">{row.item}</td>
                        <td className="px-4 py-2.5 font-mono tabular-nums text-amber-300">{row.cost}</td>
                        <td className="px-4 py-2.5 text-zinc-400">{row.limit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {e.detail.shopNote && <p className="mt-3 text-xs text-zinc-500">{e.detail.shopNote}</p>}
            </>
          )}

          {e.detail?.traders && (
            <p className="mt-6 text-xs leading-5 text-zinc-500">
              <strong className="text-zinc-400">Event traders:</strong> {e.detail.traders}
            </p>
          )}

          {e.detail?.patchContext && (
            <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Patch context (Oct 14)</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-5 text-zinc-400">
                {e.detail.patchContext.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ))}

      <p className="mt-12 text-xs text-zinc-600">
        Expired coupon codes and the redemption path live on the{' '}
        <Link href="/codes/" className="text-sky-400 hover:text-sky-300">
          redeem codes board
        </Link>
        .
      </p>
    </div>
  );
}
