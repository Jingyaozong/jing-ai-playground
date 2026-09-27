export const localRecordBackupFilename = 'jing-experiment-record-original.txt';

export function createLocalRecordBackup(source: string): Blob {
  return new Blob([source], { type: 'text/plain;charset=utf-8' });
}
