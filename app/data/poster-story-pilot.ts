export type PosterStoryPilotRecord = {
  id: 'A01' | 'B01' | 'C01';
  group: 'A' | 'B' | 'C';
  poster: string;
  method: string;
  outputTitle: string;
  protagonist: string;
  worldRule: string;
  conflict: string;
  irreversibleChoice: string;
  synopsis: string;
  wordCount: string;
  scores: {
    evidence: number;
    boundary: number;
    coherence: number;
    relevance: number;
  };
  failures: string[];
  auditNote: string;
  rawHref: string;
};

export const posterStoryPilotRecords: PosterStoryPilotRecord[] = [
  {
    id: 'A01',
    group: 'A',
    poster: '双月公交站',
    method: '直接反推',
    outputTitle: '《下一班月亮》',
    protagonist: '夜班公交调度员顾岑',
    worldRule: '第二个月亮升起时，一辆没有线路号的末班车会停靠，让乘客回到一次错过的出发。',
    conflict: '顾岑想回到妹妹离城的那晚阻止她，却得知上车后，现在线路中所有关于他的记忆都会消失。',
    irreversibleChoice: '他撕掉自己的车票，把唯一座位让给一名想见母亲最后一面的陌生人。',
    synopsis: '清晨将亮，湿漉漉的街道上仍没有一辆车。夜班公交调度员顾岑独坐站牌下，等第二个月亮升到路灯正上方。传说那时会来一辆没有线路号的末班车，把人送回一次错过的出发。他已经等了七年，想回到妹妹离城的那晚阻止她。车终于驶近，司机却告诉他：上车的人会从现在线路里消失，连亲人也不再记得。身旁的陌生女孩握着同样的票，说只想赶上母亲最后一次清醒。顾岑撕掉自己的票，把唯一座位推给她。车门关闭后，第二个月亮开始变淡；他仍记得妹妹，却第一次不再等下一班车。',
    wordCount: '197',
    scores: { evidence: 3, boundary: 1, coherence: 4, relevance: 4 },
    failures: ['推测冒充事实', '任意添加身份'],
    auditNote: '双月、湿路、空站、路灯与独坐人物都进入了情节；但人物职业、亲属关系和魔法公交直接写成既定事实，读者无法看出哪些来自画面、哪些是主动创作。',
    rawHref: '/records/poster-to-story/p01-a-direct.md',
  },
  {
    id: 'B01',
    group: 'B',
    poster: '双月公交站',
    method: '证据优先',
    outputTitle: '《双月停靠站》',
    protagonist: '负责核查废弃站点的公交线路勘察员林屿',
    worldRule: '双月同时可见时，未曾抵达的公交会以倒影线路出现在湿路上；承认自己真正等待什么的人才能看见终点。',
    conflict: '林屿奉命关闭空站，却在积水倒影里看见通往失踪伴侣的线路；只要他上车，站点就会继续诱使后来者等待。',
    irreversibleChoice: '他关闭站灯并把站点登记为永久停用，放弃唯一一次追上伴侣的机会。',
    synopsis: '可见证据先被逐项记录：天上有两个月亮，街道潮湿，公交站空旷，只有一名成年人坐着等待；站牌和路灯仍亮着，画面里没有公交，天色接近清晨。基于这些线索，故事把主人公设定为核查废弃站点的线路勘察员林屿。双月同时出现时，未曾抵达的公交会以倒影线路浮在湿路上，只有承认自己真正等待什么的人才能看见终点。林屿奉命关闭这座空站，却在积水里看见通往失踪伴侣的线路。如果他上车，站点会继续让后来者困在等待里。天亮前，他亲手关闭站灯，将站点登记为永久停用。倒影中的车门随即消失，他也放弃了唯一一次追上那个人的机会。',
    wordCount: '224',
    scores: { evidence: 5, boundary: 4, coherence: 4, relevance: 5 },
    failures: [],
    auditNote: '先列出了可指认的主体、异常、空间与光线，再进入故事。新增职业、倒影线路和失踪伴侣仍是创作设定，但输出只做了“证据／故事”两段，推测与主动选择还没有完全拆开。',
    rawHref: '/records/poster-to-story/p01-b-evidence-first.md',
  },
  {
    id: 'C01',
    group: 'C',
    poster: '双月公交站',
    method: '证据／推测／选择三栏',
    outputTitle: '《第二个月台》',
    protagonist: '城市档案馆员许澄',
    worldRule: '双月清晨，废弃站点会短暂连接到“没有被选择的人生”；一旦登车，现有人生中最亲近的人会忘记乘客。',
    conflict: '许澄可以登车回到弟弟仍活着的时间线，但现在由她抚养的女孩会彻底忘记她。',
    irreversibleChoice: '她反转站牌，永久关闭映在湿路上的第二条线路，保留现在的人生。',
    synopsis: '可见证据：双月悬在清晨天空；湿路、空站、亮着的路灯和一名坐着的成年人构成等待场景；画面中没有公交。合理推测：等待持续了一段时间，双月可能与异常时刻有关，积水也许能成为另一处空间的入口，但这些都未被画面证明。主动创作选择：双月代表两条时间线，废弃站只在天亮前连接“没有被选择的人生”，登车代价是现有人生中最亲近的人会忘记乘客。档案馆员许澄在倒影里看见弟弟仍活着的城市，也看见自己抚养的女孩正从记忆中抹去她。车门打开时，她没有上车，而是反转站牌，永久关闭第二条线路。晨光覆盖积水，她保留了现在的人生，也失去了最后一次改写过去的机会。',
    wordCount: '238',
    scores: { evidence: 5, boundary: 5, coherence: 4, relevance: 5 },
    failures: ['解释过量'],
    auditNote: '三层来源最清楚：画面事实、可能解释和主动添加的世界规则都有位置；故事也依赖双月、湿路、空站和等待关系。代价是前置说明较长，正文的叙事流动性略弱。',
    rawHref: '/records/poster-to-story/p01-c-three-column.md',
  },
];
