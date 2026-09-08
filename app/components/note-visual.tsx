export function NoteVisual({ variant, label }: { variant: string; label: string }) {
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
