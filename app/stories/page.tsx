import type { Metadata } from 'next';
import { ArchiveFilterGrid } from '../components/archive-filter-grid';
import { PageIntro } from '../components/page-intro';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { stories } from '../data/content';

export const metadata: Metadata = { title: 'AI Stories — JING AI PLAYGROUND', description: '荆的 AI 漫剧、短片与系列故事存档。' };

export default function StoriesPage() {
  const documented = stories.filter((story) => story.stage === 'documented').length;
  const concepts = stories.length - documented;
  return <main><SiteHeader active="Stories" /><PageIntro eyebrow="Archive A / Stories" count={`${documented} documented · ${concepts} concept seeds`} title="AI Stories" description="漫剧、短片和一些介于梦与分镜之间的东西。这里按故事归档，不按模型或工具分类。" />
    <section className="archive-shell"><aside className="archive-truth-note"><span className="mono">STATUS NOTE / 状态说明</span><p>Story 001 与 Story 002 已有剧本、分镜和 AI 概念关键帧，但都没有完成视频。Story 003 仍是尚未进入制作的故事种子，所有页面都会明确区分开发稿、视觉测试与完成作品。</p></aside><ArchiveFilterGrid kind="stories" items={stories} /></section><SiteFooter /></main>;
}
