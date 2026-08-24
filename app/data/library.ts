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
  tags: string[];
  dateAdded: string;
  featured: boolean;
  jingPick: boolean;
  visual: string;
  url: string | null;
  creator?: string;
  duration?: string;
  demo: boolean;
};

export const libraryItems: LibraryItem[] = [
  {
    id: 'lib-video-001', title: '人物一致性：从参考图到连续镜头', type: 'VIDEO', source: 'Bilibili', topic: 'AI Video',
    description: '一个从角色设定到镜头连续性的完整演示，重点放在实际制作流程。',
    whyISavedIt: '没有只展示结果，而是把参考图、提示词和失败镜头放在一起比较。',
    jingTake: '人物一致性部分讲得非常清楚，适合刚开始做 AI 漫剧的人。',
    tags: ['AI VIDEO', 'CHARACTER'], dateAdded: '2026-08-23', featured: true, jingPick: true, visual: 'video-blue', url: null,
    creator: '示例 UP 主', duration: '18:42', demo: true,
  },
  {
    id: 'lib-article-001', title: '如何写出可执行的镜头描述', type: 'ARTICLE', source: '示例创作博客', topic: 'Prompt',
    description: '从景别、机位、运动到时间变化，拆解一条镜头描述真正需要的信息。',
    whyISavedIt: '结构清楚，适合在写视频 Prompt 前快速复习。',
    jingTake: '最值得看的是“动作”和“摄影机运动”分开写这一点。',
    tags: ['PROMPT', 'CAMERA'], dateAdded: '2026-08-21', featured: false, jingPick: true, visual: 'article-yellow', url: null, demo: true,
  },
  {
    id: 'lib-pdf-001', title: '生成式视频质量评测框架（示例报告）', type: 'PDF', source: '示例研究机构', topic: 'Evaluation',
    description: '围绕画面质量、时序一致性、动作合理性和文本遵循展开的评测框架。',
    whyISavedIt: '维度比较完整，可以帮助我校准自己的评测表。',
    jingTake: '适合搭框架，但真正用于项目时仍然需要补充业务场景和坏例定义。',
    tags: ['EVALUATION', 'AI VIDEO'], dateAdded: '2026-08-19', featured: false, jingPick: true, visual: 'pdf-coral', url: null, demo: true,
  },
  {
    id: 'lib-tool-001', title: '分镜参考整理工具（示例）', type: 'TOOL', source: '示例工具站', topic: 'Tools',
    description: '把零散参考图按场景、景别和角色整理成一张可共享的分镜板。',
    whyISavedIt: '减少素材散落在多个文件夹里的麻烦。',
    jingTake: '功能不复杂，但很贴近真实创作工作流。',
    tags: ['TOOLS', 'WORKFLOW'], dateAdded: '2026-08-16', featured: false, jingPick: true, visual: 'tool-mint', url: null, demo: true,
  },
  {
    id: 'lib-video-002', title: '七种常用运镜的视觉区别', type: 'VIDEO', source: 'Bilibili', topic: 'Camera',
    description: '用同一场景对比推、拉、摇、移、跟、升降与环绕。',
    whyISavedIt: '很适合直接对照着修改视频 Prompt。',
    jingTake: '比单纯背术语有效，关键是看每种运镜改变了什么情绪。',
    tags: ['AI VIDEO', 'CAMERA'], dateAdded: '2026-08-12', featured: false, jingPick: false, visual: 'video-coral', url: null,
    creator: '示例影像频道', duration: '12:08', demo: true,
  },
];

export const libraryFilters = ['全部', 'VIDEO', 'ARTICLE', 'PDF', 'TOOL', 'JING PICKS'];
