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
  return <main className="experiments-page"><SiteHeader active="Experiments" /><PageIntro eyebrow="Archive B / Experiments" count={`${documented} pilot record · ${concepts} test ideas`} title="Experiments" description="有些实验已经留下样本，有些目前只是一道待验证的问题。没有执行过的内容不会显示成实验结果。" />
    <section className="archive-shell"><div className="lab-note"><span className="mono">Lab rule 001</span><p>先记录，再解释。<br />没有样本，就没有结论。</p></div><aside className="archive-truth-note"><span className="mono">STATUS NOTE / 状态说明</span><p>目前只有 Experiment 001 拥有一张四格静态 Pilot 样本板和记录台；其余三张是尚未执行的实验设想，没有模型输出、比较结果或完成结论。</p></aside><ArchiveFilterGrid kind="experiments" items={experiments} /></section><SiteFooter /></main>;
}
