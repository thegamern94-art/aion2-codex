import type { MDXComponents } from 'mdx/types';
import BossMechanicAlert from '@/components/BossMechanicAlert';
import MacroCopyBox from '@/components/MacroCopyBox';
import SkillTooltip from '@/components/SkillTooltip';
import GearGateTable from '@/components/GearGateTable';

// Global MDX component registry — available in every .mdx file.
export const mdxComponents: MDXComponents = {
  BossMechanicAlert,
  MacroCopyBox,
  SkillTooltip,
  GearGateTable,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...mdxComponents,
  };
}
