'use client';

import { useRef, useState } from 'react';
import { toolCategories, tools, type ToolCategory } from '../data/content';
import { ToolCard } from './tool-card';
import { ToolOutputGuide } from './tool-output-guide';

export function ToolDirectory() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ToolCategory | '全部'>('全部');
  const searchRef = useRef<HTMLInputElement>(null);
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const matches = tools.filter((tool) => {
    const text = `${tool.label} ${tool.title} ${tool.description}`.toLocaleLowerCase();
    return (category === '全部' || tool.category === category) && terms.every((term) => text.includes(term));
  });

  function clearSearch() {
    setQuery('');
    searchRef.current?.focus();
  }

  function clearFilters() {
    setCategory('全部');
    clearSearch();
  }

  const resultMessage = category === '全部'
    ? terms.length ? `找到 ${matches.length} 个工具` : `全部 ${tools.length} 个工具`
    : terms.length ? `在${category}中找到 ${matches.length} 个工具` : `${category} · ${matches.length} 个工具`;

  return (
    <section className="tool-directory archive-shell" aria-labelledby="tool-directory-title" id="all-tools">
      <div className="tool-archive-heading">
        <div><p className="eyebrow mono">ALL TOOLS / 完整工具箱</p><h2 id="tool-directory-title" tabIndex={-1}>需要哪一件，<br />就拿哪一件。</h2></div>
        <p>每个工具都可以独立使用，所有输入只在当前浏览器本地处理。</p>
      </div>
      <ToolOutputGuide />
      <div className="tool-directory-filters" role="group" aria-label="按工作用途筛选工具">
        {(['全部', ...toolCategories] as const).map((option) => (
          <button className="tool-filter" type="button" key={option} aria-pressed={category === option} aria-controls="tool-search-results" onClick={() => setCategory(option)}>
            {option}<span className="tool-filter-count mono">{option === '全部' ? tools.length : tools.filter((tool) => tool.category === option).length}</span>
          </button>
        ))}
      </div>
      <div className="tool-directory-search" role="search" aria-label="查找本地工具">
        <label htmlFor="tool-search">输入名称或用途</label>
        <div className="tool-search-input">
          <input id="tool-search" type="search" ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Escape') clearSearch(); }} placeholder="例如：水线、声音、预算、Prompt" aria-controls="tool-search-results" />
          {query && <button type="button" onClick={clearSearch}>清除搜索</button>}
        </div>
        <p role="status" aria-live="polite" aria-atomic="true">{resultMessage}</p>
      </div>
      <div className="tools-page-grid" id="tool-search-results">
        {matches.map((tool) => <ToolCard tool={tool} index={tools.indexOf(tool)} key={tool.id} />)}
      </div>
      {matches.length === 0 && <div className="tool-search-empty"><h3>没有找到匹配的工具</h3><p>试试更短的词，或清除用途筛选与搜索，重新浏览全部工具。</p><button type="button" onClick={clearFilters}>查看全部工具</button></div>}
    </section>
  );
}
