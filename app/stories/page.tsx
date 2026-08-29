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
    <section className="archive-shell"><aside className="archive-truth-note"><span className="mono">STATUS NOTE / 状态说明</span><p>三个原创故事现在都有剧本与分镜开发记录。Story 001、002 有 AI 概念关键帧，Story 003 目前只有文字任务书；三个故事都没有完成视频，页面会继续明确区分开发稿、视觉测试与完成作品。</p></aside><ArchiveFilterGrid kind="stories" items={stories} /></section><SiteFooter /></main>;
}
