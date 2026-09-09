export type StoryDetail = {
  slug: string;
  number: string;
  title: string;
  titleLines?: string[];
  englishTitle: string;
  type: string;
  date: string;
  duration: string;
  status: string;
  draft: boolean;
  heroVisual?: 'memory-letter' | 'pier-ticket' | 'personal-rain' | 'early-shadow' | 'echo-cup' | 'water-ledger';
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
    titleLines?: string[];
    copy: string;
    locks: string[];
    generatedLabel?: string;
  };
  ending?: { label: string; copy: string; href: string; link: string };
  related?: { href: string; label: string };
  soundPlan?: {
    duration: number;
    heading: string;
    description: string;
    lanes: Array<{
      label: string;
      role: string;
      tone: 'blue' | 'yellow' | 'coral' | 'mint';
      cues: Array<{
        start: number;
        end: number;
        title: string;
        detail: string;
      }>;
    }>;
    checks: string[];
  };
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
    titleLines: ['她每天醒来', '都会忘记昨天'],
    englishTitle: 'She Forgets Yesterday',
    type: 'AI Short Film',
    date: '2026.08',
    duration: '01:30',
    status: 'AI 共创草案 · 无视频',
    draft: true,
    draftNotice: '这是由 AI 协助整理的原创短片开发稿，知夏、林澈及全部情节均为虚构。人物锚点生成于 2026-08-25，四张独立概念画面生成于 2026-08-31，用于确认人物、道具、光线与情绪方向；尚未生成视频或实验结论，也不代表已经完成的成片。',
    heroVisual: 'memory-letter',
    related: { href: '/notes/memory-story-preflight/', label: '查看开拍前准备单 ↗' },
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
    characterAnchor: {
      name: '知夏',
      title: '先确认知夏是谁，再让她重新认识昨天。',
      titleLines: ['先确认知夏是谁，', '再让她重新认识昨天。'],
      copy: '独立人物锚点先锁定脸、发型、配饰与服装，再把同一组识别特征带进四个时间段。它只负责统一视觉身份，不代表任何真人或正式演员。',
      locks: ['齐下巴黑色短发＋右侧蓝色发夹', '珊瑚红三角耳饰＋芥末黄针织外套', '象牙白圆领内搭＋自然肤质', '清晨冷蓝、傍晚暖光与夜间薄荷灯仍保持同一张脸'],
    },
    stills: [
      { shot: 'SCENE 01', title: '清晨醒来', direction: '明亮但陌生的蓝色卧室；她坐在床沿望向窗外，黄色外套成为第一处身份锚点。', status: 'AI 概念关键帧', framePosition: 'left top', tone: 'yellow' },
      { shot: 'SCENE 02', title: '桌上的信', direction: '俯拍把空白信封、照片、时钟和迟疑的手放进同一条证据链。', status: 'AI 概念关键帧', framePosition: 'right top', tone: 'blue' },
      { shot: 'SCENE 03', title: '傍晚见面', direction: '玻璃门把两个人分在画面两侧；暖色光让距离看起来更像告别。', status: 'AI 概念关键帧', framePosition: 'left bottom', tone: 'coral' },
      { shot: 'SCENE 04', title: '写给明天', direction: '夜晚台灯下，她低头写信；蓝色发夹、红色耳饰和黄色外套继续维持人物身份。', status: 'AI 概念关键帧', framePosition: 'right bottom', tone: 'mint' },
    ],
    production: [
      { phase: '故事梗概', status: '完成草案', note: '由 AI 编辑完成首版核心设定与一天时间线，尚未由荆确认。' },
      { phase: '人物设定', status: '完成草案', note: '已建立短发、蓝色发夹、红色三角耳饰和黄色外套四个视觉锚点。' },
      { phase: '概念关键帧', status: '完成草案', note: '已从四格拼板升级为四张独立概念关键帧，用于检查人物、道具、一天中的光线与情绪节奏；它们不是成片剧照。' },
      { phase: '90 秒剧本', status: '完成草案', note: '已写成六场、十四镜的第一版可拍摄文本；对白、旁白和声音仍待荆确认。' },
      { phase: '视频生成', status: '待开始', note: '已完成十四镜 Prompt 包并选定三镜动作测试；尚未调用外部视频模型，也没有生成结果。' },
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
    titleLines: ['第七码头', '没有船'],
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
    titleLines: ['影子比她', '早到五分钟'],
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
    related: { href: '/tools/shadow-motion-card/', label: '生成影子动作拆分卡 ↗' },
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
  {
    slug: 'objects-remember-the-last-sentence',
    number: '005',
    title: '她碰过的东西，会记住最后一句话',
    titleLines: ['她碰过的东西，', '会记住', '最后一句话'],
    englishTitle: 'Objects Remember the Last Sentence',
    type: 'Magical Realism Draft',
    date: '2026.08',
    duration: '01:00',
    status: 'AI 概念开发 · 无视频',
    draft: true,
    heroVisual: 'echo-cup',
    draftNotice: '这是由 AI 协助整理的原创魔幻现实短片开发稿，乔野、母亲及全部情节均为虚构。角色锚点与四张画面是 2026-08-30 生成的 AI 视觉开发素材，用于确认人物、白杯、旧家和接触构图；没有生成视频或实验结论，也不代表已经完成的成片。',
    logline: '搬空旧家那天，乔野发现每件被她碰到的东西，都会重复母亲在它身边说过的最后一句话；唯独那只白杯，她一直不敢拿起。',
    premise: '我们真正舍不得的，究竟是那个人留下的话，还是某个再普通不过、却再也不会重复的日常？',
    premiseLines: ['真正舍不得的，', '是那个人留下的话，', '还是再也不会重复的日常？'],
    sectionCopy: {
      beats: { eyebrow: '01 / One empty afternoon', heading: '五次触碰，\n把告别从大话变回日常。', description: '异常从钥匙、围巾和收音机逐渐靠近核心白杯。每一次接触只触发一句话，乔野也只能决定继续听，或把手收回。' },
      rules: { eyebrow: '02 / Echo rules', heading: '三条规则，\n让回声只存在于接触之后。', description: '声音来源、触发方式和重复边界都被锁定。物品不回答问题，也不会替人物解释过去。' },
      stills: { eyebrow: '03 / Key-frame studies', heading: '四张概念画面，\n先锁住手、杯子与留白。', description: '四张 AI 概念关键帧使用同一人物锚点生成，用于确认乔野、白杯、旧家配色和接触构图；它们是视觉开发素材，不是成片剧照。' },
      script: { eyebrow: '04 / Screenplay draft', heading: '六十秒，\n只让最后一句话响一次。', description: '六场原创无旁白短片，以纸箱、手指接触、物品回声和房间环境声推进；文字与声音都将在后期完成。' },
      shots: { eyebrow: '05 / Shot list', heading: '十二个镜头，\n两次伸手，一次真正拿起。', description: '镜头表刻意把接近、预接触、闭合、承重与释放拆开。镜头 08、09 和 10 是手物接触与声音时点的重点测试。' },
    },
    shotSummary: ['12 SHOTS', '60 SECONDS', '1 WHITE CUP', 'DRAFT 01'],
    stillsGenerated: true,
    characterAnchor: {
      name: '乔野',
      title: '先锁住乔野，再锁住那只白杯。',
      titleLines: ['先锁住乔野，', '再锁住那只白杯。'],
      copy: '乔野是 29 岁的书籍修复师。人物锚点固定齐下巴短发、左侧薄荷绿发夹、珊瑚红针织背心和浅蓝衬衫；道具锚点固定一只无图案白色陶瓷杯、C 形杯柄、杯口细小缺口和木桌上的黄色杯垫。',
      locks: ['齐下巴黑色短发＋左侧薄荷绿长方发夹＋克制表情', '珊瑚红针织背心＋浅蓝衬衫＋深藏蓝直筒裤', '白色陶瓷杯＋C 形杯柄＋杯口一点缺口＋黄色圆形杯垫'],
    },
    ending: { label: 'CURRENT ENDING', copy: '她没有保存回声。\n只把杯子洗干净，带走。', href: '/experiments/can-one-hand-lift-the-same-cup/', link: '查看同一只手拿杯实验 ↗' },
    related: { href: '/tools/contact-action-card/', label: '生成接触动作拆分卡 ↗' },
    soundPlan: {
      duration: 60,
      heading: '声音不提前解释，\n只在动作之后出现。',
      description: '四条轨道把房间环境、真实接触、物品回声与刻意静默分开。所有台词都是待确认的虚构文本，时间点是剪辑草案，不代表已经录音或完成声音制作。',
      lanes: [
        {
          label: 'ROOM',
          role: '环境底',
          tone: 'blue',
          cues: [
            { start: 0, end: 30, title: '空屋午后', detail: '远处街声、轻微管道声；保持空间连续，不用音乐填满。' },
            { start: 30, end: 40, title: '冰箱停机', detail: '环境底突然变薄，让白杯前的十秒悬停被听见。' },
            { start: 40, end: 60, title: '房间恢复', detail: '低环境底回来，50 秒后逐渐交给水流、拉链与门锁。' },
          ],
        },
        {
          label: 'CONTACT',
          role: '接触与动作',
          tone: 'yellow',
          cues: [
            { start: 0, end: 5, title: '胶带 / 钥匙', detail: '钥匙真正落入掌心时保留一次清脆金属触点。' },
            { start: 10, end: 15, title: '指尖 / 围巾', detail: '两次布料接触，第二次只有摩擦声，不再触发回声。' },
            { start: 20, end: 25, title: '手 / 收音机', detail: '指尖触壳与立刻松手分成两个短声音，不让收音机自行启动。' },
            { start: 30, end: 40, title: '桌面 / 指甲', detail: '两次接近都不触杯，只留下极轻的指甲碰桌声。' },
            { start: 40, end: 50, title: '接触 / 闭合 / 承重 / 落稳', detail: '42 秒接触，44 秒闭合，45 秒离桌，49 秒杯底落稳。' },
            { start: 50, end: 60, title: '水流 / 布 / 拉链 / 门锁', detail: '每个动作只留一个主声，门锁成为全片最后的实体声音。' },
          ],
        },
        {
          label: 'VOICE',
          role: '物品回声',
          tone: 'coral',
          cues: [
            { start: 5, end: 9, title: '“早点回来。”', detail: '钥匙接触完成后进入；声音干燥、近距离，不做幽灵混响。' },
            { start: 11, end: 14, title: '“外面冷。”', detail: '第一次触碰围巾后播放；第二次触碰保持无声。' },
            { start: 21, end: 25, title: '“我不会再回来了。”', detail: '乔野过去的声音；手松开后台词仍自然说完。' },
            { start: 45, end: 49, title: '“水凉了就别喝了。”', detail: '抓握建立、杯底离桌以后才进入；不从靠近或接触瞬间抢跑。' },
          ],
        },
        {
          label: 'SILENCE',
          role: '停顿与无音乐',
          tone: 'mint',
          cues: [
            { start: 9, end: 10, title: '一秒确认', detail: '第一句结束后，不立刻用下一个动作盖住反应。' },
            { start: 25, end: 30, title: '五秒退开', detail: '争吵回声结束后只留房间底噪，让她主动看向白杯。' },
            { start: 38, end: 42, title: '接触前静默', detail: '指尖尚未碰到杯柄，台词与陶瓷声都不能提前出现。' },
            { start: 49, end: 50, title: '一句后的呼吸', detail: '台词结束后留一秒人物呼吸，再切到水槽。' },
            { start: 57, end: 60, title: '无配乐结尾', detail: '门锁后不加情绪音乐，让空屋底噪自然停止。' },
          ],
        },
      ],
      checks: [
        'VOICE 轨不得早于对应 CONTACT 轨的真实接触点。',
        '第二次触碰围巾只保留布料声，不重复台词。',
        '母亲回声不使用恐怖混响、电话滤波或超自然音效。',
        '全片不使用配乐；情绪来自环境密度、动作声和停顿长度。',
        '未经确认不模仿任何真实人物声线，临时配音必须明确标注。',
      ],
    },
    beats: [
      { time: '14:06', title: '钥匙说“早点回来”', copy: '乔野把旧钥匙放进纸箱，金属碰到掌心时，门口响起母亲平静的一句话。房间里没有其他人。', tone: 'yellow' },
      { time: '14:19', title: '围巾说“外面冷”', copy: '她试着再碰一次围巾。熟悉的声音只播放一遍，不回应她，也不解释自己从哪里来。', tone: 'blue' },
      { time: '14:31', title: '收音机记住了一句争吵', copy: '她碰到旧收音机，听见自己曾说“我不会再回来了”。这一次，她立刻松手，把它留在原处。', tone: 'coral' },
      { time: '14:47', title: '白杯一直没有被碰', copy: '桌上只剩那只白杯。她的手两次停在杯柄前，杯子和房间都保持沉默。', tone: 'mint' },
      { time: '14:52', title: '最后一句只是“水凉了”', copy: '她握住杯柄，杯底离开桌面后，母亲说：“水凉了就别喝了。”没有遗言，也没有答案。', tone: 'yellow' },
      { time: '15:06', title: '她带走的是杯子', copy: '乔野洗净杯口，把白杯放进随身包。门锁上后，屋里没有回声，只有水管里最后一点水声。', tone: 'blue' },
    ],
    rules: [
      { label: 'THE TOUCH', title: '真正接触后，物品才会开口', copy: '靠近、悬停和隔着布料不触发声音。必须由乔野的皮肤或完整抓握产生清楚接触，回声才开始。' },
      { label: 'THE LAST LINE', title: '每件物品只保留最后一句', copy: '声音属于最后一个在物品旁说话的人；内容可能重要，也可能只是最普通的生活提醒。' },
      { label: 'NO REPLY', title: '回声只播放一次，不回答问题', copy: '松手再碰不会重复，同一件物品不能对话、补充或变成保存无限记忆的录音机。' },
    ],
    stills: [
      { shot: 'FRAME 01', title: '纸箱里的第一句', direction: '明亮空屋中，乔野蹲在蓝色纸箱旁，钥匙落在掌心；画面保留大量门口留白，让声音从空处出现。', status: 'AI 概念关键帧 · 2026-08-30', framePosition: 'left top', tone: 'yellow' },
      { shot: 'FRAME 02', title: '她听见自己的争吵', direction: '珊瑚红收音机停在窗边，乔野的手刚刚松开；右侧桌面上的白杯仍未被触碰。', status: 'AI 概念关键帧 · 2026-08-30', framePosition: 'right top', tone: 'coral' },
      { shot: 'FRAME 03', title: '杯柄前的一厘米', direction: '极近景只看右手、杯柄、黄色杯垫和清楚间距；白杯保持完整落桌，接触点与承重点都可辨认。', status: 'AI 概念关键帧 · 2026-08-30', framePosition: 'left bottom', tone: 'mint' },
      { shot: 'FRAME 04', title: '洗净以后带走', direction: '水槽边的白杯被双手擦干，杯口小缺口仍在；空屋从背景虚化，画面不出现生成文字或超自然光效。', status: 'AI 概念关键帧 · 2026-08-30', framePosition: 'right bottom', tone: 'blue' },
    ],
    production: [
      { phase: '故事命题', status: '完成草案', note: '已把“物品保存最后一句话”收束为关于普通日常、告别与带走什么的原创短片命题。' },
      { phase: '人物与规则', status: '完成草案', note: '建立虚构角色乔野、母亲与旧家，并锁定接触触发、只存一句和不可重播三条规则。' },
      { phase: '60 秒剧本', status: '完成草案', note: '已写成六场结构；没有旁白，回声台词与现场声音均标明后期制作。' },
      { phase: '十二镜分镜', status: '完成草案', note: '十二镜共 60 秒，重点拆分白杯接近、握住、承重、落稳与清洗动作。' },
      { phase: '角色与道具锚点', status: '完成草案', note: '已生成乔野全身角色锚点，并把白杯、杯口缺口、黄色杯垫和旧家配色纳入同一张参考图。' },
      { phase: '接触动作测试', status: '待开始', note: '优先验证镜头 08、09、10 的手杯接触链，以及接触后声音进入的剪辑时点；目前没有视频结果。' },
      { phase: '关键帧与声音制作', status: '制作中', note: '四张 AI 概念关键帧与 60 秒声音触发时间线已经完成；配音、拟音与真实视频仍未制作。' },
    ],
    script: [
      { timecode: '00:00—00:10', scene: '旧家 / 开箱', visual: '午后空屋。乔野把钥匙放进纸箱，金属刚碰到掌心，门边传来母亲的声音。她停住。', voice: '母亲的回声：“早点回来。”', sound: '胶带撕开、钥匙轻响；回声保持干燥，不加混响特效。' },
      { timecode: '00:10—00:20', scene: '衣柜 / 验证', visual: '她用指尖碰围巾，听完后再次触碰。围巾不再发声，她在空白标签上画下一道线。', voice: '母亲的回声：“外面冷。”', sound: '布料摩擦；第二次触碰只保留房间底噪。' },
      { timecode: '00:20—00:30', scene: '窗边 / 退开', visual: '她碰到旧收音机，自己的声音突然出现。手立刻松开；收音机没有启动，白杯在远处保持静止。', voice: '乔野过去的声音：“我不会再回来了。”', sound: '窗外自行车铃；手离开塑料外壳的轻响。' },
      { timecode: '00:30—00:40', scene: '餐桌 / 悬停', visual: '她坐到白杯前。右手接近杯柄，又停在一厘米外；第二次仍然没有碰到。', voice: '无对白。', sound: '冰箱停机，屋内突然更安静；指甲轻碰桌面。' },
      { timecode: '00:40—00:50', scene: '餐桌 / 拿起', visual: '指尖接触杯柄，手指闭合，杯底离桌。直到杯子真正承重，母亲最后一句话才出现。', voice: '母亲的回声：“水凉了就别喝了。”', sound: '陶瓷离开杯垫；台词结束后留一秒呼吸。' },
      { timecode: '00:50—01:00', scene: '水槽与门口 / 带走', visual: '她把杯子放稳、洗净、擦干，收进随身包。最后一个纸箱留在屋里；她锁门离开。', voice: '无对白。', sound: '水流、布擦陶瓷、拉链与门锁；结尾不加音乐。' },
    ],
    shotList: [
      { shot: '01', duration: 5, size: '空屋大全景', visual: '乔野坐在蓝色纸箱之间，把旧钥匙放进掌心。', camera: '固定', sound: '胶带与钥匙' },
      { shot: '02', duration: 5, size: '手部特写', visual: '钥匙接触掌心后她停住，目光转向空门口。', camera: '缓慢推近', sound: '“早点回来。”' },
      { shot: '03', duration: 5, size: '衣柜近景', visual: '指尖碰到围巾，听完后再碰一次，第二次没有声音。', camera: '固定', sound: '“外面冷。”＋布料' },
      { shot: '04', duration: 5, size: '窗台中景', visual: '她触碰收音机又立刻松开，白杯留在远处桌面。', camera: '轻微横移', sound: '“我不会再回来了。”' },
      { shot: '05', duration: 5, size: '面部近景', visual: '乔野看向白杯，没有哭，只把一只纸箱推到旁边。', camera: '固定', sound: '自行车铃与房间底噪' },
      { shot: '06', duration: 6, size: '桌面俯拍', visual: '白杯、黄色杯垫与右手形成三角；手在杯柄前停住。', camera: '缓慢下压', sound: '冰箱停机' },
      { shot: '07', duration: 5, size: '极近景', visual: '指尖第二次接近杯柄，仍保留清楚间距，然后短暂停住。', camera: '固定', sound: '指甲碰桌面' },
      { shot: '08', duration: 4, size: '微距特写', visual: '指腹接触杯柄外侧，杯底仍完整落在杯垫上。', camera: '固定', sound: '皮肤轻触陶瓷' },
      { shot: '09', duration: 5, size: '手杯近景', visual: '四指闭合后杯底离桌两厘米，杯柄和杯口形状保持不变。', camera: '固定', sound: '“水凉了就别喝了。”' },
      { shot: '10', duration: 5, size: '侧面近景', visual: '杯子先落稳在水槽边，手指随后释放。', camera: '固定匹配切', sound: '陶瓷落台与呼吸' },
      { shot: '11', duration: 5, size: '水槽中景', visual: '乔野洗净、擦干白杯，杯口缺口始终朝画面左侧。', camera: '缓慢横移', sound: '水流与布料' },
      { shot: '12', duration: 5, size: '门口远景', visual: '白杯进入随身包，乔野锁门离开，纸箱留在空屋。', camera: '固定长镜头', sound: '拉链与门锁' },
    ],
    promptGuide: {
      identityLock: 'same fictional East Asian Chinese woman, age 29, chin-length straight black bob, mint-green rectangular hair clip on her left side, calm restrained eyes, coral-red knitted vest over a pale sky-blue cotton shirt, dark navy straight trousers, natural skin texture, consistent face and hands',
      styleLock: 'bright cinematic magical realism, sunlit empty apartment, cream walls, sky-blue moving boxes, coral mint and mustard accents, natural photographic texture, restrained performance, readable hand-object contact, subtle 35mm texture, 16:9, no on-screen text',
      negative: 'different person, hairstyle change, missing hair clip, wardrobe change, duplicate woman, extra hands, extra fingers, fused fingers, hand passing through object, warped cup, duplicated cup, moving cup before contact, floating props, supernatural glow, horror mood, dark noir, subtitles, logo, watermark, generated text',
    },
    prompts: [
      { shot: '01', title: '钥匙落进掌心', prompt: 'Wide locked shot in a bright nearly empty apartment. Qiao Ye sits among sky-blue moving boxes and lowers one old brass key into her open right palm, then freezes.', constraint: '只出现一把钥匙与一只右手；声音后期加入，不生成幽灵或发光效果。' },
      { shot: '02', title: '听向空门口', prompt: 'Close-up of her hand holding the key, then a restrained focus shift to her face as her eyes turn toward the empty doorway. No one else appears.', constraint: '手与钥匙保持不变；只移动眼神，不做夸张惊吓或口型。' },
      { shot: '03', title: '围巾只说一次', prompt: 'Medium close-up at an open wardrobe. Her index finger touches a mustard scarf once, withdraws, then touches the same point again. The scarf stays still.', constraint: '两次接触分开生成或剪辑；不让布料自动移动，不在画面中生成声音文字。' },
      { shot: '04', title: '从收音机松手', prompt: 'Side medium shot by a bright window. Her fingertips touch one coral-red radio and immediately release it; a white ceramic cup remains untouched on a distant table.', constraint: '收音机不可自行启动；白杯位置、数量和朝向保持固定。' },
      { shot: '05', title: '看向白杯', prompt: 'Restrained close-up. She looks from the radio toward the white cup across the room, then quietly pushes one box aside. One natural blink.', constraint: '不流泪、不说话；人物发夹、发型与背心保持稳定。' },
      { shot: '06', title: '杯柄前停住', prompt: 'Top-down shot of a plain white ceramic cup on a round mustard coaster, handle pointing right. Her right hand approaches and stops one centimeter before the handle.', constraint: '明确保留空气间距；杯底完整接触杯垫，杯子不可提前移动。' },
      { shot: '07', title: '第二次接近', prompt: 'Extreme close-up matching the previous frame. Her fingertips approach the cup handle again and stop without contact, then hold still.', constraint: '保持同一手、同一杯与同一机位；不要用隐性切镜消除间距。' },
      { shot: '08', title: '第一次真正接触', prompt: 'Macro locked shot. The pad of her index finger makes clear contact with the outside of the cup handle while the cup stays fully supported by the table.', constraint: '只完成接触，不抬杯；接触前杯子不能滑动，手指不能穿过杯柄。' },
      { shot: '09', title: '闭合后承重', prompt: 'Close locked shot. Her fingers close naturally around the C-shaped handle; only after the grip is secure, the white cup rises exactly two centimeters.', constraint: '接触→闭合→离桌按顺序发生；不复制杯子，不改变杯柄、杯口缺口或手指数。' },
      { shot: '10', title: '落稳再松手', prompt: 'Side close-up beside a sink. She lowers the cup until its base is fully supported by the counter, pauses, then releases her fingers.', constraint: '必须先落稳后释放；禁止悬浮、滑动、穿模和动作回弹。' },
      { shot: '11', title: '洗净与擦干', prompt: 'Medium shot at a bright sink. She rinses the same white cup once, turns off the water, then dries it with a pale cloth.', constraint: '拆成短动作生成后剪辑；杯子缺口、柄方向和数量全程一致。' },
      { shot: '12', title: '带走杯子', prompt: 'Wide locked shot toward the apartment door. She places the dry white cup carefully into an open canvas shoulder bag, closes the zipper and locks the door behind her.', constraint: '杯子进入包后不再出现；门锁动作与离开分开验收，不生成文字。' },
    ],
    motionTests: [
      { shot: '08', title: '接触前保持绝对静止', duration: '4 秒', purpose: '验证指尖接近与真正接触能否被清楚区分，杯子不会提前响应。', action: '保留间距 → 指腹接触杯柄 → 停住半秒。', pass: '接触点可见；接触前杯底与杯垫坐标不变，手指结构完整。', fail: '杯子提前滑动、手穿过杯柄、接触点被遮挡或出现多指。', status: '待生成' },
      { shot: '09', title: '闭合之后才抬杯', duration: '5 秒', purpose: '验证抓握、承重转移和杯底离桌能否按顺序发生。', action: '指尖接触 → 四指闭合 → 杯底离桌两厘米 → 停住。', pass: '杯形与杯柄不变，手先完成抓握，杯子随后平稳离桌。', fail: '杯子悬浮、抓握点滑动、杯柄变形、手指融合或隐性切镜。', status: '待生成' },
      { shot: '10', title: '落稳以后再释放', duration: '5 秒', purpose: '验证承重点从手回到台面时，释放动作不会抢先发生。', action: '杯底靠近台面 → 完整落稳 → 手指打开 → 手离开。', pass: '杯底落稳后才松手，杯子位置与朝向保持一致。', fail: '提前松手仍悬浮、杯子弹跳、落点漂移、手穿杯或动作倒放。', status: '待生成' },
    ],
    nextSteps: [
      '由荆确认母亲最后一句保持“水凉了就别喝了”，还是改成更接近她真实感受的日常话语。',
      '复核人物锚点与四张概念关键帧中的脸、发夹、服装、白杯和旧家配色，再决定是否锁为正式视觉参考。',
      '用接触动作卡分别测试镜头 08、09、10，记录接触时点、手部完整、道具保持和承重逻辑。',
      '确认四句虚构台词与声音表演方向后，按触发时间线制作临时配音和动作拟音。',
    ],
  },
  {
    slug: 'before-the-water-recedes',
    number: '006',
    title: '退水以前',
    titleLines: ['退水以前'],
    englishTitle: 'Before the Water Recedes',
    type: 'Editorial Story Candidate',
    date: '2026.09',
    duration: '01:12',
    status: '编辑候选 · 待荆确认',
    draft: true,
    heroVisual: 'water-ledger',
    draftNotice: '这是从 EXP.009 的 A01 样本继续发展的 AI 编辑候选。顾岚、档案馆与全部情节均为虚构；人物锚点和三张概念关键帧生成于 2026-09-01，用于视觉开发。它尚未由荆确认，也没有生成视频或真实制作结果。',
    logline: '档案安全员顾岚进入一座被清水淹没、书页却全干的图书馆。水面正在预演今晚被淹的街区；她只能把一条撤离路线写在身上，再撑开红伞，让所有预演永远消失。',
    premise: '这不是一个关于预测灾难的故事，而是一个关于取舍的故事：当你只能带走一条路，是否愿意让剩下的预言全部消失？',
    premiseLines: ['如果只能带走一条路，', '你愿意让所有预言，', '从此消失吗？'],
    sectionCopy: {
      beats: { eyebrow: '01 / The countdown', heading: '十二分钟，\n从全部路线到一条路。', description: '馆内时间从 11:48 走向正午。六个拍点只推进三件事：看懂水面、接受限制、做出不可撤销的选择。' },
      rules: { eyebrow: '02 / World rules', heading: '三条规则，\n把预警变成选择。', description: '水、皮肤与红伞各自承担一种叙事功能。规则越少，观众越容易在七十二秒内看懂代价。' },
      stills: { eyebrow: '03 / Visual anchors', heading: '一个人物锚点，\n三个决定时刻。', description: '人物与三张关键帧是 AI 视觉开发素材。它们先验证服装、红伞、水位和空间方向，不代表视频已经制作。' },
      script: { eyebrow: '04 / Screenplay draft', heading: '七十二秒，\n只带走一条路。', description: '六场戏按画面行为编排，不用旁白解释规则。唯一一句台词仍是编辑草案，等待荆确认。' },
      shots: { eyebrow: '05 / Shot list', heading: '十二个镜头，\n从进水到退水。', description: '十二镜各六秒，先把空间、因果和三个高风险动作拆清楚，再决定是否进入视频生成。' },
    },
    shotSummary: ['12 SHOTS', '72 SECONDS', '1 ROUTE', 'DRAFT 01'],
    stillsGenerated: true,
    characterAnchor: {
      name: '顾岚',
      title: '先锁住顾岚，再让水面改变。',
      titleLines: ['先锁住顾岚，', '再让水面改变。'],
      copy: '顾岚是虚构的档案安全员。人物锚点固定齐下巴黑发、左侧芥末黄发夹、浅蓝工作衬衫与珊瑚红防水背心；道具锚点固定芥末黄工具包和唯一一把珊瑚红长柄伞。任何真实人物都不是她的原型。',
      locks: ['齐下巴黑发＋左侧芥末黄发夹＋克制表情', '浅蓝工作衬衫＋珊瑚红防水背心＋深藏蓝阔腿裤', '薄荷绿雨靴＋芥末黄工具包＋唯一一把珊瑚红长柄伞'],
      generatedLabel: 'GENERATED 2026.09 · FICTIONAL CHARACTER',
    },
    ending: { label: 'EDITORIAL CANDIDATE', copy: '故事已经有了路线。\n还没有成为荆的作品。', href: '/experiments/does-the-short-evidence-ledger-travel/', link: '回看来源实验 ↗' },
    related: { href: '/notes/poster-to-story-evidence-ledger/', label: '阅读证据账本方法 ↗' },
    beats: [
      { time: '11:48', title: '清水已经没过脚踝', copy: '顾岚从左侧安全门进入档案馆。水面平静，书架没有倒，所有摊开的纸页却完全干燥。', tone: 'blue' },
      { time: '11:51', title: '水面映出不存在的街道', copy: '她低头时，倒影不是天花板，而是几条正在涨水的街。每次水纹散开，路线都会换一组。', tone: 'yellow' },
      { time: '11:54', title: '手机与纸张都带不走预演', copy: '拍下的画面只剩普通水面；她把路线抄进干书，墨迹也在离开水面后消失。', tone: 'coral' },
      { time: '11:57', title: '她认出一条通往旧社区的路', copy: '九条街里，只有一条连接低洼社区与高架站。她不再继续寻找更完整的答案。', tone: 'mint' },
      { time: '11:59', title: '路线被写在左臂上', copy: '活着的皮肤能留下水面的信息。顾岚用防水笔把七个转向点写到左前臂，逐一复核。', tone: 'yellow' },
      { time: '12:00', title: '红伞打开，水开始退', copy: '她撑开馆里唯一一把红伞。水沿对角线退去，所有预演归零；她只带着手臂上的一条路线离开。', tone: 'blue' },
    ],
    rules: [
      { label: 'THE WATER', title: '水面只预演今晚的淹水路线', copy: '预演会随水纹切换，无法暂停。照片、录像与普通抄写只能留下正常水面，不能复制路线。' },
      { label: 'THE SKIN', title: '只有活着的皮肤能把路线带出去', copy: '写在皮肤上的转向点不会消失，但容量有限。顾岚必须主动选择一条路线，而不是带走完整预测。' },
      { label: 'THE UMBRELLA', title: '撑开红伞会退水，也会删除全部预演', copy: '伞只能打开一次。动作发生后馆内恢复干燥，水面不再出现未来，选择无法重来。' },
    ],
    stills: [
      { shot: 'FRAME 01', title: '唯一一把伞', direction: '明亮档案馆被浅蓝清水覆盖。顾岚从左侧进入，唯一一把合拢的珊瑚红伞立在远处，先建立空间方向与关键道具。', status: 'AI 概念关键帧 · 2026-09-01', framePosition: 'left top', tone: 'blue' },
      { shot: 'FRAME 02', title: '把路线写在手臂上', direction: '中近景锁住左前臂、黑色防水笔和干燥书页。路线只用抽象线段表达，不生成可误读的地名或界面文字。', status: 'AI 概念关键帧 · 2026-09-01', framePosition: 'right top', tone: 'yellow' },
      { shot: 'FRAME 03', title: '退水以前', direction: '顾岚撑开唯一一把珊瑚红伞。水位沿明确对角线退去，木地板重新出现，出口保持在画面右后方。', status: 'AI 概念关键帧 · 2026-09-01', framePosition: 'left bottom', tone: 'coral' },
    ],
    production: [
      { phase: '来源与命题', status: '完成草案', note: '从 EXP.009 的 A01 短证据账本继续发展；来源关系与编辑候选身份已明确标注。' },
      { phase: '人物与世界规则', status: '完成草案', note: '已建立虚构角色顾岚，并把水面、皮肤和红伞收束为三条可拍摄规则。' },
      { phase: '72 秒剧本', status: '完成草案', note: '六场共 72 秒，冲突从读取全部路线收束到只带走一条路线。' },
      { phase: '十二镜分镜', status: '完成草案', note: '十二镜共 72 秒，每镜六秒；空间方向与关键动作已拆开。' },
      { phase: '人物锚点', status: '完成草案', note: '已生成顾岚全身视觉锚点，锁定发夹、服装、工具包、雨靴与单把红伞。' },
      { phase: '概念关键帧', status: '完成草案', note: '已生成进入、水上记录与撑伞退水三张概念关键帧；均为静态视觉开发素材。' },
      { phase: '视频与声音', status: '待开始', note: '尚未生成视频、录制台词或完成拟音；需先测试写字、撑伞和退水三个高风险动作。' },
    ],
    script: [
      { timecode: '00:00—00:12', scene: '档案馆入口 / 进入', visual: '顾岚推开安全门，薄荷绿雨靴踏入脚踝深的清水。远处只有一把合拢的红伞，摊开的书页保持干燥。', voice: '无对白。', sound: '门轴、浅水脚步、远处换气扇；不使用神秘配乐。' },
      { timecode: '00:12—00:24', scene: '书架通道 / 看懂水面', visual: '俯拍水面。九条抽象街线依次亮起，倒影里出现今晚的水位；顾岚用书架编号确认方向。', voice: '馆内广播草案：“距离正午，还有九分钟。”', sound: '水纹、旧广播底噪；路线变化用细小纸张摩擦声提示。' },
      { timecode: '00:24—00:36', scene: '阅览桌 / 复制失败', visual: '她拍照，屏幕里只剩普通水面；再把路线写进干书，墨迹从纸上退去。她看向自己的左臂。', voice: '无对白。', sound: '快门、笔尖、墨迹消失后的短暂静默。' },
      { timecode: '00:36—00:49', scene: '中央通道 / 选择', visual: '九条路线在水面交错。她认出通往低洼社区的七个转向点，划掉其余路线，把这七点写在左前臂。', voice: '顾岚低声草案：“只带这一条。”', sound: '防水笔连续七次短划；其余环境声逐渐变薄。' },
      { timecode: '00:49—01:02', scene: '红伞前 / 删除预演', visual: '她逐点复核手臂，取下红伞，停一拍后撑开。水面从左前方向右后方退去，路线同时消失。', voice: '无对白。', sound: '伞骨弹开、连续退水声；不使用爆炸或魔法音效。' },
      { timecode: '01:02—01:12', scene: '安全门 / 离开', visual: '干燥木地板重新出现。顾岚收起已无作用的伞，左臂路线仍在；她从右侧出口离开，书页全部空白。', voice: '广播只剩整点提示音。', sound: '雨靴踩木地板、单次整点音、关门。' },
    ],
    shotList: [
      { shot: '01', duration: 6, size: '入口大全景', visual: '顾岚从左侧门进入被清水覆盖的明亮档案馆。', camera: '固定', sound: '门轴与水步' },
      { shot: '02', duration: 6, size: '脚部特写', visual: '薄荷绿雨靴落入脚踝深的水，干书页倒映在旁。', camera: '低机位跟半步', sound: '一次清楚落水声' },
      { shot: '03', duration: 6, size: '通道远景', visual: '唯一一把合拢的红伞立在通道尽头，顾岚停在左侧。', camera: '缓慢推近', sound: '换气扇与水纹' },
      { shot: '04', duration: 6, size: '水面俯拍', visual: '九条抽象街线在水面依次出现，不生成地名。', camera: '垂直固定', sound: '广播倒计时' },
      { shot: '05', duration: 6, size: '书页近景', visual: '干燥书页映出其中一条路线，手指沿七个转向点确认。', camera: '轻微横移', sound: '纸张与指尖' },
      { shot: '06', duration: 6, size: '桌面中近景', visual: '手机拍摄失败，写进纸页的线也逐段消失。', camera: '固定匹配切', sound: '快门与笔尖' },
      { shot: '07', duration: 6, size: '人物近景', visual: '顾岚看向左前臂，再看向低洼社区方向，做出选择。', camera: '缓慢推近', sound: '环境声变薄' },
      { shot: '08', duration: 6, size: '手臂特写', visual: '右手用防水笔在左前臂画下七个连续转向点。', camera: '固定', sound: '七次短划' },
      { shot: '09', duration: 6, size: '极近景', visual: '手指沿左臂路线逐点复核，最后一点与水面路线对齐。', camera: '固定', sound: '低声“只带这一条”' },
      { shot: '10', duration: 6, size: '手伞近景', visual: '右手握住唯一一把红伞，伞尖离地，人物先停一拍。', camera: '侧面固定', sound: '伞柄离架' },
      { shot: '11', duration: 6, size: '馆内大全景', visual: '红伞完整撑开，水沿对角线连续退去，木地板显露。', camera: '固定长镜头', sound: '伞骨与退水' },
      { shot: '12', duration: 6, size: '出口远景', visual: '顾岚收伞，从右侧出口离开；手臂路线可见，书页恢复空白。', camera: '固定', sound: '木地板脚步与关门' },
    ],
    promptGuide: {
      identityLock: 'same fictional East Asian Chinese woman, early 30s, jaw-length straight black hair, small mustard-yellow hair clip on her left side, calm observant expression, pale sky-blue utility shirt, coral-red waterproof work vest, dark navy wide-leg trousers, mint-green rubber boots, mustard canvas satchel, consistent natural face and hands',
      styleLock: 'bright cinematic magical realism, sunlit public archive library, ivory shelving, pale blue ankle-deep clear water, coral mustard mint accents, clean daylight, natural photographic texture, restrained performance, readable spatial direction, 16:9, no on-screen text',
      negative: 'different person, hairstyle change, missing hair clip, wardrobe change, duplicate woman, duplicate umbrella, open umbrella before shot 11, dark horror, neon cyberpunk, dirty floodwater, floating books, wet pages, extra hands, fused fingers, warped arm, illegible generated text, subtitles, logo, watermark',
    },
    prompts: [
      { shot: '01', title: '从左侧进入水面', prompt: 'Wide locked shot in a bright flooded archive library. Gu Lan enters through the left safety door and pauses in ankle-deep clear pale-blue water; one closed coral umbrella stands far ahead.', constraint: '人物只出现一次；入口保持左、出口保持右后方；书页干燥。' },
      { shot: '02', title: '雨靴落进清水', prompt: 'Low close-up of the same mint-green rubber boots taking one careful step into ankle-deep clear water. Dry open pages reflect beside the boot.', constraint: '只完成一步；水位不变，书页不湿、不漂浮。' },
      { shot: '03', title: '远处唯一的红伞', prompt: 'Symmetrical aisle view. Gu Lan stands on the left third while exactly one closed coral-red long umbrella remains upright at the far end.', constraint: '只出现一把伞且保持合拢；人物与伞不换侧。' },
      { shot: '04', title: '九条路线浮现', prompt: 'Top-down locked view of clear water showing nine abstract thin route lines and simple turn nodes, reflected as physical light patterns rather than a digital interface.', constraint: '不生成地名、数字或界面；水下不出现城市模型。' },
      { shot: '05', title: '沿七个点确认', prompt: 'Close view of one dry open archive book above clear water. Gu Lan’s index finger follows seven abstract turn nodes reflected across the blank page.', constraint: '书页保持干燥；手指完整，路线不变成可读文字。' },
      { shot: '06', title: '复制失败', prompt: 'Locked tabletop shot. A phone camera shows only ordinary water while black marker lines on a dry blank page fade away from left to right.', constraint: '屏幕不生成 UI 文字；纸张不湿，消失方向单一。' },
      { shot: '07', title: '决定只带一条', prompt: 'Restrained medium close-up of Gu Lan looking from the water route to her bare left forearm, then making one small decisive nod.', constraint: '脸、发夹与服装稳定；不哭、不说话、不夸张表演。' },
      { shot: '08', title: '路线写在左臂', prompt: 'Clear close-up. Her right hand uses one black waterproof marker to draw seven simple connected turn marks along her left forearm.', constraint: '固定左右手关系；每个点依次出现，禁止多指、穿模和生成文字。' },
      { shot: '09', title: '逐点复核路线', prompt: 'Extreme close-up matching the previous shot. Her right index finger checks the seven marks on her left forearm one by one and stops at the final node.', constraint: '路线形状与镜头 08 一致；不新增点，不改变手臂结构。' },
      { shot: '10', title: '拿起唯一一把伞', prompt: 'Side close-up of her right hand gripping the handle of the same closed coral umbrella, lifting its tip from the floor, then holding still.', constraint: '伞保持合拢；只出现一只手与一把伞，不提前退水。' },
      { shot: '11', title: '撑伞以后退水', prompt: 'Wide locked shot. Gu Lan opens the single coral umbrella fully; only after the canopy locks, the clear water recedes diagonally from front-left to back-right and reveals dry wood flooring.', constraint: '顺序必须是握持→撑开→锁定→退水；人物、伞与书架保持稳定。' },
      { shot: '12', title: '带着一条路离开', prompt: 'Wide locked exit view. On the dry floor Gu Lan closes the umbrella, keeps the seven marks visible on her left forearm, and walks out through the right-side door.', constraint: '路线保留，书页空白；不再出现水或第二把伞。' },
    ],
    motionTests: [
      { shot: '08', title: '右手在左前臂连续写字', duration: '6 秒', purpose: '验证手部结构、左右关系与路线累计是否稳定。', action: '笔尖接触 → 七次短划 → 路线完整 → 手离开。', pass: '左臂稳定、右手五指完整，七个节点依次增加且不漂移。', fail: '手指融合、笔穿过皮肤、路线跳变、节点重复或左右手互换。', status: '待生成' },
      { shot: '10', title: '合伞保持与单手取伞', duration: '6 秒', purpose: '验证唯一道具在抓握和离地过程中不复制、不提前展开。', action: '手接近 → 握住弯柄 → 伞尖离地 → 停一拍。', pass: '始终只有一把合拢红伞，握点与伞长不变。', fail: '伞复制、自动撑开、柄形改变、手穿柄或伞尖跳位。', status: '待生成' },
      { shot: '11', title: '撑开以后水才退', duration: '6 秒', purpose: '验证撑伞动作与空间退水的因果顺序。', action: '握持 → 伞骨撑开并锁定 → 水线沿单一对角线后退。', pass: '伞先完整打开，水随后连续退去；人物、地板和书架无形变。', fail: '水提前退、伞盖穿人、出现第二把伞、水线倒流或背景融化。', status: '待生成' },
    ],
    nextSteps: [
      '由荆确认“只能带走一条路线”的核心选择，以及顾岚最后是否收起红伞。',
      '复核人物锚点与三张关键帧中的脸、发夹、服装、雨靴、工具包和唯一红伞，再决定是否锁为正式参考。',
      '优先测试镜头 08、10、11，分别记录手臂书写、单手取伞与撑伞退水的通过条件。',
      '故事确认后再制作广播、笔尖、伞骨与退水声音时间线；当前不生成或模仿任何真实人物声线。',
    ],
  },
];

export function getStoryBySlug(slug: string) {
  return storyDetails.find((story) => story.slug === slug);
}
