import type { Metadata } from 'next';
import Link from 'next/link';
import EnhancementCalculator from '@/components/EnhancementCalculator';
import { ENHANCEMENT } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Enhancement Calculator — Expected Attempts & Cost',
  description:
    'AION 2 Unique enhancement calculator: expected attempts, Enhance Stones and Kinah for +0→+15 with real success rates (65/50/35/25/20%), +5%-per-fail pity and hard caps — plus Amplified (+15→+20) and Potential modes. Global-labeled, community-derived rates.',
};

export default function EnhancementPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Interactive Tool</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">Enhancement Calculator</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
        Pick a tier and a target — the model uses the documented success rates with the{' '}
        <strong className="text-zinc-300">+5%-per-fail soft pity</strong> (which is exactly why the
        hard caps 8/11/14/16/17 guarantee success) to compute expected attempts, then multiplies by
        per-attempt cost anchors. Pair it with the{' '}
        <Link href="/guides/progression/gear-transfer-ilvl-70-guide/" className="text-sky-400 hover:text-sky-300">
          Gear Transfer guide
        </Link>{' '}
        before you invest.
      </p>
      <div className="mt-8">
        <EnhancementCalculator data={ENHANCEMENT} />
      </div>
    </div>
  );
}
