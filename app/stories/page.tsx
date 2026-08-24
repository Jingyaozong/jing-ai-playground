import type { Metadata } from 'next';
import { PageIntro } from '../components/page-intro';
import { Reveal } from '../components/reveal';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { StoryCard } from '../components/story-card';
import { stories } from '../data/content';

export const metadata: Metadata = { title: 'AI Stories — JING AI PLAYGROUND', description: '荆的 AI 漫剧、短片与系列故事存档。' };

export default function StoriesPage() {
  return <main><SiteHeader active="Stories" /><PageIntro eyebrow="Archive A / Stories" count={`${stories.length} stories in progress`} title="AI Stories" description="漫剧、短片和一些介于梦与分镜之间的东西。这里按故事归档，不按模型或工具分类。" />
    <section className="archive-shell"><div className="archive-filter mono"><span>All stories</span><span>Short films</span><span>Comic series</span><span>Visual poems</span></div><div className="story-grid archive-grid">{stories.map((story, index) => <Reveal key={story.id}><StoryCard story={story} index={index} /></Reveal>)}</div></section><SiteFooter /></main>;
}
