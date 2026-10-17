import Link from 'next/link';
import { Swords } from 'lucide-react';
import { SITE } from '@/lib/site';

const LINKS = [
  { href: '/classes/', label: 'Classes' },
  { href: '/dungeons/', label: 'Dungeons & Raids' },
  { href: '/tools/gear-check/', label: 'Gear Check' },
  { href: '/tools/enhancement/', label: 'Enhancement Calculator' },
  { href: '/checklist/', label: 'Weekly Checklist' },
  { href: '/guides/', label: 'Guides' },
  { href: '/roadmap/', label: 'Roadmap' },
  { href: '/codes/', label: 'Redeem Codes' },
];

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="flex items-center gap-2 font-semibold tracking-tight text-zinc-200">
            <Swords className="h-4 w-4 text-amber-400" aria-hidden />
            {SITE.name}
          </p>
          <p className="mt-2 max-w-md text-xs leading-5 text-zinc-500">
            Fan-made database and guide hub for the AION 2 Global PC build. Not affiliated with or
            endorsed by NCSOFT. Data current as of {SITE.updated} — verify critical values in game.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Footer">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-zinc-400 hover:text-amber-300">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
