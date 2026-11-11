// 笔记封面：统一的简洁色块加标题，不再使用装饰性占位图。
export function NoteVisual({ label }: { variant?: string; label: string }) {
  return <div className="note-cover" aria-hidden="true"><span>{label}</span></div>;
}
