'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  CornerDownLeft,
  Gift,
  Info,
  Search,
  Skull,
  Swords,
  Wrench,
} from 'lucide-react';
import { buildSearchIndex, scoreEntry, type SearchEntry, type SearchType } from '@/lib/search-index';

const TYPE_ICON: Record<SearchType, typeof Swords> = {
  class: Swords,
  dungeon: Skull,
  guide: BookOpen,
  system: Info,
  tool: Wrench,
  codes: Gift,
};

export default function CmdKSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const index = useMemo(buildSearchIndex, []);

  const results = useMemo(() => {
    return index
      .map((e) => ({ e, s: scoreEntry(e, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((x) => x.e);
  }, [index, q]);

  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'k') {
        ev.preventDefault();
        setOpen((o) => !o);
      }
      if (ev.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQ('');
      setSel(0);
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  function go(entry: SearchEntry) {
    setOpen(false);
    router.push(entry.href);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
        aria-label="Search (Cmd+K)"
      >
        <Search className="h-3.5 w-3.5" aria-hidden />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-zinc-700 bg-zinc-800 px-1 font-mono text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-[12vh] backdrop-blur-sm"
          onMouseDown={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 shadow-card"
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Site search"
          >
            <div className="flex items-center gap-2 border-b border-zinc-800 px-4">
              <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setSel(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSel((s) => Math.min(s + 1, results.length - 1));
                  }
                  if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSel((s) => Math.max(s - 1, 0));
                  }
                  if (e.key === 'Enter' && results[sel]) go(results[sel]);
                }}
                placeholder="Search classes, dungeons, guides…"
                className="h-12 w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
              />
              <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 font-mono text-[10px] text-zinc-500">
                esc
              </kbd>
            </div>
            <ul className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-zinc-500">No results for “{q}”</li>
              )}
              {results.map((r, i) => {
                const Icon = TYPE_ICON[r.type];
                return (
                  <li key={r.href + r.title}>
                    <button
                      onMouseEnter={() => setSel(i)}
                      onClick={() => go(r)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${
                        i === sel ? 'bg-zinc-800/80' : ''
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-amber-400" aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-zinc-100">{r.title}</span>
                        <span className="block truncate text-xs text-zinc-500">{r.subtitle}</span>
                      </span>
                      {i === sel && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
