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
  heroVisual?: 'memory-letter' | 'pier-ticket' | 'personal-rain' | 'early-shadow';
  draftNotice?: string;
  logline: string;
  premise: string;
  premiseLines: string[];
  sectionCopy?: {
    beats: { eyebrow: string; heading: string; description: string };
    rules: { eyebrow: string; heading: string; description: string };
    stills: { eyebrow: string; heading: string; description: string };
    script: { eyebrow: string; heading: string; description: string };
    shots: { eyebrow: string; heading: string; description: string };
  };
  shotSummary?: [string, string, string, string];
  stillsGenerated?: boolean;
  characterAnchor?: {
    name: string;
    title: string;
    copy: string;
    locks: string[];
  };
  ending?: { label: string; copy: string; href: string; link: string };
  related?: { href: string; label: string };
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
  promptGuide: {
    identityLock: string;
    styleLock: string;
    negative: string;
  };
  prompts: Array<{
    shot: string;
    title: string;
    prompt: string;
    constraint: string;
  }>;
  motionTests: Array<{
    shot: string;
    title: string;
    duration: string;
    purpose: string;
    action: string;
    pass: string;
    fail: string;
    status: '待生成' | '测试中' | '已记录';
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
    heroVisual: 'memory-letter',
    logline: '她每天醒来都会失去昨天的记忆，只能依靠桌上那封由“昨天的自己”留下的信，重新认识正在告别的人。',
    premise: '这不是一个关于恢复记忆的故事，而是关于：如果每天都要重新选择一次，你还会不会继续爱同一个人。',
    premiseLines: ['这不是关于恢复记忆。', '如果每天都要重新选择一次，', '还会继续爱同一个人吗？'],
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
      { phase: '视频生成', status: '制作中', note: '已完成十四镜 Prompt 包并选定三镜动作测试；尚未调用外部视频模型，也没有生成结果。' },
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
    promptGuide: {
      identityLock: 'same fictional East Asian woman, late 20s, chin-length straight black bob, blue rectangular hair clip on her right side, coral triangular earrings, mustard-yellow cardigan over an ivory crew-neck shirt, natural skin texture, consistent facial proportions',
      styleLock: 'bright cinematic realism, soft natural light, restrained performance, believable body motion, subtle 35mm film texture, clean pastel production design, 16:9 frame, no on-screen text',
      negative: 'different person, facial morphing, age change, long hair, missing blue hair clip, different earrings, wardrobe change, beauty filter, plastic skin, extra fingers, fused hands, duplicated limbs, warped objects, floating props, camera shake, flicker, subtitles, logo, watermark',
    },
    prompts: [
      { shot: '01', title: '睁眼', prompt: 'Extreme close-up of her closed eye in early morning light. A thin band of sunlight crosses her face; she opens her eye once, startled but not frightened. Locked camera, only eyelid, breath and tiny pupil adjustment move.', constraint: '动作只保留一次睁眼；避免夸张惊醒和面部抽动。' },
      { shot: '02', title: '镜中的陌生人', prompt: 'Medium shot in a pale-blue bedroom. She slowly sits up on the bed and turns toward a wardrobe mirror, discovering her own reflection. The camera makes one almost imperceptible push-in; the reflection must stay anatomically synchronized.', constraint: '镜中人物必须同步；不让发型、发夹或服装在转头时变化。' },
      { shot: '03', title: '证据桌面', prompt: 'Top-down insert of a cream envelope, one printed couple photo and a blue alarm clock reading 06:42 on a wooden desk. Her right hand enters slowly and stops above the envelope. Locked composition, clean object continuity.', constraint: '只出现一只手；信封、照片、闹钟的位置全程固定。' },
      { shot: '04', title: '读到第一行', prompt: 'Close-up of her reading a handwritten letter beside the window. The paper covers the lower half of her face; her eyes scan one line and her breathing settles. Gentle handheld drift under two centimeters, no lip movement.', constraint: '不生成可辨认的信中文字；保持克制表演。' },
      { shot: '05', title: '确认身份', prompt: 'Three clean match-cut actions against the same bright bedroom background: she clips the blue barrette into her bob, fastens one coral triangular earring, then pulls on the mustard cardigan. Precise hands, consistent face and wardrobe continuity.', constraint: '作为三个独立短片生成后剪辑；不要在一次生成中强行变装。' },
      { shot: '06', title: '照片背面', prompt: 'Macro close-up of a printed photograph between her fingers. She turns it over once, revealing a small handwritten name area while the camera slides gently left. Realistic paper flex and stable fingers.', constraint: '名字后期合成；模型画面不直接生成文字。' },
      { shot: '07', title: '隔着玻璃见面', prompt: 'Medium close-up at a small café entrance during warm dusk. She stands inside behind the glass; a man waits outside. Their reflections overlap for one second as they make eye contact. Locked camera, subtle breathing and a small uncertain glance.', constraint: '优先测试玻璃反射与双人稳定性；男角色不要求完整身份设定。' },
      { shot: '08', title: '推来咖啡', prompt: 'Two-shot at a quiet café table. The man sits opposite her and slowly slides a plain cup of black coffee across the table, then releases it. She watches the cup without touching it. Gentle lateral camera move, realistic hand contact.', constraint: '杯子只能移动一次；避免手指融合和杯子漂移。' },
      { shot: '09', title: '愿意听完', prompt: 'Close-up on her face. She looks down at the coffee, pauses, then raises her eyes toward the man with cautious openness. Locked camera, no tears, no smile, one natural blink.', constraint: '对白后期配音；只测试眼神与微表情，不做口型。' },
      { shot: '10', title: '并肩走', prompt: 'Wide rear tracking shot at a quiet blue-hour street crossing. She and the man walk side by side with a small gap that gradually narrows. The mustard cardigan remains the visual anchor; smooth slow follow, natural walking cadence.', constraint: '保持两人步速稳定；不做奔跑、回头或复杂交通。' },
      { shot: '11', title: '主动握手', prompt: 'Close-up of two hands while walking. She folds the photograph with her free hand, lowers it, then gently reaches for and holds the man’s hand. One continuous deliberate action, shallow depth of field, stable anatomy.', constraint: '核心是手部接触；若出现多指、穿模或手掌融合即判失败。' },
      { shot: '12', title: '摊开新信纸', prompt: 'Side medium shot at night under a mint-green desk lamp. She sits, places a blank cream sheet squarely on the desk and steadies it with her left hand. Locked camera, warm pool of light, quiet controlled motion.', constraint: '桌面道具保持简洁；不要自动出现文字或额外信件。' },
      { shot: '13', title: '写给明天', prompt: 'Top-down macro shot of her right hand writing slowly on cream paper under warm lamplight. The pen travels across one line while her other hand holds the page. Smooth wrist motion, realistic pen contact and paper texture.', constraint: '笔迹后期合成；只测试写字动作、手指和笔尖接触。' },
      { shot: '14', title: '23:56', prompt: 'Extreme close-up of a blue analog alarm clock on the desk at night. The second hand advances once; the minute display changes from 23:55 to 23:56 through an editorial cut. Locked frame, then a clean cut to black.', constraint: '时间数字与跳时在剪辑中完成；模型只生成稳定钟面和秒针动作。' },
    ],
    motionTests: [
      { shot: '02', title: '转头与镜像同步', duration: '5 秒', purpose: '同时检验正脸转侧脸、镜面反射和人物锚点保持。', action: '坐起 → 转头看镜子 → 停住一秒。', pass: '脸型、短发、蓝色发夹和耳饰稳定；镜像动作同步。', fail: '镜中出现另一张脸、反射延迟、发夹换边或肩部变形。', status: '待生成' },
      { shot: '07', title: '玻璃后的微表情', duration: '5 秒', purpose: '检验复杂反射下的身份稳定、眼神落点和克制表演。', action: '抬眼 → 与门外的人对视 → 很轻地吸一口气。', pass: '身份锚点清楚，视线方向可信，玻璃反射不吞没五官。', fail: '脸部重影、眼神漂移、表情突然夸张或背景人物增殖。', status: '待生成' },
      { shot: '11', title: '行走中的手部接触', duration: '5 秒', purpose: '检验最容易出错的手部结构、人物互动和连续动作。', action: '收起照片 → 伸手 → 握住对方的手。', pass: '两只手结构完整，接触顺序清楚，照片没有漂移。', fail: '多指、手掌融合、手臂穿插、照片凭空消失或动作回弹。', status: '待生成' },
    ],
    nextSteps: [
      '由荆确认人物名字、对白语气和开放式结尾是否成立。',
      '用同一张人物锚点图分别生成镜头 02、07、11 的五秒动作测试。',
      '按通过/失败标准保存参数、原始输出和问题截图。',
      '记录角色一致性与情绪表演问题，再决定是否进入完整制作。',
    ],
  },
  {
    slug: 'no-boat-at-pier-seven',
    number: '002',
    title: '第七码头没有船',
    englishTitle: 'No Boat at Pier Seven',
    type: 'AI Short Film Draft',
    date: '2026.08',
    duration: '01:12',
    status: 'AI 概念开发 · 无视频',
    draft: true,
    heroVisual: 'pier-ticket',
    draftNotice: '这是由 AI 协助整理的原创故事开发稿，周渡、周遥及全部情节均为虚构。角色锚点与四张画面是 2026-08-29 生成的视觉开发素材，用于验证人物、道具和场景方向；尚未生成视频或模型结论，也不代表已经完成的成片。',
    logline: '港口深夜值班员收到一张来自十年后的船票。票面写着失踪姐姐的名字，以及一座从来不存在的第七码头。',
    premise: '如果一条不存在的航线能带你见到错过的人，你会继续等那艘船，还是承认有些告别只能由留下的人完成？',
    premiseLines: ['一条不存在的航线，', '真能带你见到错过的人？', '继续等，', '还是由留下的人完成告别？'],
    sectionCopy: {
      beats: {
        eyebrow: '01 / One impossible night',
        heading: '二十四分钟，\n等一艘不存在的船。',
        description: '故事世界只走过二十四分钟，却压着周渡十年的等待。每个时间点都把“船会不会来”推向“他还要不要等”。',
      },
      rules: {
        eyebrow: '02 / The route rules',
        heading: '三条规则，\n让谎言保持可信。',
        description: '超自然设定只通过船票、码头和旧广播出现。规则越少越明确，人物最后的选择就越有重量。',
      },
      stills: {
        eyebrow: '03 / Key-frame briefs',
        heading: '先留四个空位，\n再决定雾里有什么。',
        description: '角色锚点与四张 AI 概念关键帧用于验证人物、道具、空间和结尾方向。它们是视觉开发素材，不是成片剧照，也不代表视频动作已经通过测试。',
      },
      script: {
        eyebrow: '04 / Screenplay draft',
        heading: '七十二秒，\n把十年等到天亮。',
        description: '五场原创短片剧本，以老打印机和广播作为声音主轴。对白保持克制，解释留给动作和空镜。',
      },
      shots: {
        eyebrow: '05 / Shot list',
        heading: '十二个镜头，\n只让一次选择发生。',
        description: '镜头表已经拆到景别、运镜和声音，可直接进入关键帧设计。当前只锁定叙事节奏，尚未进行视频模型测试。',
      },
    },
    shotSummary: ['12 SHOTS', '72 SECONDS', '1 NIGHT', 'DRAFT 01'],
    stillsGenerated: true,
    characterAnchor: {
      name: '周渡',
      title: '先确认周渡是谁，再让他走进雾里。',
      copy: '这张独立锚点图固定周渡的脸、年龄感与值班服装。后续四张关键帧都引用同一张人物图生成，用珊瑚红围巾和薄荷反光条帮助跨场景识别。',
      locks: ['短卷黑发＋疲惫但平静的眼神', '海军蓝港口工装＋一条薄荷反光带', '珊瑚红针织围巾＋旧银色腕表'],
    },
    ending: {
      label: 'CURRENT ENDING',
      copy: '船没有来。\n天亮以后，他第一次没有继续等。',
      href: '/experiments/what-reference-images-lock/',
      link: '先看角色锁定实验 ↗',
    },
    related: { href: '/notes/ai-video-shot-continuity/', label: '阅读连续性方法 ↗' },
    beats: [
      { time: '00:03', title: '出票', copy: '停用多年的针式打印机自行启动，吐出一张日期为 2036 年的单程票。乘客是周渡，签发人是失踪十年的姐姐周遥。', tone: 'yellow' },
      { time: '00:08', title: '查图', copy: '周渡翻遍值班室的旧图纸。港口只有一到六码头，所有版本都没有“7”。', tone: 'blue' },
      { time: '00:17', title: '起雾', copy: '第三声雾笛落下，六号码头尽头亮起一块黄色“7”号牌，一条窄跳板伸进没有船的雾里。', tone: 'mint' },
      { time: '00:19', title: '听见', copy: '停用的七码头频道突然有了信号。广播里传来年长十岁的周遥：“小渡，不要上来。”', tone: 'coral' },
      { time: '00:22', title: '撕票', copy: '跳板在脚下轻响。他没有问姐姐在哪里，只问了一句“你还好吗”，然后把票沿虚线慢慢撕开。', tone: 'blue' },
      { time: '00:24', title: '退潮', copy: '号牌和跳板随雾消失。天亮后第一班船从三号码头离岸，周渡关掉广播，第一次准时下班。', tone: 'yellow' },
    ],
    rules: [
      { label: 'THE TICKET', title: '船票只出现一次', copy: '午夜后由停用打印机出票，日期来自十年后；票面只有乘客、时间和七码头，不写目的地。沿虚线撕开后，航线永久关闭。' },
      { label: 'PIER 07', title: '码头只存在七分钟', copy: '第三声雾笛后的 00:17 到 00:24，六号码头尽头才会多出号牌与跳板。雾里没有可见船体，只有受力和声响证明它可能存在。' },
      { label: 'CHANNEL 07', title: '广播只能回答一句', copy: '登船者可以向广播问一个问题，对面只会留下一句回答。故事不解释信号来自未来、记忆还是周渡自己的告别。' },
    ],
    stills: [
      { shot: 'FRAME 01', title: '十年后的船票', direction: '奶油色空白票据停在周渡手里，老式打印机与港外蓝光建立午夜值班室；日期、00:17 与数字 07 仍留给后期排版。', status: 'AI 概念关键帧 · 2026-08-29', framePosition: 'left top', tone: 'yellow' },
      { shot: 'FRAME 02', title: '地图上没有七', direction: '高机位保留周渡可辨认的侧脸，港区图、手指和空白船票构成视觉证据链；地图编号仍留给后期制作。', status: 'AI 概念关键帧 · 2026-08-29', framePosition: 'right top', tone: 'blue' },
      { shot: 'FRAME 03', title: '雾里的跳板', direction: '浅蓝雾保持明亮可读，空白黄色号牌与金属跳板指向画外；画面中没有船体、幽灵或第二个人。', status: 'AI 概念关键帧 · 2026-08-29', framePosition: 'left bottom', tone: 'mint' },
      { shot: 'FRAME 04', title: '把票撕开', direction: '黎明蓝光与暖色晨光交界处，周渡手里只剩两半船票，远处真实渡轮作为次要信息离岸。', status: 'AI 概念关键帧 · 2026-08-29', framePosition: 'right bottom', tone: 'coral' },
    ],
    production: [
      { phase: '故事命题', status: '完成草案', note: '已从“未来船票”概念收束为一个关于结束等待的单夜故事；人物与情节均为虚构。' },
      { phase: '角色与规则', status: '完成草案', note: '建立周渡、周遥的关系，以及船票、七码头、广播三条超自然规则；名字与细节待荆确认。' },
      { phase: '72 秒剧本', status: '完成草案', note: '已写成五场短片文本，锁定唯一关键动作：周渡主动撕票。对白仍是编辑初稿。' },
      { phase: '十二镜分镜', status: '完成草案', note: '镜头总时长 72 秒，已分配景别、运镜、画面动作和声音线索。' },
      { phase: '概念关键帧', status: '完成草案', note: '已用同一张周渡锚点图生成四张视觉开发素材，验证值班室、港图、雾中跳板与黎明结尾；不是成片剧照。' },
      { phase: '动作测试', status: '待开始', note: '先测试出票取票、走上湿滑跳板、撕开票据三个动作，再决定是否制作完整镜头。' },
      { phase: '剪辑与声音', status: '待开始', note: '声音设计以打印机、三声雾笛、广播噪声和清晨第一班渡轮为主线。' },
    ],
    script: [
      { timecode: '00:00—00:11', scene: '值班室 / 出票', visual: '空港在浅蓝夜雾里。周渡趴在值班台前，停用的针式打印机突然自行走纸。他抬头，看见一张新票。', voice: '无对白。', sound: '荧光灯电流；远处浪声；打印针从一个点敲成一整行。' },
      { timecode: '00:11—00:24', scene: '值班室 / 查图', visual: '票面：2036、00:17、七码头、周渡，签发人周遥。周渡拉出港区图，手指从 1 划到 6，停在一片空白海面。', voice: '周渡（极轻）：“姐？”', sound: '第一声雾笛；纸页摩擦；墙钟秒针被放大。' },
      { timecode: '00:24—00:43', scene: '六码头尽头 / 出现', visual: '他跑过六块码头牌。第二声、第三声雾笛后，雾里多出黄色 7 号牌和一条向下微沉的跳板。跳板尽头没有船。', voice: '港区广播：“七码头，开始检票。”', sound: '脚步踩过湿地；金属跳板受力轻响；广播像从很远的旧喇叭传来。' },
      { timecode: '00:43—00:59', scene: '七码头 / 回答', visual: '周渡把一只脚放上跳板。值班手台亮起“07”。他握紧船票，没有继续向前。', voice: '周遥（广播）：“小渡，不要上来。”\n周渡：“你还好吗？”\n周遥：“我已经到岸了。”', sound: '无线电噪声中留一秒安静；水下传来一次沉闷船铃。' },
      { timecode: '00:59—01:12', scene: '黎明 / 下班', visual: '他沿虚线撕开船票。跳板、号牌和雾一起退去。第一班真实渡轮从三号码头驶出；周渡关灯、锁门，走向亮起来的街道。', voice: '无旁白。', sound: '撕纸声清楚落下；清晨广播报出“三号码头”；脚步离开，海浪继续。' },
    ],
    shotList: [
      { shot: '01', duration: 5, size: '大全景', visual: '浅蓝夜雾罩住空港，值班室是唯一暖黄色方块。', camera: '固定', sound: '浪声、灯管电流' },
      { shot: '02', duration: 5, size: '中景', visual: '周渡趴在桌边；身后的旧打印机突然走纸，他惊醒回头。', camera: '缓慢推近', sound: '打印针启动' },
      { shot: '03', duration: 6, size: '特写', visual: '船票从打印口推出；右手接住，票面文字留给后期合成。', camera: '固定俯角', sound: '打印声结束、第一声雾笛' },
      { shot: '04', duration: 5, size: '俯拍近景', visual: '港区图上只有 1—6，手指和船票一起停在六码头后的空白。', camera: '轻微横移', sound: '纸页与墙钟' },
      { shot: '05', duration: 5, size: '跟拍中景', visual: '周渡沿湿码头快走，珊瑚红围巾成为雾里的身份锚点。', camera: '背后跟拍', sound: '脚步、第二声雾笛' },
      { shot: '06', duration: 6, size: '远景', visual: '第三声雾笛后，黄色 7 号牌从雾中显出；画面里仍没有船。', camera: '固定长焦', sound: '第三声雾笛、金属轻响' },
      { shot: '07', duration: 7, size: '广角背影', visual: '周渡停在跳板前；跳板向雾中延伸并轻微下沉。', camera: '极慢推近', sound: '广播：开始检票' },
      { shot: '08', duration: 6, size: '脚部特写', visual: '工作靴踏上湿跳板，重量压下金属；另一只脚留在岸上。', camera: '低机位固定', sound: '金属受力、海水' },
      { shot: '09', duration: 7, size: '中近景', visual: '手台亮起 07，周渡抬起它贴近耳边，听见姐姐的声音。', camera: '侧面缓推', sound: '三句广播对白' },
      { shot: '10', duration: 6, size: '手部特写', visual: '双手沿票据虚线缓慢反向用力，纸纤维断开。', camera: '固定微距', sound: '噪声静止、撕纸' },
      { shot: '11', duration: 7, size: '远景', visual: '两半船票落地，雾退去；原位置只剩普通护栏和六号码头。', camera: '缓慢拉远', sound: '清晨广播开始' },
      { shot: '12', duration: 7, size: '大全景', visual: '真实渡轮从三号码头离岸，周渡锁门走向亮街，不再回头。', camera: '固定', sound: '渡轮汽笛、脚步渐远' },
    ],
    promptGuide: {
      identityLock: 'same fictional East Asian man, early 30s, lean build, short slightly wavy black hair, tired calm eyes, navy harbour work jacket with one mint reflective stripe, coral-red knitted scarf, worn silver wristwatch, consistent facial proportions and wardrobe',
      styleLock: 'bright nocturnal cinematic realism, luminous pale-blue fog, warm sodium-yellow practical lights, coral and mint color accents, deep ink outlines only in graphic props, restrained performance, subtle 35mm texture, 16:9, no horror darkness, no on-screen text',
      negative: 'different person, age change, hairstyle change, missing coral scarf, wardrobe change, black crushed shadows, horror monster, visible ghost, visible ship at pier seven, facial morphing, extra fingers, fused hands, floating ticket, warped pier, unreadable generated typography, subtitles, logo, watermark',
    },
    prompts: [
      { shot: '01', title: '空港值班室', prompt: 'Wide establishing shot of an empty coastal ferry terminal after midnight. Luminous pale-blue fog fills the harbour; one small ticket office glows warm yellow. Calm sea, bright readable silhouettes, locked camera, no people visible.', constraint: '夜景保持明亮可读；不要出现第七码头、船或恐怖元素。' },
      { shot: '02', title: '打印机惊醒', prompt: 'Medium shot inside a mint-and-cream harbour office. The same night attendant rests at the desk; an old dot-matrix printer behind him starts once and he lifts his head, then turns toward it. One slow camera push.', constraint: '先测试回头时的脸和围巾稳定；打印机不能漂移或变形。' },
      { shot: '03', title: '船票出现', prompt: 'Close overhead insert of a cream perforated ferry ticket advancing once from an old dot-matrix printer. His watch-wearing right hand enters and receives it after the paper stops. Clean object continuity, locked camera.', constraint: '票面文字后期排版；只生成空白分区和打孔结构。' },
      { shot: '04', title: '地图只有六码头', prompt: 'Top-down close shot of a worn harbour map with six simple pier blocks and open water beyond. His finger traces the route and stops at the blank edge while the cream ticket rests beside it. Gentle lateral slide.', constraint: '数字与地图标注后期合成；保持一只手和两个道具。' },
      { shot: '05', title: '穿过六码头', prompt: 'Rear medium tracking shot of the same attendant walking quickly along a wet pier through luminous blue fog. His coral scarf and mint reflective stripe remain clearly visible; natural gait, restrained urgency.', constraint: '不奔跑、不回头；控制背景干净，避免出现额外行人。' },
      { shot: '06', title: '七码头出现', prompt: 'Locked long shot into pale-blue harbour fog. After a gentle fog shift, a single mustard-yellow pier sign is revealed at the end of the walkway. No vessel, no creature, no silhouette behind it.', constraint: '数字 7 后期合成；重点只测雾中显露，不做物体凭空变形。' },
      { shot: '07', title: '没有船的跳板', prompt: 'Wide rear view of the attendant facing a narrow metal gangway extending into bright fog. The gangway settles downward a few centimeters as if weight exists beyond the frame, but no boat is visible. Very slow push-in.', constraint: '不可生成船体或幽灵；空间结构要可信，跳板只动一次。' },
      { shot: '08', title: '一只脚上船', prompt: 'Low locked close-up of one worn work boot stepping carefully onto a wet metal gangway while the other boot stays on the concrete pier. The metal flexes slightly under weight, realistic contact and reflections.', constraint: '动作分两阶段完成；若脚踝、鞋底或金属接触变形即失败。' },
      { shot: '09', title: '频道七', prompt: 'Side medium close-up of the same attendant lifting a small vintage radio to his ear. He listens in stillness, eyes fixed into fog, then lowers his gaze slightly. Slow two-percent camera push, no lip sync.', constraint: '频道数字与对白后期完成；不生成姐姐形象，只保留声音空间。' },
      { shot: '10', title: '沿虚线撕票', prompt: 'Macro close-up of both hands holding a cream perforated ticket. He tears it once along the central dotted line with slow deliberate force. Stable fingers, believable paper fibers and clean separation, locked frame.', constraint: '这是最高风险手部镜头；多指、纸张黏连、撕开后复原均判失败。' },
      { shot: '11', title: '雾退以后', prompt: 'Wide shot of the ordinary end of pier six at blue dawn. Two torn ticket halves land on wet ground as fog thins, revealing only a safety rail and open water. The camera slowly pulls back.', constraint: '不要让票据悬浮；七码头元素必须完全不出现。' },
      { shot: '12', title: '第一次准时下班', prompt: 'Bright dawn establishing shot of a real ferry departing from pier three in the distance. The attendant locks the small office and walks toward a sunlit street without turning back. Locked composition, natural pace.', constraint: '以离开而非船为情绪终点；人物服装和步态保持一致。' },
    ],
    motionTests: [
      { shot: '03', title: '出票与接票', duration: '5 秒', purpose: '检验打印机、纸张和单手接触的道具连续性。', action: '船票推出 → 停止 → 右手接住并停留。', pass: '票据只有一张，移动方向一致；手指完整，纸张没有穿过打印机。', fail: '票据增殖、悬浮、文字跳动、手指融合或纸张突然变形。', status: '待生成' },
      { shot: '08', title: '踏上湿跳板', duration: '5 秒', purpose: '检验脚部接触、重心转移和金属受力的可信度。', action: '右脚抬起 → 踏上跳板 → 重量压下后停住。', pass: '两脚位置清楚，鞋底贴合金属，跳板只产生一次轻微形变。', fail: '脚穿过跳板、步态循环、鞋子改变或背景海面扭曲。', status: '待生成' },
      { shot: '10', title: '沿虚线撕开', duration: '5 秒', purpose: '检验双手、薄纸和不可逆动作的连续性。', action: '双手绷紧船票 → 沿中线撕开 → 两半分离。', pass: '手部结构稳定，撕裂路径单一，分开的票据不再恢复。', fail: '多指、手掌融合、纸张重复生成、裂口回弹或碎片消失。', status: '待生成' },
    ],
    nextSteps: [
      '由荆确认周渡、周遥的关系，以及“我已经到岸了”是否保留为唯一回答。',
      '先画角色正侧背锚点与值班服装卡，再生成四张概念关键帧。',
      '用相同角色参考图测试镜头 03、08、10，按通过与失败标准记录原始输出。',
      '确认声音方向后，再决定制作 72 秒短片，或改编成十二格纵向漫画。',
    ],
  },
  {
    slug: 'before-the-rain-ends',
    number: '003',
    title: '雨停以前',
    englishTitle: 'Before the Rain Ends',
    type: 'Visual Poem Draft',
    date: '2026.08',
    duration: '01:00',
    status: 'AI 概念开发 · 无视频',
    draft: true,
    heroVisual: 'personal-rain',
    draftNotice: '这是由 AI 协助整理的原创视觉诗开发稿，林栖及全部情节均为虚构。角色锚点与四张画面是 2026-08-29 生成的视觉开发素材，用于验证人物、局部雨区和结尾方向；尚未生成视频或模型结论，也不代表已经完成的成片。',
    logline: '一场雨只落在林栖头顶。她走遍整座城想甩掉它，直到终于把伞放下，雨才第一次落向所有人。',
    premise: '当悲伤像一场只属于你的天气，真正的出口是走得更远，还是停止把淋湿当成一种惩罚？',
    premiseLines: ['当悲伤成为只属于你的天气，', '出口是走得更远，', '还是停止把淋湿当成惩罚？'],
    sectionCopy: {
      beats: { eyebrow: '01 / One private weather', heading: '从清晨到傍晚，\n她一直走在同一场雨里。', description: '六个时间点不解释雨从哪里来，只记录她怎样从躲避、奔跑，走到愿意停下。' },
      rules: { eyebrow: '02 / Weather rules', heading: '三条规则，\n让隐喻留在现实里。', description: '雨有稳定半径，会打湿真实物体，也会跟随她移动；除此之外不增加新的魔法解释。' },
      stills: { eyebrow: '03 / Key-frame studies', heading: '四个画面，\n先确认雨落在哪里。', description: '角色锚点与四张 AI 概念关键帧用于检查林栖、局部雨区与结尾的共享雨幕。它们是视觉开发素材，不是成片剧照，也不代表视频动作或雨效已经通过测试。' },
      script: { eyebrow: '04 / Screenplay draft', heading: '六十秒，\n让一场雨不再只属于她。', description: '五场无旁白视觉诗，人物只说一句话。声音从私人雨声逐渐打开为整座城市的普通天气。' },
      shots: { eyebrow: '05 / Shot list', heading: '十个镜头，\n每一镜只改变一件事。', description: '一分钟镜头表锁定局部雨区、人物路径与声音变化；当前只有静态概念画面，尚未进行视频动作与雨效测试。' },
    },
    shotSummary: ['10 SHOTS', '60 SECONDS', '1 RAIN CLOUD', 'DRAFT 01'],
    stillsGenerated: true,
    characterAnchor: {
      name: '林栖',
      title: '先确认林栖是谁，再让雨跟着她走。',
      copy: '这张独立锚点图固定林栖的脸、发型与日常服装。后续四张关键帧都引用同一张人物图生成，用透明黄色雨衣、蓝色斜挎包和红色帆布鞋帮助跨场景识别。',
      locks: ['耳后直黑发＋平静克制的表情', '透明柠檬黄雨衣＋象牙白内搭', '天蓝斜挎包＋珊瑚红帆布鞋＋透明伞'],
    },
    ending: { label: 'CURRENT ENDING', copy: '雨没有停。\n它只是不再单独落在她身上。', href: '/notes/ai-video-shot-rhythm/', link: '阅读节奏设计方法 ↗' },
    related: { href: '/experiments/can-local-rain-follow-a-character/', label: '打开局部雨跟随实验 ↗' },
    beats: [
      { time: '07:20', title: '醒来', copy: '厨房地面只有她站立的一小圈是湿的。窗外晴朗，头顶却持续落下细雨。', tone: 'blue' },
      { time: '08:05', title: '上车', copy: '公交车里只有她的座位上方在下雨。乘客默默挪开，给她留出一圈干燥的空位。', tone: 'yellow' },
      { time: '11:40', title: '躲雨', copy: '她走进长长的地下通道，雨云仍贴着天花板移动。所有屋檐都失去意义。', tone: 'mint' },
      { time: '16:10', title: '跑远', copy: '她一路跑到城市边缘。雨区始终以她为圆心，鞋子越来越重，世界仍然明亮。', tone: 'coral' },
      { time: '17:02', title: '放下', copy: '她在空公交站停住，把伞合起，放在长椅上，第一次不再向前走。', tone: 'blue' },
      { time: '17:03', title: '一起下雨', copy: '私人雨区向外扩散成普通细雨。街上的人陆续撑伞，她抬头，让雨落到脸上。', tone: 'yellow' },
    ],
    rules: [
      { label: 'THE RADIUS', title: '雨区始终以她为圆心', copy: '半径约 1.2 米，随她平稳移动；无论室内、车里还是地下通道，雨都来自她头顶一小片看不见的云。' },
      { label: 'THE WATER', title: '被淋湿的东西都是真的', copy: '头发、衣服、座椅和地面会积水，旁人一旦走出雨区就不再被淋。它不是只有她能看见的幻觉。' },
      { label: 'THE CHANGE', title: '雨不会因为跑远而停止', copy: '只有她主动停下并合起伞时，局部雨区才向外扩散；雨没有消失，只从私人事件变回普通天气。' },
    ],
    stills: [
      { shot: 'FRAME 01', title: '厨房里的局部雨', direction: '阳光仍照进奶油色厨房，林栖站在清晰的湿圆中央；雨衣、蓝包与红鞋建立人物锚点，雨区外地板保持干燥。', status: 'AI 概念关键帧 · 2026-08-29', framePosition: 'left top', tone: 'yellow' },
      { shot: 'FRAME 02', title: '公交车上的空圈', direction: '车厢里只有她的座位上方落雨，透明伞和局部积水把边界讲清楚；乘客只是自然留出距离，没有夸张围观。', status: 'AI 概念关键帧 · 2026-08-29', framePosition: 'right top', tone: 'blue' },
      { shot: 'FRAME 03', title: '跑到城市边缘', direction: '明亮蓝天下的堤岸保持干燥，局部雨幕紧跟她的背影；蓝色斜挎包与红色帆布鞋继续承担跨场景识别。', status: 'AI 概念关键帧 · 2026-08-29', framePosition: 'left bottom', tone: 'coral' },
      { shot: 'FRAME 04', title: '雨终于落向所有人', direction: '傍晚公交站里整条街一起下雨，合起的透明伞留在黄色长椅上；林栖仍可辨认，但已经不再是唯一被淋湿的人。', status: 'AI 概念关键帧 · 2026-08-29', framePosition: 'right bottom', tone: 'mint' },
    ],
    production: [
      { phase: '故事命题', status: '完成草案', note: '已把“只落在一个人头顶的雨”收束为关于停止逃避与重新进入共同世界的视觉寓言。' },
      { phase: '角色与规则', status: '完成草案', note: '建立虚构角色林栖，以及雨区半径、真实积水和扩散条件三条规则；人物细节待荆确认。' },
      { phase: '60 秒剧本', status: '完成草案', note: '已写成五场无旁白短片文本，唯一一句对白是“原来不是要等它停”。' },
      { phase: '十镜分镜', status: '完成草案', note: '十个镜头各六秒，已锁定景别、人物动作、局部雨声和结尾扩散。' },
      { phase: '角色与关键帧', status: '完成草案', note: '已用同一角色锚点生成四张 AI 概念关键帧，初步统一林栖的脸、服装与道具；这些画面尚未接受视频连续性测试。' },
      { phase: '动作与特效测试', status: '待开始', note: '优先测试跟随人物的局部雨区、车厢局部积水和合伞后的雨幕扩散。' },
      { phase: '剪辑与声音', status: '待开始', note: '以近距离私人雨声开场，结尾扩展为整条街的宽阔环境声。' },
    ],
    script: [
      { timecode: '00:00—00:12', scene: '厨房 / 清晨', visual: '阳光落在桌面。林栖睁眼，发现头顶在下雨。她侧移一步，地面的湿圆也跟着移动。', voice: '无对白。', sound: '冰箱低鸣；雨滴只在画面中央出现，窗外有清楚鸟鸣。' },
      { timecode: '00:12—00:24', scene: '公交车 / 上午', visual: '她撑伞坐在车厢里，雨只落在座位周围。新上车的人看见积水，安静地换到另一边。', voice: '无对白。', sound: '雨打伞面压过报站声；雨区外保留干燥衣料和车门声。' },
      { timecode: '00:24—00:36', scene: '地下通道 / 中午', visual: '她收伞冲进通道，雨仍贴着她移动。她加快脚步，最后跑起来，湿鞋在地面留下连续脚印。', voice: '无对白。', sound: '脚步、呼吸与局部雨声逐渐变快；通道回声拉长。' },
      { timecode: '00:36—00:48', scene: '城市边缘 / 下午', visual: '林栖跑到空旷堤岸，停下回望。远处城市晴朗，她的雨区仍完整罩住身体。她第一次没有立刻继续走。', voice: '林栖（轻声）：“原来不是要等它停。”', sound: '呼吸慢下来；雨声保持不变，音乐只进入一个低而温暖的长音。' },
      { timecode: '00:48—01:00', scene: '公交站 / 傍晚', visual: '她合起伞，放在长椅上，抬头站进雨里。局部雨幕向画外展开，路人陆续撑伞；她沿原路慢慢走回城里。', voice: '无旁白。', sound: '合伞一响；私人雨声扩展成立体环境声，最后留下鞋底踩水。' },
    ],
    shotList: [
      { shot: '01', duration: 6, size: '俯拍全景', visual: '明亮厨房里只有一个湿圆；林栖站在圆心，四周地面干燥。', camera: '固定', sound: '近距离雨滴、鸟鸣' },
      { shot: '02', duration: 6, size: '脚部近景', visual: '她向左试探一步，湿圆与雨线同步平移。', camera: '横向小幅跟随', sound: '雨鞋踩水' },
      { shot: '03', duration: 6, size: '车厢广角', visual: '她撑伞坐在公交车中段，乘客在雨区外形成自然空圈。', camera: '固定', sound: '雨打伞面、报站' },
      { shot: '04', duration: 6, size: '中近景', visual: '车门打开，新乘客看见座椅积水，平静地换到对面。', camera: '轻微横移', sound: '车门、衣料、雨声' },
      { shot: '05', duration: 6, size: '长焦中景', visual: '地下通道中，局部雨幕跟着她快走，不受屋顶阻挡。', camera: '正面后退跟拍', sound: '脚步与回声加速' },
      { shot: '06', duration: 6, size: '低机位特写', visual: '红色帆布鞋跑过干地，留下两列清楚湿脚印。', camera: '侧向跟拍', sound: '踩水、呼吸' },
      { shot: '07', duration: 6, size: '大全景', visual: '她抵达明亮堤岸，整个城市干燥，只有她被一小块雨幕笼罩。', camera: '缓慢拉远', sound: '风声、雨声不变' },
      { shot: '08', duration: 6, size: '近景', visual: '她停下看向雨线之外，说出唯一一句话。', camera: '固定', sound: '“原来不是要等它停。”' },
      { shot: '09', duration: 6, size: '手部中近景', visual: '她合起透明伞，放到公交站长椅上，双手离开伞柄。', camera: '缓慢下压', sound: '合伞、伞尖触椅' },
      { shot: '10', duration: 6, size: '街道远景', visual: '雨幕从她身边向整条街扩散，路人撑伞；她转身走回城里。', camera: '固定长镜头', sound: '整条街的雨、脚步' },
    ],
    promptGuide: {
      identityLock: 'same fictional East Asian woman, late 20s, shoulder-length straight black hair tucked behind both ears, calm oval face, translucent lemon-yellow raincoat over an ivory shirt, sky-blue crossbody bag, coral-red canvas shoes, clear dome umbrella, consistent facial proportions and wardrobe',
      styleLock: 'bright cinematic realism, luminous daylight even during rain, restrained natural performance, clean pastel city production design, believable wet surfaces and water physics, subtle 35mm texture, 16:9, no on-screen text',
      negative: 'different person, age change, hairstyle change, missing yellow raincoat, bag color change, shoe color change, dark storm, thunder, horror, crying performance, beauty filter, extra fingers, fused hands, duplicated umbrella, rain covering whole scene before final shot, warped architecture, subtitles, logo, watermark',
    },
    prompts: [
      { shot: '01', title: '厨房湿圆', prompt: 'Bright top-down wide shot of a cream kitchen in morning sunlight. The same woman stands at the center of a precise 1.2-meter wet circle while fine rain falls only inside that circle; the rest of the floor stays dry.', constraint: '局部雨区边界要清楚但自然；不要出现可见乌云或全屋降雨。' },
      { shot: '02', title: '雨跟着移动', prompt: 'Low close shot of her coral-red canvas shoes taking one cautious step left. The small rain column and wet boundary translate with her in one smooth motion, leaving the previous floor dry except for residual droplets.', constraint: '只测试一步和雨区平移；鞋型、脚踝与积水反射必须稳定。' },
      { shot: '03', title: '车厢里的伞', prompt: 'Wide symmetrical city bus interior in daylight. She sits under a clear dome umbrella while rain falls only around her seat; other passengers sit naturally beyond the dry boundary without staring.', constraint: '保持明亮日常感；不要做围观、惊叫或灾难场面。' },
      { shot: '04', title: '安静换座', prompt: 'Medium shot near the bus door. One newly arrived passenger notices a wet seat edge, pauses, then calmly crosses to a dry seat while she remains under the small rain column in the background.', constraint: '人物动作只保留一次换座；避免背景乘客增殖或伞面变形。' },
      { shot: '05', title: '屋顶没有用', prompt: 'Front-facing tracking shot in a bright pedestrian underpass. She walks quickly toward camera without opening the umbrella; a narrow rain column follows directly above her despite the ceiling.', constraint: '雨区跟随人物，不穿帮成漏水点；人物五官与雨衣保持稳定。' },
      { shot: '06', title: '湿脚印', prompt: 'Low side tracking close-up of coral-red canvas shoes running across a dry pale floor, leaving two clean lines of wet footprints behind. Natural stride, realistic splashes, no upper body visible.', constraint: '只生成两只脚与连续脚印；出现多脚、滑步或水迹跳变即失败。' },
      { shot: '07', title: '城市边缘', prompt: 'Very wide bright embankment under a blue afternoon sky. She stops alone near the center while one compact rain curtain surrounds only her; the distant city remains sunlit and dry.', constraint: '画面不能变成阴天灾难；局部雨幕必须与人物同中心。' },
      { shot: '08', title: '终于停下', prompt: 'Restrained close-up of her wet face beneath a clear umbrella. She catches her breath, looks beyond the rain boundary and speaks one short sentence with quiet recognition, one natural blink.', constraint: '口型可后期处理；不哭、不笑，不做戏剧化表情。' },
      { shot: '09', title: '把伞放下', prompt: 'Medium close-up at a bright bus shelter. She closes the clear dome umbrella once and places it on a dry yellow bench, then releases the handle with both hands. Stable object contact.', constraint: '合伞是不可逆连续动作；手、伞骨和长椅接触不能融合。' },
      { shot: '10', title: '普通天气', prompt: 'Locked wide shot of a city street at warm dusk. Rain expands outward from the woman until it becomes an even gentle shower across the whole frame; pedestrians naturally open umbrellas as she walks back toward the city.', constraint: '只在最后一镜让全场下雨；扩散顺序清楚，不做洪水或暴风。' },
    ],
    motionTests: [
      { shot: '02', title: '人物与雨区同步', duration: '5 秒', purpose: '验证局部降雨能否随人物平移，并保留真实湿地边界。', action: '右脚站定 → 左移一步 → 雨区同步停住。', pass: '人物、雨线和湿圆同向移动，边界没有突然扩大或跳帧。', fail: '雨区留在原地、覆盖全屋、人物滑步或水迹瞬间消失。', status: '待生成' },
      { shot: '05', title: '通道内跟随雨', duration: '5 秒', purpose: '验证屋顶空间中雨幕跟随人物，而不会被解释成固定漏水。', action: '快走三步 → 抬头确认 → 继续向前。', pass: '雨幕始终以人物为中心，背景结构稳定，黄雨衣保持一致。', fail: '雨从天花板固定位置落下、人物换脸、通道弯曲或雨幕闪烁。', status: '待生成' },
      { shot: '09', title: '合伞并放下', duration: '5 秒', purpose: '验证双手、透明伞骨与长椅的复杂接触。', action: '收拢伞面 → 合起伞骨 → 放上长椅 → 松手。', pass: '两手结构完整，伞只合拢一次，放下后不漂移。', fail: '多指、伞骨穿手、伞面重复展开、长椅变形或道具消失。', status: '待生成' },
    ],
    nextSteps: [
      '由荆确认“雨扩散成普通天气”的结尾，以及唯一一句对白是否保留。',
      '用同一角色锚点优先测试镜头 02、05、09，验证局部雨区能否在移动镜头里稳定跟随。',
      '按通过与失败标准保存原始输出、参数和局部雨区问题截图。',
      '根据测试决定保留写实雨效，还是改成更平面的插画视觉诗。',
    ],
  },
  {
    slug: 'shadow-arrives-five-minutes-early',
    number: '004',
    title: '影子比她早到五分钟',
    englishTitle: 'Her Shadow Arrives Five Minutes Early',
    type: 'Magical Realism Draft',
    date: '2026.08',
    duration: '01:08',
    status: 'AI 概念开发 · 无视频',
    draft: true,
    heroVisual: 'early-shadow',
    draftNotice: '这是由 AI 协助整理的原创魔幻现实短片开发稿，安澄、父亲与全部情节均为虚构。角色锚点与四张画面是 2026-08-30 生成的视觉开发素材，用于确认人物、硬光影子与结尾方向；尚未生成视频或实验结论，也不代表已经完成的成片。',
    logline: '离开城市的那天，钟表修复师安澄发现自己的影子总比她早五分钟行动。傍晚，它在车站与父亲的旧钟表店之间，替她先走出了一条尚未决定的路。',
    premise: '如果未来只比你早五分钟，你看见的是命运，还是一次仍来得及改变的选择？',
    premiseLines: ['如果未来只比你早五分钟，', '你看见的是命运，', '还是仍来得及改变的选择？'],
    sectionCopy: {
      beats: { eyebrow: '01 / Five minutes ahead', heading: '从第一只杯子，\n到最后一扇门。', description: '六个时间点把异常从小动作推到真正的选择。影子不解释未来，只把安澄此刻最可能做的事提前演给她看。' },
      rules: { eyebrow: '02 / Shadow rules', heading: '三条规则，\n让影子不变成万能预言。', description: '时间差、信息边界和改道条件都被锁定。魔法只负责制造五分钟空隙，选择仍然属于人物。' },
      stills: { eyebrow: '03 / Key-frame studies', heading: '四个画面，\n先看懂谁走在前面。', description: '人物锚点与四张 AI 概念关键帧使用同一角色参考图生成，用于确认服装、硬光方向和影子动作的可读性；它们不是成片剧照。' },
      script: { eyebrow: '04 / Screenplay draft', heading: '六十八秒，\n把迟疑变成一段路。', description: '六场无旁白短片，以钟表声、列车声和开门声推进。父女关系不靠解释性对白交代，结尾停在门已经打开。' },
      shots: { eyebrow: '05 / Shot list', heading: '十二个镜头，\n每五分钟只改一次方向。', description: '镜头表把人物动作与影子动作分开描述，并保留三个高风险测试镜头；当前只有静态概念画面，尚未做视频验证。' },
    },
    shotSummary: ['12 SHOTS', '68 SECONDS', '+05:00', 'DRAFT 01'],
    stillsGenerated: true,
    characterAnchor: {
      name: '安澄',
      title: '先锁住安澄，再让她的影子提前离开。',
      copy: '安澄是 31 岁的旧钟表修复师。锚点图固定她的脸、低发髻与工作服；珊瑚红短夹克、芥末黄工具包、银色方表和薄荷绿行李箱，让人物在工作室、车站与夕阳下仍能被认出。',
      locks: ['黑色低发髻＋轻薄碎刘海＋克制观察感', '珊瑚红工装短夹克＋浅天蓝衬衫＋深藏蓝阔腿裤', '芥末黄工具包＋银色方表＋薄荷绿硬壳行李箱'],
    },
    ending: { label: 'CURRENT ENDING', copy: '影子先到了五分钟。\n门也早开了五分钟。', href: '/notes/ai-video-lighting-continuity/', link: '阅读光线连续性方法 ↗' },
    related: { href: '/tools/lighting-ledger/', label: '打开光线连续性账本 ↗' },
    beats: [
      { time: '08:03', title: '杯子先被拿起', copy: '安澄还站在工作台旁，墙上的影子已经伸手去够架上的杯子。五分钟后，她做了同样的动作。', tone: 'yellow' },
      { time: '12:10', title: '误差被量出来', copy: '她用单盏工作灯、地面胶带和计时器重复测试。无论动作大小，影子始终领先整整五分钟。', tone: 'blue' },
      { time: '15:26', title: '它没有告诉她新东西', copy: '影子提前躲开坠落的零件，却无法指出是哪颗螺丝松了。它只知道她接下来会怎样反应。', tone: 'mint' },
      { time: '17:45', title: '它先走向列车', copy: '安澄带着行李站在站台。影子已经拖着不存在的箱子向车门移动，像一张提早五分钟交出的答案。', tone: 'coral' },
      { time: '17:50', title: '影子第一次改道', copy: '远处旧钟报时。她握住父亲留下的店门钥匙，影子停在半步之间，随后转身走向出口。', tone: 'blue' },
      { time: '18:00', title: '门已经打开', copy: '安澄抵达钟表店时，父亲正扶着打开的门。夕阳沉下去，影子回到她脚边，两个人都没有先说话。', tone: 'yellow' },
    ],
    rules: [
      { label: 'THE OFFSET', title: '只在单一硬光下领先五分钟', copy: '太阳或单盏硬光能形成清楚影子时，时间差才出现；进入漫射光、黑暗或多重光源，影子会恢复普通状态。' },
      { label: 'THE LIMIT', title: '影子不能提供她不知道的信息', copy: '它只能提前演出安澄基于现有信息最可能做出的身体动作，不能指出彩票、事故原因或别人的决定。' },
      { label: 'THE TURN', title: '真正改变决定时，影子会重新选路', copy: '一旦安澄的选择发生改变，影子先停顿，再从当前位置改道；它不是固定命运，只是一份提前五分钟出现的行动草稿。' },
    ],
    stills: [
      { shot: 'FRAME 01', title: '杯子先被拿起', direction: '明亮工作室里安澄双手垂下，墙上唯一的影子却已伸向架上的杯子；人物与影子动作差异一眼可读。', status: 'AI 概念关键帧 · 2026-08-30', framePosition: 'left top', tone: 'yellow' },
      { shot: 'FRAME 02', title: '把五分钟量出来', direction: '安澄站在黄色胶带框内，双手背后；硬光下的影子独自伸向一排黄铜钥匙，桌上保留计时器与空白记录本。', status: 'AI 概念关键帧 · 2026-08-30', framePosition: 'right top', tone: 'blue' },
      { shot: 'FRAME 03', title: '站台上的改道', direction: '安澄和薄荷绿行李箱朝向列车，长影却向空站台另一侧迈步；珊瑚长椅与金色斜光强化两条路径。', status: 'AI 概念关键帧 · 2026-08-30', framePosition: 'left bottom', tone: 'coral' },
      { shot: 'FRAME 04', title: '早开五分钟的门', direction: '夕阳从店外照进旧钟表店，安澄停在门口，父亲已经把门打开；影子重新接回脚边，和解只保留为可能。', status: 'AI 概念关键帧 · 2026-08-30', framePosition: 'right bottom', tone: 'mint' },
    ],
    production: [
      { phase: '故事命题', status: '完成草案', note: '已把“提前五分钟的影子”收束为关于犹豫、选择与仍来得及改道的原创短片命题。' },
      { phase: '人物与规则', status: '完成草案', note: '建立虚构角色安澄、父亲与旧钟表店，并锁定时间差、信息边界和改道条件三条规则。' },
      { phase: '68 秒剧本', status: '完成草案', note: '已写成六场无旁白结构，声音以钟表、硬光环境、列车和门轴推进。' },
      { phase: '十二镜分镜', status: '完成草案', note: '十二个镜头共 68 秒，已拆分实体人物动作、影子动作和各镜声音职责。' },
      { phase: '角色与关键帧', status: '完成草案', note: '已用同一人物锚点生成四张原创 AI 概念关键帧，初步统一脸、服装、工具包与行李箱。' },
      { phase: '影子动作测试', status: '待开始', note: '优先验证人物静止时影子独立动作、站台改道与夕阳下重新同步；目前没有视频结果。' },
      { phase: '剪辑与声音', status: '待开始', note: '以不同材质的钟表滴答建立节拍，让列车离站声覆盖人物没有说出口的话。' },
    ],
    script: [
      { timecode: '00:00—00:10', scene: '工作室 / 清晨', visual: '安澄站在硬光里检查钟芯。墙上的影子先伸手拿杯子，她看着它；五分钟后的跳切里，她的手进入同一位置。', voice: '无对白。', sound: '十几只钟不同步的滴答；陶杯轻碰木架。' },
      { timecode: '00:10—00:22', scene: '工作室 / 中午', visual: '地面胶带、单盏灯、计时器。她把双手背在身后，影子却依次触碰钥匙、关灯、抬腕看表。每次都领先五分钟。', voice: '无对白。', sound: '计时器归零三次；每次只留一个清脆铃声。' },
      { timecode: '00:22—00:32', scene: '工作台 / 下午', visual: '一枚松动零件坠下前，影子先侧身。安澄跟着避开，随后检查整台钟，却找不到影子未曾告诉她的原因。', voice: '无对白。', sound: '金属落地滚动；滴答忽然停了一拍。' },
      { timecode: '00:32—00:45', scene: '车站 / 傍晚', visual: '安澄拖着行李站在列车旁。她仍没有动，长影却已经朝车门走去。广播结束，车门开始准备关闭。', voice: '无对白。', sound: '列车低鸣、模糊广播、行李轮停在地缝上。' },
      { timecode: '00:45—00:57', scene: '站台 / 改道', visual: '远处旧街钟报时。她摸到工具包里的店门钥匙。影子停下，脚尖转向，独自朝出口走；安澄随后松开行李拉杆。', voice: '无对白。', sound: '五下钟声；列车关门，行李拉杆回弹。' },
      { timecode: '00:57—01:08', scene: '钟表店 / 夕阳', visual: '影子先掠过磨砂玻璃。父亲抬头，把门打开。五分钟后安澄走进夕阳，影子重新接回脚边；她停在门外，没有拥抱，也没有离开。', voice: '无对白。', sound: '门轴、远去的列车；店里一只修好的钟重新开始走。' },
    ],
    shotList: [
      { shot: '01', duration: 5, size: '工作台中景', visual: '安澄双手垂下，墙上影子先伸向架上杯子。', camera: '固定', sound: '多层钟表滴答' },
      { shot: '02', duration: 6, size: '手部近景', visual: '五分钟后，她的手准确进入影子刚才的位置并拿起杯子。', camera: '固定匹配切', sound: '陶杯碰木架' },
      { shot: '03', duration: 6, size: '侧面全景', visual: '她站在胶带框内双手背后，影子独自去取墙上钥匙。', camera: '缓慢横移', sound: '计时器第一次响' },
      { shot: '04', duration: 5, size: '俯拍特写', visual: '表盘、空白记录本与银色方表排成一线，秒针走完五分钟。', camera: '固定', sound: '单一秒针' },
      { shot: '05', duration: 6, size: '工作台近景', visual: '影子提前侧身，黄铜零件随后从安澄肩旁落下。', camera: '轻微推近', sound: '金属滚动' },
      { shot: '06', duration: 5, size: '面部近景', visual: '她看向影子，又看向拆开的钟芯，确认它并不知道故障原因。', camera: '固定', sound: '滴答缺一拍' },
      { shot: '07', duration: 6, size: '站台大全景', visual: '安澄与行李箱朝向列车，长影已经先向车门迈步。', camera: '固定', sound: '列车低鸣' },
      { shot: '08', duration: 6, size: '腰部特写', visual: '她握住工具包里的旧钥匙；影子的脚步在地面停住。', camera: '缓慢下压', sound: '远处钟声开始' },
      { shot: '09', duration: 6, size: '低机位全景', visual: '实体双脚不动，影子从半步之间转向站台出口。', camera: '固定', sound: '第五下钟声' },
      { shot: '10', duration: 6, size: '道具近景', visual: '她松开行李拉杆，列车门在背景闭合。', camera: '浅景深固定', sound: '拉杆回弹、关门' },
      { shot: '11', duration: 6, size: '店内反拍', visual: '影子掠过磨砂门，父亲从工作台抬头并打开门。', camera: '缓慢拉远', sound: '门轴与钟摆' },
      { shot: '12', duration: 5, size: '门口双人远景', visual: '安澄抵达敞开的门前，夕阳落下，影子重新接回脚边。', camera: '固定长镜头', sound: '一只钟重新启动' },
    ],
    promptGuide: {
      identityLock: 'same fictional East Asian Chinese woman, age 31, oval face, calm observant eyes, straight black shoulder-length hair in a low knot with wispy bangs, cropped coral-red canvas utility jacket, pale sky-blue work shirt, high-waisted dark navy wide-leg trousers, mustard-yellow canvas tool satchel, slim silver rectangular wristwatch, off-white sneakers, mint-green hard-shell suitcase when traveling',
      styleLock: 'bright cinematic magical realism, natural photographic texture, one clear directional hard light, readable deep-ink cast shadow, luminous cream sky-blue coral mint and mustard production design, restrained performance, subtle 35mm texture, 16:9, no on-screen text',
      negative: 'different person, hairstyle change, wardrobe change, missing watch, bag color change, suitcase color change, extra physical body, duplicate woman, multiple shadows, horror shadow, dark noir, supernatural glow, neon, cyberpunk, facial morphing, extra fingers, fused hands, warped clocks, unreadable generated text, subtitles, logo, watermark',
    },
    prompts: [
      { shot: '01', title: '影子先拿杯子', prompt: 'Locked medium shot in the bright clock workshop. An Cheng stands completely still with both arms lowered while her single crisp wall shadow slowly raises one arm toward a ceramic cup, then stops.', constraint: '真人双手必须全程垂下；只允许墙上一个影子独立抬臂。' },
      { shot: '02', title: '五分钟后的匹配动作', prompt: 'Same locked composition and light direction. An Cheng now raises her right hand once into the exact silhouette position and removes the cup from the shelf with realistic contact.', constraint: '与镜头 01 构图匹配；杯子只移动一次，影子恢复同步。' },
      { shot: '03', title: '钥匙测试', prompt: 'Wide profile under one work lamp. She keeps both hands clasped behind her back while her single wall shadow reaches toward the brass key ring on a mint peg.', constraint: '不可生成第二个人或额外手臂；灯位和影子方向保持固定。' },
      { shot: '04', title: '计时五分钟', prompt: 'Top-down macro still life of an analog timer, blank notebook, silver rectangular wristwatch and a disassembled brass clock movement. Only the second hands move naturally.', constraint: '表盘数字与记录线后期处理；道具不能漂移或变形。' },
      { shot: '05', title: '提前避开零件', prompt: 'Medium workshop shot. The shadow makes one clean sideways dodge first; after a short pause, one brass gear drops past her shoulder and rolls on the floor.', constraint: '拆成影子动作与零件坠落两个清楚节拍；不做危险事故或夸张惊吓。' },
      { shot: '06', title: '它也不知道原因', prompt: 'Restrained close-up of An Cheng studying an open clock mechanism, then glancing once toward the ordinary shadow behind her. Natural blink, no dialogue.', constraint: '只测试眼神转换；面部、发髻、耳朵和夹克保持稳定。' },
      { shot: '07', title: '影子先登车', prompt: 'Very wide golden-hour station shot. An Cheng and mint suitcase remain still facing the train while one long cast shadow walks two steps toward the open door.', constraint: '真人脚与箱子不移动；影子只走两步，不复制实体人物。' },
      { shot: '08', title: '摸到旧钥匙', prompt: 'Close shot at her mustard tool satchel. Her left hand finds and closes around one old brass key while the train stays softly blurred behind.', constraint: '只出现一只手和一把钥匙；避免多指、钥匙增殖与包体变形。' },
      { shot: '09', title: '影子改道', prompt: 'Low locked shot of her still sneakers and one long shadow. The shadow pauses mid-stride, turns cleanly away from the train and begins toward the exit while the real feet remain planted.', constraint: '最高风险镜头；影子方向变化必须连续，实体双脚不可滑动。' },
      { shot: '10', title: '留下行李', prompt: 'Close-up of her hand releasing the extended suitcase handle once. The handle settles with a small spring movement as the train doors close in the background.', constraint: '不可让箱子消失或移动；关门和松手各发生一次。' },
      { shot: '11', title: '影子先到门口', prompt: 'Interior view of the old clock shop toward frosted glass. One shadow passes across the glass; her elderly father notices it, looks up and slowly opens the door.', constraint: '安澄实体不入镜；父亲只完成抬头与开门，避免复杂口型。' },
      { shot: '12', title: '重新同步', prompt: 'Locked wide sunset shot at the open shop doorway. An Cheng arrives and stops; as the sun reaches the horizon, her long shadow smoothly aligns with her feet. Father waits inside, no embrace.', constraint: '影子只做一次贴合；不生成融化、发光或超自然粒子。' },
    ],
    motionTests: [
      { shot: '01', title: '真人静止，影子抬手', duration: '5 秒', purpose: '验证模型能否把实体身体与投影动作解耦，同时保持单一人物和单一影子。', action: '真人站定 → 影子独自抬臂 → 手形停在杯子旁。', pass: '真人双臂不动；墙面仅有一个影子，抬臂路径连续且杯子不提前移动。', fail: '真人同步抬手、出现第二人、影子断裂、杯子漂移或墙体弯曲。', status: '待生成' },
      { shot: '09', title: '影子从半步改道', duration: '5 秒', purpose: '验证影子能否在实体双脚静止时停顿、转向并继续移动。', action: '影子向车门半步 → 停住 → 转向出口一步。', pass: '影子只有一条，方向变化可读；实体鞋与地砖坐标保持不变。', fail: '实体滑步、影子分叉、转向跳帧、光线方向突变或站台结构扭曲。', status: '待生成' },
      { shot: '12', title: '夕阳下重新贴合', duration: '5 秒', purpose: '验证长影缩短或偏移后与脚边自然同步，而不是以特效消失。', action: '人物到门口停住 → 影子贴回脚边 → 门内钟摆继续。', pass: '人物身份稳定，影子以真实光学方向完成贴合，门与父亲位置不变。', fail: '影子融化发光、人物换脸、门框变形、父亲增殖或钟摆闪烁。', status: '待生成' },
    ],
    nextSteps: [
      '由荆确认父女关系只通过旧钥匙、钟表店与开门动作暗示，是否需要保留一句对白。',
      '用同一人物锚点优先测试镜头 01、09、12，验证人物与影子能否在视频里保持不同步。',
      '按通过与失败标准保存原始输出、模型参数和影子错位截图，不把失败样本当成正式结论。',
      '根据测试结果决定保留写实光影，或把全片改成更可控的二维剪影动画。',
    ],
  },
];

export function getStoryBySlug(slug: string) {
  return storyDetails.find((story) => story.slug === slug);
}
