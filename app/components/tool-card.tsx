import type { Tool } from '../data/content';

export function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  return (
    <article className="tool-card" id={tool.id}>
      <div className="tool-symbol" aria-hidden="true">{tool.symbol}</div>
      <div className="card-topline mono"><span>TOOL 0{index + 1}</span><span>{tool.status}</span></div>
      <p className="tool-label">{tool.label}</p>
      <h3>{tool.title}</h3>
      <p>{tool.description}</p>
      <span className="tool-action mono">Open soon ↗</span>
    </article>
  );
}
