export type LibraryType = 'VIDEO' | 'ARTICLE' | 'PDF' | 'TOOL';

export type LibraryItem = {
  id: string;
  title: string;
  type: LibraryType;
  source: string;
  topic: string;
  description: string;
  whyISavedIt: string;
  jingTake: string;
  takeStatus: 'confirmed' | 'draft';
  tags: string[];
  dateAdded: string;
  featured: boolean;
  jingPick: boolean;
  visual: string;
  url: string;
  creator?: string;
  duration?: string;
  demo: boolean;
};

export const libraryItems: LibraryItem[] = [
  {
    id: 'runway-gen4-intro-video',
    title: 'Introducing Runway Gen-4',
    type: 'VIDEO',
    source: 'YouTube · Runway',
    topic: 'AI Video',
    description: 'Runway 官方发布的 Gen-4 能力展示，重点呈现跨场景的角色、地点与物体一致性。',
    whyISavedIt: '适合快速建立对模型视觉方向和一致性能力的直观认识，也可以作为继续阅读提示指南前的入口。',
    jingTake: '更适合用来确认 Gen-4 能做什么，不是详细操作教程；看完以后还需要回到真实项目里测试。',
    takeStatus: 'draft',
    tags: ['AI VIDEO', 'CONSISTENCY', 'RUNWAY'],
    dateAdded: '2026-08-25', featured: true, jingPick: true, visual: 'video-blue',
    url: 'https://www.youtube.com/watch?v=uRkfzKYFOxc', creator: 'Runway', demo: false,
  },
  {
    id: 'google-veo-prompt-guide',
    title: 'Veo 视频生成提示指南',
    type: 'ARTICLE',
    source: 'Google Cloud',
    topic: 'Prompt',
    description: 'Google 官方中文指南，解释如何用主体、动作、场景、镜头、光线和视觉风格组织 Veo 视频提示。',
    whyISavedIt: '结构清楚，而且有中文版本，适合写视频 Prompt 时逐项检查有没有遗漏关键画面信息。',
    jingTake: '可以直接把六个构成要素做成 Prompt 自检清单；不必每次全部写满，先保留真正影响镜头的部分。',
    takeStatus: 'draft',
    tags: ['AI VIDEO', 'PROMPT', 'VEO'],
    dateAdded: '2026-08-25', featured: false, jingPick: true, visual: 'article-yellow',
    url: 'https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/video-gen-prompt-guide?hl=zh-CN', demo: false,
  },
  {
    id: 'vbench-cvpr-paper',
    title: 'VBench：视频生成模型综合评测基准',
    type: 'PDF',
    source: 'CVPR 2024',
    topic: 'Evaluation',
    description: '将视频生成质量拆成 16 个细分维度，并为不同维度设计提示集、评测方法与人类偏好校准。',
    whyISavedIt: '它提供了一套可以追溯的评测维度，非常适合用来校准人物一致性、运动流畅度、闪烁和 Prompt 遵循等判断。',
    jingTake: '最值得借鉴的不是一个总分，而是把“视频好不好”拆成多个可以单独解释、单独复盘的维度。',
    takeStatus: 'draft',
    tags: ['EVALUATION', 'AI VIDEO', 'BENCHMARK'],
    dateAdded: '2026-08-25', featured: false, jingPick: true, visual: 'pdf-coral',
    url: 'https://openaccess.thecvf.com/content/CVPR2024/papers/Huang_VBench_Comprehensive_Benchmark_Suite_for_Video_Generative_Models_CVPR_2024_paper.pdf', demo: false,
  },
  {
    id: 'vbench-open-source-toolkit',
    title: 'VBench 开源评测工具与 Prompt Suite',
    type: 'TOOL',
    source: 'GitHub · Vchitect',
    topic: 'Evaluation',
    description: 'VBench 系列论文的开源实现，包含评测代码、标准提示集、生成样例和多个视频模型的对比入口。',
    whyISavedIt: '论文给出方法，仓库则能看到具体维度名称、标准提示和实际使用方式，方便把概念落到工作流。',
    jingTake: '适合研究标准化模型对比；个人项目不需要完整照搬，但维度定义和 Prompt Suite 很值得参考。',
    takeStatus: 'draft',
    tags: ['EVALUATION', 'OPEN SOURCE', 'WORKFLOW'],
    dateAdded: '2026-08-25', featured: false, jingPick: true, visual: 'tool-mint',
    url: 'https://github.com/Vchitect/VBench', demo: false,
  },
  {
    id: 'runway-gen4-prompt-guide',
    title: 'Gen-4 Video Prompting Guide',
    type: 'ARTICLE',
    source: 'Runway',
    topic: 'Prompt',
    description: 'Runway 官方 Gen-4 视频提示指南，围绕输入图、运动描述、正向表达和提示结构给出示例。',
    whyISavedIt: '它把图生视频里“图片负责什么、文字负责什么”说得很直接，能减少在 Prompt 中重复描述静态画面的情况。',
    jingTake: '输入图已经决定了外观时，文字提示更应该把注意力放在主体运动、环境变化和摄影机运动。',
    takeStatus: 'draft',
    tags: ['AI VIDEO', 'PROMPT', 'RUNWAY'],
    dateAdded: '2026-08-25', featured: false, jingPick: false, visual: 'article-yellow',
    url: 'https://help.runwayml.com/hc/en-us/articles/39789879462419-Gen-4-Video-Prompting-Guide', demo: false,
  },
  {
    id: 'openai-sora-examples',
    title: 'Sora：从文字生成视频的官方示例',
    type: 'ARTICLE',
    source: 'OpenAI',
    topic: 'AI Video',
    description: 'OpenAI 的 Sora 介绍与生成示例页，可以对照查看较长提示如何组织人物、动作、镜头、环境和质感。',
    whyISavedIt: '适合把提示原文与结果放在一起观察，理解一条描述里哪些信息负责内容、哪些信息负责镜头和氛围。',
    jingTake: '适合学习长描述的信息组织方式，但不能直接把示例当成所有视频模型都通用的 Prompt 模板。',
    takeStatus: 'draft',
    tags: ['AI VIDEO', 'PROMPT', 'SORA'],
    dateAdded: '2026-08-25', featured: false, jingPick: false, visual: 'article-yellow',
    url: 'https://openai.com/index/sora/', demo: false,
  },
  {
    id: 'openai-prompt-engineering-best-practices',
    title: 'ChatGPT Prompt Engineering Best Practices',
    type: 'ARTICLE',
    source: 'OpenAI',
    topic: 'Prompt',
    description: 'OpenAI 官方的 ChatGPT Prompt 入门指南，重点说明清晰具体、补足上下文、迭代修改和语气控制等基础原则。',
    whyISavedIt: '适合给第一次系统整理 Prompt 的人做起点，也能用来检查网站里收藏的复杂 Prompt 有没有忽略最基本的表达问题。',
    jingTake: '它不是技巧大全，价值在于提醒我：先把任务和上下文讲清楚，再讨论更复杂的 Prompt 结构。',
    takeStatus: 'draft',
    tags: ['PROMPT', 'CHATGPT', 'FOUNDATIONS'],
    dateAdded: '2026-08-25', featured: false, jingPick: false, visual: 'article-yellow',
    url: 'https://help.openai.com/en/articles/10032626-prompt-engineering-best-practices', demo: false,
  },
  {
    id: 'anthropic-prompt-engineering-overview',
    title: 'Prompt Engineering Overview',
    type: 'ARTICLE',
    source: 'Anthropic',
    topic: 'Prompt',
    description: 'Anthropic 官方 Prompt 工程入口，先要求明确成功标准、建立评测方式，再决定是否需要继续优化提示词。',
    whyISavedIt: '它把 Prompt 从“写一句神奇指令”拉回到可验证的问题：什么叫成功，以及怎么知道修改以后真的更好了。',
    jingTake: '最值得留下的是顺序：先定义好结果，再做小型评测，最后才优化 Prompt；很多低效尝试正好反了过来。',
    takeStatus: 'draft',
    tags: ['PROMPT', 'EVALUATION', 'CLAUDE'],
    dateAdded: '2026-08-25', featured: false, jingPick: true, visual: 'article-yellow',
    url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview', demo: false,
  },
  {
    id: 'evalcrafter-cvpr-paper',
    title: 'EvalCrafter：大型视频生成模型的评测框架',
    type: 'PDF',
    source: 'CVPR 2024',
    topic: 'Evaluation',
    description: '使用 700 条提示和 17 项客观指标，从视觉质量、内容质量、运动质量与文生视频对齐等方面评估生成视频。',
    whyISavedIt: '可以和 VBench 对照阅读：两者都反对只用一个总分判断视频，但在 Prompt 集、指标组合和人类偏好校准上各有侧重。',
    jingTake: '适合用来补足“运动质量”和“内容正确性”的检查思路；最终仍要确认自动指标是否真的符合真实观看感受。',
    takeStatus: 'draft',
    tags: ['EVALUATION', 'AI VIDEO', 'BENCHMARK'],
    dateAdded: '2026-08-25', featured: false, jingPick: false, visual: 'pdf-coral',
    url: 'https://openaccess.thecvf.com/content/CVPR2024/papers/Liu_EvalCrafter_Benchmarking_and_Evaluating_Large_Video_Generation_Models_CVPR_2024_paper.pdf', demo: false,
  },
  {
    id: 'comfyui-official-docs',
    title: 'ComfyUI 官方文档与工作流教程',
    type: 'TOOL',
    source: 'ComfyUI',
    topic: 'Workflow',
    description: 'ComfyUI 官方维护的文档入口，包含安装、节点与连线概念、工作流模板，以及图片、视频、音频等教程。',
    whyISavedIt: '网上的整合包和教程更新速度不一；遇到界面变化、节点概念或标准工作流问题时，官方文档更适合作为核对入口。',
    jingTake: '不用一开始就追求巨大工作流，先理解节点、输入输出和最小可运行流程，后面排错会轻松很多。',
    takeStatus: 'draft',
    tags: ['WORKFLOW', 'OPEN SOURCE', 'COMFYUI'],
    dateAdded: '2026-08-25', featured: false, jingPick: false, visual: 'tool-mint',
    url: 'https://docs.comfy.org/', demo: false,
  },
  {
    id: 'adobe-structuring-video-prompts',
    title: '如何组织 Firefly 视频 Prompt',
    type: 'VIDEO',
    source: 'YouTube · Adobe',
    topic: 'Prompt',
    description: 'Adobe 官方短教程，用视觉风格、摄影机、主体、动作、地点、光线和审美方向组织视频提示。',
    whyISavedIt: '内容短、结构明确，适合写视频 Prompt 前快速复习，也能和 Google Veo 的官方提示结构互相对照。',
    jingTake: '可以把它当成检查清单，但不必机械填满七项；先写真正会改变运动、构图和气氛的部分。',
    takeStatus: 'draft',
    tags: ['AI VIDEO', 'PROMPT', 'ADOBE'],
    dateAdded: '2026-08-25', featured: false, jingPick: false, visual: 'video-blue',
    url: 'https://www.youtube.com/watch?v=mL7zyasCfrY', creator: 'Adobe', demo: false,
  },
  {
    id: 'kling-character-consistency-bilibili',
    title: '在生成视频时，怎样保持角色一致性？',
    type: 'VIDEO',
    source: 'Bilibili',
    topic: 'Consistency',
    description: '可灵 AI 官方账号发布的中文短教程，介绍在视频生成中使用角色参考保持人物一致性的基本入口。',
    whyISavedIt: '它足够短，适合中文用户先理解功能在哪里、参考图怎么参与生成，再进入更复杂的多镜头测试。',
    jingTake: '适合快速上手，不适合直接证明长视频的一致性已经解决；真正制作时仍要逐镜检查脸、服装和动作漂移。',
    takeStatus: 'draft',
    tags: ['AI VIDEO', 'CONSISTENCY', 'KLING'],
    dateAdded: '2026-08-25', featured: false, jingPick: false, visual: 'video-blue',
    url: 'https://www.bilibili.com/video/BV1e9QoY9ECr/', creator: '可灵AI', demo: false,
  },
];

export const libraryFilters = ['全部', 'VIDEO', 'ARTICLE', 'PDF', 'TOOL', 'JING PICKS'];
