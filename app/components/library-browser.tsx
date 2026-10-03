'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import type { LibraryItem } from '../data/library';
import { readUrlFilter, writeUrlFilter } from '../../lib/filter-url';
import { libraryFilters } from '../data/library';
import { LibraryCard } from './library-card';

const filterLabels: Record<string, string> = { 全部: '全部', VIDEO: '视频', ARTICLE: '文章', PDF: '报告与论文', TOOL: '工具', 'JING PICKS': '精选候选' };

function subscribeToFilter(onChange: () => void) {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
}

function readFilter() {
  return readUrlFilter(window.location.search, 'type', libraryFilters);
}

function selectFilter(filter: string) {
  const url = writeUrlFilter(window.location.href, 'type', filter);
  if (url.href === window.location.href) return;
  window.history.pushState(null, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function LibraryBrowser({ items }: { items: LibraryItem[] }) {
  const active = useSyncExternalStore(subscribeToFilter, readFilter, () => '全部');
  const [query, setQuery] = useState('');
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter((item) => {
      const filterMatch = active === '全部' || item.type === active || (active === 'JING PICKS' && item.jingPick);
      const searchMatch = !normalized || `${item.title} ${item.source} ${item.topic} ${item.tags.join(' ')} ${item.jingTake}`.toLowerCase().includes(normalized);
      return filterMatch && searchMatch;
    });
  }, [active, items, query]);

  useEffect(() => {
    const revealLinkedCard = () => {
      const item = visible.find((item) => window.location.hash === `#library-${item.id}`);
      if (!item) return;
      const card = document.getElementById(`library-${item.id}`);
      if (!card) return;
      const review = card.querySelector('details');
      if (review) review.open = true;
      card.scrollIntoView({ block: 'start' });
      card.focus({ preventScroll: true });
    };
    revealLinkedCard();
    window.addEventListener('hashchange', revealLinkedCard);
    return () => window.removeEventListener('hashchange', revealLinkedCard);
  }, [visible]);

  return (
    <section className="content-browser library-browser" aria-label="筛选收藏内容">
      <div className="browser-toolbar">
        <label className="search-field"><span className="mono">搜索收藏 / Search</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入标题、来源、主题或标签" /></label>
        <div className="filter-row">{libraryFilters.map((filter) => <button aria-pressed={active === filter} className={active === filter ? 'is-active' : ''} onClick={() => selectFilter(filter)} key={filter}>{filterLabels[filter]}</button>)}</div>
      </div>
      <p className="library-result-count" role="status">{filterLabels[active]} · 显示 {visible.length} 项收藏{query.trim() && ` · 关键词：${query.trim()}`}</p>
      <div className="library-grid">{visible.map((item) => <LibraryCard item={item} anchorId={`library-${item.id}`} key={item.id} />)}</div>
      {visible.length === 0 && <div className="empty-result"><b>这里暂时没有匹配收藏。</b><span>试试其他关键词，或清除筛选重新浏览。</span><button onClick={() => { selectFilter('全部'); setQuery(''); }}>查看全部收藏</button></div>}
    </section>
  );
}
