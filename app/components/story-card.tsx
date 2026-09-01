import Link from 'next/link';
import type { Story } from '../data/content';
import { ProjectVisual } from './project-visual';

export function StoryCard({ story, isLatest = false }: { story: Story; isLatest?: boolean }) {
  return (
    <article className="story-card" id={story.id}>
      <ProjectVisual variant={story.visual} label={story.title} />
      <span className={`project-truth-badge truth-${story.stage} mono`}>{story.stage === 'documented' ? (isLatest ? '最新故事 · 有详情' : '有详情记录') : '概念候选 · 未制作'}</span>
      <div className="card-topline mono">
        <span>AI STORY {story.number}</span>
        <span>{story.date}</span>
      </div>
      <h3>{story.title}</h3>
      <p>{story.description}</p>
      <div className="card-footer mono">
        <span>{story.type}</span>
        <span>{story.duration} · {story.status}</span>
      </div>
      {story.slug && <Link className="story-card-link" href={`/stories/${story.slug}/`}>进入故事 <span>↗</span></Link>}
      {!story.slug && <span className="concept-card-note mono">只保留故事种子 · 暂无详情页</span>}
    </article>
  );
}
