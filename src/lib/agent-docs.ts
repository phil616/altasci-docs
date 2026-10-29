import type { Code, InlineCode, Nodes, Root, RootContent } from 'mdast';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeRemark from 'rehype-remark';
import { categories } from '../data/categories.ts';

export interface AgentDoc {
  id: string;
  body?: string;
  data: {
    title: string;
    description: string;
    category: string;
    order: number;
    updated: string;
    tags: string[];
  };
}

const markdown = unified().use(remarkParse).use(remarkGfm).use(remarkStringify, {
  bullet: '-',
  fences: true,
});
const htmlToMarkdown = unified()
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeRemark);

function visit(node: Nodes, callback: (node: Nodes) => void) {
  callback(node);
  if ('children' in node) {
    for (const child of node.children) visit(child, callback);
  }
}

const paragraph = (value: string): RootContent => ({
  type: 'paragraph', children: [{ type: 'text', value }],
});

export const markdownPath = (id: string) => `/docs/${id}.md`;

function rewriteArticleLink(url: string, docIds: ReadonlySet<string>) {
  const match = /^(\/docs\/[^?#]*)([?#].*)?$/.exec(url);
  if (!match) return url;
  const id = match[1].slice('/docs/'.length).replace(/\/$/, '');
  return docIds.has(id) ? `${markdownPath(id)}${match[2] || ''}` : url;
}

export function createAgentMarkdown(doc: AgentDoc, docIds: ReadonlySet<string>): string {
  let tree = markdown.parse(doc.body || '');
  const codeByOffset = new Map<number, Code | InlineCode>();
  let hasHtml = false;
  visit(tree, node => {
    if (node.type === 'html') hasHtml = true;
    const offset = node.position?.start.offset;
    if ((node.type === 'code' || node.type === 'inlineCode') && offset !== undefined) {
      codeByOffset.set(offset, node);
    }
  });

  // Parse embedded HTML, including inline links inside GFM tables, rather than
  // stripping tags with a regex that could damage code examples or link targets.
  if (hasHtml) tree = htmlToMarkdown.runSync(tree) as Root;
  visit(tree, node => {
    const offset = node.position?.start.offset;
    const original = offset === undefined ? undefined : codeByOffset.get(offset);
    if ((node.type === 'code' || node.type === 'inlineCode') && original?.type === node.type) {
      // HTML conversion normalizes code whitespace and drops fence metadata.
      // Restore the original code using its source position.
      Object.assign(node, original);
    }
    if (node.type === 'link' || node.type === 'definition') {
      node.url = rewriteArticleLink(node.url, docIds);
    }
  });

  const category = categories.find(item => item.id === doc.data.category)!;
  tree.children.unshift(
    { type: 'heading', depth: 1, children: [{ type: 'text', value: doc.data.title }] },
    paragraph(doc.data.description),
    paragraph(`分类：${category.name}；更新日期：${doc.data.updated}`),
    ...(doc.data.tags.length ? [paragraph(`标签：${doc.data.tags.join('、')}`)] : []),
    { type: 'paragraph', children: [
      { type: 'link', url: `/docs/${doc.id}/`, children: [{ type: 'text', value: '网页版本' }] },
      { type: 'text', value: ' · ' },
      { type: 'link', url: '/llm.txt', children: [{ type: 'text', value: '全部文章与获取说明' }] },
    ] },
    { type: 'thematicBreak' },
  );
  return markdown.stringify(tree);
}

export function createAgentIndex(docs: readonly AgentDoc[]): string {
  const tree = markdown.parse(`# AltasCI Docs：AI Agent 阅读入口

本站提供中文企业文档。此文件列出全部 ${docs.length} 篇文章的 Markdown 读取地址。

## 如何获取文章

1. 对本站同源地址发起 GET /llm.txt，读取本索引；/llms.txt 提供相同内容。
2. 按下方分类、标题和摘要选择文章，再 GET 对应的 /docs/<文章 ID>.md 地址。
3. 将响应正文按 UTF-8 Markdown 文本读取，无需浏览器、CSS 或 JavaScript，也无需登录或 API Key。
4. 文章正文中的站内文章链接已指向 Markdown 版本，可继续逐篇 GET；代码示例中的 URL 保留原文。

所有以 / 开头的链接都相对于本站域名根路径。若索引地址为 [示例索引](https://docs.example.com/llm.txt)，则 /docs/pki/openpgp.md 的完整地址为 [示例文章](https://docs.example.com/docs/pki/openpgp.md)。此域名仅作示例，请使用获取本索引时的实际域名。

请求示例：GET /docs/pki/openpgp.md。网页 /docs/pki/openpgp/ 对应的 Markdown 地址为 /docs/pki/openpgp.md，.md 后不加斜杠。

## 内容格式与范围

- 文章包含标题、摘要、分类、更新日期、标签和正文，不含 YAML Frontmatter、页头、侧栏或页面脚本。
- 正文内嵌 HTML 转换为 Markdown，下载链接保留目标地址；代码块与行内代码保留示例内容，可能包含 HTML 语法。
- 分类和其他网页入口仍可能返回 HTML；证书、公钥等附件返回其原始文件格式，不是 Markdown。
- Demo 标识与限制随原文保留。演示业务流程和接口不表示已实现的服务；服务访问错误 E001 至 E008 与 Demo 错误代码分开说明。
- 这是构建时生成的公开静态文档接口；文章变更需重新构建发布。不存在的文章地址应返回 HTTP 404。
- 本索引只列出本站文档；文中的外部参考资料需按各自链接获取。

## 文章目录
`);

  for (const category of categories) {
    const entries = docs.filter(doc => doc.data.category === category.id)
      .sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id, 'en'));
    tree.children.push(
      { type: 'heading', depth: 3, children: [{ type: 'text', value: category.name }] },
      { type: 'list', ordered: false, spread: true, children: entries.map(doc => ({
        type: 'listItem', spread: false, children: [
          { type: 'paragraph', children: [
            { type: 'link', url: markdownPath(doc.id), children: [{ type: 'text', value: doc.data.title }] },
            { type: 'text', value: `：${doc.data.description}（更新：${doc.data.updated}${doc.data.tags.length ? `；标签：${doc.data.tags.join('、')}` : ''}）` },
          ] },
        ],
      })) },
    );
  }
  return markdown.stringify(tree);
}
