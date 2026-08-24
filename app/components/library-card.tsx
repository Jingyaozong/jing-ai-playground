import type { LibraryItem } from '../data/library';

export function LibraryCard({ item, compact = false }: { item: LibraryItem; compact?: boolean }) {
  return (
    <article className={`library-card library-${item.type.toLowerCase()} ${compact ? 'is-compact' : ''}`}>
      <div className={`library-cover cover-${item.visual}`}>
        <span className="library-type mono">{item.source === 'Bilibili' ? '[ BILIBILI ]' : item.type}</span>
        <span className="library-cover-symbol" aria-hidden="true">{item.type === 'VIDEO' ? '▶' : item.type === 'PDF' ? 'PDF' : item.type === 'TOOL' ? '✦' : 'Aa'}</span>
        {item.duration && <small className="mono">{item.duration}</small>}
      </div>
      <div className="library-copy">
        <div className="library-meta mono"><span>{item.type} · {item.source}</span><span>{item.topic}</span></div>
        <h3>{item.title}</h3>
        {item.creator && <p className="library-creator">UP 主 / {item.creator}</p>}
        {!compact && <>
          <p>{item.description}</p>
          <div className="saved-reason"><span className="mono">为什么收藏</span><p>{item.whyISavedIt}</p></div>
          <blockquote><span className="mono">JING&apos;S TAKE</span>{item.jingTake}</blockquote>
        </>}
        <div className="library-bottom">
          <div className="note-tags">{item.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
          {item.url ? <a href={item.url} target="_blank" rel="noreferrer">查看原内容 ↗</a> : <span className="demo-link">Demo · 原链接待添加</span>}
        </div>
      </div>
    </article>
  );
}
