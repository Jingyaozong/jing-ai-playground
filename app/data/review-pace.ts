export type ReviewPaceInputs = {
  reviewers: number;
  workDays: number;
  hoursPerDay: number;
  regularMinutes: number;
  highRiskShare: number;
  highRiskMinutes: number;
  reworkRate: number;
};

export type ReviewPaceResult = {
  daily: number;
  total: number;
  perPerson: number;
  regularItems: number;
  highRiskItems: number;
  weightedMinutes: number;
  reservedHours: number;
};

export function calculateReviewPace(input: ReviewPaceInputs): ReviewPaceResult {
  const { reviewers, workDays, hoursPerDay, regularMinutes, highRiskShare, highRiskMinutes, reworkRate } = input;
  if (![reviewers, workDays, hoursPerDay, regularMinutes, highRiskShare, highRiskMinutes, reworkRate].every(Number.isFinite)
    || reviewers <= 0 || workDays <= 0 || hoursPerDay <= 0 || regularMinutes <= 0 || highRiskMinutes <= 0
    || highRiskShare < 0 || highRiskShare > 100 || reworkRate < 0 || reworkRate >= 100) {
    throw new RangeError('排期输入必须为有效的正数与百分比');
  }

  const highRiskFraction = highRiskShare / 100;
  const weightedMinutes = regularMinutes * (1 - highRiskFraction) + highRiskMinutes * highRiskFraction;
  const teamMinutesPerDay = reviewers * hoursPerDay * 60;
  const usableMinutesPerDay = teamMinutesPerDay * (1 - reworkRate / 100);
  const daily = Math.floor(usableMinutesPerDay / weightedMinutes);
  const total = Math.floor(usableMinutesPerDay * workDays / weightedMinutes);
  const highRiskItems = Math.round(total * highRiskFraction);

  return {
    daily,
    total,
    perPerson: Math.floor(usableMinutesPerDay / reviewers / weightedMinutes),
    regularItems: total - highRiskItems,
    highRiskItems,
    weightedMinutes,
    reservedHours: teamMinutesPerDay * workDays * reworkRate / 100 / 60,
  };
}

export function formatReviewPaceSummary(input: ReviewPaceInputs, result: ReviewPaceResult): string {
  return [
    '评测排期估算 · 待试标校准',
    `团队：${input.reviewers} 人；周期：${input.workDays} 个工作日；有效工时：${input.hoursPerDay} 小时/人/天`,
    `常规样本：约 ${100 - input.highRiskShare}%，${input.regularMinutes} 分钟/条`,
    `高风险与争议样本：约 ${input.highRiskShare}%，${input.highRiskMinutes} 分钟/条（含计划内逐条复核）`,
    `额外返修缓冲：${input.reworkRate}% 团队有效工时`,
    `加权单条耗时：${result.weightedMinutes.toFixed(1)} 分钟`,
    `预计日处理量：${result.daily} 条；周期处理量：${result.total} 条（余量跨日累计）`,
    `周期结构估算：常规约 ${result.regularItems} 条，高风险约 ${result.highRiskItems} 条`,
    `预留返修时间：${result.reservedHours.toFixed(1)} 团队小时`,
    '人数按共享团队池估算，未拆新人和骨干排班。仅用于计划讨论；未执行试标、质检或交付验收。',
  ].join('\n');
}
