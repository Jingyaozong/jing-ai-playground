import Link from 'next/link';
import { tools } from '../data/content';

const scenes = [
  {
    label: '规则与质检',
    questionLines: ['规则答疑后，', '如何复核结论？'],
    result: '把题目、实际回答、错误标签和人工裁决放在同一份记录里。',
    toolId: 'tool-021',
    noteHref: '/notes/synthetic-rule-knowledge-desk/',
    accent: 'mint',
    mark: '✓',
  },
  {
    label: '多模态评测',
    questionLines: ['视频问题出现在哪段？', '属于哪个维度？'],
    result: '按八维框架记录时间段、严重度、证据和复核状态。',
    toolId: 'tool-022',
    noteHref: '/notes/video-evaluation-eight-dimensions/',
    accent: 'yellow',
    mark: '◫',
  },
  {
    label: 'Agent 复核',
    questionLines: ['Agent 说完成了，', '证据在哪里？'],
    result: '沿着动作日志定位偏离，再把验收项与证据写进复核包。',
    toolId: 'tool-023',
    noteHref: '/notes/office-agent-trajectory-review/',
    accent: 'sky',
    mark: '↳',
  },
] as const;

export function ToolWorkScenes() {
  return (
    <section className="tool-work-scenes archive-shell" id="work-scenes" aria-labelledby="tool-work-scenes-title">
      <div className="tool-work-scenes-heading">
        <div>
          <p className="eyebrow mono">WORK DESKS / 工作场景</p>
          <h2 id="tool-work-scenes-title">先从手头的事，<br />找到工具。</h2>
        </div>
        <p>有些工作从一条规则、一个画面问题或一段动作日志开始。选中眼前的任务，再打开对应的记录台。</p>
      </div>
      <div className="tool-work-scenes-grid">
        {scenes.map((scene) => {
          const tool = tools.find((item) => item.id === scene.toolId);
          if (!tool?.href) return null;
          return (
            <article className={`tool-work-scene tool-work-scene-${scene.accent}`} key={scene.toolId}>
              <div className="tool-work-scene-top"><span className="mono">{scene.label}</span><span aria-hidden="true">{scene.mark}</span></div>
              <h3>{scene.questionLines.map((line) => <span key={line}>{line}</span>)}</h3>
              <p className="tool-work-scene-result"><span className="mono">留下什么</span>{scene.result}</p>
              <div className="tool-work-scene-links">
                <Link className="tool-work-scene-primary" href={tool.href}>打开{tool.label} <span aria-hidden="true">↗</span></Link>
                <Link className="tool-work-scene-note" href={scene.noteHref}>先看方法笔记 ↗</Link>
              </div>
            </article>
          );
        })}
      </div>
      <p className="tool-work-scenes-footnote">工具在浏览器本地运行；相关方法笔记为编辑稿，待荆确认。</p>
    </section>
  );
}
