/** @type {import('next').NextConfig} */
import createMDX from '@next/mdx';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  // Fully static export — required for GitHub Pages hosting.
  output: 'export',
  // Set NEXT_PUBLIC_BASE_PATH=/<repo-name> for project pages (username.github.io/<repo>).
  basePath,
  // GitHub Pages resolves /path/ to /path/index.html; trailing slashes keep deep links working.
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ['ts', 'tsx', 'mdx'],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
