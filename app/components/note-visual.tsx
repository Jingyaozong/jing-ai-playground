export function NoteVisual({ variant, label }: { variant: string; label: string }) {
  return (
    <div className={`note-visual note-visual-${variant}`} aria-label={`${label} 的文章封面`}>
      <span className="note-visual-grid" />
      <span className="note-visual-orbit" />
      <span className="note-visual-mark">J</span>
      <small className="mono">JING NOTES</small>
    </div>
  );
}
