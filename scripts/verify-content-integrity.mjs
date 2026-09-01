const [{ stories, experiments, tools }, { storyDetails }, { experimentDetails }] = await Promise.all([
  import('../app/data/content.ts'),
  import('../app/data/stories.ts'),
  import('../app/data/experiments.ts'),
]);

const failures = [];

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

if (failures.length > 0) {
  throw new Error(`内容一致性检查失败：\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
}

console.log(`内容一致性检查通过：${stories.length} 个故事、${experiments.length} 个实验，编号、详情、状态与工具链接一致。`);
