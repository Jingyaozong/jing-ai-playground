type DraftRecord = {
  id: string | number;
  group: string;
  status: 'untested' | 'generated' | 'reviewed';
  scores: Record<string, number | null>;
};

type PlainObject = Record<string, unknown>;

function isObject(value: unknown): value is PlainObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function restoreField(saved: unknown, fallback: unknown, key: string): unknown {
  if (key === 'status') {
    return saved === 'untested' || saved === 'generated' || saved === 'reviewed' ? saved : undefined;
  }
  if (key === 'scores') {
    if (!isObject(saved) || !isObject(fallback)) return undefined;
    if (Object.keys(saved).some((scoreKey) => !Object.hasOwn(fallback, scoreKey))) return undefined;
    const scores: Record<string, number | null> = {};
    for (const scoreKey of Object.keys(fallback)) {
      if (!Object.hasOwn(saved, scoreKey)) return undefined;
      const score = saved[scoreKey];
      if (score !== null && (!Number.isInteger(score) || (score as number) < 1 || (score as number) > 5)) return undefined;
      scores[scoreKey] = score as number | null;
    }
    return scores;
  }
  if (Array.isArray(fallback)) {
    if (!Array.isArray(saved)) return undefined;
    if (key === 'checkpoints') {
      if (saved.length !== fallback.length) return undefined;
      const checkpoints: PlainObject[] = [];
      for (let index = 0; index < fallback.length; index++) {
        const original = fallback[index];
        const candidate = saved[index];
        if (!isObject(original) || !isObject(candidate) || candidate.point !== original.point
          || Object.keys(candidate).some((field) => !Object.hasOwn(original, field))
          || !['frame', 'umbrella', 'waterline'].every((field) => Object.hasOwn(candidate, field) && typeof candidate[field] === 'string')) return undefined;
        checkpoints.push({ point: original.point, frame: candidate.frame, umbrella: candidate.umbrella, waterline: candidate.waterline });
      }
      return checkpoints;
    }
    return saved.every((item) => typeof item === 'string') ? [...saved] : undefined;
  }
  if (typeof fallback === 'string') return typeof saved === 'string' ? saved : undefined;
  return undefined;
}

export function restoreExperimentRecordDraft<T extends DraftRecord>(value: unknown, defaults: T[]): T[] | null {
  if (!Array.isArray(value) || value.length !== defaults.length) return null;
  const savedById = new Map<string | number, PlainObject>();
  for (const item of value) {
    if (!isObject(item) || (typeof item.id !== 'string' && typeof item.id !== 'number') || savedById.has(item.id)) return null;
    savedById.set(item.id, item);
  }

  const restored: T[] = [];
  for (const fallback of defaults) {
    const saved = savedById.get(fallback.id);
    if (!saved || saved.group !== fallback.group
      || Object.keys(saved).some((key) => !Object.hasOwn(fallback, key))
      || ('task' in fallback && saved.task !== fallback.task)
      || ('poster' in fallback && saved.poster !== fallback.poster)) return null;
    const row: PlainObject = { ...fallback };
    for (const [key, original] of Object.entries(fallback)) {
      if (!Object.hasOwn(saved, key)) return null;
      if (key === 'id' || key === 'group' || key === 'task' || key === 'poster') continue;
      const field = restoreField(saved[key], original, key);
      if (field === undefined) return null;
      row[key] = field;
    }
    restored.push(row as T);
  }
  return restored;
}
