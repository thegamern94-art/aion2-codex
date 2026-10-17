import { SKILL_BY_ID } from '@/lib/skills';

// CSS-only hover tooltip — rendered at build time from the class database.
// Usage in MDX: <SkillTooltip id="templar-aegis-protocol" />
export default function SkillTooltip({ id, label }: { id: string; label?: string }) {
  const skill = SKILL_BY_ID.get(id);
  if (!skill) return <span className="text-zinc-200">{label ?? id}</span>;

  return (
    <span className="group relative inline-block cursor-help align-baseline">
      <span className="border-b border-dotted border-amber-400/70 text-amber-300">{label ?? skill.name}</span>
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-full left-1/2 z-30 mb-2 w-72 max-w-[80vw] -translate-x-1/2 rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-left opacity-0 shadow-card transition group-hover:visible group-hover:opacity-100"
      >
        <span className="block text-xs font-semibold uppercase tracking-wider text-amber-400">{skill.name}</span>
        <span className="mt-0.5 block text-[11px] text-zinc-500">
          {skill.className} · skill chain
        </span>
        <span className="mt-2 block text-xs leading-5 text-zinc-300">{skill.description}</span>
        {skill.steps.length > 0 && (
          <span className="mt-2 block space-y-1 text-[11px] leading-5 text-zinc-400">
            {skill.steps.slice(0, 4).map((s, i) => (
              <span key={i} className="block">
                {i + 1}. {s}
              </span>
            ))}
          </span>
        )}
      </span>
    </span>
  );
}
