import Link from 'next/link';
import type { Tool } from '../data/content';

export function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const card = (
    <article className={`tool-card tool-tone-${index % 3}`} id={tool.id}>
      <div className="tool-symbol" aria-hidden="true">{tool.symbol}</div>
      <div className="card-topline mono"><span>TOOL {String(index + 1).padStart(2, '0')}</span><span>{tool.status}</span></div>
      <p className="tool-label">{tool.label}</p>
      <h3>{tool.title}</h3>
      <p>{tool.description}</p>
      <span className="tool-action mono">{tool.href ? '立即使用 ↗' : '准备中'}</span>
    </article>
  );

  return tool.href ? <Link className="tool-card-link" href={tool.href} aria-label={`打开${tool.label}`}>{card}</Link> : card;
}
