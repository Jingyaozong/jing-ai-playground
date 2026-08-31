import Link from 'next/link';
import { tools } from '../data/content';

const stages = [
  {
    number: '01',
    label: 'DEVELOP',
    title: '故事与分镜',
    description: '先把想法变成可执行的镜头任务，再分配每一镜的职责和秒数。',
    toolIds: ['tool-001', 'tool-019', 'tool-002', 'tool-008'],
    note: '从一个故事种子开始',
  },
  {
    number: '02',
    label: 'ANCHOR',
    title: '角色与场景',
    description: '锁住不能漂移的人物与空间事实，并在生成前拆掉过载镜头。',
    toolIds: ['tool-004', 'tool-009', 'tool-014', 'tool-015', 'tool-016', 'tool-017', 'tool-005'],
    note: '先固定，再变化',
  },
  {
    number: '03',
    label: 'GENERATE',
    title: '生成与记录',
    description: '给风险分配候选和预算，保留每次生成、淘汰与采用的依据。',
    toolIds: ['tool-011', 'tool-010'],
    note: '每一次尝试都能复盘',
  },
  {
    number: '04',
    label: 'REVIEW',
    title: '声音与评审',
    description: '检查相邻镜头的接口，把声音拆成轨道，并估算真实审片产能。',
    toolIds: ['tool-007', 'tool-006', 'tool-003'],
    note: '画面通过，不等于作品完成',
  },
  {
    number: '05',
    label: 'DELIVER',
    title: '交付与发布',
    description: '从母版拆出发布规格，最后核对文件、字幕、授权和清单。',
    toolIds: ['tool-013', 'tool-012'],
    note: '发布版本来自干净母版',
  },
];

export function ToolWorkflowMap() {
  return (
    <section className="tool-workflow archive-shell" aria-labelledby="tool-workflow-title">
      <div className="tool-workflow-heading">
        <div>
          <p className="eyebrow mono">START HERE / AI VIDEO ROUTE</p>
          <h2 id="tool-workflow-title">不知道先用哪个？<br /><em>沿着制作路线走。</em></h2>
        </div>
        <p>这不是要求每个项目使用全部工具。先找到当前所在阶段，只打开眼下能减少一次返工的那一张表。</p>
      </div>

      <div className="tool-route" role="list" aria-label="AI 视频制作的五个阶段">
        {stages.map((stage, stageIndex) => {
          const stageTools = stage.toolIds.map((id) => tools.find((tool) => tool.id === id)).filter((tool) => Boolean(tool));
          return (
            <article className={`tool-route-stage tool-route-tone-${stageIndex}`} role="listitem" key={stage.number}>
              <div className="tool-route-index"><span className="mono">STAGE</span><strong>{stage.number}</strong><i aria-hidden="true" /></div>
              <div className="tool-route-copy"><span className="mono">{stage.label}</span><h3>{stage.title}</h3><p>{stage.description}</p></div>
              <div className="tool-route-links">
                {stageTools.map((tool, toolIndex) => tool && <Link href={tool.href ?? '/tools/'} key={tool.id} aria-label={`打开${tool.label}`}>
                  <span className="mono">{stage.number}.{toolIndex + 1}</span><strong>{tool.label}</strong><i>{tool.symbol}</i>
                </Link>)}
              </div>
              <small>{stage.note}</small>
            </article>
          );
        })}
      </div>

      <div className="tool-route-legend">
        <span className="mono">LOOP WHEN NEEDED</span>
        <p>风险预检、连续性检查和版本记录可以在每轮生成后重新打开；路线表示主要顺序，不是单向流水线。</p>
        <a href="#all-tools">查看全部 {tools.length} 个工具 ↓</a>
      </div>
    </section>
  );
}
