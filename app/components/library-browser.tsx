'use client';

import { useMemo, useState } from 'react';
import type { LibraryItem } from '../data/library';
import { libraryFilters } from '../data/library';
import { LibraryCard } from './library-card';

export function LibraryBrowser({ items }: { items: LibraryItem[] }) {
  const [active, setActive] = useState('全部');
  const [query, setQuery] = useState('');
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter((item) => {
      const filterMatch = active === '全部' || item.type === active || (active === 'JING PICKS' && item.jingPick);
      const searchMatch = !normalized || `${item.title} ${item.source} ${item.topic} ${item.tags.join(' ')} ${item.jingTake}`.toLowerCase().includes(normalized);
      return filterMatch && searchMatch;
    });
  }, [active, items, query]);

  return (
    <section className="content-browser library-browser" aria-label="筛选收藏内容">
      <div className="browser-toolbar">
        <label className="search-field"><span className="mono">搜索收藏 / Search</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入标题、来源、主题或标签" /></label>
        <div className="filter-row">{libraryFilters.map((filter) => <button className={active === filter ? 'is-active' : ''} onClick={() => setActive(filter)} key={filter}>{filter}</button>)}</div>
      </div>
      <div className="library-grid">{visible.map((item) => <LibraryCard item={item} key={item.id} />)}</div>
      {visible.length === 0 && <div className="empty-result"><b>这里暂时没有匹配收藏。</b><span>换一个关键词，或者查看“全部”。</span></div>}
    </section>
  );
}
