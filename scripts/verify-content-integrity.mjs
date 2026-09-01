import { existsSync, readFileSync, readdirSync } from 'node:fs';
import matter from 'gray-matter';

const [
  { stories, experiments, tools },
  { storyDetails },
  { experimentDetails },
  { libraryItems },
  { noteCategories },
  { getAllNotes },
] = await Promise.all([
  import('../app/data/content.ts'),
  import('../app/data/stories.ts'),
  import('../app/data/experiments.ts'),
  import('../app/data/library.ts'),
  import('../app/data/note-config.ts'),
  import('../lib/notes.ts'),
]);

const failures = [];
const notes = getAllNotes();
const noteFilenames = readdirSync(new URL('../content/notes/', import.meta.url))
  .filter((filename) => filename.endsWith('.md'));
const noteSources = new Map(noteFilenames.map((filename) => [
  filename,
  matter(readFileSync(new URL(`../content/notes/${filename}`, import.meta.url), 'utf8')),
]));
const noteSlugs = new Set(notes.map((note) => note.slug));
const validNoteCategories = new Set(noteCategories.map((category) => category.id));
const validEditorialStatuses = new Set(['draft', 'source-backed', 'published']);
const validLibraryTypes = new Set(['VIDEO', 'ARTICLE', 'PDF', 'TOOL']);

function check(condition, message) {
  if (!condition) failures.push(message);
}

function checkUnique(items, field, label) {
  const values = items.map((item) => item[field]);
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  check(duplicates.length === 0, `${label}存在重复：${[...new Set(duplicates)].join('、')}`);
}

function checkSequentialNumbers(items, label) {
  const actual = items.map((item) => Number(item.number)).sort((a, b) => a - b);
  const expected = Array.from({ length: items.length }, (_, index) => index + 1);
  check(actual.every((value, index) => value === expected[index]), `${label}公开编号不连续：${actual.join('、')}`);
}

function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function isSecureExternalUrl(value) {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

const internalRoutes = new Set([
  '/',
  '/about/',
  '/experiments/',
  '/library/',
  '/notes/',
  '/prompts/',
  '/prompts/all/',
  '/stories/',
  '/tools/',
  ...notes.map((note) => `/notes/${note.slug}/`),
  ...stories.map((story) => `/stories/${story.slug}/`),
  ...experiments.map((experiment) => `/experiments/${experiment.slug}/`),
  ...tools.flatMap((tool) => tool.href ? [tool.href] : []),
]);

function checkInternalHref(href, label) {
  if (!href.startsWith('/')) return;
  const route = href.split('#')[0].split('?')[0];
  const publicFile = new URL(`../public${route}`, import.meta.url);
  check(internalRoutes.has(route) || existsSync(publicFile), `${label}指向不存在的内部页面或公开文件：${href}`);
}

check(stories.length === storyDetails.length, `故事归档 ${stories.length} 条，详情 ${storyDetails.length} 条`);
check(experiments.length === experimentDetails.length, `实验归档 ${experiments.length} 条，详情 ${experimentDetails.length} 条`);

for (const [items, label] of [[stories, '故事'], [experiments, '实验']]) {
  checkUnique(items, 'slug', `${label} slug`);
  checkUnique(items, 'number', `${label}编号`);
  checkSequentialNumbers(items, label);
}

for (const story of stories) {
  const detail = storyDetails.find((item) => item.slug === story.slug);
  check(detail, `故事 ${story.number} 缺少详情：${story.slug}`);
  if (!detail) continue;

  for (const field of ['number', 'title', 'type', 'date', 'duration', 'status']) {
    check(story[field] === detail[field], `故事 ${story.number} 的 ${field} 不一致：归档“${story[field]}” / 详情“${detail[field]}”`);
  }

  if (detail.draft) {
    check(Boolean(detail.draftNotice?.trim()), `故事 ${story.number} 是草案，但缺少草案声明`);
  }

  if (story.status.includes('无视频')) {
    check(/尚未生成视频|没有生成视频|无视频/.test(detail.draftNotice ?? ''), `故事 ${story.number} 标注无视频，但草案声明未说明`);
    const activeVideoPhase = detail.production.find((item) => item.phase.includes('视频') && item.status === '制作中');
    check(!activeVideoPhase, `故事 ${story.number} 标注无视频，但“${activeVideoPhase?.phase}”仍为制作中`);
  }

  if (detail.stillsGenerated ?? true) {
    const mislabeledStill = detail.stills.find((still) => !still.status.includes('AI 概念关键帧'));
    check(!mislabeledStill, `故事 ${story.number} 的“${mislabeledStill?.title}”未标为 AI 概念关键帧`);
  }
}

for (const experiment of experiments) {
  const detail = experimentDetails.find((item) => item.slug === experiment.slug);
  check(detail, `实验 ${experiment.number} 缺少详情：${experiment.slug}`);
  if (!detail) continue;

  for (const field of ['number', 'title', 'category', 'date']) {
    check(experiment[field] === detail[field], `实验 ${experiment.number} 的 ${field} 不一致：归档“${experiment[field]}” / 详情“${detail[field]}”`);
  }

  const sampleToken = experiment.status.match(/\d+\s*\/\s*\d+/)?.[0].replaceAll(' ', '');
  if (sampleToken) {
    check(detail.status.replaceAll(' ', '').includes(sampleToken), `实验 ${experiment.number} 的详情状态缺少 ${sampleToken}`);
    check(detail.conclusionBadge?.replaceAll(' ', '').includes(sampleToken), `实验 ${experiment.number} 的结论标签缺少 ${sampleToken}`);
    check(Boolean(detail.currentConclusion?.trim()), `实验 ${experiment.number} 有样本状态，但缺少当前结论`);
  }

  if (sampleToken?.startsWith('0/')) {
    check(/没有|无|样本为\s*0/.test(detail.currentConclusion ?? ''), `实验 ${experiment.number} 为 ${sampleToken}，但结论未明确说明没有输出`);
  }

  if (detail.toolHref) {
    check(tools.some((tool) => tool.href === detail.toolHref), `实验 ${experiment.number} 指向不存在的工具：${detail.toolHref}`);
  }
}

check(notes.length === noteFilenames.length, `笔记解析 ${notes.length} 篇，Markdown 文件 ${noteFilenames.length} 个`);
checkUnique(notes, 'slug', '笔记 slug');

for (const note of notes) {
  const source = noteSources.get(`${note.slug}.md`);
  check(noteFilenames.includes(`${note.slug}.md`), `笔记 ${note.slug} 的 slug 与文件名不一致`);
  check(Boolean(source), `笔记 ${note.slug} 无法读取原始 Markdown`);
  check(Boolean(note.title.trim()), `笔记 ${note.slug} 缺少标题`);
  check(Boolean(note.description.trim()), `笔记 ${note.slug} 缺少摘要`);
  check(Boolean(source?.content.trim()), `笔记 ${note.slug} 缺少正文`);
  check(validNoteCategories.has(note.category), `笔记 ${note.slug} 使用未知栏目：${note.category}`);
  check(validEditorialStatuses.has(source?.data.editorialStatus), `笔记 ${note.slug} 的原始内容状态无效：${source?.data.editorialStatus ?? '未填写'}`);
  check(isValidDate(note.date), `笔记 ${note.slug} 的日期无效：${note.date}`);
  check(note.tags.length > 0, `笔记 ${note.slug} 缺少标签`);
  check(Boolean(note.sourceTitle?.trim()), `笔记 ${note.slug} 缺少来源标题`);
  check(Boolean(note.sourceNote?.trim()), `笔记 ${note.slug} 缺少来源或编辑边界说明`);

  if (note.sourceUrl) {
    check(isSecureExternalUrl(note.sourceUrl), `笔记 ${note.slug} 的来源链接不是有效 HTTPS 地址：${note.sourceUrl}`);
  }

  if (note.editorialStatus === 'draft') {
    check(/编辑|草案|待荆确认|未确认|没有视频|尚待执行/.test(note.sourceNote ?? ''), `笔记 ${note.slug} 是草案，但来源说明未标出编辑或待确认状态`);
  }

  for (const relatedSlug of note.relatedNotes) {
    check(relatedSlug !== note.slug, `笔记 ${note.slug} 把自己列为关联笔记`);
    check(noteSlugs.has(relatedSlug), `笔记 ${note.slug} 指向不存在的关联笔记：${relatedSlug}`);
  }

  for (const connection of note.connections) {
    check(Boolean(connection.title.trim()), `笔记 ${note.slug} 有空白连接标题`);
    checkInternalHref(connection.href, `笔记 ${note.slug} 的连接“${connection.title}”`);
  }

  const markdownLinks = [...(source?.content.matchAll(/\[[^\]]+\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g) ?? [])]
    .map((match) => match[1]);
  for (const href of markdownLinks) {
    checkInternalHref(href, `笔记 ${note.slug} 的正文链接`);
  }
}

checkUnique(libraryItems, 'id', '收藏 ID');
checkUnique(libraryItems, 'url', '收藏原链接');
check(libraryItems.some((item) => item.featured), '收藏夹缺少重点候选');

for (const item of libraryItems) {
  for (const field of ['title', 'source', 'topic', 'description', 'whyISavedIt', 'jingTake', 'visual']) {
    check(Boolean(item[field].trim()), `收藏 ${item.id} 缺少 ${field}`);
  }

  check(validLibraryTypes.has(item.type), `收藏 ${item.id} 使用未知类型：${item.type}`);
  check(isValidDate(item.dateAdded), `收藏 ${item.id} 的收藏日期无效：${item.dateAdded}`);
  check(item.tags.length > 0, `收藏 ${item.id} 缺少标签`);
  check(isSecureExternalUrl(item.url), `收藏 ${item.id} 的原链接不是有效 HTTPS 地址：${item.url}`);
  check(item.takeStatus === 'draft' || item.takeStatus === 'confirmed', `收藏 ${item.id} 的 JING'S TAKE 状态无效：${item.takeStatus}`);
  check(item.demo === false, `收藏 ${item.id} 仍被标记为演示数据`);
}

if (failures.length > 0) {
  throw new Error(`内容一致性检查失败：\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
}

console.log(`内容一致性检查通过：${stories.length} 个故事、${experiments.length} 个实验、${notes.length} 篇笔记、${libraryItems.length} 条收藏；编号、详情、状态、来源与内部链接一致。`);
