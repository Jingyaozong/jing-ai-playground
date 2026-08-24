export type PromptCategory = 'IMAGE' | 'VIDEO' | 'CHARACTER' | 'WORKFLOW';

export type PromptItem = {
  id: string;
  title: string;
  category: PromptCategory;
  description: string;
  prompt: string;
  variables: string[];
  tags: string[];
  model: string;
  jingNote: string;
  dateAdded: string;
  featured: boolean;
  demo: boolean;
};

// 这里的内容用于展示 Prompt 板块的结构与交互。
// 收到 JING 提供的正式素材后，直接替换或新增对象即可，不需要再写页面。
export const promptItems: PromptItem[] = [
  {
    id: 'prompt-character-anchor',
    title: '先锁住角色的视觉锚点',
    category: 'CHARACTER',
    description: '用于第一轮角色设定图，先建立可重复描述的外观信息。',
    prompt: '为【角色身份】创建一张角色设定图。她有【3 个稳定外观锚点】，穿着【服装与材质】，处于【情绪基线】。使用【景别】、【光线】和【背景复杂度】。保持面部比例自然，不添加未提及的首饰与文字。',
    variables: ['角色身份', '稳定外观锚点', '服装与材质', '情绪基线', '景别', '光线', '背景复杂度'],
    tags: ['角色一致性', '设定图', '图片生成'],
    model: '通用图片模型',
    jingNote: '先写少量、可辨认的锚点。第一稿就堆太多细节，后面反而很难复现。',
    dateAdded: '2026-08-24',
    featured: true,
    demo: true,
  },
  {
    id: 'prompt-video-action-camera',
    title: '把人物动作和摄影机运动分开写',
    category: 'VIDEO',
    description: '减少模型把“角色在动”和“镜头在动”混成一件事。',
    prompt: '【主体】在【场景】中先【起始动作】，随后【动作变化】，最后停在【结束状态】。摄影机使用【运镜方式】，从【起始景别】变化到【结束景别】。环境只发生【一个次要变化】，画面持续【时长】。',
    variables: ['主体', '场景', '起始动作', '动作变化', '结束状态', '运镜方式', '景别', '时长'],
    tags: ['AI 视频', '运镜', '动作'],
    model: '通用视频模型',
    jingNote: '先描述角色做什么，再单独描述摄影机怎么走。一次只保留一个主要动作。',
    dateAdded: '2026-08-23',
    featured: false,
    demo: true,
  },
  {
    id: 'prompt-image-lighting',
    title: '用光线关系描述画面，不只写氛围词',
    category: 'IMAGE',
    description: '把“电影感”拆成模型更容易执行的光源、方向和反差。',
    prompt: '【主体】位于【场景】。主光来自【方向与光源】，在【面部或物体位置】形成【明暗关系】；辅光为【颜色与强度】，背景保留【层次特征】。整体色调【色彩关系】，曝光【明亮程度】，画面情绪【情绪】。',
    variables: ['主体', '场景', '方向与光源', '明暗关系', '辅光', '色彩关系', '情绪'],
    tags: ['图片生成', '光线', '画面描述'],
    model: '通用图片模型',
    jingNote: '“高级感”很难执行，“左后方暖色夕阳 + 正面弱冷光补光”更容易得到稳定结果。',
    dateAdded: '2026-08-22',
    featured: false,
    demo: true,
  },
  {
    id: 'prompt-ask-before-write',
    title: '让 AI 先补齐信息，再开始生成',
    category: 'WORKFLOW',
    description: '适合需求还很模糊时，避免 AI 直接猜一个看似完整的答案。',
    prompt: '我准备完成【任务】。在给出结果之前，请先找出会明显影响结果的缺失信息，最多向我提出 3 个问题。收到回答后，再输出：1）你的理解；2）可直接使用的结果；3）仍需我确认的假设。',
    variables: ['任务'],
    tags: ['ChatGPT', '工作流', '需求澄清'],
    model: '对话模型',
    jingNote: '只让它问真正会改变结果的问题，否则很容易进入无休止的访谈。',
    dateAdded: '2026-08-21',
    featured: false,
    demo: true,
  },
];

export const promptFilters = ['全部', 'IMAGE', 'VIDEO', 'CHARACTER', 'WORKFLOW'];
