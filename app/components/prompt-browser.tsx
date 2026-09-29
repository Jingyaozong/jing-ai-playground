'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import type { PromptItem } from '../data/prompts';
import { promptFilters } from '../data/prompts';
import { readUrlFilter, writeUrlFilter } from '../../lib/filter-url';

function subscribeToCategory(onChange: () => void) {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
}

function readCategory() {
  return readUrlFilter(window.location.search, 'category', promptFilters);
}

function selectCategory(category: string) {
  const url = writeUrlFilter(window.location.href, 'category', category);
  const leavingCard = url.hash.startsWith('#prompt-') && url.hash !== '#prompt-collection';
  if (leavingCard) url.hash = '#prompt-collection';
  if (url.href === window.location.href) return;
  window.history.pushState(null, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
  if (leavingCard) document.getElementById('prompt-collection')?.scrollIntoView({ block: 'start', behavior: 'instant' });
}

function PromptCard({ item, index }: { item: PromptItem; index: number }) {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    await navigator.clipboard.writeText(item.prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <article className={`prompt-card prompt-card-${index % 4}`} id={`prompt-${item.id}`}>
      <div className="prompt-card-top mono">
        <span>{item.category} / {String(index + 1).padStart(2, '0')}</span>
        <span>{item.demo ? 'DEMO' : item.editorial ? 'EDITORIAL TEMPLATE' : item.sourceAdapted ? '本站改写 · 非原文' : item.dateAdded.replaceAll('-', ' / ')}</span>
      </div>
      <div className="prompt-card-heading">
        <div>
          <p className="mono">{item.model}</p>
          <h2 id={`prompt-title-${item.id}`} tabIndex={-1}>{item.title}</h2>
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
      {(item.sourceHref || item.relatedLinks?.length) && <nav className="prompt-related-links" aria-label={`${item.title} 关联入口`}>
        {item.sourceHref && (item.sourceHref.startsWith('https://')
          ? <a className="prompt-source-link" href={item.sourceHref} target="_blank" rel="noopener noreferrer">{item.sourceLabel ?? '查看模板来源 ↗'}</a>
          : <Link className="prompt-source-link" href={item.sourceHref}>{item.sourceLabel ?? '查看模板来源 ↗'}</Link>)}
        {item.relatedLinks?.map((link) => <Link className="prompt-source-link" href={link.href} key={link.href}>{link.label}</Link>)}
      </nav>}
      <div className="prompt-card-bottom">
        <div className="note-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <button type="button" onClick={copyPrompt} aria-live="polite">{copied ? '已复制 ✓' : '复制 Prompt'}</button>
      </div>
    </article>
  );
}

export function PromptBrowser({ items, showToolbar = true }: { items: PromptItem[]; showToolbar?: boolean }) {
  const urlCategory = useSyncExternalStore(subscribeToCategory, readCategory, () => '全部');
  const active = showToolbar ? urlCategory : '全部';
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const pendingPromptFocus = useRef(true);
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter((item) => {
      const categoryMatch = active === '全部' || item.category === active;
      const haystack = `${item.title} ${item.description} ${item.prompt} ${item.tags.join(' ')}`.toLowerCase();
      return categoryMatch && (!normalized || haystack.includes(normalized));
    });
  }, [active, items, query]);

  useEffect(() => {
    if (!showToolbar) return;
    let focusFrame = 0;

    const focusPrompt = () => {
      if (!pendingPromptFocus.current || active !== readCategory()) return;
      const hash = window.location.hash;
      if (!hash.startsWith('#prompt-') || hash === '#prompt-collection') return;
      const item = items.find((candidate) => hash === `#prompt-${candidate.id}`);
      if (!item || (active !== '全部' && item.category !== active)) return;
      const heading = document.getElementById(`prompt-title-${item.id}`);
      if (heading) {
        heading.focus({ preventScroll: true });
        document.getElementById(`prompt-${item.id}`)?.scrollIntoView({ block: 'start', behavior: 'instant' });
        pendingPromptFocus.current = false;
      }
    };

    const onLocationChange = () => {
      pendingPromptFocus.current = true;
      window.cancelAnimationFrame(focusFrame);
      focusFrame = window.requestAnimationFrame(() => {
        focusFrame = window.requestAnimationFrame(focusPrompt);
      });
    };

    onLocationChange();
    window.addEventListener('hashchange', onLocationChange);
    window.addEventListener('popstate', onLocationChange);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener('hashchange', onLocationChange);
      window.removeEventListener('popstate', onLocationChange);
    };
  }, [active, items, showToolbar]);

  return (
    <section className="content-browser" aria-label="筛选 Prompt">
      {showToolbar && <div className="browser-toolbar">
        <label className="search-field">
          <span className="mono">搜索 / Search</span>
          <input ref={searchRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入用途、模型或关键词" aria-controls="prompt-browser-results" />
        </label>
        <div className="filter-row" aria-label="Prompt 分类">
          {promptFilters.map((filter) => <button type="button" aria-pressed={active === filter} className={active === filter ? 'is-active' : ''} onClick={() => selectCategory(filter)} key={filter}>{filter}</button>)}
        </div>
      </div>}
      {showToolbar && <p className="prompt-result-count" role="status" aria-live="polite" aria-atomic="true">{active} · 显示 {visible.length} 条 Prompt{query.trim() && ` · 关键词：${query.trim()}`}</p>}
      <div className="prompt-grid" id={showToolbar ? 'prompt-browser-results' : undefined}>{visible.map((item, index) => <PromptCard item={item} index={index} key={item.id} />)}</div>
      {visible.length === 0 && <div className="empty-result"><b>暂时没有匹配的 Prompt。</b><span>换一个关键词，或清除搜索与分类筛选。</span><button type="button" onClick={() => { setQuery(''); selectCategory('全部'); searchRef.current?.focus({ preventScroll: true }); }}>清除筛选，查看全部</button></div>}
    </section>
  );
}
