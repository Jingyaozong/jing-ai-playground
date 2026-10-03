import Link from 'next/link';
import type { LibraryItem } from '../data/library';

export function LibraryCard({ item, compact = false, anchorId }: { item: LibraryItem; compact?: boolean; anchorId?: string }) {
  return (
    <article id={anchorId} tabIndex={anchorId ? -1 : undefined} className={`library-card library-${item.type.toLowerCase()} ${compact ? 'is-compact' : ''}`}>
      <div className={`library-cover cover-${item.visual}`}>
        <span className="library-type mono">{item.source.startsWith('Bilibili') ? '[ BILIBILI ]' : item.type}</span>
        <span className="library-cover-symbol" aria-hidden="true">{item.type === 'VIDEO' ? '▶' : item.type === 'PDF' ? 'PDF' : item.type === 'TOOL' ? '✦' : 'Aa'}</span>
        {item.duration && <small className="mono">{item.duration}</small>}
      </div>
      <div className="library-copy">
        <div className="library-meta mono"><span>{item.type} · {item.source}</span><span>{item.topic}</span></div>
        {item.takeStatus === 'draft' && <span className="take-status mono">{item.sourceStatus === 'content-pending' ? '元信息已核对 · 内容待复核 · 待荆确认' : item.sourceStatus === 'excerpt-reviewed' ? '讲解要点已核对 · 待荆确认' : '编辑初选 · 待荆确认'}</span>}
        <h3>{item.titleParts ? item.titleParts.map((part, index) => <span className="library-title-part" key={index}>{part}</span>) : item.title}</h3>
        {item.creator && <p className="library-creator">发布者 / {item.creator}</p>}
        {!compact && <>
          <p className="library-summary">{item.description}</p>
          {item.videoReview && <details className="library-video-review">
            <summary>看 {item.videoReview.points.length} 个讲解要点</summary>
            <p>{item.videoReview.basis}核对日期：{item.videoReview.checkedOn}。</p>
            <ol>{item.videoReview.points.map((point) => {
              const url = new URL(item.url);
              url.searchParams.set('t', String(point.seconds));
              const timestamp = `${String(Math.floor(point.seconds / 60)).padStart(2, '0')}:${String(point.seconds % 60).padStart(2, '0')}`;
              return <li key={point.seconds}><a className="mono" href={url.href} target="_blank" rel="noreferrer" aria-label={`${timestamp} · 打开${item.title}原片`}>{timestamp} ↗</a><p>{point.text}</p></li>;
            })}</ol>
            <p>{item.videoReview.limitation}时间链接若未自动定位，可在原播放器手动跳转。</p>
            <Link className="library-review-practice" href={item.videoReview.practice.href}>{item.videoReview.practice.label}</Link>
          </details>}
          <div className="saved-reason"><span className="mono">{item.takeStatus === 'draft' ? '编辑推荐理由 · 待荆确认' : '为什么收藏'}</span><p>{item.whyISavedIt}</p></div>
          <blockquote><span className="mono">{item.takeStatus === 'draft' ? '编辑观点候选 · 待荆确认' : "JING'S TAKE"}</span><p>{item.jingTake}</p></blockquote>
        </>}
        <div className="library-bottom">
          <div className="note-tags">{item.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
          <a href={item.url} target="_blank" rel="noreferrer">{item.sourceStatus === 'content-pending' ? '打开视频原链接 ↗' : '查看原内容 ↗'}</a>
        </div>
      </div>
    </article>
  );
}
