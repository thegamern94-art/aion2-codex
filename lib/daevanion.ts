import templar from '@/data/daevanion/templar.json';
import gladiator from '@/data/daevanion/gladiator.json';
import assassin from '@/data/daevanion/assassin.json';
import ranger from '@/data/daevanion/ranger.json';
import sorcerer from '@/data/daevanion/sorcerer.json';
import spiritmaster from '@/data/daevanion/spiritmaster.json';
import cleric from '@/data/daevanion/cleric.json';
import chanter from '@/data/daevanion/chanter.json';
import type { DaevanionData } from '@/types/game';

// Server-side map — pages pass only the current class's data to client components.
export const DAEVANION_BY_SLUG: Record<string, DaevanionData> = {
  templar: templar as unknown as DaevanionData,
  gladiator: gladiator as unknown as DaevanionData,
  assassin: assassin as unknown as DaevanionData,
  ranger: ranger as unknown as DaevanionData,
  sorcerer: sorcerer as unknown as DaevanionData,
  spiritmaster: spiritmaster as unknown as DaevanionData,
  cleric: cleric as unknown as DaevanionData,
  chanter: chanter as unknown as DaevanionData,
};
