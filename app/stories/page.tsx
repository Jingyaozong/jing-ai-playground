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
  const storiesNewestFirst = [...stories].reverse();
  return <main><SiteHeader active="Stories" /><PageIntro eyebrow="Archive A / Stories" count={`${documented} documented · ${concepts} concept seeds`} title="AI Stories" description="漫剧、短片和一些介于梦与分镜之间的东西。这里按故事归档，不按模型或工具分类。" />
    <section className="archive-shell"><aside className="archive-truth-note"><span className="mono">STATUS NOTE / 状态说明</span><p>{stories.length} 个原创故事现在都有剧本、分镜与 AI 概念关键帧。它们仍处于视觉开发阶段，都没有完成视频；页面会继续明确区分文字草案、生成画面、动作测试与完成作品。</p></aside><ArchiveFilterGrid kind="stories" items={storiesNewestFirst} /></section><SiteFooter /></main>;
}
