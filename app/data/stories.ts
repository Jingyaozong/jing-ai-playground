export type StoryDetail = {
  slug: string;
  number: string;
  title: string;
  englishTitle: string;
  type: string;
  date: string;
  duration: string;
  status: string;
  draft: boolean;
  logline: string;
  premise: string;
  beats: Array<{
    time: string;
    title: string;
    copy: string;
    tone: 'blue' | 'yellow' | 'coral' | 'mint';
  }>;
  rules: Array<{
    label: string;
    title: string;
    copy: string;
  }>;
  stills: Array<{
    shot: string;
    title: string;
    direction: string;
    status: string;
    framePosition: 'left top' | 'right top' | 'left bottom' | 'right bottom';
    tone: 'blue' | 'yellow' | 'coral' | 'mint';
  }>;
  production: Array<{
    phase: string;
    status: '完成草案' | '制作中' | '待开始';
    note: string;
  }>;
  script: Array<{
    timecode: string;
    scene: string;
    visual: string;
    voice: string;
    sound: string;
  }>;
  shotList: Array<{
    shot: string;
    duration: number;
    size: string;
    visual: string;
    camera: string;
    sound: string;
  }>;
  nextSteps: string[];
};

export const storyDetails: StoryDetail[] = [
  {
    slug: 'she-forgets-yesterday',
    number: '001',
    title: '她每天醒来都会忘记昨天',
    englishTitle: 'She Forgets Yesterday',
    type: 'AI Short Film',
    date: '2026.08',
    duration: '01:30',
    status: 'AI 共创概念稿',
    draft: true,
    logline: '她每天醒来都会失去昨天的记忆，只能依靠桌上那封由“昨天的自己”留下的信，重新认识正在告别的人。',
    premise: '这不是一个关于恢复记忆的故事，而是关于：如果每天都要重新选择一次，你还会不会继续爱同一个人。',
    beats: [
      { time: '06:42', title: '醒来', copy: '她在陌生的房间醒来，不认识镜子里的人，也不记得桌上的合照。', tone: 'yellow' },
      { time: '06:47', title: '发现信', copy: '信封上只有一句话：先别害怕，这是你写给自己的。', tone: 'blue' },
      { time: '07:10', title: '重新认识', copy: '她按照信里的线索，一件件确认自己的名字、习惯和那个人。', tone: 'mint' },
      { time: '17:30', title: '见面', copy: '对方熟悉她所有细节，她却只能礼貌地听完他们共同的昨天。', tone: 'coral' },
      { time: '23:18', title: '做出选择', copy: '她决定不再追问记忆能否回来，而是给明天留下新的判断。', tone: 'blue' },
      { time: '23:56', title: '写下一封信', copy: '她写完第一句：如果你正在读这封信，说明我又忘记了。', tone: 'yellow' },
    ],
    rules: [
      { label: 'THE LETTER', title: '信件不能替她做决定', copy: '它只保存事实和昨天的感受，明天的她仍然可以重新选择。' },
      { label: 'THE PHOTO', title: '照片证明发生过，不证明还爱着', copy: '它是人物关系的证据，也是她和观众共同面对的疑问。' },
      { label: 'THE CLOCK', title: '一天是完整的倒计时', copy: '从醒来到睡去，所有关系必须在记忆再次清零前重新建立。' },
    ],
    stills: [
      { shot: 'SCENE 01', title: '清晨醒来', direction: '明亮但陌生的蓝色卧室；她坐在床沿望向窗外，黄色外套成为第一处身份锚点。', status: 'AI 概念关键帧', framePosition: 'left top', tone: 'yellow' },
      { shot: 'SCENE 02', title: '桌上的信', direction: '俯拍把空白信封、照片、时钟和迟疑的手放进同一条证据链。', status: 'AI 概念关键帧', framePosition: 'right top', tone: 'blue' },
      { shot: 'SCENE 03', title: '傍晚见面', direction: '玻璃门把两个人分在画面两侧；暖色光让距离看起来更像告别。', status: 'AI 概念关键帧', framePosition: 'left bottom', tone: 'coral' },
      { shot: 'SCENE 04', title: '写给明天', direction: '夜晚台灯下，她低头写信；蓝色发夹、红色耳饰和黄色外套继续维持人物身份。', status: 'AI 概念关键帧', framePosition: 'right bottom', tone: 'mint' },
    ],
    production: [
      { phase: '故事梗概', status: '完成草案', note: '由 AI 编辑完成首版核心设定与一天时间线，尚未由荆确认。' },
      { phase: '人物设定', status: '完成草案', note: '已建立短发、蓝色发夹、红色三角耳饰和黄色外套四个视觉锚点。' },
      { phase: '概念关键帧', status: '完成草案', note: '已生成首轮四格视觉板，用于检查一天中的光线与情绪节奏。' },
      { phase: '90 秒剧本', status: '完成草案', note: '已写成六场、十四镜的第一版可拍摄文本；对白、旁白和声音仍待荆确认。' },
      { phase: '视频生成', status: '待开始', note: '优先保证表演与人物一致性，再处理复杂运镜。' },
      { phase: '剪辑与声音', status: '待开始', note: '以信件旁白和清晨/夜晚的环境声构建循环感。' },
    ],
    script: [
      { timecode: '00:00—00:11', scene: '清晨 / 醒来', visual: '白光越过窗帘。她睁眼，看见陌生的房间、镜中的自己和床头一张合照。', voice: '她（轻声）：“这是……谁的房间？”', sound: '闹钟停在 06:42；远处车流，布料摩擦。' },
      { timecode: '00:11—00:23', scene: '桌边 / 发现信', visual: '她走近桌面。信封写着“给明天醒来的我”。照片背面标着一个名字：林澈。', voice: '昨天的她（旁白）：“先别害怕。这是你写给自己的。你会忘记昨天，但你仍然可以决定今天。”', sound: '拆信声；环境声逐渐收窄，只留下呼吸。' },
      { timecode: '00:23—00:44', scene: '白天 / 重新认识', visual: '蓝色发夹、红色耳饰、黄色外套。她照着信上的清单确认生活，也反复端详照片里的人。', voice: '昨天的她（旁白）：“你叫知夏。你不喝太甜的咖啡。林澈陪了你三年。照片能证明发生过，却不能替你证明还爱着。”', sound: '冰箱门、咖啡机和纸页组成有节奏的生活声。' },
      { timecode: '00:44—01:01', scene: '傍晚 / 见面', visual: '玻璃门两侧，他们隔着倒影对视。林澈没有拥抱她，只把一杯无糖咖啡推过去。', voice: '林澈：“今天的我，还算是你愿意见的人吗？”\n她：“我不知道。但我想听你把昨天讲完。”', sound: '门铃一响；街声回到画面，停顿保留两秒。' },
      { timecode: '01:01—01:17', scene: '夜晚 / 做出选择', visual: '两人并肩走到路口。她没有翻完旧照片，而是第一次主动握住他的手。', voice: '她（旁白）：“也许爱不是记得多少。也许是知道明天会忘，今天还是愿意走近一步。”', sound: '脚步、晚风；音乐第一次出现，只用三枚温暖音符。' },
      { timecode: '01:17—01:30', scene: '桌边 / 写给明天', visual: '台灯下，她在新信纸上落笔。镜头停在第一句话，画面切黑前，闹钟跳到 23:56。', voice: '她（旁白）：“如果你正在读这封信，说明我又忘记了。别急着相信昨天的我——请你再亲自选择他一次。”', sound: '笔尖划纸；最后一笔落下，闹钟秒针继续。' },
    ],
    shotList: [
      { shot: '01', duration: 6, size: '特写', visual: '晨光扫过闭着的眼睛；她突然睁眼。', camera: '固定', sound: '闹钟与呼吸' },
      { shot: '02', duration: 5, size: '中景', visual: '她坐起环顾卧室，在镜中看见自己。', camera: '缓慢推近', sound: '“这是谁的房间？”' },
      { shot: '03', duration: 6, size: '俯拍特写', visual: '信封、合照、时钟形成三角；手进入画面。', camera: '固定', sound: '拆信声' },
      { shot: '04', duration: 6, size: '近景', visual: '信纸遮住半张脸，她读到第一行。', camera: '轻微手持', sound: '旁白：先别害怕' },
      { shot: '05', duration: 7, size: '蒙太奇', visual: '戴发夹、耳饰、穿黄色外套，逐项确认身份。', camera: '三次跳切', sound: '旁白＋生活声' },
      { shot: '06', duration: 7, size: '特写', visual: '照片在她指间翻面，“林澈”两个字出现。', camera: '横移', sound: '旁白：照片能证明发生过' },
      { shot: '07', duration: 7, size: '中近景', visual: '她在玻璃门内，林澈在门外；倒影叠在一起。', camera: '固定', sound: '门铃与街声' },
      { shot: '08', duration: 6, size: '双人中景', visual: '林澈坐下，把无糖咖啡推到她面前。', camera: '缓慢横移', sound: '“还算是你愿意见的人吗？”' },
      { shot: '09', duration: 7, size: '正反打近景', visual: '她看咖啡，再抬眼看他，迟疑后回答。', camera: '固定', sound: '“我想听你把昨天讲完。”' },
      { shot: '10', duration: 8, size: '远景', visual: '暮色路口，两人并肩走，距离慢慢缩短。', camera: '背后跟拍', sound: '脚步与晚风' },
      { shot: '11', duration: 6, size: '手部特写', visual: '她收起照片，主动握住林澈的手。', camera: '缓慢推近', sound: '旁白：今天还是愿意走近' },
      { shot: '12', duration: 6, size: '中景', visual: '夜晚台灯下，她摊开一张新的信纸。', camera: '侧面固定', sound: '椅子与纸页声' },
      { shot: '13', duration: 7, size: '俯拍特写', visual: '笔尖写下“如果你正在读这封信”。', camera: '缓慢下压', sound: '完整结尾旁白' },
      { shot: '14', duration: 6, size: '极特写', visual: '闹钟从 23:55 跳到 23:56；画面切黑。', camera: '固定', sound: '秒针继续，无音乐' },
    ],
    nextSteps: [
      '由荆确认人物名字、对白语气和开放式结尾是否成立。',
      '把十四镜拆成可直接投喂视频模型的逐镜 Prompt 与负面约束。',
      '选择一个视频模型完成 3 个短镜头的动作测试。',
      '记录角色一致性与情绪表演问题，再决定是否进入完整制作。',
    ],
  },
];

export function getStoryBySlug(slug: string) {
  return storyDetails.find((story) => story.slug === slug);
}
