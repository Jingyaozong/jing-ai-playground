'use client';

import { useMemo, useState } from 'react';
import type { PromptItem } from '../data/prompts';
import { promptFilters } from '../data/prompts';

function PromptCard({ item, index }: { item: PromptItem; index: number }) {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    await navigator.clipboard.writeText(item.prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <article className={`prompt-card prompt-card-${index % 4}`}>
      <div className="prompt-card-top mono">
        <span>{item.category} / {String(index + 1).padStart(2, '0')}</span>
        <span>{item.demo ? 'DEMO' : item.dateAdded.replaceAll('-', ' / ')}</span>
      </div>
      <div className="prompt-card-heading">
        <div>
          <p className="mono">{item.model}</p>
          <h2>{item.title}</h2>
        </div>
        <span className="prompt-brace" aria-hidden="true">{'{ }'}</span>
      </div>
      <p className="prompt-description">{item.description}</p>
      <details className="prompt-sheet">
        <summary><span className="mono">完整 Prompt / 点击展开</span><i>展开 ↓</i></summary>
        <p>{item.prompt}</p>
      </details>
      {item.variables.length > 0 && <div className="prompt-variables">
        <span className="mono">可替换变量</span>
        <div>{item.variables.map((variable) => <span key={variable}>【{variable}】</span>)}</div>
      </div>}
      <blockquote><span className="mono">使用提示 / HOW TO USE</span>{item.usageNote}</blockquote>
      <div className="prompt-card-bottom">
        <div className="note-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <button type="button" onClick={copyPrompt} aria-live="polite">{copied ? '已复制 ✓' : '复制 Prompt'}</button>
      </div>
    </article>
  );
}

export function PromptBrowser({ items }: { items: PromptItem[] }) {
  const [active, setActive] = useState('全部');
  const [query, setQuery] = useState('');
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter((item) => {
      const categoryMatch = active === '全部' || item.category === active;
      const haystack = `${item.title} ${item.description} ${item.prompt} ${item.tags.join(' ')}`.toLowerCase();
      return categoryMatch && (!normalized || haystack.includes(normalized));
    });
  }, [active, items, query]);

  return (
    <section className="content-browser" aria-label="筛选 Prompt">
      <div className="browser-toolbar">
        <label className="search-field">
          <span className="mono">搜索 / Search</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入用途、模型或关键词" />
        </label>
        <div className="filter-row" aria-label="Prompt 分类">
          {promptFilters.map((filter) => <button type="button" className={active === filter ? 'is-active' : ''} onClick={() => setActive(filter)} key={filter}>{filter}</button>)}
        </div>
      </div>
      <div className="prompt-grid">{visible.map((item, index) => <PromptCard item={item} index={index} key={item.id} />)}</div>
      {visible.length === 0 && <div className="empty-result"><b>暂时没有匹配的 Prompt。</b><span>换一个关键词，或者查看“全部”。</span></div>}
    </section>
  );
}
