type ScoredRecord = {
  id: string | number;
  scores: Record<string, number | null>;
};

// Scoring and review status are separate user decisions.
export function updateRecordScore<T extends ScoredRecord>(
  records: T[],
  activeId: T['id'],
  key: keyof T['scores'],
  value: number | null,
): T[] {
  return records.map((record) => record.id === activeId
    ? { ...record, scores: { ...record.scores, [key]: value } }
    : record);
}
