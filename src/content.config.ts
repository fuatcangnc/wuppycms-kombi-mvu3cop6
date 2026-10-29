import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'

const posts = defineCollection({
  base: 'src/content/posts',
  pattern: '**/*.md',
  schema: z.object({
    title: z.string(),
    category: z.string().optional(),
    description: z.string().optional(),
    publishedAt: z.coerce.date().optional(),
    image: z.string().optional(),
    relatedService: z.string().optional(),
  }),
})

const pages = defineCollection({
  base: 'src/content/pages',
  pattern: '**/*.md',
  schema: z.object({
    title: z.string(),
    eyebrow: z.string().optional(),
    description: z.string().optional(),
  }),
})

export const collections = { posts, pages }
