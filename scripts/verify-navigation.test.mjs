import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import matter from 'gray-matter';
import { readUrlFilter, writeUrlFilter } from '../lib/filter-url.ts';
import { getAllNotes } from '../lib/notes.ts';
import { stories, experiments, experimentEvidenceLabels, tools, toolCategories } from '../app/data/content.ts';
import { experimentDetails } from '../app/data/experiments.ts';
import { libraryItems } from '../app/data/library.ts';
import { promptFilters, promptItems, promptSource } from '../app/data/prompts.ts';
import { promptResources } from '../app/data/prompt-resources.ts';
import { calculateReviewPace, calculateReviewPaceTarget, compareReviewPaceMix, formatReviewPaceSummary } from '../app/data/review-pace.ts';
import { summarizeTrialTimeLog, trialTimeLogHeaders } from '../app/data/review-pace-import.ts';

// Run after build: inspect real exported anchors, not embedded React payloads.
test('work desks expose manual copying before asking for clipboard permission', () => {
  for (const path of ['dataset-release', 'prompt-preflight']) {
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

test('homepage work route reaches trial method, local estimate and delivery gate without invented results', () => {
  const home = anchors('index.html');
  const note = anchors('notes/trial-to-review-pace/index.html');
  const pace = anchors('tools/review-pace/index.html');
  const html = readFileSync(join(process.cwd(), 'out/index.html'), 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  for (const href of ['/notes/trial-to-review-pace/', '/tools/review-pace/', '/tools/dataset-release/']) {
    assert.ok(home.includes(href), `Homepage work route missing ${href}`);
  }
  assert.ok(note.includes('/tools/review-pace/'));
  assert.ok(pace.includes('/tools/dataset-release/'));
  assert.match(html, /aria-label="从试标到交付的工作路径"/);
  assert.match(html, /id="home-work-route"/);
  assert.match(html, /方法内容为编辑候选，待荆确认/);
  assert.match(html, /浏览器本地工具/);
  assert.match(html, /人工交付自检/);
});

test('scroll reveal leaves content visible without browser animation support', () => {
  const css = readFileSync(join(process.cwd(), 'app', 'globals.css'), 'utf8');
  const component = readFileSync(join(process.cwd(), 'app', 'components', 'reveal.tsx'), 'utf8');
  assert.match(css, /\.reveal\s*\{[^}]*transition:/);
  assert.doesNotMatch(css, /\.reveal\s*\{[^}]*opacity:\s*0/);
  assert.match(css, /\.reveal\.reveal-armed\s*\{\s*opacity:\s*0/);
  assert.match(component, /typeof IntersectionObserver === 'undefined'/);
  assert.match(component, /classList\.add\('reveal-armed'\)/);
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
      assert.ok(card.includes(`>${item.status}</span>`), `Story status is not visible in its badge: ${item.id}`);
      assert.ok(!card.includes('有详情记录') && !card.includes('最新故事 · 有详情'), `Generic story badge remains: ${item.id}`);
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
      assert.ok(card.includes(experimentEvidenceLabels[item.evidenceKind]), `Evidence badge is missing: ${item.id}`);
      assert.ok(!card.includes('有详情记录') && !card.includes('最新研究 · 有详情'), `Generic experiment badge remains: ${item.id}`);
      assert.ok(card.includes(`/experiments/${item.slug}/`), `Missing detail link: ${item.id}`);
    }
  }
});

test('experiment detail first screens match archive evidence and distinguish planned from completed units', () => {
  for (const item of experiments) {
    const detail = experimentDetails.find((experiment) => experiment.slug === item.slug);
    assert.ok(detail, `Missing experiment detail: ${item.number}`);
    if (detail.titleLines) {
      assert.equal(detail.titleLines.join(''), detail.title, `Detail title groups changed text: ${item.number}`);
      assert.ok(detail.titleLines.every((line) => line.trim().length > 1), `Detail title has an orphan group: ${item.number}`);
    }
    const html = readFileSync(join(process.cwd(), 'out', `experiments/${item.slug}/index.html`), 'utf8')
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    const hero = html.match(/<header class="experiment-detail-hero">([\s\S]*?)<\/header>/)?.[1];
    assert.ok(hero, `Missing detail hero: ${item.number}`);
    assert.ok(hero.includes(experimentEvidenceLabels[item.evidenceKind]), `Archive/detail evidence differs: ${item.number}`);
    assert.ok(hero.includes('class="experiment-evidence-note"'), `Missing plain-language evidence boundary: ${item.number}`);
    const expectedBoard = item.evidenceKind === 'static-pilot'
      ? '40 PLANNED · 4 STATIC · NO VIDEO'
      : item.evidenceKind === 'text-pilot' ? 'TEXT OUTPUTS · NO VIDEO' : 'PLANNED CELLS · 0 GENERATED';
    if (item.number !== '010') assert.ok(hero.includes(expectedBoard), `Unit count lacks evidence type: ${item.number}`);
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
    assert.ok(html.includes('02 / Planned cells · 待执行'), `Sample section reads as completed: ${item.number}`);
    const visualStatus = [...html.matchAll(/<div class="experiment-sample-visual[^>]*>[\s\S]*?<b class="mono">([^<]+)<\/b>/g)].map((match) => match[1]);
    assert.deepEqual(visualStatus, detail.samples.map((sample) => sample.status), `Empty cell visual status differs from record: ${item.number}`);
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

test('single-shot practice keeps synthetic scope and empty assessment separate', () => {
  const html = readFileSync(join(process.cwd(), 'out/tools/shot-prompt-builder/index.html'), 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  for (const text of ['id="single-shot-practice"', '合成演练 · 编辑候选 · 待荆确认', '无参考图、无视频、未调用模型', '不是已观察到的 Bad Case', '当前判定：待执行', '判定：待真实样本生成后填写', '待观看后填写，不推测模型内部原因', '合成演练：乔野拿起白杯']) assert.ok(html.includes(text), `Practice boundary missing: ${text}`);
  assert.ok(html.includes('/library/?type=VIDEO#library-adobe-structuring-video-prompts'));
  assert.ok(html.includes('/tools/multimodal-evaluation/'));
  assert.ok(!html.includes('- [x]'), 'Practice checklist invents completed verification');
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

test('library distinguishes reviewed excerpts, historical sources and unconfirmed opinions', () => {
  const html = readFileSync(join(process.cwd(), 'out/library/index.html'), 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const routeSection = html.slice(html.indexOf('class="library-routes'), html.indexOf('class="featured-library'));
  const reviewed = libraryItems.filter((item) => item.sourceStatus === 'excerpt-reviewed');
  assert.equal(reviewed.length, 2);
  assert.ok(routeSection.length > 0, 'Library reading routes are missing');
  assert.equal(html.split('讲解要点已核对 · 待荆确认').length - 1, reviewed.length, 'Each video needs its own visible review boundary');
  for (const item of reviewed) {
    assert.ok(html.includes(`id="library-${item.id}"`), `${item.id}: reviewed card is missing`);
    assert.ok(html.includes(item.videoReview.basis) && html.includes(item.videoReview.limitation), `${item.id}: review scope is missing`);
    for (const point of item.videoReview.points) {
      const url = new URL(item.url);
      url.searchParams.set('t', String(point.seconds));
      assert.ok(html.includes(url.href.replaceAll('&', '&amp;')), `${item.id}: source timestamp link is missing`);
    }
    assert.ok(html.includes(item.videoReview.practice.href), `${item.id}: practice route is missing`);
    assert.ok(!routeSection.includes(item.url.replaceAll('&', '&amp;')), `${item.id}: editorial candidate appears in a curated route`);
  }
  assert.ok(html.includes('编辑推荐理由 · 待荆确认'), 'Draft recommendation is presented as Jing’s confirmed choice');
  assert.ok(html.includes('Sora 产品自 2026 年 4 月 26 日起不再提供'), 'Historical Sora status is missing');
  assert.ok(html.includes('https://huggingface.co/docs/diffusers/main/using-diffusers/text-img2vid'), 'Current Diffusers guide is missing');
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

test('entry pages keep fictional, pending and local-only work visibly distinct', () => {
  const readPage = (path) => readFileSync(join(process.cwd(), 'out', path), 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const home = readPage('index.html');
  const notes = readPage('notes/index.html');
  const toolIndex = readPage('tools/index.html');
  assert.ok(home.includes('点击查看当前状态'));
  assert.ok(home.includes('不把计划写成成果'));
  assert.ok(notes.includes('没有执行过的测试不会写成结果'));
  assert.ok(toolIndex.includes('输入不会上传；生成的计划与记录仍需人工核对'));
  for (const note of getAllNotes().filter((item) => item.synthetic && item.editorialStatus === 'draft')) {
    const card = [...notes.matchAll(/<article class="note-card[^\"]*"[^>]*>[\s\S]*?<\/article>/g)]
      .map(([markup]) => markup)
      .find((markup) => markup.includes(`/notes/${note.slug}/`));
    assert.ok(card, `Fictional note card missing: ${note.slug}`);
    assert.ok(card.includes('虚构演练 · 待荆确认'), `Fictional draft lacks both status labels: ${note.slug}`);
  }
});

test('cross-page recommendations remain editorial candidates until Jing confirms them', () => {
  const readPage = (path) => readFileSync(join(process.cwd(), 'out', path), 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<!--\s*-->/g, '');
  const home = readPage('index.html');
  const library = readPage('library/index.html');
  const about = readPage('about/index.html');
  const prompts = readPage('prompts/index.html');
  const reviewed = libraryItems.filter((item) => item.sourceStatus === 'excerpt-reviewed').length;
  assert.ok(home.includes('Picks to review / 待确认推荐'));
  assert.ok(home.includes('推荐理由与观点仍是编辑候选，待荆确认'));
  assert.ok(home.includes('来源分级标注'));
  assert.ok(library.includes('编辑初选<br/>待荆确认'));
  assert.ok(library.includes('PICKS TO REVIEW'));
  assert.ok(library.includes('编辑观点候选 · 待荆确认'));
  const draftCards = [...library.matchAll(/<article\b[^>]*\bclass="library-card[^"]*"[^>]*>[\s\S]*?<\/article>/g)]
    .map(([card]) => card)
    .filter((card) => card.includes('编辑初选 · 待荆确认') || card.includes('元信息已核对 · 内容待复核 · 待荆确认') || card.includes('讲解要点已核对 · 待荆确认'));
  assert.ok(draftCards.length >= libraryItems.filter((item) => item.takeStatus === 'draft').length);
  for (const card of draftCards) {
    assert.ok(card.includes('编辑观点候选 · 待荆确认'), 'Draft card lacks its editorial opinion label');
    assert.ok(!card.includes('JING&#x27;S TAKE'), 'Draft card claims a confirmed personal take');
  }
  assert.ok(about.includes(`${libraryItems.length} 条收藏附原链接 · ${reviewed} 条视频附时间点要点`));
  assert.ok(about.includes(`收藏中 ${reviewed} 条视频附时间点要点与核对依据`));
  assert.ok(prompts.includes('编辑推荐理由 · 待荆确认'));
  assert.ok(!prompts.includes('我为什么留下'));
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

test('caption-derived Prompt note preserves source limits and returns to the resource', () => {
  const slug = 'prompt-iteration-ambiguity-output';
  const note = getAllNotes().find((item) => item.slug === slug);
  assert.ok(note, 'Missing caption-derived note');
  assert.equal(note.editorialStatus, 'draft');
  assert.equal(note.sourceUrl, 'https://www.youtube.com/watch?v=T9aRN5JkmL8');
  assert.match(note.sourceNote, /没有逐帧核对完整视频/);
  const html = readFileSync(join(process.cwd(), 'out', 'notes', slug, 'index.html'), 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  for (const time of ['03:14', '12:45', '51:12']) assert.ok(html.includes(time));
  assert.ok(html.includes('编辑稿 · 待荆确认'));
  assert.ok(html.includes('无测试结果'));
  assert.ok(anchors(`notes/${slug}/index.html`).includes('/prompts/#prompt-resources'));
  assert.ok(anchors('prompts/index.html').includes(`/notes/${slug}/`));
  const prompts = readFileSync(join(process.cwd(), 'out/prompts/index.html'), 'utf8');
  assert.match(prompts, /<section\b[^>]*id="prompt-resources"/);
});

test('Prompt pre-flight tool and its method note are connected without invented results', () => {
  const noteLinks = anchors('notes/prompt-iteration-ambiguity-output/index.html');
  const toolLinks = anchors('tools/prompt-preflight/index.html');
  assert.ok(noteLinks.includes('/tools/prompt-preflight/'));
  assert.ok(toolLinks.includes('/notes/prompt-iteration-ambiguity-output/'));
  assert.ok(anchors('tools/index.html').includes('/tools/prompt-preflight/'));
  const html = readFileSync(join(process.cwd(), 'out/tools/prompt-preflight/index.html'), 'utf8');
  assert.ok(html.includes('不调用 AI、不上传输入、不自动保存'));
    assert.ok(html.includes('待执行 · 无输出'));
    assert.ok(html.includes('HUMAN REVIEW / 逐项验收'));
    assert.ok(html.includes('虚构演练 · 待执行'));
    assert.ok(html.includes('查看并载入虚构示例'));
  assert.ok(html.includes('工具不自动评分'));
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
  assert.match(page, /没有记录时，不生成虚构的批次对照/);
});

test('risk routing note and calculator link to each other', () => {
  const noteLinks = anchors('notes/dataset-release-gates/index.html');
  const toolLinks = anchors('tools/review-pace/index.html');
  assert.ok(noteLinks.includes('/tools/review-pace/'));
  assert.ok(toolLinks.includes('/notes/dataset-release-gates/'));
});
