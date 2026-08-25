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
    tone: 'blue' | 'yellow' | 'coral' | 'mint';
  }>;
  production: Array<{
    phase: string;
    status: '完成草案' | '制作中' | '待开始';
    note: string;
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
    duration: '01:38',
    status: '制作中',
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
      { shot: 'SCENE 01', title: '清晨醒来', direction: '高亮但陌生的卧室；人物与环境之间留出很大空白。', status: '待生成关键帧', tone: 'yellow' },
      { shot: 'SCENE 02', title: '桌上的信', direction: '信封、合照与时钟形成三个视觉锚点；手尚未碰到信。', status: '待生成关键帧', tone: 'blue' },
      { shot: 'SCENE 03', title: '傍晚见面', direction: '两个人处于同一画面，却被门框或玻璃分隔。', status: '待生成关键帧', tone: 'coral' },
      { shot: 'SCENE 04', title: '写给明天', direction: '夜晚台灯下，她写信的手与清晨读信的手形成首尾呼应。', status: '待生成关键帧', tone: 'mint' },
    ],
    production: [
      { phase: '故事梗概', status: '完成草案', note: '核心设定与情感问题已经确定，仍可继续压缩。' },
      { phase: '90 秒剧本', status: '制作中', note: '正在调整见面段落，让信息更少、情绪更清楚。' },
      { phase: '人物设定', status: '制作中', note: '需要固定发型、服装、年龄感与关键配饰。' },
      { phase: '分镜与关键帧', status: '待开始', note: '剧本锁定后按六个时间节点拆镜。' },
      { phase: '视频生成', status: '待开始', note: '优先保证表演与人物一致性，再处理复杂运镜。' },
      { phase: '剪辑与声音', status: '待开始', note: '以信件旁白和清晨/夜晚的环境声构建循环感。' },
    ],
    nextSteps: [
      '确认 90 秒版本的最终剧本与结尾句。',
      '完成女主角和另一人物的视觉设定图。',
      '为六个时间节点拆出第一版分镜表。',
      '用同一套人物锚点生成四张关键场景图。',
    ],
  },
];

export function getStoryBySlug(slug: string) {
  return storyDetails.find((story) => story.slug === slug);
}
