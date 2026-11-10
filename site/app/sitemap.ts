import type { MetadataRoute } from 'next'
import { slugs } from '@/lib/content'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const blog = slugs('blog')
  return ['', '/work', ...slugs('work').map((s) => `/work/${s}`), '/playground', '/about', ...(blog.length ? ['/blog', ...blog.map((s) => `/blog/${s}`)] : [])].map((p) => ({
    url: `${SITE_URL}${p}`,
  }))
}
