// “Bad Case 侦探”小游戏的关卡数据。
// 素材全部来自五款模型交叉盲评（见 blind-test.ts），每条视频取该产品这道题的第 1 次生成。
// 正确答案和解释是逐帧看过视频后写的；评审团分数不在这里写，统一从 blind-test-scores.ts 读取。

export type DetectiveProduct = 'kling' | 'jimeng' | 'hailuo' | 'happyhorse' | 'vidu';

export type DetectiveRound = {
  id: string;
  /** 盲评题号，题面从 blindTest.questions 读取 */
  question: number;
  product: DetectiveProduct;
  /** 四个选项，其中一个必须是 NO_ISSUE */
  options: string[];
  /** 正确选项的文字，必须和 options 里的某一项完全一致 */
  answer: string;
  /** 失败类型；没有问题时写“通过” */
  type: string;
  /** 揭晓时显示的一句解释，只写画面里看得到的东西 */
  explanation: string;
  /** 带红框的截帧（可选） */
  frame?: { src: string; timecode: string; alt: string };
  /** 补充说明（可选） */
  note?: string;
};

export const NO_ISSUE = '没有明显问题';

export const detectiveConfig = {
  seconds: 25,
  source: '/cases/five-model-blind-test/',
};

export const detectiveRounds: DetectiveRound[] = [
  {
    id: 'q1-happyhorse',
    question: 1,
    product: 'happyhorse',
    options: ['热气是一张贴图，形状不变地平移', '窗外的雨滴停在半空不动', '杯子在画面里逐渐变形', NO_ISSUE],
    answer: NO_ISSUE,
    type: '通过',
    explanation: '热气不断上升、卷曲、散开，窗外雨滴在动，杯子和桌面纹理从头到尾保持稳定。',
  },
  {
    id: 'q5-hailuo',
    question: 5,
    product: 'hailuo',
    options: ['招牌上是认不出的假字，不是“幸福奶茶”', '店门口一个顾客都没有', '镜头一直在剧烈晃动', NO_ISSUE],
    answer: '招牌上是认不出的假字，不是“幸福奶茶”',
    type: '指令遗漏与绑定错误',
    explanation: '招牌上有五个像汉字的字形，没有一个是“幸福奶茶”。画面其余部分干净自然，所以这个问题很容易被一眼带过。',
    frame: { src: '/videos/blind/badcases/q5-hailuo.webp', timecode: '00:03', alt: '红框标出招牌上的五个假字' },
  },
  {
    id: 'q8-jimeng',
    question: 8,
    product: 'jimeng',
    options: ['狗跑到中央后没有停下，直接跑出画面', '抖水时毛色变成了橙红色', '奔跑时四条腿粘在一起', NO_ISSUE],
    answer: NO_ISSUE,
    type: '通过',
    explanation: '狗从左侧入画，跑到中央停下，抖水时能看到甩出的水珠，最后转向镜头张嘴。毛色和体型全程稳定。',
    note: '视频静音，“吠叫”这一步只能看到张嘴，听不到声音。',
  },
  {
    id: 'q10-vidu',
    question: 10,
    product: 'vidu',
    options: ['画面底部出现了题面没要求的乱码字幕', '博主从头到尾没有张嘴', '背后的书架在说话时变形', NO_ISSUE],
    answer: '画面底部出现了题面没要求的乱码字幕',
    type: '指令遗漏与绑定错误',
    explanation: '题面没有要求字幕，画面底部却一直挂着一条字幕：前半段是拼不出意思的英文，后半段混进了残缺的中文。',
    frame: { src: '/videos/blind/badcases/q10-vidu.webp', timecode: '00:03', alt: '红框标出画面底部的乱码字幕' },
    note: '这道题原本考音画同步。游戏里视频静音，这一关只看画面。',
  },
  {
    id: 'q7-hailuo',
    question: 7,
    product: 'hailuo',
    options: ['翻起的食材没有落回锅里，掉到了锅下面的灶台上', '整段视频没有出现火焰', '镜头中途切到了另一间厨房', NO_ISSUE],
    answer: '翻起的食材没有落回锅里，掉到了锅下面的灶台上',
    type: '空间、碰撞与物理失败',
    explanation: '第二次颠勺时，食材从锅的上方落下，却出现在锅底下面的灶台上，锅里变空了。题面要求的是“落回锅里”。',
    frame: { src: '/videos/blind/badcases/q7-hailuo.webp', timecode: '00:05', alt: '红框标出掉在灶台上的食材，锅悬在它上方是空的' },
  },
  {
    id: 'q6-happyhorse',
    question: 6,
    product: 'happyhorse',
    options: ['两人的手没碰到就分开了', '转身后两人跑向不同方向', '跑动时两人的球衣颜色互换', NO_ISSUE],
    answer: NO_ISSUE,
    type: '通过',
    explanation: '两只手掌在画面上方贴合，随后两人转身朝同一方向跑去，白衣和黑衣始终对得上。中间从近景切到背后跟拍，是正常剪辑。',
  },
  {
    id: 'q3-jimeng',
    question: 3,
    product: 'jimeng',
    options: ['画面与题面无关：没有少女和樱花，也不是动漫风格', '画面从头到尾是黑白的', '镜头一直在快速旋转', NO_ISSUE],
    answer: '画面与题面无关：没有少女和樱花，也不是动漫风格',
    type: '样本错配（执行问题）',
    explanation: '画面是写实风格的雨夜霓虹街道。原因不在模型：负责这款的组员用错了题面。评测里遇到这种情况，要先剔除再补跑，不能算成模型的分。',
    frame: { src: '/videos/blind/badcases/q3-jimeng.webp', timecode: '00:02', alt: '雨夜霓虹街道，与题面不符' },
    note: '这一格的评审分数不可靠：小组约定按 0 分处理，但 7 位评审里只有 3 位填了 0。',
  },
  {
    id: 'q8-vidu',
    question: 8,
    product: 'vidu',
    options: ['毛色是高饱和的橙红色，尾巴偏大，不像金毛犬', '狗一开始就站在画面中央，没有入画', '天色是正午，不是清晨', NO_ISSUE],
    answer: '毛色是高饱和的橙红色，尾巴偏大，不像金毛犬',
    type: '外观与道具变异',
    explanation: '狗的毛色是很饱和的橙红色，抖水时最明显，尾巴比例也偏大。动作步骤基本都在，问题出在主体外观。',
    frame: { src: '/videos/blind/badcases/q8-vidu.webp', timecode: '00:03', alt: '红框标出毛色异常的狗' },
  },
];

export const detectiveVideo = (round: DetectiveRound) => `/videos/blind/q${round.question}-${round.product}.mp4`;
export const detectivePoster = (round: DetectiveRound) => `/videos/blind/posters/q${round.question}-${round.product}.webp`;
