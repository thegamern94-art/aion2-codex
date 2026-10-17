# AION 2 Codex

A fast, programmatic MMO guide, build planner and database web app for **AION 2 (Global PC build, live since Oct 5, 2026)** — built to be published on **GitHub Pages** as a fully static site.

![Stack](https://img.shields.io/badge/Next.js-15-black) ![Static](https://img.shields.io/badge/Output-static%20export-black) ![License](https://img.shields.io/badge/content-fan%20project-orange)

## Features

- **Live reset header** — daily/weekly reset countdowns (07:00 UTC anchor, Wednesday weekly), Space-Time Rift windows (every 3 h), and the active seasonal event (Halloween "Trick or Treat", Oct 14 – Nov 4 2026).
- **8-class build matrix** (`/classes`) — filter by Role, Difficulty and Meta Tier (PvE / 10-man Raid / Abyss PvP), with per-class tabbed pages: Overview, Skill Chains & 2-Key Macros, Arcana & Daevanion priority, Gear Progression.
- **Expedition & raid readiness checker** (`/tools/gear-check`) — pick any expedition (1★–4★+) or 10-man Sanctuary raid, enter your Gear Score, get an instant verdict plus a "30-Second Boss Cheat Sheet" and the Gear Transfer (ilvl 70 keeper) rules.
- **MDX component kit** — `<BossMechanicAlert />`, `<MacroCopyBox />`, `<SkillTooltip />`, `<GearGateTable />`.
- **Cmd+K search** — instant client-side palette across classes, dungeons, guides, systems and codes.
- **Programmatic SEO** — `sitemap.xml`, `robots.txt`, per-page metadata, JSON-LD `FAQPage` + `Article` schema.
- **Redeem codes board** (`/codes`) — statuses, redemption path, scam warnings.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, TypeScript, `output: 'export'`) |
| Styling | Tailwind CSS 3 + lucide-react (dark, high-contrast, line-art accents) |
| Content | Local MDX in `content/guides/**` + typed JSON DBs in `data/` (schemas in `types/game.ts`) |
| Search | Client-side Cmd+K palette (no server, no index service) |
| Hosting | GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`) |

## Quickstart

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production static build → out/
```

Build with a basePath (simulates GitHub Pages project-site hosting):

```bash
NEXT_PUBLIC_BASE_PATH=/aion2-codex NEXT_PUBLIC_SITE_URL=https://yourname.github.io npm run build
```

## Publishing to GitHub Pages

1. Create the repo and push:
   ```bash
   gh auth login
   gh repo create aion2-codex --public --source . --push
   ```
2. Enable Pages with the Actions source (one-time):
   ```bash
   gh api repos/<owner>/aion2-codex/pages -X POST -f build_type=workflow
   ```
   (Or: repo **Settings → Pages → Source: GitHub Actions**.)
3. Push to `main` (or run the workflow manually via **Actions → Deploy to GitHub Pages → Run workflow**). The workflow builds with `NEXT_PUBLIC_BASE_PATH=/<repo-name>` and deploys the `out/` artifact.
4. Using the special `<owner>.github.io` repo instead? The workflow detects it and builds **without** a basePath.

## Editing content

- **Add a guide:** create `content/guides/<category>/<slug>.mdx`, then register it in `lib/guides-meta.ts` (metadata + FAQ) and in the `CONTENT` map in `app/guides/[category]/[slug]/page.tsx`. Routes, sitemap, search and JSON-LD derive automatically.
- **Tune class data:** edit `data/classes.json` (validated by `types/game.ts`). Skill tooltip IDs follow `<class-slug>-<slugified-chain-name>`.
- **Tune dungeons/gates:** edit `data/dungeons.json` — `gates` holds the client-extracted Exploration/Conquest/Hard values, `ilvlGate` is the headline Gear Score gate.
- **Reset times & rift windows:** `data/systems.json` (all UTC "HH:MM"). The header timers react instantly.

## Data provenance & honesty rules

Data was researched on **Oct 17, 2026** (Global build, ~2 weeks after launch) and cross-checked against game8, Mobalytics (Oct 15, 2026 snapshots), BlueStacks, metabot.gg (client-extracted values) and community trackers. Where sources disagree (expedition gates, tier-list philosophy), the site says so instead of averaging. Entries with no English documentation (e.g. several 4★+ dungeon mechanics) are labeled as such rather than invented. Tier lists shift fast at launch — re-verify weekly.

This is a **fan project** — not affiliated with or endorsed by NCSOFT. AION 2 and all related marks belong to NCSOFT Corporation.

## Third-party data & icon attribution

- **Daevanion board data, skill/stigma/wings tables and game icons** are adapted from [aion2-meta.com](https://aion2-meta.com), which builds on AION2CAL Korean ranking data and NCSOFT official Global profiles (snapshot October 2026).
- **Class portraits** and the Skill Specializations documentation are adapted from [daevaguides.com](https://daevaguides.com).
- All game art and icons are property of NCSOFT; they are used here for identification in a non-commercial fan guide. Board layouts reflect the Global client — KR layouts may differ.
