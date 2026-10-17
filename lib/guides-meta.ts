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
];

export function guideHref(g: GuideMeta): string {
  return `/guides/${g.category}/${g.slug}/`;
}
