'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function MacroCopyBox({
  name,
  keys,
  lines,
  useCase,
}: {
  name: string;
  keys: string[];
  lines: string[];
  useCase?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — user can still select the text
    }
  }

  return (
    <div className="my-5 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/60">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-2.5">
        <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm">
          <span className="font-medium text-zinc-200">{name}</span>
          <span className="flex gap-1">
            {keys.map((k) => (
              <kbd
                key={k}
                className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 font-mono text-[11px] text-amber-300"
              >
                {k}
              </kbd>
            ))}
          </span>
        </div>
        <button
          onClick={copy}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition ${
            copied
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
              : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100'
          }`}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {useCase && <p className="px-4 pt-2 text-xs leading-5 text-zinc-500">{useCase}</p>}
      <pre className="overflow-x-auto px-4 pb-3 pt-1 font-mono text-xs leading-5 text-zinc-300">
        {lines.join('\n')}
      </pre>
    </div>
  );
}
