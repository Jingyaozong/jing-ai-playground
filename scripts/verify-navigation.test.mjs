import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import matter from 'gray-matter';
import { readUrlFilter, writeUrlFilter } from '../lib/filter-url.ts';
import { getAllNotes } from '../lib/notes.ts';
import { stories, experiments } from '../app/data/content.ts';
import { libraryItems } from '../app/data/library.ts';

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
  for (const [tool, note] of [
    ['rule-review', 'synthetic-rule-knowledge-desk'],
    ['multimodal-evaluation', 'video-evaluation-eight-dimensions'],
    ['agent-trace-review', 'office-agent-trajectory-review'],
  ]) {
    assert.ok(section.includes(`/tools/${tool}/`), `Missing desk: ${tool}`);
    assert.ok(section.includes(`/notes/${note}/`), `Missing method note: ${note}`);
  }
  assert.ok(html.includes('href="#work-scenes"'), 'Missing direct work-scene anchor');
});
