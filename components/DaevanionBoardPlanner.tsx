'use client';

import { useEffect, useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import type { DaevaNode, DaevanionData } from '@/types/game';
import { withBase } from '@/lib/asset';

const TYPE_LABELS: Record<string, string> = {
  'node-common': 'Stat (1 crystal)',
  'node-rare': 'Passive skill level (2)',
  'node-legend': 'Active skill level (3)',
  'node-unique': 'Special (4)',
  'node-start': 'Board start',
};

function iconKey(icon: string): string {
  const file = icon.split('/').pop() ?? '';
  return file.replace('.webp', '');
}

export default function DaevanionBoardPlanner({ slug, data }: { slug: string; data: DaevanionData }) {
  const [boardIdx, setBoardIdx] = useState(0);
  const [spent, setSpent] = useState(0);
  const [selected, setSelected] = useState<DaevaNode | null>(null);
  const [mounted, setMounted] = useState(false);

  const board = data.boards[boardIdx];
  const total = board.totalCrystals ?? 0;
  const vb = board.viewBox.split(' ').map(Number);
  const vbW = vb[2] || 528;
  const vbH = vb[3] || 528;

  const storageKey = `codex:daeva:${slug}:${boardIdx}`;

  // Load persisted progress per class+board
  useEffect(() => {
    const raw = localStorage.getItem(`codex:daeva:${slug}:${boardIdx}`);
    const n = raw ? parseInt(raw, 10) : 0;
    setSpent(Number.isFinite(n) ? Math.max(0, Math.min(n, board.totalCrystals ?? 0)) : 0);
    setSelected(null);
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, boardIdx]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(storageKey, String(spent));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spent, mounted, storageKey]);

  const litCount = useMemo(
    () => board.nodes.filter((n) => spent >= n.spent).length,
    [board, spent],
  );

  const legend = useMemo(() => {
    const seen = new Set<string>();
    for (const n of board.nodes) seen.add(iconKey(n.icon));
    return [...seen].filter((k) => TYPE_LABELS[k]);
  }, [board]);

  function pick(node: DaevaNode) {
    setSelected(node);
  }

  return (
    <div>
      {/* Board tabs */}
      <div className="flex flex-wrap gap-2">
        {data.boards.map((b, i) => (
          <button
            key={b.name}
            onClick={() => setBoardIdx(i)}
            aria-pressed={i === boardIdx}
            className={
              i === boardIdx
                ? 'rounded-lg border border-amber-500/60 bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-300'
                : 'rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
            }
          >
            {b.name}{' '}
            <small className="ml-1 font-mono text-[11px] text-zinc-500">{b.totalCrystals} crystals</small>
          </button>
        ))}
      </div>

      {/* Board intro + budget */}
      <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <p className="text-sm text-zinc-300">
          This board opens at character level{' '}
          <span className="font-mono text-amber-300">{board.unlockLevel ?? '—'}</span>. Completing it
          takes <span className="font-mono text-amber-300">{board.totalCrystals}</span> Daevanion
          Crystals.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="text-xs text-zinc-500">
            Daevanion Crystals spent:{' '}
            <span className="font-mono tabular-nums text-zinc-200">
              {spent} / {total}
            </span>
          </span>
          <input
            type="range"
            min={0}
            max={total}
            value={spent}
            onChange={(e) => setSpent(parseInt(e.target.value, 10))}
            className="h-1.5 min-w-40 flex-1 cursor-pointer accent-amber-400"
            aria-label="Daevanion crystals spent"
          />
          <button
            onClick={() => setSpent(0)}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:border-zinc-600"
          >
            <RotateCcw className="h-3 w-3" aria-hidden /> Reset
          </button>
        </div>
        <p className="mt-2 text-[11px] text-zinc-600">
          {litCount} of {board.nodes.length} nodes open at {spent} crystals — drag to see how far a
          given budget gets you.
        </p>
      </div>

      {/* Board */}
      <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950/60 p-2">
        <svg
          viewBox={board.viewBox}
          role="img"
          aria-label={`${board.name} board`}
          className="mx-auto h-auto w-full"
          style={{ maxWidth: vbW, maxHeight: vbH * 1.6 }}
        >
          <path d={board.links} stroke="#3f3f46" strokeWidth={2} fill="none" strokeLinecap="round" />
          {board.nodes.map((n, i) => {
            const lit = spent >= n.spent;
            const isStart = n.order === null;
            const isSelected = selected?.order != null && selected.order === n.order;
            return (
              <g
                key={i}
                transform={`translate(${n.x} ${n.y})`}
                onClick={() => pick(n)}
                style={{ cursor: 'pointer' }}
                opacity={lit || isStart ? 1 : 0.32}
              >
                <image href={withBase(n.icon)} x={-22} y={-22} width={44} height={44} />
                {!isStart && n.order != null && (
                  <>
                    <circle
                      cx={12}
                      cy={12}
                      r={9.5}
                      fill={lit ? '#f59e0b' : '#18181b'}
                      stroke={lit ? '#fbbf24' : '#52525b'}
                      strokeWidth={1}
                    />
                    <text
                      x={12}
                      y={12}
                      dy=".36em"
                      textAnchor="middle"
                      fontSize={8.5}
                      fontWeight={700}
                      fill={lit ? '#18181b' : '#a1a1aa'}
                      style={{ pointerEvents: 'none' }}
                    >
                      {n.order}
                    </text>
                  </>
                )}
                {isSelected && (
                  <circle cx={0} cy={0} r={26} fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 3" />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected node detail */}
      <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-sm" aria-live="polite">
        {selected ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-semibold text-zinc-100">
              {selected.order != null ? `#${selected.order} · ` : ''}
              {selected.type}
            </span>
            <span className="text-zinc-300">{selected.gives}</span>
            {selected.cost != null && (
              <span className="font-mono text-xs text-amber-300">{selected.cost} crystal{selected.cost > 1 ? 's' : ''}</span>
            )}
            {selected.krShare && (
              <span className="text-xs text-zinc-500">{selected.krShare} of top KR players take it</span>
            )}
            {selected.order != null && spent < selected.spent && (
              <span className="text-xs text-zinc-500">
                opens when {selected.spent} crystals are spent
              </span>
            )}
          </div>
        ) : (
          <p className="text-xs text-zinc-500">
            Click a node to see what it gives, its cost and how many top KR players take it.
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-zinc-500">
        {legend.map((k) => (
          <span key={k} className="inline-flex items-center gap-1.5">
            <img src={withBase(`/icons/${k}.webp`)} alt="" width={18} height={18} />
            {TYPE_LABELS[k]}
          </span>
        ))}
      </div>

      {/* First 12 */}
      {board.firstTwelve.length > 0 && (
        <details className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          <summary className="cursor-pointer text-sm font-medium text-zinc-200">
            First 12 nodes on {board.name}
          </summary>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-6 text-zinc-300">
            {board.firstTwelve.map((n, i) => (
              <li key={i}>
                <strong className="text-zinc-200">{n.type}</strong> — {n.gives}{' '}
                <em className="font-mono text-xs not-italic text-amber-300/90">{n.cost}</em>
              </li>
            ))}
          </ol>
        </details>
      )}

      <p className="mt-3 text-[11px] leading-4 text-zinc-600">
        Board layout, unlock order and pick rates adapted from{' '}
        <a href="https://aion2-meta.com" target="_blank" rel="noreferrer" className="text-sky-400 hover:text-sky-300">
          aion2-meta.com
        </a>{' '}
        (built from AION2CAL Korean ranking data). Global board layout; KR layouts differ. Game assets
        © NCSOFT. Progress is saved in your browser, per class and board.
      </p>
    </div>
  );
}
