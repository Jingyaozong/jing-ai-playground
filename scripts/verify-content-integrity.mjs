import { existsSync, readFileSync, readdirSync } from 'node:fs';
import matter from 'gray-matter';

const [
  { stories, experiments, tools },
  { storyDetails },
  { experimentDetails },
  { libraryItems },
  { promptItems, promptFilters, promptSource },
  { noteCategories },
  { getAllNotes },
] = await Promise.all([
  import('../app/data/content.ts'),
  import('../app/data/stories.ts'),
  import('../app/data/experiments.ts'),
  import('../app/data/library.ts'),
  import('../app/data/prompts.ts'),
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
const promptsPageSource = readFileSync(new URL('../app/prompts/page.tsx', import.meta.url), 'utf8');

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
    if (/没有生成视频|尚未生成视频/.test(detail.draftNotice ?? '')) {
      check(story.status.includes('无视频'), `故事 ${story.number} 尚未生成视频，但归档状态没有标注“无视频”`);
    }
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

  if (experiment.evidenceKind === 'protocol') {
    check(/0\s*\/\s*\d+.*待执行/.test(experiment.status), `实验 ${experiment.number} 的协议角标与归档状态不一致`);
    check(detail.samples.every((sample) => sample.generated === false && !sample.outputText), `实验 ${experiment.number} 标为待执行，但详情含有已生成样本`);
  } else if (experiment.evidenceKind === 'text-pilot') {
    check(/9\s*\/\s*9.*完成/.test(experiment.status), `实验 ${experiment.number} 的文本样本角标与归档状态不一致`);
    check(detail.samples.length === 9 && detail.samples.every((sample) => Boolean(sample.outputText?.trim()) && Boolean(sample.rawHref)), `实验 ${experiment.number} 标为已有文本样本，但缺少原始文本记录`);
  } else if (experiment.evidenceKind === 'static-pilot') {
    check(experiment.status.includes('PILOT 4 格'), `实验 ${experiment.number} 的静态样本角标与归档状态不一致`);
    check(detail.samples.length === 4 && detail.samples.every((sample) => sample.generated !== false && !sample.outputText), `实验 ${experiment.number} 的四格静态样本状态不一致`);
  }

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

  if (note.synthetic) {
    check(note.editorialStatus === 'draft', `虚构案例 ${note.slug} 必须保留为编辑草案`);
    check(/独立虚构/.test(note.sourceNote ?? ''), `虚构案例 ${note.slug} 的来源说明缺少“独立虚构”边界`);
    check(/虚构/.test(source?.content.slice(0, 1200) ?? ''), `虚构案例 ${note.slug} 的正文开头没有明确标注虚构`);
    check(/不对应|不是|不使用/.test(source?.content.slice(0, 1200) ?? ''), `虚构案例 ${note.slug} 的正文开头没有说明与真实项目的关系`);
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
  check(item.sourceStatus === undefined || item.sourceStatus === 'metadata-pending', `收藏 ${item.id} 的来源状态无效：${item.sourceStatus}`);
  if (item.sourceStatus === 'metadata-pending') {
    check(item.takeStatus === 'draft' && !item.featured && !item.jingPick, `收藏 ${item.id} 来源未核对，不可作为精选或确认观点`);
    check(!item.creator && /待核对/.test(item.title) && /未能|尚未/.test(item.description), `收藏 ${item.id} 未明确显示来源核验边界`);
  }
  check(item.demo === false, `收藏 ${item.id} 仍被标记为演示数据`);
}

check(libraryItems.filter((item) => item.sourceStatus === 'metadata-pending').length === 2, '待核对视频数与页面状态说明不一致');

check(!promptsPageSource.includes('来自真实项目'), 'Prompt 页面不得把本站故事草案标成“来自真实项目”');

checkUnique(promptItems, 'id', 'Prompt ID');
check(
  JSON.stringify(promptItems.filter((item) => item.sourceAdapted).map((item) => item.title)) === JSON.stringify(promptSource.topicTitles),
  '公众号来源主题与前 12 张改写卡的标题或顺序不一致',
);
for (const item of promptItems) {
  const label = `Prompt ${item.id}`;
  check(promptFilters.includes(item.category), `${label} 使用未知分类：${item.category}`);
  check(Boolean(item.title.trim() && item.description.trim() && item.prompt.trim() && item.usageNote.trim()), `${label} 缺少标题、摘要、正文或使用提示`);
  check(isValidDate(item.dateAdded), `${label} 的日期无效：${item.dateAdded}`);
  check(item.demo === false, `${label} 仍被标记为演示数据`);
  check(Boolean(item.editorial) !== Boolean(item.sourceAdapted), `${label} 必须明确区分编辑候选与来源改写`);

  if (item.sourceAdapted) {
    check(isSecureExternalUrl(item.sourceHref), `${label} 缺少有效的原作者 HTTPS 链接`);
    check(item.sourceHref === promptSource.url, `${label} 的公众号原文链接与来源登记不一致`);
    check(/改写|非原文/.test(item.usageNote), `${label} 的使用提示没有说明改写边界`);
    check(item.sourceLabel === promptSource.cardLinkLabel, `${label} 的入口没有标明指向原文合集`);
  }

  if (item.editorial) {
    check(/^【状态】/.test(item.prompt), `${label} 正文开头缺少内容状态`);
    check(/编辑候选.*待荆确认/.test(item.usageNote), `${label} 的使用提示缺少待确认状态`);
    check(Boolean(item.relatedLinks?.length), `${label} 缺少方法或工具关联入口`);
  }

  const links = [
    ...(item.sourceHref ? [{ href: item.sourceHref, label: item.sourceLabel ?? '' }] : []),
    ...(item.relatedLinks ?? []),
  ];
  check(new Set(links.map((link) => link.href)).size === links.length, `${label} 存在重复关联入口`);
  for (const relatedLink of item.relatedLinks ?? []) {
    check(relatedLink.href.startsWith('/'), `${label} 的站内关联入口不是内部路径：${relatedLink.href}`);
  }
  for (const link of links) {
    check(Boolean(link.label.trim()), `${label} 存在无标题的关联入口`);
    check(link.href.startsWith('/') || isSecureExternalUrl(link.href), `${label} 的关联入口不是内部路径或 HTTPS 地址：${link.href}`);
    checkInternalHref(link.href, `${label} 的关联入口“${link.label}”`);

    if (link.href.startsWith('/tools/') && /打开|预检/.test(link.label)) {
      const tool = tools.find((candidate) => candidate.href === link.href);
      check(tool?.status === 'Ready', `${label} 将尚未可用的工具标为可打开：${link.href}`);
    }

    if (link.href.startsWith('/experiments/')) {
      const experiment = experiments.find((candidate) => `/experiments/${candidate.slug}/` === link.href);
      const statedNumber = link.label.match(/EXP\.(\d{3})/)?.[1];
      const statedSamples = link.label.match(/\d+\s*\/\s*\d+/)?.[0].replaceAll(' ', '');
      if (statedNumber) check(experiment?.number === statedNumber, `${label} 的实验编号与入口不一致：${link.label}`);
      if (statedSamples) {
        check(experiment?.status.replaceAll(' ', '').includes(statedSamples), `${label} 的实验样本数与入口不一致：${link.label}`);
        check(experiment?.evidenceKind === 'text-pilot', `${label} 把非文本 Pilot 标为已有实验依据：${link.label}`);
      }
    }
  }
}

if (failures.length > 0) {
  throw new Error(`内容一致性检查失败：\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
}

console.log(`内容一致性检查通过：${stories.length} 个故事、${experiments.length} 个实验、${notes.length} 篇笔记、${libraryItems.length} 条收藏、${promptItems.length} 张 Prompt；编号、详情、状态、来源与内部链接一致。`);
