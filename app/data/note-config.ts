import type { NoteCategory } from '../../lib/notes';

export const noteCategories: Array<{
  id: NoteCategory;
  chinese: string;
  description: string;
  color: string;
}> = [
  { id: 'AI TIPS', chinese: 'AI 使用技巧', description: 'Prompt、镜头、人物和各种真正能用上的小技巧。', color: 'yellow' },
  { id: 'AI EVAL', chinese: 'AI / AIGC 评测', description: '从视频八维到 Agent 轨迹，把判断落在可复核的证据上。', color: 'blue' },
  { id: 'MAKING OF', chinese: '创作幕后', description: '剧本、分镜、人设、工作流，以及翻车以后怎么改。', color: 'coral' },
  { id: 'AI BRIEFING', chinese: 'AI 信息精选', description: '看过大量信息以后，只留下真正值得关注的部分。', color: 'sky' },
];

export const noteFilters = ['全部', 'AI VIDEO', 'PROMPT', 'EVALUATION', 'AIGC', 'IMAGE', 'TOOLS'];
