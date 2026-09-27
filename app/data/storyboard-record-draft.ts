type DraftRow = {
  id: string;
  group: string;
  task: string;
  status: 'untested' | 'generated' | 'reviewed';
  model: string;
  asset: string;
  shotCount: string;
  duration: string;
  scores: Record<string, number | null>;
  failures: string[];
  note: string;
};

export function restoreStoryboardDraft<T extends DraftRow>(value: unknown, defaults: T[]): T[] | null {
  if (!Array.isArray(value) || value.length !== defaults.length) return null;
  const rows = new Map<string, T>();
  for (const item of value) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
    const record = item as Partial<T>;
    if (typeof record.id !== 'string' || rows.has(record.id)) return null;
    rows.set(record.id, record as T);
  }

  const restored: T[] = [];
  for (const fallback of defaults) {
    const saved = rows.get(fallback.id);
    if (!saved || saved.group !== fallback.group || saved.task !== fallback.task
      || !['untested', 'generated', 'reviewed'].includes(saved.status)
      || ![saved.model, saved.asset, saved.shotCount, saved.duration, saved.note].every((field) => typeof field === 'string')
      || !Array.isArray(saved.failures) || !saved.failures.every((failure) => typeof failure === 'string')
      || !saved.scores || typeof saved.scores !== 'object' || Array.isArray(saved.scores)) return null;

    const scores: Record<string, number | null> = {};
    for (const key of Object.keys(fallback.scores)) {
      const score = saved.scores[key];
      if (score !== null && (!Number.isInteger(score) || score < 1 || score > 5)) return null;
      scores[key] = score;
    }
    restored.push({
      ...fallback,
      status: saved.status,
      model: saved.model,
      asset: saved.asset,
      shotCount: saved.shotCount,
      duration: saved.duration,
      scores: scores as T['scores'],
      failures: [...saved.failures],
      note: saved.note,
    });
  }
  return restored;
}
