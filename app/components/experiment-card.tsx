import Link from 'next/link';
import type { Experiment } from '../data/content';
import { ProjectVisual } from './project-visual';

export function ExperimentCard({ experiment, isLatest = false }: { experiment: Experiment; isLatest?: boolean }) {
  return (
    <article className="experiment-card" id={experiment.id}>
      <ProjectVisual variant={experiment.visual} label={experiment.title} />
      <span className={`project-truth-badge truth-${experiment.stage} mono`}>{experiment.stage === 'documented' ? (isLatest ? '最新研究 · 有详情' : '有详情记录') : '实验设想 · 未执行'}</span>
      <div className="card-topline mono">
        <span>EXP. {experiment.number}</span>
        <span>{experiment.category}</span>
      </div>
      <h3>{experiment.title}</h3>
      <p>{experiment.description}</p>
      <div className="card-footer mono"><span>{experiment.date}</span><span>{experiment.status}</span></div>
      {experiment.slug && <Link className="experiment-card-link" href={`/experiments/${experiment.slug}/`}>打开实验记录 <span>↗</span></Link>}
      {!experiment.slug && <span className="concept-card-note mono">无样本 · 无结果 · 暂无详情页</span>}
    </article>
  );
}
