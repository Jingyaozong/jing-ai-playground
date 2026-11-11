import type { Metadata } from 'next';
import { pageMeta } from '../lib/seo';
import { ArchiveFilterGrid } from '../components/archive-filter-grid';
import { PageIntro } from '../components/page-intro';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { experiments } from '../data/content';

export const metadata: Metadata = pageMeta({ title: '实验设计', description: 'AI 角色、视频模型与 Prompt 的对照测试设计。', robots: { index: false, follow: true } });

export default function ExperimentsPage() {
  const experimentsNewestFirst = [...experiments].reverse();
  return <main className="experiments-page"><SiteHeader active="Experiments" /><PageIntro eyebrow="归档" count={`${experiments.length} 个`} title="实验设计" description="每个实验都先写对照协议：固定什么、改变什么、怎样记录。" />
    <section className="archive-shell"><ArchiveFilterGrid kind="experiments" items={experimentsNewestFirst} /></section><SiteFooter /></main>;
}
