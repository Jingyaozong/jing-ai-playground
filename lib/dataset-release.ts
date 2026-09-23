export const releaseGates = [
  {
    id: 'format', title: '格式', cue: '先让接收方读得懂',
    checks: [
      { id: 'schema', label: '必填字段、类型、枚举与唯一 ID 符合约定' },
      { id: 'relations', label: '文件格式可读取，图片、文本与标注关联正确' },
    ],
  },
  {
    id: 'validity', title: '有效性', cue: '每条数据都有去向',
    checks: [
      { id: 'quarantine', label: '空值、重复、损坏与待复核样本已隔离并留因' },
      { id: 'reconcile', label: '原始、可交付、待修复与排除数量可以对账' },
    ],
  },
  {
    id: 'quality', title: '质量', cue: '把风险留在交付前',
    checks: [
      { id: 'review', label: '高风险与争议样本已逐条复核，普通样本按约定抽检' },
      { id: 'retest', label: '返修已复验，未关闭问题有明确处置' },
    ],
  },
  {
    id: 'trace', title: '可追溯', cue: '交出去也能找回来',
    checks: [
      { id: 'versions', label: '批次、规则版本、生产与验收时间可追溯' },
      { id: 'manifest', label: '文件清单、数量、校验值与例外记录已准备' },
    ],
  },
] as const;

export type ReleaseCheckId = (typeof releaseGates)[number]['checks'][number]['id'];
export type ReleaseCheckStatus = 'unchecked' | 'verified' | 'needs-work';
export type ReleaseEntry = { status: ReleaseCheckStatus; evidence: string };
export type ReleaseRecord = {
  dataset: string;
  batch: string;
  ruleVersion: string;
  checks: Record<ReleaseCheckId, ReleaseEntry>;
  synthetic?: boolean;
};

export function blankReleaseRecord(): ReleaseRecord {
  return {
    dataset: '', batch: '', ruleVersion: '',
    checks: Object.fromEntries(releaseGates.flatMap((gate) => gate.checks.map((check) => [check.id, { status: 'unchecked', evidence: '' }]))) as Record<ReleaseCheckId, ReleaseEntry>,
  };
}

// A branch of the already published fictional “纸舟” exercise, paused at B02's
// first QC failure. No file, sample or verification below exists in real life.
export function paperBoatB02Practice(): ReleaseRecord {
  return {
    dataset: '纸舟 · 合成客服意图标注（虚构演练）',
    batch: 'B02 · 首检冻结版（模拟）',
    ruleVersion: 'v0.2（模拟）',
    synthetic: true,
    checks: {
      schema: { status: 'verified', evidence: '模拟设定：字段、枚举和唯一 ID 已按 v0.2 对照；没有真实文件。' },
      relations: { status: 'verified', evidence: '模拟设定：对话、证据片段与标签关联表已检查；没有真实附件。' },
      quarantine: { status: 'verified', evidence: '模拟设定：空值与待裁决样本不进入 B02 冻结集合。' },
      reconcile: { status: 'verified', evidence: '模拟设定：B02 冻结集合为 500 条；仅作案例中的对账口径。' },
      review: { status: 'needs-work', evidence: '模拟首检 100 条：普通不合格 4，约定最多 2；关键错误 0。暂停 B02 放行。' },
      retest: { status: 'unchecked', evidence: '模拟时点：返修与独立复检尚未执行，不能预填通过。' },
      versions: { status: 'unchecked', evidence: '模拟时点：已有批次与规则版本；生产和验收时间仍待记录。' },
      manifest: { status: 'unchecked', evidence: '模拟时点：交付文件尚未冻结，不伪造数量校验或 SHA-256。' },
    },
  };
}

export function isBlankReleaseRecord(record: ReleaseRecord) {
  return !record.dataset.trim() && !record.batch.trim() && !record.ruleVersion.trim()
    && releaseGates.every((gate) => gate.checks.every((check) => record.checks[check.id].status === 'unchecked' && !record.checks[check.id].evidence.trim()));
}

export function assessRelease(record: ReleaseRecord) {
  const missingIdentity = (['dataset', 'batch', 'ruleVersion'] as const).filter((key) => !record[key].trim());
  const checks = releaseGates.flatMap((gate) => gate.checks.map((check) => {
    const entry = record.checks[check.id];
    return { ...check, gate: gate.title, status: entry.status, evidence: entry.evidence.trim(), complete: entry.status === 'verified' && !!entry.evidence.trim() };
  }));
  const blocked = checks.filter((check) => check.status === 'needs-work');
  const pending = checks.filter((check) => !check.complete && check.status !== 'needs-work');
  return { missingIdentity, checks, blocked, pending, readyForHumanApproval: missingIdentity.length === 0 && blocked.length === 0 && pending.length === 0 };
}

const oneLine = (value: string) => value.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();

export function releaseReport(record: ReleaseRecord) {
  const result = assessRelease(record);
  const state = result.readyForHumanApproval ? '记录齐备 · 待人工批准' : result.blocked.length ? '暂勿交付 · 有待处理项' : '待核实 · 不可据此交付';
  return [
    record.synthetic ? '# 虚构演练 · 数据交付四关自检记录' : '# 数据交付四关自检记录', '',
    '状态：' + state,
    record.synthetic
      ? '说明：纸舟 B02 是完全虚构的练习。所有“已核实”只是情境设定，没有真实文件、抽检或客户验收；不得作为实际交付记录。'
      : '说明：这是人工填写的自检记录；工具不读取数据文件、不验证证据真伪、不代表客户验收或批准发布。', '',
    `数据集：${oneLine(record.dataset) || '未填'}`,
    `批次：${oneLine(record.batch) || '未填'}`,
    `规则版本：${oneLine(record.ruleVersion) || '未填'}`, '',
    ...releaseGates.flatMap((gate) => [
      `## ${gate.title}`, '',
      ...gate.checks.map((check) => {
        const entry = record.checks[check.id];
        const label = entry.status === 'needs-work' ? '需处理' : entry.status === 'verified' && entry.evidence.trim() ? '已核实（人工记录）' : '待核实';
        return `- ${check.label}：${label}；依据/待办：${oneLine(entry.evidence) || '未填'}`;
      }), '',
    ]),
    '下一步：由有权限的负责人对照实际文件、抽检记录与未关闭问题人工复核并决定是否放行。',
  ].join('\n');
}
