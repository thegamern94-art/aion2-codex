import type { MetaBuildData, MetaRow, MetaSkill } from '@/types/game';
import { withBase } from '@/lib/asset';

function Icon({ src, size = 28 }: { src: string | null; size?: number }) {
  if (!src) return <span className="inline-block rounded bg-zinc-800" style={{ width: size, height: size }} />;
  return <img src={withBase(src)} alt="" width={size} height={size} className="rounded" loading="lazy" />;
}

function Pct({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <span className="font-mono text-[11px] text-zinc-500">
      {label} <span className="text-zinc-300">{value}</span>
    </span>
  );
}

function SkillChips({ list }: { list: MetaSkill[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {list.map((s, i) => (
        <span
          key={`${s.name}-${i}`}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-sm text-zinc-200"
          title={s.meta ?? undefined}
        >
          {s.order != null && (
            <span className="font-mono text-[10px] font-bold text-amber-400">{s.order}</span>
          )}
          <Icon src={s.icon} size={22} />
          {s.name}
        </span>
      ))}
    </div>
  );
}

function MetaTable({ rows, cols }: { rows: MetaRow[]; cols: { key: keyof MetaRow; label: string }[] }) {
  if (rows.length === 0) return <p className="mt-2 text-xs text-zinc-600">No data captured for this section.</p>;
  return (
    <div className="mt-3 overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full min-w-[420px] text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/80 text-left text-xs uppercase tracking-wider text-zinc-400">
            <th className="px-3 py-2 font-medium">Name</th>
            {cols.map((c) => (
              <th key={String(c.key)} className="px-3 py-2 font-medium">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={`${r.name}-${i}`} className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-900/40">
              <td className="px-3 py-2">
                <span className="inline-flex items-center gap-2 text-zinc-200" title={r.tip ?? undefined}>
                  <Icon src={r.icon} size={22} />
                  {r.name}
                </span>
              </td>
              {cols.map((c) => (
                <td key={String(c.key)} className="px-3 py-2 font-mono text-xs tabular-nums text-zinc-300">
                  {r[c.key] ? String(r[c.key]) : '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MetaBuild({ meta }: { meta: MetaBuildData }) {
  return (
    <div className="space-y-10">
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">Skill leveling order</h3>
        <p className="mt-1 text-xs text-zinc-500">
          Where top KR players push skill points first (level 20+ priority). Rings add +1 to some skills.
        </p>
        <SkillChips list={meta.skillOrder} />
        {meta.ringSkills.length > 0 && (
          <>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-zinc-500">Look for these on rings</p>
            <SkillChips list={meta.ringSkills} />
          </>
        )}
        {meta.specialties.length > 0 && (
          <>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Skill specialties to take
            </p>
            <SkillChips list={meta.specialties} />
          </>
        )}
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
          Passives raised by gear
        </h3>
        <p className="mt-1 text-xs text-zinc-500">
          Armor, necklaces and earrings add +1 to some passives — the share of top players whose pieces raise them.
        </p>
        <MetaTable
          rows={meta.passives}
          cols={[
            { key: 'pve', label: 'PvE' },
            { key: 'pvp', label: 'PvP' },
            { key: 'global', label: 'Global avg' },
          ]}
        />
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">Stigma picks</h3>
        <p className="mt-1 text-xs text-zinc-500">Share of top KR players running each stigma, PvE vs PvP.</p>
        <MetaTable
          rows={meta.stigmas}
          cols={[
            { key: 'pve', label: 'PvE' },
            { key: 'pvp', label: 'PvP' },
            { key: 'global', label: 'Global avg' },
          ]}
        />
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">Wings</h3>
        <p className="mt-1 text-xs text-zinc-500">
          Wings available in the global client, ranked by top-player usage. Hover a name for its stats.
        </p>
        <MetaTable
          rows={meta.wings}
          cols={[
            { key: 'pve', label: 'PvE' },
            { key: 'pvp', label: 'PvP' },
          ]}
        />
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
          Stat &amp; manastone priority
        </h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {meta.statPriority.map((s) => (
            <div key={s.slot} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{s.slot}</p>
              <p className="mt-2 text-xs leading-5 text-zinc-300">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {meta.titles.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">Titles</h3>
          <p className="mt-1 text-xs text-zinc-500">
            One attack, one defense and one utility title. Hover for the effect.
          </p>
          <MetaTable rows={meta.titles} cols={[{ key: 'effect', label: 'Effect' }]} />
        </section>
      )}

      <p className="text-[11px] leading-4 text-zinc-600">
        Data adapted from{' '}
        <a href="https://aion2-meta.com" target="_blank" rel="noreferrer" className="text-sky-400 hover:text-sky-300">
          aion2-meta.com
        </a>{' '}
        — KR top-player builds (AION2CAL) plus NCSOFT official Global profiles, snapshot Oct 2026. Icons
        are game assets © NCSOFT. Re-verify after balance patches.
      </p>
    </div>
  );
}
