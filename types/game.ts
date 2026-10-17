// Shared game data schemas for AION 2 Codex.
// These types mirror the JSON databases in /data.

export type Role = 'Tank' | 'Melee DPS' | 'Ranged DPS' | 'Magic DPS' | 'Healer' | 'Support';
export type MetaTier = 'S' | 'A' | 'B' | 'C';
export type ContentTier = '1-star' | '2-star' | '3-star' | '4-star+' | 'Raid';

export interface TierRatings {
  /** PvE expeditions (1–3 star) */
  pve: MetaTier;
  /** 10-man raids */
  raid: MetaTier;
  /** Abyss PvP */
  pvp: MetaTier;
}

export interface SkillChain {
  name: string;
  keys: string[];
  description: string;
  steps: string[];
  tips: string[];
}

export interface Macro {
  name: string;
  keys: [string, string];
  lines: string[];
  useCase: string;
}

export interface PriorityGuide {
  priority: string[];
  notes: string;
}

export interface GearStage {
  stage: string;
  ilvl: string;
  focus: string;
  notes: string;
}

export interface ClassInfo {
  slug: string;
  name: string;
  role: Role;
  weapons: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  tiers: TierRatings;
  tagline: string;
  overview: string;
  playstyle: string;
  strengths: string[];
  weaknesses: string[];
  skillChains: SkillChain[];
  macros: Macro[];
  arcana: PriorityGuide;
  daevanion: PriorityGuide;
  gearProgression: GearStage[];
  /** Phase 2: deep-dive codex content (optional until populated) */
  codex?: ClassCodex;
}

export interface BossCheat {
  name: string;
  tldr: string[];
}

export interface Dungeon {
  slug: string;
  name: string;
  tier: ContentTier;
  kind: 'expedition' | 'raid';
  /** Party size range, e.g. "1–5" or "10" */
  players: string;
  /** Headline entry gate (Gear Score, Conquest tier) */
  ilvlGate: number;
  /** Full gate table from the client, where documented */
  gates?: { exploration: string; conquest: string; hard?: string };
  bosses: BossCheat[];
  rewards: string[];
  transferNote?: string;
}

export interface ResetConfig {
  label: string;
  /** "HH:MM" in UTC */
  utc: string;
  weekday?: string;
}

export interface EventInfo {
  name: string;
  /** ISO 8601 with timezone */
  start: string;
  end: string;
  summary: string;
  rewards?: string[];
  /** Rich detail for the events hub (optional) */
  detail?: EventDetail;
}

export interface EventDetail {
  coinMath?: { label: string; value: string }[];
  candyKeys?: string[];
  shop?: { item: string; cost: string; limit: string }[];
  shopNote?: string;
  traders?: string;
  patchContext?: string[];
}

export interface SiegeConfig {
  name: string;
  daysUtc: string[];
  timeUtc: string;
  durationMinutes: number;
  description?: string;
}

export interface GearTransferInfo {
  summary: string;
  rules: string[];
}

export interface SystemData {
  resets: {
    eu: ResetConfig;
    na: ResetConfig;
    weekly: ResetConfig;
  };
  rift: {
    name: string;
    description: string;
    windowsUtc: string[];
    durationMinutes: number;
  };
  events: EventInfo[];
  gearTransfer: GearTransferInfo;
  /** Phase 2: Abyss siege schedule (optional) */
  sieges?: SiegeConfig;
}

export type CodeStatus = 'active' | 'expired' | 'unknown';

export interface RedeemCode {
  code: string;
  reward: string;
  status: CodeStatus;
  added: string;
  source?: string;
}

export interface CodesData {
  updated: string;
  howTo: string[];
  codes: RedeemCode[];
}

export interface GuideFaq {
  q: string;
  a: string;
}

export interface GuideMeta {
  /** URL segment, e.g. "progression" */
  category: string;
  /** URL segment, e.g. "gear-transfer-ilvl-70-guide" */
  slug: string;
  title: string;
  description: string;
  /** ISO date */
  updated: string;
  readingMinutes: number;
  faq: GuideFaq[];
}

// ---------- Phase 2 ----------

export interface ClassCodex {
  statPriority: string[];
  gearRolls: string[];
  rotation: string[];
  pvpTips: string[];
  synergies: string[];
  consumables: string[];
  sourceNote?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  cap: string;
  scope: 'character' | 'server';
  category: 'dungeons' | 'raids' | 'trials' | 'pvp' | 'shops' | 'events';
  hint?: string;
}

export interface ChecklistCategory {
  id: string;
  label: string;
}

export interface ChecklistData {
  updated: string;
  categories: ChecklistCategory[];
  items: ChecklistItem[];
  odyne: { base: number; membership: number; regen: string };
  resetNote: string;
}

export interface EnhStep {
  label: string;
  /** null = guaranteed success (no rate) */
  rate: number | null;
  /** % pity added per failure at the same step */
  pityPerFail: number;
  /** attempts after which success is guaranteed (null = uncapped) */
  capAttempts: number | null;
}

export interface EnhTier {
  ilvl: number;
  label: string;
  stonesPerAttempt: number;
  kinahPerAttempt: number;
  estimated: boolean;
}

export interface EnhancementData {
  updated: string;
  /** +0 → +10 guaranteed block */
  guaranteedSteps: number;
  /** +10 → +15, can fail */
  uniqueSteps: EnhStep[];
  /** +15 → +20 Amplified, can fail */
  amplifySteps: EnhStep[];
  potential: { levels: number; apPerLevel: number; note: string };
  tiers: EnhTier[];
  notes: string[];
}

export interface ArcanaSet {
  name: string;
  pieces: string;
  effect: string;
  focus?: 'pve' | 'pvp' | 'defense';
}

export interface ArcanaData {
  updated: string;
  slots: string[];
  sets: ArcanaSet[];
  transmutation: { guaranteed1: string; guaranteed2: string; crystalSources: string[] };
  chaliceRoute: string[];
  statPriority: string[];
  caveats: string[];
}

export interface KinahSource {
  name: string;
  amount: string;
  currency: 'Regular' | 'Bound' | 'Both';
  cadence: string;
  note?: string;
}

export interface KinahData {
  updated: string;
  regularVsBound: string[];
  sources: KinahSource[];
  sinks: string[];
  altStrategy: string[];
}

export interface RoadmapStage {
  id: string;
  title: string;
  range: string;
  ilvl?: string;
  summary: string;
  actions: string[];
  link?: { href: string; label: string };
}

export interface RoadmapData {
  updated: string;
  stages: RoadmapStage[];
  altGuide: string[];
}

// ---------- Phase 3: Daevanion boards & meta build (scraped from aion2-meta.com) ----------

export interface DaevaNode {
  x: number;
  y: number;
  spent: number;
  gives: string;
  order: number | null;
  type: string;
  icon: string;
  cost: number | null;
  krShare: string | null;
  variant: string;
}

export interface DaevaBoard {
  name: string;
  unlockLevel: number | null;
  totalCrystals: number | null;
  viewBox: string;
  links: string;
  nodes: DaevaNode[];
  firstTwelve: { type: string; gives: string; cost: string }[];
}

export interface DaevanionData {
  slug: string;
  source: string;
  boards: DaevaBoard[];
}

export interface MetaSkill {
  name: string;
  icon: string | null;
  order?: number | null;
  meta?: string | null;
}

export interface MetaRow {
  name: string;
  icon: string | null;
  tip?: string | null;
  meta?: string | null;
  pve?: string;
  pvp?: string;
  global?: string;
  effect?: string;
}

export interface MetaBuildData {
  slug: string;
  source: string;
  skillOrder: MetaSkill[];
  ringSkills: MetaSkill[];
  specialties: MetaSkill[];
  passives: MetaRow[];
  stigmas: MetaRow[];
  wings: MetaRow[];
  titles: MetaRow[];
  statPriority: { slot: string; text: string }[];
}
