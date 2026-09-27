export function writeLocalRecordSnapshot(storage: Pick<Storage, 'setItem'>, key: string, snapshot: string): boolean {
  try {
    storage.setItem(key, snapshot);
    return true;
  } catch {
    return false;
  }
}
