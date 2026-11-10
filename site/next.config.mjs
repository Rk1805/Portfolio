import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // QA builds into its own dir so it never clobbers the dev server's .next
  distDir: process.env.NEXT_DIST_DIR || '.next',
  pageExtensions: ['ts', 'tsx', 'mdx'],
  reactStrictMode: true,
  poweredByHeader: false,
}

export default createMDX()(nextConfig)
