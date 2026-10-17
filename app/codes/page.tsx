import { CODES } from '@/lib/data';
import type { CodeStatus } from '@/types/game';

export const metadata = {
  title: 'Redeem Codes — Coupons & Freebies',
  description:
    'Active and recently expired AION 2 Global redeem codes, where to enter them, and what they drop. Updated regularly — statuses reflect the last check.',
};

const STATUS_STYLE: Record<CodeStatus, string> = {
  active: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
  expired: 'border-zinc-700 bg-zinc-800/60 text-zinc-500',
  unknown: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
};

function StatusPill({ status }: { status: CodeStatus }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ${STATUS_STYLE[status]}`}>
      {status}
    </span>
  );
}

export default function CodesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Freebies</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">Redeem Codes</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
        Coupon codes land from livestreams, compensation mailings and seasonal events — and they
        expire fast. Statuses below reflect the last check on {CODES.updated}.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">How to redeem</h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-6 text-zinc-300">
          {CODES.howTo.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">Code board</h2>
        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 text-left text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-4 py-2.5 font-medium">Code</th>
                <th className="px-4 py-2.5 font-medium">Reward</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Checked</th>
              </tr>
            </thead>
            <tbody>
              {CODES.codes.map((c) => (
                <tr key={c.code} className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-900/40">
                  <td className="px-4 py-2.5">
                    <code className="rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-xs text-amber-300">
                      {c.code}
                    </code>
                  </td>
                  <td className="px-4 py-2.5 text-zinc-300">{c.reward}</td>
                  <td className="px-4 py-2.5">
                    <StatusPill status={c.status} />
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-zinc-500">{c.added}</td>
                </tr>
              ))}
              {CODES.codes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-zinc-500">
                    No codes tracked yet — check back after the next livestream or event.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs leading-5 text-zinc-600">
          “Unknown” means the code was published but not yet verified by the community. Codes are
          case-sensitive and usually region-locked to Global servers.
        </p>
      </section>
    </div>
  );
}
