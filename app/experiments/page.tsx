import type { Metadata } from 'next';
import { ExperimentCard } from '../components/experiment-card';
import { PageIntro } from '../components/page-intro';
import { Reveal } from '../components/reveal';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { experiments } from '../data/content';

export const metadata: Metadata = { title: 'Experiments — JING AI PLAYGROUND', description: 'AI 角色、视频模型、Prompt 与工作流实验记录。' };

export default function ExperimentsPage() {
  return <main className="experiments-page"><SiteHeader active="Experiments" /><PageIntro eyebrow="Archive B / Experiments" count={`${experiments.length} open notebooks`} title="Experiments" description="有些实验解决问题，有些只是为了看看会发生什么。过程、失败和意外结果都值得留下来。" />
    <section className="archive-shell"><div className="lab-note"><span className="mono">Lab rule 001</span><p>先记录，再解释。<br />允许结果比问题更奇怪。</p></div><div className="experiment-grid archive-grid">{experiments.map((experiment, index) => <Reveal key={experiment.id}><ExperimentCard experiment={experiment} index={index} /></Reveal>)}</div></section><SiteFooter /></main>;
}
