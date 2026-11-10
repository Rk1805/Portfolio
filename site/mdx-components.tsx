import type { MDXComponents } from 'mdx/types'
import { Figure, Video } from '@/components/Longform'

// One component map for case studies and blog posts.
const components: MDXComponents = { Figure, Video }

export function useMDXComponents(): MDXComponents {
  return components
}
