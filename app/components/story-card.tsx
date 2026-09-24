import Link from 'next/link';
import type { Story } from '../data/content';
import { ProjectVisual } from './project-visual';

export function StoryCard({ story }: { story: Story }) {
  return (
    <article className="story-card" id={story.id}>
      <ProjectVisual variant={story.visual} label={story.title} />
      <span className={`project-truth-badge ${story.status.includes('编辑候选') ? 'truth-editorial' : `truth-${story.stage}`} mono`}>{story.stage === 'documented' ? story.status : '概念候选 · 未制作'}</span>
      <div className="card-topline mono">
        <span>AI STORY {story.number}</span>
        <span>{story.date}</span>
      </div>
      <h3>{story.titleParts ? story.titleParts.map((part, index) => <span className="story-title-part" key={index}>{part}</span>) : story.title}</h3>
      <p>{story.description}</p>
      <div className="card-footer mono">
        <span>{story.type}</span>
        <span>{story.duration}</span>
      </div>
      {story.slug && <Link className="story-card-link" href={`/stories/${story.slug}/`}>进入故事 <span>↗</span></Link>}
      {!story.slug && <span className="concept-card-note mono">只保留故事种子 · 暂无详情页</span>}
    </article>
  );
}
