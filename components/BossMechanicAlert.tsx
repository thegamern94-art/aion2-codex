import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function BossMechanicAlert({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="my-6 rounded-lg border border-amber-500/40 bg-amber-500/5 p-4">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
        <AlertTriangle className="h-4 w-4" aria-hidden />
        {title}
      </p>
      <div className="mt-2 text-sm leading-6 text-zinc-300 [&_a]:text-sky-400 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}
