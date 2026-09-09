import { cloneElement, isValidElement, type ReactNode } from 'react';
import Link from 'next/link';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

function textFromNode(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textFromNode).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) return textFromNode(node.props.children);
  return '';
}

function stripCalloutPrefix(node: ReactNode, type: string): ReactNode {
  if (typeof node === 'string') return node.replace(`[!${type}]`, '').trimStart();
  if (Array.isArray(node)) return node.map((child) => stripCalloutPrefix(child, type));
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return cloneElement(node, undefined, stripCalloutPrefix(node.props.children, type));
  }
  return node;
}

const components: Components = {
  h1: ({ children }) => <h1 className="article-h1">{children}</h1>,
  h2: ({ children }) => <h2>{children}</h2>,
  h3: ({ children }) => <h3>{children}</h3>,
  strong: ({ children }) => <mark>{children}</mark>,
  blockquote: ({ children }) => {
    const text = textFromNode(children).trimStart();
    const match = text.match(/^\[!(KEY POINT|TIP|BAD CASE|JING'S NOTE)\]/);
    if (!match) return <blockquote className="article-quote">{children}</blockquote>;
    const type = match[1];
    return <aside className={`article-callout callout-${type.toLowerCase().replaceAll(' ', '-').replace("'", '')}`}><span className="mono">{type}</span><div>{stripCalloutPrefix(children, type)}</div></aside>;
  },
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children }) => {
    const language = /language-([\w-]+)/.exec(className ?? '')?.[1];
    if (!language) return <code className="inline-code">{children}</code>;
    return <div className={`article-code ${language === 'prompt' ? 'is-prompt' : ''}`}><span className="mono">{language === 'prompt' ? 'PROMPT' : language}</span><pre><code>{children}</code></pre></div>;
  },
  table: ({ children }) => <div className="article-table-wrap"><table>{children}</table></div>,
  a: ({ href = '#', children }) => {
    const label = textFromNode(children);
    if (label.startsWith('VIDEO:')) return <a className="article-video" href={href} target="_blank" rel="noreferrer"><span className="video-play">▶</span><span><small className="mono">External video</small><b>{label.replace('VIDEO:', '').trim()}</b></span><i>打开来源 ↗</i></a>;
    if (href.startsWith('/')) return <Link href={href}>{children}</Link>;
    return <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>{children}</a>;
  },
  img: ({ src = '', alt = '' }) => (
    <figure className="article-image">
      {/* Markdown sources do not guarantee dimensions; next/image would impose a guessed aspect ratio. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
      {alt && <figcaption>{alt}</figcaption>}
    </figure>
  ),
};

export function MarkdownContent({ content }: { content: string }) {
  return <div className="article-body"><ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{content}</ReactMarkdown></div>;
}
