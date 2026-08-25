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
];

export const libraryFilters = ['全部', 'VIDEO', 'ARTICLE', 'PDF', 'TOOL', 'JING PICKS'];
