export function NoteVisual({ variant, label }: { variant: string; label: string }) {
  if (variant === 'synthetic-delivery') return (
    <div className="note-visual note-visual-delivery" aria-label={`${label}：六阶段虚构项目工作单`}>
      <small className="mono">SYNTHETIC CASE / 虚构演练</small>
      <strong>先试标，<br />再放量。</strong>
      <ol>{['需求确认', '执行方案', '小批试标', '团队配置', '培训放量', '终检交付'].map((stage) => <li key={stage}>{stage}</li>)}</ol>
      <p>方法可展示 · 项目独立虚构</p>
    </div>
  );
  if (variant === 'memory-preflight') return (
    <div className="note-visual note-visual-memory-preflight" aria-label={`${label} 的信件准备单示意，所有动作测试待执行`}>
      <small>写给下一次生成</small><div className="preflight-letter"><b>先备齐，<br />再出发。</b><p>人物与道具参照</p><p>文字与声音位置</p><p>02 · 07 · 11 三镜测试</p></div><span>准备单 · 无视频结果</span>
    </div>
  );
  if (variant === 'prompt-comparison') return (
    <div className="note-visual note-visual-prompt-comparison" aria-label={`${label} 的比较协议示意，不是评测结果`}>
      <small className="mono">SAME TASK / ONE CHANGE</small>
      <div className="comparison-tracks"><div><b>A</b><span>基线描述</span></div><div><b>B</b><span>只加一项条件</span></div></div>
      <p>同一任务 · 同一把尺子</p><small>比较方案 · 待执行</small>
    </div>
  );
  return (
    <div className={`note-visual note-visual-${variant}`} aria-label={`${label} 的文章封面`}>
      <span className="note-visual-grid" />
      <span className="note-visual-orbit" />
      <span className="note-visual-mark">J</span>
      <small className="mono">JING NOTES</small>
    </div>
  );
}
