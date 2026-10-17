import templar from '@/data/meta/templar.json';
import gladiator from '@/data/meta/gladiator.json';
import assassin from '@/data/meta/assassin.json';
import ranger from '@/data/meta/ranger.json';
import sorcerer from '@/data/meta/sorcerer.json';
import spiritmaster from '@/data/meta/spiritmaster.json';
import cleric from '@/data/meta/cleric.json';
import chanter from '@/data/meta/chanter.json';
import type { MetaBuildData } from '@/types/game';

// Server-side map — pages pass only the current class's data to client components.
export const METABUILD_BY_SLUG: Record<string, MetaBuildData> = {
  templar: templar as unknown as MetaBuildData,
  gladiator: gladiator as unknown as MetaBuildData,
  assassin: assassin as unknown as MetaBuildData,
  ranger: ranger as unknown as MetaBuildData,
  sorcerer: sorcerer as unknown as MetaBuildData,
  spiritmaster: spiritmaster as unknown as MetaBuildData,
  cleric: cleric as unknown as MetaBuildData,
  chanter: chanter as unknown as MetaBuildData,
};
