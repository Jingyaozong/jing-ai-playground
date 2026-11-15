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
  'no-boat-at-pier-seven-08': { result: '失败', finding: '00:01.2 靴子第一次踩上跳板很干净，但 00:02.5 又抬起、00:03.7 再落下一次，变成了重复踏步；跳板也看不出受力形变。' },
  'no-boat-at-pier-seven-10': { result: '通过', finding: '双手绷紧船票，00:02.5–00:03.7 从中间撕开，00:04.4 两半分开后没有复原；手表在，手指结构完整。' },
  'before-the-rain-ends-05': { result: '失败', finding: '雨柱又一次变成画面正中一根细细的水线，和第 02 镜同样的问题；"抬头确认"没有出现。雨衣、蓝色斜挎包和人物长相稳定，通道没有变形。' },
  'before-the-rain-ends-09': { result: '通过', finding: '00:00.6–00:01.3 合伞一次，00:02.5 放上黄色长椅，00:03.1 松手，之后伞没有漂移。' },
  'shadow-arrives-five-minutes-early-09': { result: '失败', finding: '要求真人的脚钉在原地，实际 00:01.9 起她自己迈步，00:04.4 已经走出画面；影子跟着人走，没有独立改道。' },
  'shadow-arrives-five-minutes-early-12': { result: '失败', finding: '00:00 画面里同时出现两个穿同样衣服的她，一个在路上走、一个已经站在门口；影子贴回脚边的过程也看不出来。父亲和门框是稳定的。' },
  'objects-remember-the-last-sentence-08': { result: '通过', finding: '食指从画外慢慢靠近，00:02.5 指腹碰到杯柄外侧后停住；杯子和杯垫全程没动，手指结构完整。' },
  'objects-remember-the-last-sentence-10': { result: '通过', finding: '00:01.2 杯底落稳在台面上，00:03.1 手指才张开，00:03.7 手离开，杯子位置不变。小瑕疵：00:03.1 前后杯口轮廓有轻微扭曲。' },
  'before-the-water-recedes-08': { result: '部分通过', finding: '右手持笔在左前臂上一段段画出连续折线，路线不跳、不漂，左臂稳定。但画了约 10 个转折点并加了箭头，不是要求的 7 个。' },
  'before-the-water-recedes-10': { result: '失败', finding: '伞始终只有一把且保持合拢，但伞尖一直贴着水面，"提起离地"看不出来；00:01.2–00:02.0 松散的伞面变成紧紧卷起并多了一条束带，伞形改变。' },
  'before-the-water-recedes-11': { result: '通过', finding: '伞在 00:01.9 完全撑开，之后水才开始退，露出木地板；全程只有一把伞。偏差：水大致向画面深处退，不是严格的左前到右后对角线。' },
};

export const testOutput = (slug: string, shot: string) => storyTestOutputs[`${slug}-${shot}`];
export const testVideo = (slug: string, shot: string) => ({ video: `/videos/story-tests/${slug}-${shot}.mp4`, poster: `/videos/story-tests/${slug}-${shot}.webp` });
