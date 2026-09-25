import { needsOriginalEvidence } from '../data/experiment-export-boundary';

type RecordEvidenceReminderProps = {
  status: string;
  asset: string;
};

export function RecordEvidenceReminder({ status, asset }: RecordEvidenceReminderProps) {
  if (!needsOriginalEvidence(status, asset)) return null;

  return (
    <div className="experiment-evidence-reminder" role="status">
      <strong>先补原始素材</strong>
      <p>这格已标为完成复核，但还没有结果文件或原始输出链接。请先填写并核对素材；当前状态只是本机记录，不是已核验的公开结论。</p>
    </div>
  );
}
