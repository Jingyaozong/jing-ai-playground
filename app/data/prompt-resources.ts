export type PromptResource = {
  id: string;
  title: string;
  source: string;
  type: 'GUIDE' | 'GALLERY' | 'VIDEO';
  description: string;
  whyItMatters: string;
  tags: string[];
  url: string;
};

export const promptResources: PromptResource[] = [
  {
    id: 'openai-prompting-best-practices',
    title: 'ChatGPT Prompt 编写最佳实践',
    source: 'OpenAI Help Center',
    type: 'GUIDE',
    description: '从清楚具体、补足上下文到根据结果反复修改，适合第一次系统整理自己的提问方式。',
    whyItMatters: '内容短、门槛低，最适合用来检查一条 Prompt 的基本质量。',
    tags: ['ChatGPT', '入门', '迭代'],
    url: 'https://help.openai.com/en/articles/10032626-how-do-i-prompt-chatgpt-effectively',
  },
  {
    id: 'anthropic-prompt-engineering-overview',
    title: 'Claude Prompt Engineering Overview',
    source: 'Anthropic / Claude Docs',
    type: 'GUIDE',
    description: '把 Prompt 优化放在“先定义成功标准、再测试”的框架里，并连接到示例、结构化和 Prompt chaining 等专题。',
    whyItMatters: '它提醒读者：不是每个问题都应该靠堆 Prompt 解决，先定义什么叫成功更重要。',
    tags: ['Claude', '评估', 'Prompt chaining'],
    url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview',
  },
  {
    id: 'google-prompt-design-strategies',
    title: 'Gemini Prompt Design Strategies',
    source: 'Google AI for Developers',
    type: 'GUIDE',
    description: '覆盖清晰指令、示例、拆分复杂任务、多模态输入、参数和迭代策略，并提供模型相关注意事项。',
    whyItMatters: '适合需要处理图片、视频或长上下文时查阅，不只讨论纯文字问答。',
    tags: ['Gemini', '多模态', '结构化'],
    url: 'https://ai.google.dev/gemini-api/docs/prompting-strategies',
  },
  {
    id: 'google-prompt-gallery',
    title: 'Gemini Prompt Gallery',
    source: 'Google AI Studio',
    type: 'GALLERY',
    description: '包含视频问答、图片识别、研究助手、结构化 JSON、教学与代码等可交互示例。',
    whyItMatters: '当你不知道 Prompt 应该长什么样时，先从真实任务示例反向拆解最有效。',
    tags: ['示例库', '多模态', 'Google AI Studio'],
    url: 'https://ai.google.dev/gemini-api/prompts',
  },
  {
    id: 'anthropic-prompting-deep-dive',
    title: 'AI Prompt Engineering: A Deep Dive',
    source: 'Anthropic / YouTube',
    type: 'VIDEO',
    description: 'Anthropic 团队讨论 Prompt 如何迭代、角色与隐喻、模型推理，以及 Prompt engineering 未来会如何变化。',
    whyItMatters: '比技巧清单更接近“为什么这样问”，适合想理解 Prompt 方法论的人。',
    tags: ['视频', '方法论', 'Anthropic'],
    url: 'https://www.youtube.com/watch?v=T9aRN5JkmL8',
  },
];
