import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { readUrlFilter, writeUrlFilter } from '../lib/filter-url.ts';
import { getAllNotes } from '../lib/notes.ts';
import { experiments, experimentEvidenceLabels, tools, toolCategories } from '../app/data/content.ts';
import { experimentDetails } from '../app/data/experiments.ts';
import { libraryItems } from '../app/data/library.ts';
import { promptFilters, promptItems, promptSource } from '../app/data/prompts.ts';
import { promptResources } from '../app/data/prompt-resources.ts';
import { calculateReviewPace, calculateReviewPaceTarget, compareReviewPaceMix, formatReviewPaceSummary } from '../app/data/review-pace.ts';
import { summarizeTrialTimeLog, trialTimeLogHeaders } from '../app/data/review-pace-import.ts';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const deploymentBasePath = process.env.GITHUB_ACTIONS === 'true' && repositoryName && !repositoryName.endsWith('.github.io') ? `/${repositoryName}` : '';

function routeWithoutBase(href, base = deploymentBasePath) {
  if (!base) return href;
  return href === base ? '/' : href.startsWith(`${base}/`) ? href.slice(base.length) : href;
}

test('deployment route comparisons strip only the exact repository prefix', () => {
  assert.equal(routeWithoutBase('/jing-ai-playground/tools/?x=1#desk', '/jing-ai-playground'), '/tools/?x=1#desk');
  assert.equal(routeWithoutBase('/jing-ai-playground-other/tools/', '/jing-ai-playground'), '/jing-ai-playground-other/tools/');
  assert.equal(routeWithoutBase('https://example.com/jing-ai-playground/tools/', '/jing-ai-playground'), 'https://example.com/jing-ai-playground/tools/');
  assert.equal(routeWithoutBase('/tools/', ''), '/tools/');
});

// Run after build: inspect real exported anchors, not embedded React payloads.
test('evaluation exports retain leave protection until the current snapshot is confirmed saved', () => {
  const source = readFileSync(join(process.cwd(), 'app/components/multimodal-evaluation-desk.tsx'), 'utf8');
  const download = source.slice(source.indexOf('function downloadCsv('), source.indexOf('function confirmSavedExport('));
  assert.ok(!download.includes('setDirty(false)'), 'Starting a download must not mark edits saved');
  assert.match(download, /setExportedBatch\(batch\)/);
  const confirm = source.slice(source.indexOf('function confirmSavedExport('), source.indexOf('function completeReview('));
  assert.match(confirm, /if \(exportedBatch !== batch \|\| pendingImport \|\| loading\) return/);
  assert.match(confirm, /setDirty\(false\)/);
  assert.match(source, /disabled=\{exportedBatch !== batch \|\| !!pendingImport \|\| loading\}/);
  assert.match(source, /旧文件不包含这些新内容/);
  assert.match(source, /页面无法自动确认下载完成/);
});

test('evaluation removal offers a bounded undo without overwriting subsequent edits', () => {
  const source = readFileSync(join(process.cwd(), 'app/components/multimodal-evaluation-desk.tsx'), 'utf8');
  assert.match(source, /setRemovedSnapshot\(\{ batch, sampleIndex: selectedSample, dimensionIndex: selectedDimension \}\)/);
  assert.match(source, /setBatch\(removedSnapshot.batch\)/);
  assert.match(source, /setSelectedDimension\(removedSnapshot.dimensionIndex\)/);
  for (const handler of ['updateBatch', 'updateSample', 'updateDimension', 'addSample', 'applyImport']) {
    const body = source.slice(source.indexOf(`function ${handler}(`)).split(/\n  (?:async )?function /)[0];
    assert.ok(body.includes('setRemovedSnapshot(null)'), handler);
  }
  assert.match(source, /撤销上次移除/);
  assert.match(source, /继续编辑、新增或确认导入后，撤销失效/);
});

test('CSV desks announce pending replacements and expose a keyboard focus target', () => {
  for (const [component, state] of [['rule-review.tsx', 'pending'], ['multimodal-evaluation-desk.tsx', 'pendingImport']]) {
    const source = readFileSync(join(process.cwd(), 'app/components', component), 'utf8');
    assert.ok(source.includes(`if (${state}) importNotice.current?.focus()`));
    assert.match(source, /ref=\{importNotice\} tabIndex=\{-1\}/);
    assert.match(source, /尚未替换当前/);
  }
});

test('tool directory distinguishes drafts, human records and restorable formats', () => {
  const html = readFileSync(join(process.cwd(), 'out/tools/index.html'), 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  assert.match(html, /id="tool-output-guide"/);
  for (const text of ['生成草案', '记录人工判断', '导入后续填', '复制不等于保存', '文字副本不能代替它', '不解析任意文件']) assert.ok(html.includes(text), text);
  const guide = html.match(/<aside class="tool-output-guide"[\s\S]*?<\/aside>/)?.[0];
  assert.ok(guide);
  for (const path of ['shot-prompt-builder', 'multimodal-evaluation', 'rule-review', 'agent-trace-review']) assert.ok(guide.includes(`href="${deploymentBasePath}/tools/${path}/"`), path);
});

test('work desks expose manual copying before asking for clipboard permission', () => {
  for (const path of ['dataset-release', 'prompt-preflight', 'multimodal-evaluation']) {
    const page = readFileSync(join(process.cwd(), `out/tools/${path}/index.html`), 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    assert.match(page, /class="local-record-copy"/);
    assert.match(page, /<button[^>]*>手动复制<\/button>/);
    assert.match(page, /修改记录后请重新复制/);
    assert.doesNotMatch(page, /正在复制…/);
  }
});

function anchors(file) {
  const html = readFileSync(join(process.cwd(), 'out', file), 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  return [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"[^>]*>/g)]
    .map((match) => routeWithoutBase(match[1].replaceAll('&amp;', '&')));
}

const groups = [
  { path: 'library', key: 'type', hash: '#library-all', values: ['ARTICLE', 'VIDEO', 'PDF', 'TOOL', 'JING PICKS'] },
];

test('scroll reveal leaves content visible without browser animation support', () => {
  const css = readFileSync(join(process.cwd(), 'app', 'globals.css'), 'utf8');
  const component = readFileSync(join(process.cwd(), 'app', 'components', 'reveal.tsx'), 'utf8');
  assert.match(css, /\.reveal\s*\{[^}]*transition:/);
  assert.doesNotMatch(css, /\.reveal\s*\{[^}]*opacity:\s*0/);
  assert.match(css, /\.reveal\.reveal-armed\s*\{\s*opacity:\s*0/);
  assert.match(component, /typeof IntersectionObserver === 'undefined'/);
  assert.match(component, /classList\.add\('reveal-armed'\)/);
});

test('experiment card title groups preserve titles, status and detail links', () => {
  for (const file of ['archive/index.html', 'experiments/index.html']) {
    const html = readFileSync(join(process.cwd(), 'out', file), 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    for (const item of experiments) {
      assert.equal(item.titleParts.join(''), item.title, `Title changed: ${item.id}`);
      assert.ok(item.titleParts.every((part) => part.trim().length > 1), `Orphan group: ${item.id}`);
      // ProjectVisual can contain nested articles; do not stop at its closing tag.
      const start = html.indexOf(`<article class="experiment-card" id="${item.id}">`);
      const next = html.indexOf('<article class="experiment-card"', start + 1);
      const card = start < 0 ? undefined : html.slice(start, next < 0 ? undefined : next);
      if (!card && file === 'archive/index.html') continue;
      assert.ok(card, `Missing experiment card: ${item.id}`);
      for (const part of item.titleParts) assert.ok(card.includes(`<span class="experiment-title-part">${part}</span>`), `Missing title group: ${item.id} / ${part}`);
      assert.ok(card.includes(item.status), `Status changed: ${item.id}`);
      assert.ok(card.includes(experimentEvidenceLabels[item.evidenceKind]), `Evidence badge is missing: ${item.id}`);
      assert.ok(!card.includes('有详情记录') && !card.includes('最新研究 · 有详情'), `Generic experiment badge remains: ${item.id}`);
      assert.ok(card.includes(`/experiments/${item.slug}/`), `Missing detail link: ${item.id}`);
    }
  }
});

test('pending experiment references and empty visual cells cannot read as generated results', () => {
  for (const item of experiments.filter((experiment) => experiment.evidenceKind === 'protocol')) {
    const detail = experimentDetails.find((experiment) => experiment.slug === item.slug);
    assert.ok(detail, `Missing protocol detail: ${item.number}`);
    const html = readFileSync(join(process.cwd(), 'out', `experiments/${item.slug}/index.html`), 'utf8')
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    const expectedReference = detail.reference?.kind === 'reference-pack'
      ? '参考图待制作 · 非实验结果'
      : detail.reference?.kind === 'character' ? 'AI 角色锚点 · 非实验结果' : '协议示意图 · 非实验结果';
    assert.ok(html.includes(`class="experiment-reference-kind mono">${expectedReference}</span>`), `Reference lacks visible evidence boundary: ${item.number}`);
    const visualStatus = [...html.matchAll(/<div class="experiment-sample-visual[^>]*>[\s\S]*?<b class="mono">([^<]+)<\/b>/g)].map((match) => match[1]);
    assert.deepEqual(visualStatus, detail.samples.map((sample) => sample.status), `Empty cell visual status differs from record: ${item.number}`);
  }
});

test('library semantic title groups preserve original titles in both card contexts', () => {
  const pages = ['archive/index.html', 'library/index.html'].map((file) => readFileSync(join(process.cwd(), 'out', file), 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ''));
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

test('version records start blank and delivery placeholders are not completed', () => {
  const readPage = (route) => readFileSync(join(process.cwd(), 'out/tools', route, 'index.html'), 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const version = readPage('shot-version-recorder');
  assert.ok(version.includes('空白起点：没有预填模型输出、可用区间或采用结论'));
  assert.ok(version.includes('user_entered_unverified') && version.includes('verification_scope'));
  assert.ok(!version.includes('人物身份、房门位置与信封状态在采用区间内保持稳定'));
  assert.ok(!version.includes('00:01.18–00:04.62'));
  const delivery = readPage('delivery-pack');
  const completionBoxes = [...delivery.matchAll(/<label class="delivery-done-box">([\s\S]*?)<\/label>/g)];
  assert.ok(completionBoxes.length > 0);
  assert.ok(completionBoxes.every(([box]) => !box.includes('checked')), 'Delivery example invents a completed item');
  assert.ok(delivery.includes('待导出与人工验收'));
});

test('reviewed video guides and practice tools have unique bidirectional anchors', () => {
  const html = readFileSync(join(process.cwd(), 'out/library/index.html'), 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  for (const item of libraryItems.filter((item) => item.videoReview)) {
    const anchorId = `library-${item.id}`;
    assert.equal(html.split(`id="${anchorId}"`).length - 1, 1, `Duplicate or missing library anchor: ${item.id}`);
    const toolHtml = readFileSync(join(process.cwd(), 'out', item.videoReview.practice.href, 'index.html'), 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    assert.ok(toolHtml.includes(`/library/?type=VIDEO#${anchorId}`), `Missing return route: ${item.id}`);
    assert.ok(html.includes(item.videoReview.practice.href), `Missing practice entry: ${item.id}`);
  }
});

test('prompt resource cards distinguish checked source text from reviewed video captions', () => {
  const html = readFileSync(join(process.cwd(), 'out/prompts/index.html'), 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  assert.equal(promptResources.length, 5);
  assert.equal(promptResources.filter((item) => item.sourceStatus === 'content-checked').length, 4);
  assert.equal(promptResources.filter((item) => item.sourceStatus === 'captions-reviewed').length, 1);
  assert.ok(html.includes('4 条资源正文已按原站核对'));
  assert.ok(html.includes('字幕重点已核对'));
  assert.ok(html.includes('未核对完整画面'));
  for (const time of ['03:14', '12:45', '51:12']) assert.ok(html.includes(time));
  for (const item of promptResources) {
    assert.ok(html.includes(item.url.replaceAll('&', '&amp;')), `Original resource link missing: ${item.id}`);
  }
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
  const css = readFileSync(join(process.cwd(), 'app', 'globals.css'), 'utf8');
  assert.match(css, /\.prompt-collection\s*\{\s*scroll-margin-top:\s*0\s*;/, 'Prompt catalog already has section padding; extra anchor offset pushes its filters below the mobile fold');
  for (const category of promptFilters.filter((filter) => filter !== '全部')) {
    assert.ok(promptItems.some((item) => item.category === category), `Empty Prompt category: ${category}`);
    assert.ok(links.some((url) => url.pathname === '/prompts/all/' && url.searchParams.get('category') === category && url.hash === '#prompt-collection'), `Missing category entrance: ${category}`);
    const selected = writeUrlFilter('http://localhost:3000/prompts/all/?keep=yes#prompt-collection', 'category', category);
    assert.equal(readUrlFilter(selected.search, 'category', promptFilters), category);
    assert.equal(writeUrlFilter(selected.href, 'category', '全部').href, 'http://localhost:3000/prompts/all/?keep=yes#prompt-collection');
  }
  assert.equal(readUrlFilter('?category=UNKNOWN', 'category', promptFilters), '全部');
});

test('Prompt card deep links keep the heading focused without displacing the target card', () => {
  const component = readFileSync(join(process.cwd(), 'app', 'components', 'prompt-browser.tsx'), 'utf8');
  const css = readFileSync(join(process.cwd(), 'app', 'globals.css'), 'utf8');
  assert.match(component, /heading\.focus\(\{\s*preventScroll:\s*true\s*\}\)/);
  assert.match(component, /scrollIntoView\(\{\s*block:\s*'start',\s*behavior:\s*'instant'\s*\}\)/);
  assert.match(component, /requestAnimationFrame\(focusPrompt\)/, 'History restoration needs to finish before card focus is applied');
  assert.match(component, /if \(leavingCard\) document\.getElementById\('prompt-collection'\)\?\.scrollIntoView/, 'Changing category from an exact card must return to the filter controls');
  assert.match(css, /html:has\(\.prompt-collection\)\s*\{\s*scroll-behavior:\s*auto\s*;/, 'Native smooth scrolling must not race with category hydration on a card hash');
});

test('source-inspired Prompt cards are short original task cards with visible attribution and honest copy', () => {
  const adapted = promptItems.filter((item) => item.sourceAdapted);
  assert.equal(adapted.length, 12, 'The source-inspired set should contain exactly twelve cards');
  assert.deepEqual(adapted.map((item) => item.id), promptItems.slice(0, 12).map((item) => item.id));
  const html = readFileSync(join(process.cwd(), 'out/prompts/all/index.html'), 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  for (const item of adapted) {
    assert.equal(item.sourceHref, promptSource.url, `${item.id}: wrong original article link`);
    assert.ok(item.prompt.startsWith('【版本说明】'), `${item.id}: copied text omits attribution`);
    assert.ok(item.prompt.includes(promptSource.url), `${item.id}: copied text omits original article URL`);
    assert.ok(item.prompt.length < 650, `${item.id}: task card is no longer short`);
    assert.ok(item.usageNote.includes('本站改写'), `${item.id}: visible note omits rewrite status`);
    for (const variable of item.variables) assert.ok(item.prompt.includes(`【${variable}】`), `${item.id}: variable label does not match copied text: ${variable}`);
    const start = html.indexOf(`id="prompt-${item.id}"`);
    const next = html.indexOf('<article class="prompt-card', start + 1);
    const card = html.slice(start, next < 0 ? undefined : next);
    assert.ok(start >= 0, `Missing rendered card: ${item.id}`);
    assert.ok(card.includes('本站改写 · 非原文'), `${item.id}: missing visible status`);
    assert.ok(card.includes(`href="${promptSource.url.replaceAll('&', '&amp;')}"`), `${item.id}: missing original article link`);
  }
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

test('review pace keeps high-risk time and extra rework time separate', () => {
  const inputs = {
    reviewers: 3, workDays: 5, hoursPerDay: 6,
    regularMinutes: 8, highRiskShare: 25, highRiskMinutes: 20, reworkRate: 10,
  };
  const result = calculateReviewPace(inputs);
  assert.equal(result.weightedMinutes, 11);
  assert.equal(result.daily, 88);
  assert.equal(result.total, 441);
  assert.equal(result.regularItems, 331);
  assert.equal(result.highRiskItems, 110);
  assert.equal(result.reservedHours, 9);
  assert.ok(result.total >= result.daily * inputs.workDays);

  const onlyRegular = calculateReviewPace({ ...inputs, highRiskShare: 0 });
  const onlyHighRisk = calculateReviewPace({ ...inputs, highRiskShare: 100 });
  assert.ok(onlyRegular.daily > result.daily && result.daily > onlyHighRisk.daily);
  assert.equal(onlyRegular.highRiskItems, 0);
  assert.equal(onlyHighRisk.regularItems, 0);
  const acrossDays = calculateReviewPace({ ...inputs, reviewers: 1, hoursPerDay: 0.5, workDays: 10, regularMinutes: 60, highRiskShare: 0, reworkRate: 0 });
  assert.equal(acrossDays.daily, 0);
  assert.equal(acrossDays.total, 5);
  assert.match(formatReviewPaceSummary(inputs, result), /待试标校准/);
  assert.match(formatReviewPaceSummary(inputs, result), /未执行试标、质检或交付验收/);
  assert.throws(() => calculateReviewPace({ ...inputs, highRiskShare: 101 }), RangeError);
  assert.throws(() => calculateReviewPace({ ...inputs, regularMinutes: 0 }), RangeError);
  assert.throws(() => calculateReviewPace({ ...inputs, reviewers: 2.5 }), RangeError);
  assert.throws(() => calculateReviewPace({ ...inputs, workDays: 4.5 }), RangeError);
});

test('review pace compares an optional target with usable workdays, without claiming delivery', () => {
  const inputs = {
    reviewers: 3, workDays: 5, hoursPerDay: 6,
    regularMinutes: 8, highRiskShare: 25, highRiskMinutes: 20, reworkRate: 10,
  };
  const result = calculateReviewPace(inputs);
  const within = calculateReviewPaceTarget(inputs, result, 400);
  assert.equal(within.withinEstimate, true);
  assert.equal(within.gap, 41);
  assert.equal(within.requiredDays, 5);
  assert.equal(within.extraDays, 0);
  const boundary = calculateReviewPaceTarget(inputs, result, 441);
  assert.equal(boundary.withinEstimate, true);
  assert.equal(boundary.gap, 0);
  const short = calculateReviewPaceTarget(inputs, result, 442);
  assert.equal(short.withinEstimate, false);
  assert.equal(short.gap, -1);
  assert.equal(short.requiredDays, 6);
  assert.equal(short.extraDays, 1);
  assert.doesNotMatch(formatReviewPaceSummary(inputs, result), /目标对照/);
  assert.match(formatReviewPaceSummary(inputs, result, short), /估算缺口 1 条/);
  assert.match(formatReviewPaceSummary(inputs, result, within), /不代表交付承诺/);
  assert.throws(() => calculateReviewPaceTarget(inputs, result, 0), RangeError);
  assert.throws(() => calculateReviewPaceTarget(inputs, result, 1.5), RangeError);
  assert.throws(() => calculateReviewPaceTarget(inputs, result, 1_000_001), RangeError);
});

test('review pace field scenarios preserve risk time and expose a one-day target shortfall', () => {
  const inputs = {
    reviewers: 4, workDays: 5, hoursPerDay: 6,
    regularMinutes: 6, highRiskShare: 20, highRiskMinutes: 18, reworkRate: 15,
  };
  const result = calculateReviewPace(inputs);
  assert.equal(result.weightedMinutes, 8.4);
  assert.equal(result.daily, 146);
  assert.equal(result.total, 728);
  assert.equal(result.reservedHours, 18);
  assert.equal(calculateReviewPaceTarget(inputs, result, 700).withinEstimate, true);
  const over = calculateReviewPaceTarget(inputs, result, 800);
  assert.equal(over.gap, -72);
  assert.equal(over.requiredDays, 6);
  assert.equal(over.extraDays, 1);

  const slowInputs = { ...inputs, reviewers: 1, workDays: 1, hoursPerDay: 1, regularMinutes: 10, highRiskShare: 50, highRiskMinutes: 20, reworkRate: 0 };
  const slowResult = calculateReviewPace(slowInputs);
  assert.equal(slowResult.total, 4);
  assert.equal(calculateReviewPaceTarget(slowInputs, slowResult, 5).requiredDays, 2);
});

test('review pace does not promise a high-risk item that exceeds available minutes', () => {
  const inputs = {
    reviewers: 1, workDays: 1, hoursPerDay: 1,
    regularMinutes: 1, highRiskShare: 10, highRiskMinutes: 100, reworkRate: 0,
  };
  const result = calculateReviewPace(inputs);
  assert.equal(result.total, 4);
  assert.equal(result.highRiskItems, 0);
  const target = calculateReviewPaceTarget(inputs, result, 5);
  assert.equal(target.withinEstimate, false);
  assert.equal(target.requiredDays, 2);
});

test('local timing import summarizes reviewed rows without counting extra rework or pauses', () => {
  const makeRow = (id, tier, work, review, status = 'reviewed', note = '') => [
    id, 'batch-1', 'v1', tier, '', work, review, '7', '3', '', 'reviewer', status, note,
  ].join(',');
  const csv = [trialTimeLogHeaders.join(','), makeRow('a', 'regular', '5', '0', 'reviewed', '"needs, checking"'),
    makeRow('b', 'regular', '7', '2'), makeRow('c', 'high-risk', '10', '8')].join('\r\n');
  assert.deepEqual(summarizeTrialTimeLog(`\uFEFF${csv}`), {
    total: 3, regularCount: 2, highRiskCount: 1,
    regularMinutes: 7, highRiskMinutes: 18, highRiskShare: 33.3,
    timingReview: { eligible: false, flaggedLines: [] },
  });
  const twoHundred = [trialTimeLogHeaders.join(','),
    ...Array.from({ length: 200 }, (_, index) => makeRow(String(index), index < 160 ? 'regular' : 'high-risk', index < 160 ? '6' : '18', '0'))].join('\n');
  assert.equal(summarizeTrialTimeLog(twoHundred).highRiskShare, 20);
  assert.deepEqual(summarizeTrialTimeLog(twoHundred).timingReview, { eligible: true, flaggedLines: [] });
  const extreme = [trialTimeLogHeaders.join(','),
    ...Array.from({ length: 5 }, (_, index) => makeRow(`r${index}`, 'regular', '6', index === 4 ? '84' : '0')),
    ...Array.from({ length: 5 }, (_, index) => makeRow(`h${index}`, 'high-risk', '18', '0'))].join('\n');
  const extremeSummary = summarizeTrialTimeLog(extreme);
  assert.deepEqual(extremeSummary.timingReview, { eligible: true, flaggedLines: [6] });
  assert.equal(extremeSummary.regularMinutes, 22.8, 'Flagged time must remain in the mean');
  assert.throws(() => summarizeTrialTimeLog(trialTimeLogHeaders.join(',')), /尚无记录/);
  assert.throws(() => summarizeTrialTimeLog(csv.replace('a,batch-1', 'b,batch-1')), /重复/);
  assert.throws(() => summarizeTrialTimeLog(csv.replace('reviewed', 'pending')), /reviewed/);
  assert.throws(() => summarizeTrialTimeLog(csv.replace('5,0,7', '5,,7')), /planned_review_minutes/);
  assert.throws(() => summarizeTrialTimeLog(csv.replace('regular', 'unknown')), /risk_tier/);
  assert.throws(() => summarizeTrialTimeLog(csv.replace('"needs, checking"', '"unfinished')), /未闭合/);
  assert.throws(() => summarizeTrialTimeLog([trialTimeLogHeaders.join(','), makeRow('a', 'regular', '5', '0')].join('\n')), /同时有常规和高风险/);
  assert.throws(() => summarizeTrialTimeLog(csv.replace('5,0,7', '0.1,0,7')), /work_minutes/);
  assert.throws(() => summarizeTrialTimeLog(csv.replace('5,0,7', '0x10,0,7')), /work_minutes/);
  assert.throws(() => summarizeTrialTimeLog(csv.replace('a,batch-1,v1', 'a,,v1')), /第 2 行 batch_id 为空/);
  assert.throws(() => summarizeTrialTimeLog(csv.replace('a,batch-1,v1', 'a,batch-1,')), /第 2 行 rule_version 为空/);
  assert.throws(() => summarizeTrialTimeLog(csv.replace('b,batch-1,v1', 'b,batch-2,v1')), /第 3 行 batch_id 与前面记录不同/);
  assert.throws(() => summarizeTrialTimeLog(csv.replace('b,batch-1,v1', 'b,batch-1,v2')), /第 3 行 rule_version 与前面记录不同/);
  assert.equal(summarizeTrialTimeLog(csv.replace('b,batch-1,v1', 'b, batch-1 , v1 ')).total, 3);
  const tooMany = [trialTimeLogHeaders.join(','),
    ...Array.from({ length: 501 }, (_, index) => makeRow(String(index), index % 2 ? 'regular' : 'high-risk', '5', '0'))].join('\n');
  assert.throws(() => summarizeTrialTimeLog(tooMany), /最多读取 500/);
  const page = readFileSync(join(process.cwd(), 'out/tools/review-pace/index.html'), 'utf8');
  assert.match(page, /把试标耗时/);
  assert.match(page, /选择 CSV 文件/);
  assert.match(page, /不上传、不保存原始行/);
  assert.match(page, /不同批次或规则版本须分开汇总/);
});

test('review pace mix comparison changes only the risk share and keeps target evidence separate', () => {
  const input = { reviewers: 4, workDays: 5, hoursPerDay: 6, regularMinutes: 6, highRiskShare: 20, highRiskMinutes: 18, reworkRate: 15 };
  const compared = compareReviewPaceMix(input, 20, 35, 800);
  assert.equal(compared.trial.total, 728);
  assert.ok(compared.batch.total < compared.trial.total);
  assert.equal(compared.capacityDifference, compared.batch.total - compared.trial.total);
  assert.equal(compared.trialTarget?.gap, -72);
  assert.equal(compared.batchTarget?.gap, compared.batch.total - 800);
  assert.equal(input.highRiskShare, 20, 'Comparison must not mutate the main estimate');
  const equal = compareReviewPaceMix(input, 20, 20);
  assert.equal(equal.capacityDifference, 0);
  assert.equal(equal.batchTarget, null);
  assert.throws(() => compareReviewPaceMix(input, 20, 101), RangeError);
  const page = readFileSync(join(process.cwd(), 'out/tools/review-pace/index.html'), 'utf8');
  assert.match(page, /试标比例/);
  assert.match(page, /正式批次/);
  assert.match(page, /没有记录时，不生成示例批次对照/);
});

test('risk routing note and calculator link to each other', () => {
  const noteLinks = anchors('notes/dataset-release-gates/index.html');
  const toolLinks = anchors('tools/review-pace/index.html');
  assert.ok(noteLinks.includes('/tools/review-pace/'));
  assert.ok(toolLinks.includes('/notes/dataset-release-gates/'));
});

// —— 作品集信息架构 ——
const page = (file) => readFileSync(join(process.cwd(), 'out', file), 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
const internalPaths = (file) => anchors(file).map((href) => routeWithoutBase(href)).filter((href) => href.startsWith('/')).map((href) => href.split('#')[0].split('?')[0]);

test('primary navigation has at most five items and the archive lives in the footer', () => {
  const home = page('index.html');
  const nav = home.match(/<nav class="desktop-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
  const labels = [...nav.matchAll(/<a\b[^>]*>([^<]+)<\/a>/g)].map((match) => match[1]);
  assert.deepEqual(labels, ['评测案例', '方法', '项目经历', '创作实践', '关于与联系']);
  const footer = home.match(/<footer[\s\S]*<\/footer>/)?.[0] ?? '';
  assert.match(footer, />归档<\/a>/);
});

test('homepage leads to cases, method, projects, practice and contact', () => {
  const paths = internalPaths('index.html');
  for (const route of ['/cases/', '/cases/five-model-blind-test/', '/method/', '/projects/', '/stories/', '/about/']) {
    assert.ok(paths.includes(route), `Homepage does not link to ${route}`);
  }
  const home = page('index.html');
  assert.match(home, /我关注多模态生成的视觉质量/);
  assert.match(home, /下载简历/);
});

test('method page lists the six core method notes and the aesthetic case', () => {
  const paths = internalPaths('method/index.html');
  for (const slug of ['ai-video-evaluation', 'video-evaluation-eight-dimensions', 'video-failure-cases', 'bad-case-review-loop', 'dataset-release-gates', 'causal-motion-five-point-ledger']) {
    assert.ok(paths.includes(`/notes/${slug}/`), `Method page is missing ${slug}`);
  }
  assert.match(page('method/index.html'), /id="aesthetic"/);
});

test('blind test case page shows role, task card, real videos, scores, bad cases and limits', () => {
  const html = page('cases/five-model-blind-test/index.html');
  for (const text of ['我做了什么', '任务卡', '10 道测试题', '盲评结果', '同步播放', 'Bad Case', '局限与复盘', '结论只适用于这套题']) assert.ok(html.includes(text), `Missing: ${text}`);
  const videos = [...html.matchAll(/<video\b[^>]*\bsrc="([^"]+)"/g)].map((match) => routeWithoutBase(match[1]));
  assert.equal(videos.length, 15, 'Expected three walls of five videos');
  for (const src of videos) assert.ok(existsSync(join(process.cwd(), 'out', src)), `Missing video file: ${src}`);
});

test('bad case detective exports, links back to the case, and every round has its media', async () => {
  const html = page('play/bad-case-detective/index.html');
  for (const text of ['Bad Case 侦探', '怎么玩', '开始', '不限时']) assert.ok(html.includes(text), `Missing: ${text}`);
  assert.ok(internalPaths('play/bad-case-detective/index.html').includes('/cases/five-model-blind-test/'));
  for (const file of ['stories/index.html', 'cases/five-model-blind-test/index.html']) {
    assert.ok(internalPaths(file).includes('/play/bad-case-detective/'), `${file} does not link to the game`);
  }
  const { detectiveRounds, detectiveVideo, detectivePoster, NO_ISSUE } = await import('../app/data/detective-rounds.ts');
  assert.ok(detectiveRounds.length >= 6 && detectiveRounds.length <= 8, 'Expected 6–8 rounds');
  assert.ok(detectiveRounds.filter((round) => round.answer === NO_ISSUE).length >= 2, 'Expected at least two clean rounds');
  for (const round of detectiveRounds) {
    assert.equal(round.options.length, 4, `${round.id} should have four options`);
    assert.ok(round.options.includes(NO_ISSUE) && round.options.includes(round.answer), `${round.id} options are inconsistent`);
    for (const src of [detectiveVideo(round), detectivePoster(round), round.frame?.src].filter(Boolean)) {
      assert.ok(existsSync(join(process.cwd(), 'out', src)), `Missing media file: ${src}`);
    }
  }
});

// 组员姓名只存在于本地的原始素材文件夹（已被 git 忽略）。有这个文件夹时检查导出页面里没有出现任何姓名；CI 上没有就跳过。
test('team members stay anonymous on every exported page', (t) => {
  const rawDirectory = join(process.cwd(), '视频评测');
  if (!existsSync(rawDirectory)) return t.skip('raw material folder is not present');
  const names = readdirSync(rawDirectory).map((entry) => entry.match(/（(.+)）/)?.[1]).filter(Boolean);
  assert.ok(names.length > 0, 'Expected member names in the raw material folder');
  const files = [];
  const walk = (directory) => {
    for (const entry of readdirSync(join(process.cwd(), 'out', directory), { withFileTypes: true })) {
      const path = directory ? `${directory}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(path); else if (/\.(html|txt|js)$/.test(entry.name)) files.push(path);
    }
  };
  walk('');
  for (const file of files) {
    const text = readFileSync(join(process.cwd(), 'out', file), 'utf8');
    for (const name of names) assert.ok(!text.includes(name), `${file} exposes a team member name`);
  }
});

test('every exported page resolves its internal links', () => {
  const files = [];
  const walk = (directory) => {
    for (const entry of readdirSync(join(process.cwd(), 'out', directory), { withFileTypes: true })) {
      const path = directory ? `${directory}/${entry.name}` : entry.name;
      if (entry.isDirectory()) { if (entry.name !== '_next') walk(path); } else if (entry.name === 'index.html') files.push(path);
    }
  };
  walk('');
  const exists = (route) => {
    try { readFileSync(join(process.cwd(), 'out', route.endsWith('/') ? `${route}index.html` : route)); return true; } catch { return false; }
  };
  for (const file of files) {
    for (const route of internalPaths(file)) assert.ok(exists(decodeURIComponent(route)), `${file} links to a missing target: ${route}`);
  }
});

test('archived method demonstrations carry exactly one plain disclosure line', () => {
  for (const note of getAllNotes().filter((item) => item.synthetic)) {
    const html = page(`notes/${note.slug}/index.html`);
    assert.equal(html.split('方法演示，非真实项目数据').length - 1, 1, `${note.slug} should disclose once`);
  }
});

test('the old homepage copy redirects to the new homepage', () => {
  assert.match(page('archive/index.html'), /http-equiv="refresh"/i);
});
