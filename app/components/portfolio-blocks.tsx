import Image from 'next/image';
import Link from 'next/link';
import type { StaticImageData } from 'next/image';
import { eightDimensions, evaluationFlow, isPlaceholder, type Project } from '../data/profile';

const withBase = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;

export function PageHead({ title, description, back }: { title: string; description: string; back?: { href: string; label: string } }) {
  return (
    <header className="pf-page-head pf-shell">
      {back && <Link className="pf-breadcrumb" href={back.href}>← {back.label}</Link>}
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}

export function Severity({ level }: { level: string }) {
  return <span className="pf-severity" data-level={level}>{level}</span>;
}

export function CaseCard({ href, tag, title, description, image, poster, alt, pending }: { href: string; tag: string; title: string; description: string; image?: StaticImageData; poster?: string; alt?: string; pending?: string }) {
  return (
    <Link className="pf-card" href={href}>
      {image
        ? <div className="pf-media"><Image src={image} alt={alt ?? ''} sizes="(max-width: 900px) 100vw, 360px" /></div>
        : poster
          // eslint-disable-next-line @next/next/no-img-element
          ? <div className="pf-media"><img src={withBase(poster)} alt={alt ?? ''} width={1280} height={720} loading="lazy" /></div>
          : <div className="pf-media pf-media-pending">{pending}</div>}
      <div className="pf-card-body">
        <span className="pf-card-tag">{tag}</span>
        <h3>{title}</h3>
        <p>{description}</p>
        <span className="pf-card-more">查看案例 →</span>
      </div>
    </Link>
  );
}

export function DimensionGrid() {
  return (
    <ol className="pf-grid-4">
      {eightDimensions.map((dimension) => (
        <li className="pf-dimension" key={dimension.id}>
          <b>{dimension.id}</b>
          <h3>{dimension.name}</h3>
          <p>{dimension.check}</p>
        </li>
      ))}
    </ol>
  );
}

export function EvaluationFlow() {
  return <ol className="pf-flow" aria-label="评测流程">{evaluationFlow.map((step) => <li key={step}>{step}</li>)}</ol>;
}

export function ProjectCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  // 没填的项（占位符）不显示。
  const filled = (value: string) => !isPlaceholder(value);
  const meta = [project.org, project.period, compact ? '' : project.role].filter((value) => value && filled(value));
  const results = project.results.filter((result) => filled(result.value));
  return (
    <article className="pf-project" id={compact ? undefined : project.id}>
      <div>
        {meta.length > 0 && <p className="pf-project-meta">{meta.join(' · ')}</p>}
        <h3>{project.title}</h3>
      </div>
      <dl className="pf-star">
        {filled(project.situation) && <div><dt>背景</dt><dd>{project.situation}</dd></div>}
        <div><dt>任务</dt><dd>{project.task}</dd></div>
        <div><dt>行动</dt><dd><ul>{(compact ? project.actions.slice(0, 2) : project.actions).map((action) => <li key={action}>{action}</li>)}</ul></dd></div>
      </dl>
      {results.length > 0 && (
        <ul className="pf-results" aria-label="结果">
          {(compact ? results.slice(0, 2) : results).map((result) => <li key={result.label}><strong>{result.value}</strong><span>{result.label}</span></li>)}
        </ul>
      )}
      {compact
        ? <Link className="pf-text-link" href={`/projects/#${project.id}`}>查看完整经历</Link>
        : project.methodLinks.length > 0 && <p className="pf-project-links"><span>对应方法：</span>{project.methodLinks.map((link) => <Link className="pf-text-link" href={link.href} key={link.href}>{link.label}</Link>)}</p>}
    </article>
  );
}

type ScoreRow = { dimension: string; cells: Array<{ score: string; evidence: string }> };

export function ScoreTable({ models, rows }: { models: Array<{ name: string; verdict: string }>; rows: ScoreRow[] }) {
  return (
    <div className="pf-table-wrap" tabIndex={0} role="region" aria-label="八维评分表，可横向滚动">
      <table className="pf-table">
        <thead><tr><th scope="col">维度</th>{models.map((model, index) => <th scope="col" key={index}>{model.name}</th>)}</tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.dimension}>
              <th scope="row">{row.dimension}</th>
              {row.cells.map((cell, index) => <td key={index}><b>{cell.score}</b><span>{cell.evidence}</span></td>)}
            </tr>
          ))}
          <tr><th scope="row">严重度结论</th>{models.map((model, index) => <td key={index}><Severity level={model.verdict} /></td>)}</tr>
        </tbody>
      </table>
    </div>
  );
}

type BadCase = { id: string; image: string; model: string; timecode: string; type: string; seen: string; hypothesis: string; retest: string };

export function BadCaseCard({ item }: { item: BadCase }) {
  return (
    <article className="pf-card pf-badcase">
      {isPlaceholder(item.image)
        ? <div className="pf-media pf-media-pending">{item.image}</div>
        : (
          <div className="pf-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBase(item.image)} alt={`${item.model} 在 ${item.timecode} 的截帧：${item.seen}`} loading="lazy" width={1280} height={720} />
          </div>
        )}
      <div className="pf-card-body">
        <div className="pf-badcase-head"><span>{item.model} · {item.timecode}</span><span className="pf-badcase-type">{item.type}</span></div>
        <dl>
          <div><dt>可见现象</dt><dd>{item.seen}</dd></div>
          <div><dt>原因假设</dt><dd>{item.hypothesis}</dd></div>
          <div><dt>复测设计</dt><dd>{item.retest}</dd></div>
        </dl>
      </div>
    </article>
  );
}
