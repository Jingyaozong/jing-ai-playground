import type { Metadata } from 'next';
import { ArchiveFilterGrid } from '../components/archive-filter-grid';
import { PageIntro } from '../components/page-intro';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { experiments } from '../data/content';

export const metadata: Metadata = { title: 'Experiments — JING AI PLAYGROUND', description: 'AI 角色、视频模型、Prompt 与工作流实验记录。' };

export default function ExperimentsPage() {
  const documented = experiments.filter((experiment) => experiment.stage === 'documented').length;
  const concepts = experiments.length - documented;
  return <main className="experiments-page"><SiteHeader active="Experiments" /><PageIntro eyebrow="Archive B / Experiments" count={`${documented} documented · ${concepts} test ideas`} title="Experiments" description="有些实验已经留下样本，有些目前只是一道待验证的问题。没有执行过的内容不会显示成实验结果。" />
    <section className="archive-shell"><div className="lab-note"><span className="mono">Lab rule 001</span><p>先记录，再解释。<br />没有样本，就没有结论。</p></div><aside className="archive-truth-note"><span className="mono">STATUS NOTE / 状态说明</span><p>{documented} 个实验已有详情记录：Experiment 001 有四格静态 Pilot 样本板，其余 {documented - 1} 个已完成对照协议与本地记录台，正式输出仍为 0。{concepts > 0 ? `另有 ${concepts} 个未执行概念。` : '当前没有仅停留在概念卡阶段的实验。'}没有模型输出的页面不会写成实验结论。</p></aside><ArchiveFilterGrid kind="experiments" items={experiments} /></section><SiteFooter /></main>;
}
