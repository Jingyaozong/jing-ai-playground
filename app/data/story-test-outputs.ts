// 故事页「动作测试」的实测结果。键为 `故事 slug-镜头号`。
// 全部用豆包 · Seedance 2.0 Mini 文生视频，16:9 · 5 秒 · 每条生成 1 次，不用参考图。

export type TestResult = '通过' | '部分通过' | '失败';
export type TestOutput = { result: TestResult; finding: string };

export const storyTestModel = '豆包 · Seedance 2.0 Mini · 文生视频 · 16:9 · 5 秒 · 每条 1 次 · 无参考图';

export const storyTestOutputs: Record<string, TestOutput> = {
  'she-forgets-yesterday-02': { result: '失败', finding: '00:00.9–00:01.9 她已经坐直，镜中人却还靠在枕头上，而且朝向和本人相同、没有镜像翻转。短发、发夹、耳饰和开衫都保持住了。' },
  'she-forgets-yesterday-07': { result: '部分通过', finding: '玻璃反射没有吞掉五官，眼神落在门外男人的倒影上。但男人只是一块扁平的深色剪影；00:03 起表情从迟疑变成明显的惊慌；头上出现两只发夹，定妆图只有一只。' },
  'she-forgets-yesterday-11': { result: '失败', finding: '照片在 00:01.1 还在手里，00:01.25 凭空消失，没有折起或收起的动作。之后伸手、十指交握的顺序清楚，手指结构完整。' },
  'before-the-rain-ends-02': { result: '失败', finding: '"雨柱"变成一根细细的水流，像水龙头；只要求一步，人却连续走了好几步。湿圆大致跟着脚移动，这一点做到了。' },
  'shadow-arrives-five-minutes-early-01': { result: '通过', finding: '真人双臂全程垂下不动，墙上只有一个影子，00:01.2 起影子独自抬臂伸向架子上的杯子，杯子没有提前移动。' },
  'objects-remember-the-last-sentence-09': { result: '通过', finding: '00:00.6 手指环住杯柄，00:01.3 握稳，约 00:02.5 杯子才离桌并保持在空中，顺序正确；杯形、杯柄和手指数没有变化。' },
  'no-boat-at-pier-seven-03': { result: '通过', finding: '只出了一张票，00:01.9 停住后手在 00:03.1 才伸进来接票，手表和袖口都在。偏差：镜头是正面平视，不是提示词写的俯拍。' },
  'before-the-water-recedes-11': { result: '通过', finding: '伞在 00:01.9 完全撑开，之后水才开始退，露出木地板；全程只有一把伞。偏差：水大致向画面深处退，不是严格的左前到右后对角线。' },
};

export const testOutput = (slug: string, shot: string) => storyTestOutputs[`${slug}-${shot}`];
export const testVideo = (slug: string, shot: string) => ({ video: `/videos/story-tests/${slug}-${shot}.mp4`, poster: `/videos/story-tests/${slug}-${shot}.webp` });
