import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { createAgentMarkdown } from '../../lib/agent-docs';

export const getStaticPaths = (async () => {
  const docs = await getCollection('docs');
  const docIds = new Set(docs.map(doc => doc.id));
  return docs.map(doc => ({
    params: { id: doc.id },
    props: { content: createAgentMarkdown(doc, docIds) },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => new Response(props.content, {
  headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
});
