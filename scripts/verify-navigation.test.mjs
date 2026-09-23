import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import matter from 'gray-matter';
import { readUrlFilter, writeUrlFilter } from '../lib/filter-url.ts';
import { getAllNotes } from '../lib/notes.ts';
import { stories, experiments, tools, toolCategories } from '../app/data/content.ts';
import { libraryItems } from '../app/data/library.ts';
import { promptFilters, promptItems } from '../app/data/prompts.ts';

// Run after build: inspect real exported anchors, not embedded React payloads.
function anchors(file) {
  const html = readFileSync(join(process.cwd(), 'out', file), 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  return [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"[^>]*>/g)]
    .map((match) => match[1].replaceAll('&amp;', '&'));
}

const groups = [
  { path: 'notes', key: 'category', hash: '#all-notes', values: ['AI TIPS', 'AI EVAL', 'MAKING OF', 'AI BRIEFING'] },
  { path: 'library', key: 'type', hash: '#library-all', values: ['ARTICLE', 'VIDEO', 'PDF', 'TOOL', 'JING PICKS'] },
];

test('homepage tool entrance reaches the work-scene choices', () => {
  const home = anchors('index.html');
  const toolsHtml = readFileSync(join(process.cwd(), 'out/tools/index.html'), 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  assert.ok(home.includes('/tools/#work-scenes'), 'Homepage must link directly to work scenes');
  assert.match(toolsHtml, /<section\b[^>]*id="work-scenes"/, 'Work-scene target is missing');
});

test('story cards preserve semantic titles, original status and detail links', () => {
  for (const file of ['index.html', 'stories/index.html']) {
    const html = readFileSync(join(process.cwd(), 'out', file), 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    for (const item of stories) {
      const start = html.indexOf(`<article class="story-card" id="${item.id}">`);
      if (start < 0 && file === 'index.html') continue;
      assert.ok(start >= 0, `Missing story card: ${item.id}`);
      const next = html.indexOf('<article class="story-card"', start + 1);
      const card = html.slice(start, next < 0 ? undefined : next);
      if (item.titleParts) {
        assert.equal(item.titleParts.join(''), item.title, `Title changed: ${item.id}`);
        assert.ok(item.titleParts.every((part) => part.trim().length > 1), `Orphan group: ${item.id}`);
        for (const part of item.titleParts) assert.ok(card.includes(`<span class="story-title-part">${part}</span>`), `Missing title group: ${item.id} / ${part}`);
      } else {
        assert.ok(card.includes(`<h3>${item.title}</h3>`), `Short title changed: ${item.id}`);
      }
      assert.ok(card.includes(item.status), `Status changed: ${item.id}`);
      assert.ok(card.includes(`/stories/${item.slug}/`), `Missing detail link: ${item.id}`);
    }
  }
});

test('experiment card title groups preserve titles, status and detail links', () => {
  for (const file of ['index.html', 'experiments/index.html']) {
    const html = readFileSync(join(process.cwd(), 'out', file), 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    for (const item of experiments) {
      assert.equal(item.titleParts.join(''), item.title, `Title changed: ${item.id}`);
      assert.ok(item.titleParts.every((part) => part.trim().length > 1), `Orphan group: ${item.id}`);
      // ProjectVisual can contain nested articles; do not stop at its closing tag.
      const start = html.indexOf(`<article class="experiment-card" id="${item.id}">`);
      const next = html.indexOf('<article class="experiment-card"', start + 1);
      const card = start < 0 ? undefined : html.slice(start, next < 0 ? undefined : next);
      if (!card && file === 'index.html') continue;
      assert.ok(card, `Missing experiment card: ${item.id}`);
      for (const part of item.titleParts) assert.ok(card.includes(`<span class="experiment-title-part">${part}</span>`), `Missing title group: ${item.id} / ${part}`);
      assert.ok(card.includes(item.status), `Status changed: ${item.id}`);
      assert.ok(card.includes(`/experiments/${item.slug}/`), `Missing detail link: ${item.id}`);
    }
  }
});

test('library semantic title groups preserve original titles in both card contexts', () => {
  const pages = ['index.html', 'library/index.html'].map((file) => readFileSync(join(process.cwd(), 'out', file), 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ''));
  for (const item of libraryItems.filter((item) => item.titleParts)) {
    assert.equal(item.titleParts.join(''), item.title, `Title changed: ${item.id}`);
    assert.ok(item.titleParts.every((part) => part.trim().length > 1), `Orphan title group: ${item.id}`);
    const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    for (const html of pages) {
      // A card may not be selected for the homepage, but its full library card must exist.
      if (!html.includes(item.url.replaceAll('&', '&amp;'))) continue;
      for (const part of item.titleParts) assert.ok(html.includes(`<span class="library-title-part">${escape(part)}</span>`), `Missing title group: ${item.id} / ${part}`);
    }
  }
});

test('homepage featured story and recent library picks match source data', () => {
  const html = readFileSync(join(process.cwd(), 'out/index.html'), 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const featured = stories.find((story) => story.slug === 'she-forgets-yesterday') ?? stories[0];
  const section = html.match(/<section\b[^>]*id="featured-story"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(section, 'Missing featured story');
  for (const value of [featured.title, featured.description, featured.status, `/stories/${featured.slug}/`]) {
    assert.ok(section.includes(value), `Featured story mismatch: ${value}`);
  }
  const picksSection = html.match(/<section\b[^>]*class="home-picks section-shell"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(picksSection, 'Missing home picks');
  const expected = libraryItems.filter((item) => item.jingPick).sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, 4);
  let previous = -1;
  for (const item of expected) {
    const position = picksSection.indexOf(item.url.replaceAll('&', '&amp;'));
    assert.ok(position > previous, `Missing or out-of-order recent pick: ${item.id}`);
    previous = position;
  }
});

test('featured note introduction follows the selected note metadata', () => {
  const notes = getAllNotes();
  const featured = notes.find((note) => note.featured) ?? notes[0];
  assert.ok(featured);
  const html = readFileSync(join(process.cwd(), 'out/notes/index.html'), 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const section = html.match(/<section\b[^>]*id="featured-note"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(section, 'Missing featured section');
  const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
  assert.ok(section.replaceAll('<br/>', '').includes(escape(featured.title)), 'Featured title mismatch');
  assert.ok(section.includes(escape(featured.description)), 'Featured introduction mismatch');
  assert.ok(section.includes(`/notes/${featured.slug}/"`), 'Featured target mismatch');
  const status = featured.demo ? 'Demo 内容' : featured.editorialStatus === 'draft' ? '编辑稿 · 待荆确认' : featured.editorialStatus === 'source-backed' ? '资料文章 · 来源已核对' : '正式笔记';
  assert.ok(section.includes(status), 'Missing featured content status');
});

for (const group of groups) {
  test(`${group.path}: filtered entrance lands on a focusable section heading`, () => {
    const html = readFileSync(join(process.cwd(), 'out', group.path, 'index.html'), 'utf8')
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    const headingId = group.path === 'notes' ? 'all-notes-title' : 'library-all-title';
    assert.match(html, new RegExp(`<section\\b[^>]*id="${group.hash.slice(1)}"`), 'Filter target is missing');
    assert.match(html, new RegExp(`<h2\\b[^>]*id="${headingId}"[^>]*tabindex="-1"`), 'Filtered heading must accept keyboard focus');
  });

  test(`${group.path}: missing, empty and invalid filters fall back to all`, () => {
    for (const search of ['', `?${group.key}=`, `?${group.key}=UNKNOWN`, `?${group.key}=%E0%A4%A`]) {
      assert.equal(readUrlFilter(search, group.key, group.values), '全部');
    }
  });

  test(`${group.path}: category round trips preserve path, hash and unrelated parameters`, () => {
    for (const value of group.values) {
      const original = `http://localhost:3000/${group.path}/?keep=yes${group.hash}`;
      const selected = writeUrlFilter(original, group.key, value);
      assert.equal(readUrlFilter(selected.search, group.key, group.values), value);
      assert.equal(selected.pathname, `/${group.path}/`);
      assert.equal(selected.hash, group.hash);
      assert.equal(selected.searchParams.get('keep'), 'yes');
      const reset = writeUrlFilter(selected.href, group.key, '全部');
      assert.equal(reset.href, original);
      assert.equal(readUrlFilter(reset.search, group.key, group.values), '全部');
      assert.equal(writeUrlFilter(selected.href, group.key, value).href, selected.href);
    }
  });

  test(`${group.path}: every exported category entrance selects the expected filter`, () => {
    const links = anchors(`${group.path}/index.html`).map((href) => new URL(href, `http://localhost:3000/${group.path}/`));
    for (const value of group.values) {
      assert.ok(links.some((url) => url.pathname.endsWith(`/${group.path}/`) && url.hash === group.hash && url.searchParams.get(group.key) === value), `Missing entrance: ${value}`);
    }
    const filtered = links.filter((url) => url.searchParams.has(group.key));
    for (const url of filtered) assert.ok(group.values.includes(url.searchParams.get(group.key)), `Invalid category link: ${url}`);
  });
}

test('encoded spaces and plus signs both restore the selected category', () => {
  for (const value of ['AI%20EVAL', 'AI+EVAL']) {
    assert.equal(readUrlFilter(`?category=${value}`, 'category', ['AI EVAL']), 'AI EVAL');
  }
});

test('Prompt category drawers lead to the matching focusable catalog section', () => {
  const links = anchors('prompts/index.html').map((href) => new URL(href, 'http://localhost:3000/prompts/'));
  const html = readFileSync(join(process.cwd(), 'out/prompts/all/index.html'), 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  assert.match(html, /<section\b[^>]*id="prompt-collection"/, 'Prompt catalog target is missing');
  assert.match(html, /<h2\b[^>]*id="prompt-collection-title"[^>]*tabindex="-1"/, 'Prompt catalog heading must accept keyboard focus');
  for (const category of promptFilters.filter((filter) => filter !== '全部')) {
    assert.ok(promptItems.some((item) => item.category === category), `Empty Prompt category: ${category}`);
    assert.ok(links.some((url) => url.pathname === '/prompts/all/' && url.searchParams.get('category') === category && url.hash === '#prompt-collection'), `Missing category entrance: ${category}`);
    const selected = writeUrlFilter('http://localhost:3000/prompts/all/?keep=yes#prompt-collection', 'category', category);
    assert.equal(readUrlFilter(selected.search, 'category', promptFilters), category);
    assert.equal(writeUrlFilter(selected.href, 'category', '全部').href, 'http://localhost:3000/prompts/all/?keep=yes#prompt-collection');
  }
  assert.equal(readUrlFilter('?category=UNKNOWN', 'category', promptFilters), '全部');
});

test('story and experiment Prompt entrances reach their exact reusable templates', () => {
  const html = readFileSync(join(process.cwd(), 'out/prompts/all/index.html'), 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  for (const [source, promptId] of [
    ['stories/before-the-water-recedes', 'video-causal-motion-gate'],
    ['experiments/can-a-fictional-poster-grow-a-story', 'poster-to-story-short-ledger'],
    ['experiments/does-the-short-evidence-ledger-travel', 'poster-to-story-short-ledger'],
    ['experiments/can-water-recede-after-the-umbrella-opens', 'video-causal-motion-gate'],
  ]) {
    assert.ok(promptItems.some((item) => item.id === promptId), `Unknown Prompt template: ${promptId}`);
    const links = anchors(`${source}/index.html`).map((href) => new URL(href, `http://localhost:3000/${source}/`));
    assert.ok(links.some((url) => url.pathname === '/prompts/all/' && url.hash === `#prompt-${promptId}` && url.searchParams.get('category') === 'AI 视频制作'), `Missing exact template entrance from ${source}`);
    assert.match(html, new RegExp(`<article\\b[^>]*id="prompt-${promptId}"`), `Missing template anchor: ${promptId}`);
    assert.match(html, new RegExp(`<h2\\b[^>]*id="prompt-title-${promptId}"[^>]*tabindex="-1"`), `Template heading must accept focus: ${promptId}`);
  }
});

test('method notes and companion tools open the matching Prompt template or category', () => {
  const catalog = readFileSync(join(process.cwd(), 'out/prompts/all/index.html'), 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  for (const [source, promptId] of [
    ['notes/poster-to-story-evidence-ledger', 'poster-to-story-short-ledger'],
    ['notes/causal-motion-five-point-ledger', 'video-causal-motion-gate'],
    ['notes/ai-video-character-consistency', 'video-character-anchor-brief'],
    ['notes/ai-video-scene-consistency', 'video-scene-anchor-brief'],
    ['notes/ai-video-prompt-shot-facts', 'video-single-shot-motion'],
    ['notes/first-last-frame-motion-prompt', 'video-first-last-frame-bridge'],
    ['notes/ai-video-sound-workflow', 'video-sound-layer-brief'],
    ['notes/video-failure-cases', 'video-failure-revision'],
    ['notes/ai-video-shot-continuity', 'video-cut-continuity-handoff'],
    ['notes/ai-video-generation-version-log', 'video-candidate-review-table'],
    ['tools/poster-story-builder', 'poster-to-story-short-ledger'],
    ['tools/character-anchor', 'video-character-anchor-brief'],
    ['tools/scene-anchor', 'video-scene-anchor-brief'],
    ['tools/shot-prompt-builder', 'video-single-shot-motion'],
    ['tools/shot-risk-checker', 'video-first-last-frame-bridge'],
    ['tools/sound-layer-card', 'video-sound-layer-brief'],
    ['tools/continuity-checker', 'video-cut-continuity-handoff'],
    ['tools/shot-version-recorder', 'video-candidate-review-table'],
  ]) {
    assert.ok(promptItems.some((item) => item.id === promptId), `Unknown Prompt template: ${promptId}`);
    const links = anchors(`${source}/index.html`).map((href) => new URL(href, `http://localhost:3000/${source}/`));
    assert.ok(links.some((url) => url.pathname === '/prompts/all/' && url.hash === `#prompt-${promptId}` && url.searchParams.get('category') === 'AI 视频制作'), `Missing exact template entrance from ${source}`);
    assert.match(catalog, new RegExp(`<article\\b[^>]*id="prompt-${promptId}"`), `Missing template anchor: ${promptId}`);
  }
  for (const source of ['tools/shot-prompt-builder']) {
    const links = anchors(`${source}/index.html`).map((href) => new URL(href, `http://localhost:3000/${source}/`));
    assert.ok(links.some((url) => url.pathname === '/prompts/all/' && url.hash === '#prompt-collection' && url.searchParams.get('category') === 'AI 视频制作'), `Missing video category entrance from ${source}`);
  }
  assert.equal(promptItems.filter((item) => item.category === 'AI 视频制作').length, 10, 'Production template count changed');
  for (const [promptId, destinations] of [
    ['video-character-anchor-brief', ['/notes/ai-video-character-consistency/', '/tools/character-anchor/']],
    ['video-scene-anchor-brief', ['/notes/ai-video-scene-consistency/', '/tools/scene-anchor/']],
    ['video-single-shot-motion', ['/notes/ai-video-prompt-shot-facts/', '/tools/shot-prompt-builder/']],
    ['video-first-last-frame-bridge', ['/notes/first-last-frame-motion-prompt/', '/tools/shot-risk-checker/']],
    ['video-sound-layer-brief', ['/notes/ai-video-sound-workflow/', '/tools/sound-layer-card/']],
    ['video-failure-revision', ['/notes/video-failure-cases/']],
    ['video-cut-continuity-handoff', ['/notes/ai-video-shot-continuity/', '/tools/continuity-checker/']],
    ['video-candidate-review-table', ['/notes/ai-video-generation-version-log/', '/tools/shot-version-recorder/']],
    ['video-causal-motion-gate', ['/notes/causal-motion-five-point-ledger/', '/tools/waterline-motion-card/']],
    ['poster-to-story-short-ledger', ['/notes/poster-to-story-evidence-ledger/', '/tools/poster-story-builder/']],
  ]) {
    const prompt = promptItems.find((item) => item.id === promptId);
    assert.ok(prompt, `Unknown Prompt template: ${promptId}`);
    for (const href of destinations) assert.ok(prompt.relatedLinks?.some((link) => link.href === href), `Missing contextual link from ${promptId} to ${href}`);
  }
  assert.ok(readFileSync(join(process.cwd(), 'out/tools/shot-prompt-builder/index.html'), 'utf8').includes('查看 10 条制作模板'), 'Tool page template count is stale');
});

test('copied video templates preserve editorial status and evidence boundaries', () => {
  const videoItems = promptItems.filter((item) => item.category === 'AI 视频制作');
  assert.equal(videoItems.length, 10);
  for (const item of videoItems) {
    assert.equal(item.editorial, true, `${item.id}: missing editorial status`);
    assert.ok(item.prompt.startsWith('【状态】本站编辑候选，待荆确认'), `${item.id}: copied Prompt omits status`);
    assert.ok(item.usageNote.startsWith('编辑候选 · 待荆确认'), `${item.id}: visible usage note omits status`);
  }
  for (const [id, boundary] of [
    ['video-character-anchor-brief', '未提供参考图时'],
    ['video-scene-anchor-brief', '没有参考图或场景图时'],
    ['video-single-shot-motion', '实际观察栏留空'],
    ['video-first-last-frame-bridge', '没有两张实际端点图时'],
    ['video-sound-layer-brief', '没有实际音视频时'],
    ['video-failure-revision', '不强行凑主因或次因'],
    ['video-cut-continuity-handoff', '资料不足／待实测'],
    ['video-candidate-review-table', '未提供真实样本时只生成空表'],
    ['video-causal-motion-gate', '待测试 Prompt，不代表已经生成或通过'],
    ['poster-to-story-short-ledger', '没有实际海报图时'],
  ]) {
    assert.ok(videoItems.find((item) => item.id === id)?.prompt.includes(boundary), `${id}: missing evidence boundary`);
  }
});

test('every exported note has top and bottom links to its own category', () => {
  const filenames = readdirSync(join(process.cwd(), 'content/notes')).filter((name) => name.endsWith('.md'));
  assert.ok(filenames.length > 0);
  for (const filename of filenames) {
    const { data } = matter(readFileSync(join(process.cwd(), 'content/notes', filename), 'utf8'));
    const slug = data.slug ?? filename.replace(/\.md$/, '');
    const links = anchors(`notes/${slug}/index.html`).map((href) => new URL(href, `http://localhost:3000/notes/${slug}/`));
    const returns = links.filter((url) => url.pathname.endsWith('/notes/') && url.hash === '#all-notes' && url.searchParams.get('category') === data.category);
    assert.equal(returns.length, 2, `${slug}: expected top and bottom category links`);
  }
});

test('all notes, including featured notes, are present in the exported search list', () => {
  const html = readFileSync(join(process.cwd(), 'out/notes/index.html'), 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const resultStart = html.indexOf('id="note-browser-results"');
  assert.ok(resultStart >= 0, 'Missing note result container');
  const results = html.slice(resultStart);
  for (const filename of readdirSync(join(process.cwd(), 'content/notes')).filter((name) => name.endsWith('.md'))) {
    const { data } = matter(readFileSync(join(process.cwd(), 'content/notes', filename), 'utf8'));
    const slug = data.slug ?? filename.replace(/\.md$/, '');
    assert.ok(results.includes(`/notes/${slug}/"`), `Missing searchable note: ${slug}`);
  }
});

test('unpublished contact destinations remain explicit non-links', () => {
  const html = readFileSync(join(process.cwd(), 'out/index.html'), 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const footer = html.match(/<footer\b[^>]*class="site-footer"[^>]*>([\s\S]*?)<\/footer>/)?.[1];
  assert.ok(footer, 'Missing site footer');
  assert.ok(footer.includes('当前没有公开的社交账号或联系邮箱'), 'Missing public contact boundary');
  assert.ok(footer.includes('联系地址尚未公开'), 'Email placeholder is not explicit');
  assert.equal((footer.match(/<a\b/g) ?? []).length, 1, 'Unpublished destinations must not become links');
  assert.ok(footer.includes('Back to top'), 'Footer navigation link is missing');
});

test('tool work scenes link each real desk to its method note', () => {
  const html = readFileSync(join(process.cwd(), 'out/tools/index.html'), 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const section = html.match(/<section\b[^>]*class="tool-work-scenes archive-shell"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(section, 'Missing work-scene entrance');
  assert.match(section, /<h2\b[^>]*id="tool-work-scenes-title"[^>]*tabindex="-1"/, 'Hash target heading must accept keyboard focus');
  for (const [tool, note] of [
    ['rule-review', 'synthetic-rule-knowledge-desk'],
    ['multimodal-evaluation', 'video-evaluation-eight-dimensions'],
    ['agent-trace-review', 'office-agent-trajectory-review'],
    ['dataset-release', 'dataset-release-gates'],
  ]) {
    assert.ok(section.includes(`/tools/${tool}/`), `Missing desk: ${tool}`);
    assert.ok(section.includes(`/notes/${note}/`), `Missing method note: ${note}`);
  }
  assert.equal((section.match(/class="tool-work-scene tool-work-scene-/g) ?? []).length, 4, 'Work scenes should form four complete tool-and-note pairs');
  assert.equal((section.match(/aria-labelledby="work-scene-tool-/g) ?? []).length, 4, 'Each work-scene article needs a spoken name');
  assert.equal((section.match(/<h3 id="work-scene-tool-/g) ?? []).length, 4, 'Each article name must refer to its question');
  for (const title of ['视频评测：固定八个维度', '办公 Agent：从结果到过程', '数据交付：先过四道关']) {
    assert.ok(section.includes(title), `Missing named method note: ${title}`);
  }
  assert.ok(html.includes('href="#work-scenes"'), 'Missing direct work-scene anchor');
});

test('every tool shelf anchor has a focusable named heading', () => {
  const html = readFileSync(join(process.cwd(), 'out/tools/index.html'), 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  for (const [hash, headingId] of [
    ['work-scenes', 'tool-work-scenes-title'],
    ['tool-workflow-title', 'tool-workflow-title'],
    ['all-tools', 'tool-directory-title'],
  ]) {
    assert.ok(html.includes(`href="#${hash}"`), `Missing shelf entrance: ${hash}`);
    assert.ok(html.includes(`id="${hash}"`), `Missing shelf target: ${hash}`);
    assert.match(html, new RegExp(`<h2\\b[^>]*id="${headingId}"[^>]*tabindex="-1"`), `Shelf heading must accept focus: ${headingId}`);
  }
});

test('every listed tool has one visible work-use filter', () => {
  const html = readFileSync(join(process.cwd(), 'out/tools/index.html'), 'utf8');
  assert.ok(html.includes('aria-label="按工作用途筛选工具"'));
  assert.equal(new Set(tools.map((tool) => tool.id)).size, tools.length);
  assert.equal(toolCategories.reduce((count, category) => count + tools.filter((tool) => tool.category === category).length, 0), tools.length);
  for (const category of toolCategories) {
    assert.ok(html.includes(category), `Missing filter: ${category}`);
    assert.ok(tools.some((tool) => tool.category === category), `Empty filter: ${category}`);
  }
});
