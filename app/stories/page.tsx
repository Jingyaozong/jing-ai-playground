import type { Metadata } from 'next';
import { ArchiveFilterGrid } from '../components/archive-filter-grid';
import { PageIntro } from '../components/page-intro';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { TruthMethodLink } from '../components/truth-method-link';
import { stories } from '../data/content';

export const metadata: Metadata = { title: 'AI Stories — JING AI PLAYGROUND', description: '荆的 AI 漫剧、短片与系列故事存档。' };

export default function StoriesPage() {
  const documented = stories.filter((story) => story.stage === 'documented').length;
  const concepts = stories.length - documented;
  return <main><SiteHeader active="Stories" /><PageIntro eyebrow="Archive A / Stories" count={`${documented} documented · ${concepts} concept seeds`} title="AI Stories" description="漫剧、短片和一些介于梦与分镜之间的东西。这里按故事归档，不按模型或工具分类。" />
    <section className="archive-shell"><aside className="archive-truth-note"><span className="mono">STATUS NOTE / 状态说明</span><p>目前只有 Story 001 拥有剧本、分镜和生成包详情；其余两张是尚未进入制作的故事种子，不代表已经写完剧本或安排发布。</p><TruthMethodLink /></aside><ArchiveFilterGrid kind="stories" items={stories} /></section><SiteFooter /></main>;
}
