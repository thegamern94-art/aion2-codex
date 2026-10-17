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
