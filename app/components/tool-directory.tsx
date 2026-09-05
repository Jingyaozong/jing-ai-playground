'use client';

import { useRef, useState } from 'react';
import { tools } from '../data/content';
import { ToolCard } from './tool-card';

export function ToolDirectory() {
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const matches = tools.filter((tool) => {
    const text = `${tool.label} ${tool.title} ${tool.description}`.toLocaleLowerCase();
    return terms.every((term) => text.includes(term));
  });

  function clearSearch() {
    setQuery('');
    searchRef.current?.focus();
  }

  return (
    <section className="tool-directory archive-shell" aria-labelledby="tool-directory-title" id="all-tools">
      <div className="tool-archive-heading">
        <div><p className="eyebrow mono">ALL TOOLS / 完整工具箱</p><h2 id="tool-directory-title">需要哪一件，<br />就拿哪一件。</h2></div>
        <p>每个工具都可以独立使用，所有输入只在当前浏览器本地处理。</p>
      </div>
      <div className="tool-directory-search" role="search" aria-label="查找本地工具">
        <label htmlFor="tool-search">按名称或用途查找</label>
        <div className="tool-search-input">
          <input id="tool-search" type="search" ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Escape') clearSearch(); }} placeholder="例如：水线、声音、预算、Prompt" aria-controls="tool-search-results" />
          {query && <button type="button" onClick={clearSearch}>清除搜索</button>}
        </div>
        <p role="status" aria-live="polite" aria-atomic="true">{terms.length ? `找到 ${matches.length} 个工具` : `全部 ${tools.length} 个工具`}</p>
      </div>
      <div className="tools-page-grid" id="tool-search-results">
        {matches.map((tool) => <ToolCard tool={tool} index={tools.indexOf(tool)} key={tool.id} />)}
      </div>
      {matches.length === 0 && <div className="tool-search-empty"><h3>没有找到匹配的工具</h3><p>试试更短的词，比如“镜头”或“声音”，也可以查看全部工具。</p><button type="button" onClick={clearSearch}>查看全部工具</button></div>}
    </section>
  );
}
