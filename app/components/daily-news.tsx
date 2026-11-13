import { beijingTime, type NewsItem } from '../data/daily-news';

export function NewsList({ items, compact = false }: { items: NewsItem[]; compact?: boolean }) {
  return (
    <ol className={compact ? 'pf-news is-compact' : 'pf-news'}>
      {items.map((item, index) => (
        <li className="pf-news-item" key={item.id}>
          <span className="pf-news-rank" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <div className="pf-news-body">
            <p className="pf-news-meta"><span className="pf-news-tag">{item.category}</span><span>{item.source}</span><time dateTime={item.publishedAt}>{beijingTime(item.publishedAt)}</time></p>
            <h3><a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a></h3>
            {!compact && <p className="pf-news-summary">{item.summary}</p>}
          </div>
          {!compact && <a className="pf-news-link" href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`查看原文：${item.title}`}>查看原文 ↗</a>}
        </li>
      ))}
    </ol>
  );
}
