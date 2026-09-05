import Link from 'next/link';
import type { Tool } from '../data/content';

export function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const card = (
    <article className={`tool-card tool-tone-${index % 3}`} id={tool.id}>
      <div className="tool-card-top"><div className="tool-symbol" aria-hidden="true">{tool.symbol}</div><span className="tool-card-status">{tool.status === 'Ready' ? '可使用' : tool.status}</span></div>
      <p className="tool-label mono" lang="en">{tool.title}</p>
      <h3>{tool.label}</h3>
      <p>{tool.description}</p>
      <span className="tool-action mono">{tool.href ? '立即使用 ↗' : '准备中'}</span>
    </article>
  );

  return tool.href ? <Link className="tool-card-link" href={tool.href} aria-label={`打开${tool.label}`}>{card}</Link> : card;
}
