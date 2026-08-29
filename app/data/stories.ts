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
  heroVisual?: 'memory-letter' | 'pier-ticket';
  draftNotice?: string;
  logline: string;
  premise: string;
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
];

export function getStoryBySlug(slug: string) {
  return storyDetails.find((story) => story.slug === slug);
}
