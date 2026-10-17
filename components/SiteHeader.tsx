'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown, Swords } from 'lucide-react';
import CmdKSearch from './CmdKSearch';
import { useSchedule } from './use-schedule';

type NavLink = { href: string; label: string };
type NavItem = NavLink | { label: string; items: NavLink[] };

const NAV: NavItem[] = [
  { href: '/classes/', label: 'Classes' },
  { href: '/dungeons/', label: 'Dungeons' },
  {
    label: 'Tools',
    items: [
      { href: '/tools/gear-check/', label: 'Gear Check' },
      { href: '/tools/enhancement/', label: 'Enhancement Calculator' },
      { href: '/checklist/', label: 'Weekly Checklist' },
    ],
  },
  { href: '/guides/', label: 'Guides' },
  {
    label: 'Systems',
    items: [
      { href: '/arcana/', label: 'Arcana Codex' },
      { href: '/kinah/', label: 'Kinah Hub' },
      { href: '/roadmap/', label: 'Roadmap' },
      { href: '/events/', label: 'Events' },
      { href: '/codes/', label: 'Redeem Codes' },
    ],
  },
];

const ALL_LINKS: NavLink[] = NAV.flatMap((n) => ('href' in n ? [n] : n.items));

function TimerChip({
  label,
  value,
  className = '',
}: {
  label: string;
  value?: string | null;
  className?: string;
}) {
  if (value === null) return null;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 font-mono tabular-nums text-zinc-500 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" aria-hidden />
      {label}
      <span className="text-zinc-200">{value ?? '--:--:--'}</span>
    </span>
  );
}

export default function SiteHeader() {
  const pathname = usePathname() ?? '/';
  const schedule = useSchedule();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Close dropdowns on navigation
  useEffect(() => {
    setOpenMenu(null);
  }, [pathname]);

  const isActive = (href: string) => {
    const base = href.replace(/\/$/, '');
    return base === '/' ? pathname === '/' : pathname.startsWith(base);
  };

  const groupActive = (items: NavLink[]) => items.some((i) => isActive(i.href));

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-zinc-100"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded border border-amber-500/50 bg-amber-500/10">
            <Swords className="h-4 w-4 text-amber-400" aria-hidden />
          </span>
          <span>
            AION 2 <span className="text-amber-400">Codex</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) =>
            'href' in item ? (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={
                  isActive(item.href)
                    ? 'rounded-md bg-zinc-800/80 px-3 py-1.5 text-sm text-zinc-100'
                    : 'rounded-md px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }
              >
                {item.label}
              </Link>
            ) : (
              <div key={item.label} className="relative">
                <button
                  onClick={() => setOpenMenu((o) => (o === item.label ? null : item.label))}
                  onMouseEnter={() => setOpenMenu(item.label)}
                  aria-expanded={openMenu === item.label}
                  className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition ${
                    groupActive(item.items)
                      ? 'bg-zinc-800/80 text-zinc-100'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                </button>
                {openMenu === item.label && (
                  <div
                    onMouseLeave={() => setOpenMenu(null)}
                    className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg border border-zinc-700 bg-zinc-950 p-1.5 shadow-card"
                  >
                    {item.items.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        aria-current={isActive(sub.href) ? 'page' : undefined}
                        className={
                          isActive(sub.href)
                            ? 'block rounded-md bg-zinc-800/80 px-3 py-2 text-sm text-amber-300'
                            : 'block rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                        }
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ),
          )}
        </nav>

        <CmdKSearch />
      </div>

      {/* Live reset timers */}
      <div className="border-t border-zinc-800/60 bg-zinc-900/30">
        <div className="mx-auto flex max-w-6xl items-center gap-4 overflow-x-auto px-4 py-1.5 text-xs sm:px-6">
          <TimerChip label="EU reset" value={schedule?.eu} />
          <TimerChip label="NA reset" value={schedule?.na} />
          <TimerChip label="Weekly" value={schedule?.weekly} className="hidden sm:inline-flex" />
          <TimerChip label="Rift" value={schedule?.rift} />
          <TimerChip label="Siege" value={schedule?.siege} className="hidden lg:inline-flex" />
          {schedule?.event && (
            <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-medium text-amber-300 md:inline-flex">
              <span aria-hidden>🎃</span>
              {schedule.event.name} · {schedule.event.label} {schedule.event.countdown}
            </span>
          )}
        </div>
      </div>

      {/* Mobile primary nav — flattened */}
      <nav
        className="flex gap-1 overflow-x-auto border-t border-zinc-800/60 px-4 py-1.5 md:hidden"
        aria-label="Primary mobile"
      >
        {ALL_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? 'page' : undefined}
            className={
              isActive(item.href)
                ? 'whitespace-nowrap rounded-md bg-zinc-800/80 px-3 py-1 text-xs text-zinc-100'
                : 'whitespace-nowrap rounded-md px-3 py-1 text-xs text-zinc-400'
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
