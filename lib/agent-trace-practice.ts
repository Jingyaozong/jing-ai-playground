import type { AgentTrace } from './agent-trace-review';

export type TracePractice = {
  title: string; question: string; trace: AgentTrace;
  reference: { firstDeviation: string; evidence: string; uncertainty: string; retest: string };
};

// Independently authored teaching examples, not executions or anonymized client logs.
export const tracePractices: TracePractice[] = [
  {
    title: '文件整理', question: '目录整理好了，原件还在吗？',
    trace: {
      version: 1, kind: 'synthetic', caseId: 'PRACTICE-FILES-001',
      task: '独立虚构：把 inbox 中的 PDF 复制到 archive/pdf，保留原件；同名文件不得覆盖，先生成冲突清单。',
      acceptance: ['inbox 中所有原始文件保持不变。', '同名目标不被覆盖，冲突项进入清单。', '非冲突项复制后内容与原件一致，清单可复核。'],
      steps: [
        { id: 'F1', tool: 'list_files', status: 'ok', input: 'inbox 与 archive/pdf', output: 'inbox: a.pdf、b.pdf；archive/pdf: a.pdf（旧版）。' },
        { id: 'F2', tool: 'plan_operations', status: 'ok', input: '将 PDF 按扩展名归档', output: '计划 move a.pdf、b.pdf 到 archive/pdf；同名采用 overwrite。' },
        { id: 'F3', tool: 'move_file', status: 'ok', input: 'inbox/a.pdf → archive/pdf/a.pdf；overwrite=true', output: '日志声明：移动成功，目标被覆盖。' },
        { id: 'F4', tool: 'move_file', status: 'error', input: 'inbox/b.pdf → archive/pdf/b.pdf', output: '权限不足，移动失败。' },
        { id: 'F5', tool: 'final_response', status: 'ok', input: '根据操作返回汇报', output: '已整理 a.pdf；b.pdf 需要管理员处理。没有提供冲突清单。' },
      ],
    },
    reference: {
      firstDeviation: 'F2', evidence: 'F1 已发现同名冲突；F2 把“复制且不覆盖”改成“移动且覆盖”。F3 的成功返回不代表满足要求，F4 是另一个执行故障。',
      uncertainty: '日志声明发生覆盖，不等于已取得磁盘证据。这里只能记录风险；没有真实文件，不能确认损失范围或恢复结果。',
      retest: '在独立临时目录重建同名样本，先生成只读操作计划；冲突项不执行。核对源目录、目标哈希与清单，再验非冲突复制。',
    },
  },
  {
    title: 'PPT 交付', question: '导出成功，是否就能交付？',
    trace: {
      version: 1, kind: 'synthetic', caseId: 'PRACTICE-SLIDES-001',
      task: '独立虚构：交付一份可编辑的三页季度汇报 PPTX 和配套 PDF。必须包含概览、趋势、建议三页；保留趋势图数据来源，并检查导出后的文字遮挡。',
      acceptance: ['PPTX 可编辑，且与 PDF 均包含三页约定内容。', '趋势图保留数据来源。', '逐页检查 PDF 与 PPTX，无文字遮挡；未取得预览时不能判为通过。'],
      steps: [
        { id: 'P1', tool: 'read_brief', status: 'ok', input: '读取任务和三页结构', output: '三页：概览、趋势、建议。趋势数据来源：独立合成的 quarter-demo.csv。' },
        { id: 'P2', tool: 'create_deck', status: 'ok', input: '页1概览；页2趋势（含来源）；页3建议', output: '日志声明：生成三页可编辑 deck-demo.pptx。' },
        { id: 'P3', tool: 'export_pdf', status: 'ok', input: 'deck-demo.pptx；pages=[1,2]', output: '日志声明：导出 deck-demo.pdf，共 2 页。' },
        { id: 'P4', tool: 'render_preview', status: 'error', input: '预览 PPTX 与 PDF 的全部页面', output: '预览服务超时，未返回页面图像。' },
        { id: 'P5', tool: 'final_response', status: 'ok', input: '根据创建和导出状态汇报', output: 'PPT 与 PDF 均已完成，排版检查通过。' },
      ],
    },
    reference: {
      firstDeviation: 'P3', evidence: 'P3 参数只导出两页，已偏离三页要求。P4 是预览故障；P5 在没有图像证据时声称排版通过，是后续独立的未验证声明。',
      uncertainty: '日志不能证明 PPTX 真可编辑，也不能证明来源在最终画面可见。未取得实际产物时，这些项应记为无法判断，而非通过。',
      retest: '仅修正导出页范围后重导，核对两种文件的页数和内容；取得逐页预览检查遮挡，并实际打开 PPTX 检查图表及文字可编辑性。',
    },
  },
  {
    title: '数据分析', question: '总额算对了，平均值呢？',
    trace: {
      version: 1, kind: 'synthetic', caseId: 'PRACTICE-DATA-001',
      task: '独立虚构：只统计 paid 订单，排除 refunded。输出净销售额、有效订单数与客单价；客单价为纳入订单的金额合计除以同一批订单数。',
      acceptance: ['只纳入两条 paid 订单，总金额为 300 元。', '有效订单数为 2，客单价为 150 元；分子与分母范围一致。', '输出中披露筛选口径与计算过程，不用日志 OK 代替数值核对。'],
      steps: [
        { id: 'D1', tool: 'read_table', status: 'ok', input: '读取独立合成 orders.csv', output: 'A paid 100；B paid 200；C refunded 90。三行，无缺失。' },
        { id: 'D2', tool: 'filter_orders', status: 'ok', input: 'status=paid', output: 'A 100；B 200。共 2 行。' },
        { id: 'D3', tool: 'calculate_metrics', status: 'ok', input: 'sum=300（筛选后）；count=3（原表）；average=sum/count', output: '净销售额 300；有效订单数 3；客单价 100。' },
        { id: 'D4', tool: 'write_report', status: 'ok', input: '写入 D3 指标；说明：只统计 paid', output: '日志声明：报告保存成功。' },
        { id: 'D5', tool: 'final_response', status: 'ok', input: '汇报指标与筛选口径', output: '已按 paid 统计，净销售额 300，订单数 3，客单价 100。' },
      ],
    },
    reference: {
      firstDeviation: 'D3', evidence: 'D2 已筛出两行，D3 却使用原表三行作为分母。没有任何显式 error，仍然存在任务偏离；合计正确不能掩盖订单数和客单价错误。',
      uncertainty: '这份固定合成输入可以手算核对，不代表真实业务数据已经校验，也不能据此推断某个模型的准确率。',
      retest: '让分子、分母引用同一筛选结果，核对 300/2=150；追加零条有效订单样本，约定除零时显示不可计算，而非零元客单价。',
    },
  },
];
