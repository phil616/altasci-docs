import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { categories } from './data/categories';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string().refine(value => categories.some(category => category.id === value), 'category 必须对应 src/data/categories.ts 中的分类 ID'),
    order: z.number().default(0),
    updated: z.iso.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { docs };
