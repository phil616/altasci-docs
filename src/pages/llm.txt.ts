import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { createAgentIndex } from '../lib/agent-docs';

export const GET: APIRoute = async () => new Response(
  createAgentIndex(await getCollection('docs')),
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
