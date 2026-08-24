export function ProjectVisual({ variant, label }: { variant: string; label: string }) {
  return (
    <div className={`project-visual visual-${variant}`} aria-label={`${label} 概念占位视觉`}>
      <span className="visual-shape shape-a" />
      <span className="visual-shape shape-b" />
      <span className="visual-shape shape-c" />
      <span className="grain" />
      <span className="visual-caption mono">Concept visual</span>
    </div>
  );
}
