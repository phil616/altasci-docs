import assert from 'node:assert/strict';
import test from 'node:test';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { createAgentIndex, createAgentMarkdown } from '../src/lib/agent-docs.ts';

const parser = unified().use(remarkParse).use(remarkGfm);
const doc = (id, body = '', data = {}) => ({
  id, body,
  data: {
    title: '公开材料下载', description: '下载与验证说明。', category: 'pki',
    order: 10, updated: '2026-10-29', tags: ['PKI'], ...data,
  },
});
function nodes(source, type) {
  const result = [];
  const walk = node => {
    if (node.type === type) result.push(node);
    for (const child of node.children || []) walk(child);
  };
  walk(parser.parse(source));
  return result;
}

test('converts inline and block HTML to Markdown while retaining table downloads', () => {
  const result = createAgentMarkdown(doc('pki/downloads', [
    '## 文件', '', '| 文件 | 下载 |', '| --- | --- |',
    '| 根证书 | <a href="/pki/root.pem" download>下载 <strong>PEM</strong></a> |', '',
    '<div><p>请先<strong>核对指纹</strong>。</p></div>', '',
    '<script>alert("ignore")</script>',
  ].join('\n')), new Set(['pki/downloads']));
  assert.equal(nodes(result, 'html').length, 0);
  assert.equal(nodes(result, 'table').length, 1);
  assert.ok(nodes(result, 'link').some(node => node.url === '/pki/root.pem'));
  assert.ok(nodes(result, 'strong').some(node => node.children[0].value === 'PEM'));
  assert.ok(result.includes('核对指纹'));
  assert.ok(!result.includes('alert('));
  assert.ok(result.startsWith('# 公开材料下载\n'));
  assert.ok(result.includes('2026-10-29'));
  assert.ok(!result.startsWith('---'));
});

test('preserves code text, language, fence metadata and trailing whitespace during HTML conversion', () => {
  const source = [
    '<span>说明</span>', '',
    '`E<NNN>` 和 `<a href="/docs/help/faq/">示例</a>`', '',
    '```html title="example"',
    '<a href="/docs/help/faq/">示例</a>  ', '', '```',
  ].join('\n');
  const result = createAgentMarkdown(doc('pki/downloads', source), new Set(['help/faq']));
  const codeValues = content => nodes(content, 'code').map(({ lang, meta, value }) => ({ lang, meta, value }));
  assert.deepEqual(codeValues(result), codeValues(source));
  assert.deepEqual(nodes(result, 'inlineCode').map(node => node.value), nodes(source, 'inlineCode').map(node => node.value));
  assert.equal(nodes(result, 'html').length, 0);
});

test('rewrites known article links and references, retaining queries, anchors and attachment URLs', () => {
  for (const html of ['', '<span>说明</span>\n\n']) {
    const source = html + [
      '[帮助](/docs/help/faq/?from=download#常见问题)', '',
      '[引用][faq]', '', '[faq]: /docs/help/faq/#问题', '',
      '[未知文章](/docs/help/missing/)', '',
      '[附件](/pki/openpgp/root.asc)', '',
      '[外部](https://example.com/docs/help/faq/)', '',
      '[本节](#文件)',
    ].join('\n');
    const result = createAgentMarkdown(doc('pki/downloads', source), new Set(['help/faq']));
    // HTML parsing may percent-encode Unicode anchors; their decoded targets
    // must still be the same, without decoding reserved URL characters.
    const urls = [...nodes(result, 'link'), ...nodes(result, 'definition')].map(node => decodeURI(node.url));
    for (const url of [
      '/docs/help/faq.md?from=download#常见问题', '/docs/help/faq.md#问题',
      '/docs/help/missing/', '/pki/openpgp/root.asc',
      'https://example.com/docs/help/faq/', '#文件',
    ]) assert.ok(urls.includes(url), `Missing ${url}`);
  }
});

test('index lists every article once in configured category and article order with retrieval instructions', () => {
  const docs = [
    doc('pki/later', '', { order: 20, title: '稍后阅读' }),
    doc('errors/access-errors', '', { category: 'errors', tags: [], title: '服务访问错误代码' }),
    doc('business/demo', '> Demo 示例，不表示真实服务。', { category: 'business', tags: ['Demo'], title: '业务演示' }),
    doc('pki/first', '', { order: 10, title: '先读本篇' }),
  ];
  const result = createAgentIndex(docs);
  assert.deepEqual(nodes(result, 'link').filter(node => node.url.startsWith('/docs/')).map(node => node.url), [
    '/docs/business/demo.md', '/docs/pki/first.md', '/docs/pki/later.md', '/docs/errors/access-errors.md',
  ]);
  assert.ok(result.includes('GET /llm.txt'));
  assert.ok(result.includes('/llms.txt'));
  assert.ok(result.includes('UTF-8'));
  assert.ok(result.includes('实际域名'));
  assert.ok(result.includes('HTTP 404'));
  assert.deepEqual(nodes(result, 'link').filter(node => node.url.startsWith('https://docs.example.com/')).map(node => node.url), [
    'https://docs.example.com/llm.txt', 'https://docs.example.com/docs/pki/openpgp.md',
  ]);
  assert.equal(nodes(result, 'html').length, 0);
  assert.equal(docs[0].id, 'pki/later', 'must not reorder the source collection');
  const demo = createAgentMarkdown(docs[2], new Set());
  assert.ok(demo.includes('Demo 示例，不表示真实服务。'));
  assert.ok(!createAgentMarkdown(docs[1], new Set()).includes('Demo'));
});
