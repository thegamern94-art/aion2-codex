import type { GuideMeta } from '@/types/game';

// Central manifest for guide metadata. To publish a new guide:
//   1. Create content/guides/<category>/<slug>.mdx
//   2. Add its entry here (title, description, updated, faq)
//   3. Import the MDX module in app/guides/[category]/[slug]/page.tsx (CONTENT map)
// Routes, sitemap, search and JSON-LD all derive from this list.

export const GUIDES: GuideMeta[] = [
  {
    category: 'progression',
    slug: 'gear-transfer-ilvl-70-guide',
    title: 'Gear Transfer & the ilvl 70 Keeper Rule',
    description:
      'How Gear Transfer works in AION 2: what moves (Enhancement, Soul Binding, Amplification), what is lost (Potential, Manastones, Theostones), and why item level 70 is the community’s first keeper tier.',
    updated: '2026-10-17',
    readingMinutes: 6,
    faq: [
      {
        q: 'What is the ilvl 70 rule for Gear Transfer in AION 2?',
        a: 'ilvl 70 is not a named in-game rule — it is community shorthand for the first keeper gear tier (Urugugu Aulamus weapons, Vakron armor, crafted T1.5 sets). Soul-binding lines transfer as a percentage of the item’s max roll, so the same line is worth more on an ilvl 70 base — investment is safe there and largely wasted on lower tiers.',
      },
      {
        q: 'What does Gear Transfer actually carry over?',
        a: 'Enhancement level and Soul Binding lines transfer (plus Amplification per community guides). Potential rolls, Manastones, Theostones and the Philosopher’s Stone line are lost. The donor item is consumed, transfer unlocks at character level 45, and both items must be soul-bound to the same character.',
      },
      {
        q: 'Can I transfer into any piece of gear?',
        a: 'No — the destination cannot already have a fixed Soul Binding. Line counts follow fixed rules: 4→5 lines rolls the 5th line free, while 5→3 keeps only the first three. NCSoft has published no official rules page, so always read the preview window before confirming.',
      },
    ],
  },
  {
    category: 'survival',
    slug: 'space-time-rifts-abyss-survival',
    title: 'Space-Time Rifts: Windows, Loot & Survival',
    description:
      'Space-Time Rifts are cross-faction incursions every 3 hours — the only way into enemy territory. All eight windows, the PvP opt-in rules, the guard danger everyone underestimates, and how to get home with your loot.',
    updated: '2026-10-17',
    readingMinutes: 7,
    faq: [
      {
        q: 'When do Space-Time Rifts open?',
        a: 'Every 3 hours around the clock — commonly cited windows are 02:00, 05:00, 08:00, 11:00, 14:00, 17:00, 20:00 and 23:00 UTC (provisional — confirm against your in-game timer). The portal stays usable for 10 minutes, you can remain up to 1 hour, and each portal caps at 240 players.',
      },
      {
        q: 'Is the Space-Time Rift PvP-enabled?',
        a: 'PvP is opt-in: you cannot be attacked until you attack a player or a flagged target. The real dangers are enemy NPC guards — they can one-shot under-geared players — and death itself, which sends you back to your home continent.',
      },
      {
        q: 'What are the best rewards from Rifts?',
        a: 'The 7 regional quests per faction (green markers) are the best reward-per-minute: Kinah, Abyss Points and enhancement stones. The Rift is separate from the Abyss, but both feed the same PvP currency, so runs are usually stacked together.',
      },
    ],
  },
  {
    category: 'combat',
    slug: 'best-2-key-macros-all-classes',
    title: 'Best 2-Key Macro Slots for All 8 Classes',
    description:
      'AION 2 ships an official in-game Skill Macro editor: up to 4 skills per slot, hold-to-cycle, delay tuning. Copy-paste slot setups for Templar, Gladiator, Assassin, Ranger, Sorcerer, Spiritmaster, Cleric and Chanter — and what to keep manual.',
    updated: '2026-10-17',
    readingMinutes: 8,
    faq: [
      {
        q: 'Are macros allowed in AION 2?',
        a: 'Yes — AION 2 ships an official in-game Skill Macro editor: Skill menu (K) → Skill Macro. Register up to 4 skills per slot and hold the macro key to cycle through them. Third-party automation is not sanctioned; community reports describe bans for unauthorized tools.',
      },
      {
        q: 'How do I set up the macro key?',
        a: 'The macro key is unbound by default: enable it via Settings → Key Settings → General → Gameplay/Skill Macro. In the editor, the bottom slot is the highest priority — put the longest-cooldown skill first, and keep long-CD buffs, Stigmas, movement and defensive skills manual.',
      },
      {
        q: 'What delay should I use in macros?',
        a: 'Official setup guidance: about 10–20 ms delay on low ping, and 40–50 ms above roughly 80–100 ms ping. Also turn the separate Skill Queue option OFF while using macros so the two systems don’t fight each other.',
      },
    ],
  },
  {
    category: 'progression',
    slug: 'stigma-shards-ap-economy',
    title: 'Stigma & the AP Economy',
    description:
      'Stigma is the post-45 power gate: shard costs (1/2/4/8, ~75 to Lv 20), the AP-shop tiers, Festival and Nightmare sources, AP income (~104–127k/week measured), the 7-hour Abyss entry budget and the siege schedule.',
    updated: '2026-10-17',
    readingMinutes: 7,
    faq: [
      {
        q: 'How many Stigma Shards does one stigma need in AION 2?',
        a: 'Level bands cost 1 / 2 / 4 / 8 shards — roughly 75 shards to reach Lv 20 on a single stigma, with Superior Stigma Shards required beyond that. Learning is per ability-preset, so two presets double the cost.',
      },
      {
        q: 'Where do Stigma Shards come from?',
        a: '30 free shards from level-up rewards by 45, then the Abyss Trade Shop Growth tab (4 tiers × 50 shards for 10k/15k/20k/25k AP — ~200 shards per character), plus 35 from the Festival Shop (300 Centuryroot) and 35 from the Nightmare Shop (1,500 Phantasmal Fragments).',
      },
      {
        q: 'What is the fastest way to farm Abyss Points?',
        a: 'Duties (~1,000 AP × 5/day), Arena of Solitude/Cooperation (~10/week) and above all Abyss Sieges (~45,000 AP bursts) on Monday/Thursday/Saturday at 12:00 UTC. Community measurement at 45: ~104,000–127,500 AP per week.',
      },
    ],
  },
  {
    category: 'gear',
    slug: 'manastones-socketing-guide',
    title: 'Manastones, Soulstones & Theostones',
    description:
      'The whole socketing pipeline: the three stone families, socket capacity by grade, merge odds (11.12% / 9.10%), the Superior-stone weekly cap, which stats never roll on stones, and how Alchemy feeds it all.',
    updated: '2026-10-17',
    readingMinutes: 6,
    faq: [
      {
        q: 'What are the merge odds for manastones in AION 2?',
        a: 'Rare → Epic merges succeed 11.12% of the time and Epic → Unique 9.10%. Stones consume on failure, and Superior stones are capped at 5 per week per character in the dungeon shop — plan merges around the cap.',
      },
      {
        q: 'Do manastones survive Gear Transfer?',
        a: 'No — manastones and soulstones do not transfer with the gear, and Theostones are destroyed on removal. Socket a transferred piece fresh; unsocket before donating anything you plan to keep.',
      },
      {
        q: 'Which stats should I socket per class?',
        a: 'Superior stones roll the premium multiplier lines (Damage Boost, Weapon/Crit Damage Boost, Front/Back Attack Damage Boost) — positional amps lead for front-position melee and back-position burst. Full per-class orders live in each class’s Codex tab.',
      },
    ],
  },
  {
    category: 'economy',
    slug: 'market-membership-explained',
    title: 'Market, Membership & the Daeva Pass, Explained',
    description:
      'The two economic gates: the Market requires the Special Quai Membership ($14.99/30d, server-bound, Odyle cap 840) and the Daeva Pass bills per character (1,500 Quna each). Plus the Oct 14 gathering-material listing restriction and Regular vs Bound Kinah.',
    updated: '2026-10-17',
    readingMinutes: 6,
    faq: [
      {
        q: 'Do you need membership to trade in AION 2?',
        a: 'Yes — listing on the Market and using the Quna Exchange require the Special Quai Membership ($14.99/30 days, server-bound). Player-to-player direct trades are disabled entirely, so membership is the only way to move value between players.',
      },
      {
        q: 'What does the Odyle cap increase actually give?',
        a: 'Membership raises the Odyle Energy cap from 560 to 840 — +50% dungeon reward throughput for players who actually cap out. Regeneration is unchanged at +15 per 3 hours.',
      },
      {
        q: 'Is the Daeva Pass worth it for alts?',
        a: 'The Premium pass costs 1,500 Quna PER CHARACTER for Season 1 (ends Dec 16, 2026) — buy it on your most-played character and only if you will reach the reward tiers. Ranking titles carry no stats.',
      },
    ],
  },
];

export function guideHref(g: GuideMeta): string {
  return `/guides/${g.category}/${g.slug}/`;
}
