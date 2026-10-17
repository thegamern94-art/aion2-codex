'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { RoadmapStage } from '@/types/game';

// "What to do now?" — enter level + Gear Score, get the matching roadmap stage.
// Static-site friendly: no API, pure client math over the roadmap data.
export default function WhatNow({ stages }: { stages: RoadmapStage[] }) {
  const [level, setLevel] = useState(45);
  const [gs, setGs] = useState(750);

  const stageId = (() => {
    if (level < 45) return 'leveling';
    if (gs < 1200) return 'fresh45';
    if (gs < 1900) return 'keepers70';
    if (gs < 2600) return 'mid86';
    return 'endgame';
  })();

  const stage = stages.find((s) => s.id === stageId) ?? stages[0];

  return (
    <div className="card-corners rounded-lg border border-amber-500/30 bg-amber-500/5 p-6">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-100">What to do now?</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Enter where you are — the roadmap jumps to your stage.
      </p>
      <div className="mt-4 flex flex-wrap gap-4">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-zinc-500">Character level</span>
          <input
            type="number"
            min={1}
            max={45}
            value={level}
            onChange={(e) => setLevel(Math.max(1, Math.min(45, parseInt(e.target.value, 10) || 1)))}
            className="mt-1 w-32 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 outline-none focus:border-amber-500/60"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-zinc-500">Gear Score</span>
          <input
            type="number"
            min={0}
            value={gs || ''}
            onChange={(e) => setGs(Math.max(0, parseInt(e.target.value, 10) || 0))}
            placeholder="e.g. 1400"
            className="mt-1 w-32 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 outline-none focus:border-amber-500/60"
          />
        </label>
      </div>

      {stage && (
        <div className="mt-5 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
          <p className="text-sm font-semibold text-amber-300">{stage.title}</p>
          <p className="mt-1 font-mono text-[11px] text-zinc-500">{stage.range}</p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">{stage.summary}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs leading-5 text-zinc-400">
            {stage.actions.slice(0, 3).map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
          {stage.link && (
            <Link
              href={stage.link.href}
              className="mt-3 inline-flex text-xs text-sky-400 underline-offset-2 hover:text-sky-300 hover:underline"
            >
              {stage.link.label} →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
