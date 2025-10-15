import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default('Admin'),
    tags: z.array(z.string()).default([]),
    lang: z.enum(['en', 'ar']),
    image: z.string().optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
};