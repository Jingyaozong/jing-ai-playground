export function NoteVisual({ variant, label }: { variant: string; label: string }) {
  const checksheets: Record<string, { heading: [string, string]; items: string[]; footer: string }> = {
    'rule-desk-checksheet': { heading: ['先查规则，', '再给答案。'], items: ['有据：回答', '缺项：澄清', '冲突：转人工', '高风险：转人工'], footer: '虚构方案 · 未接入模型' },
    'evaluation-checksheet': { heading: ['分开看，', '才评得清。'], items: ['语义遵循', '基础画质', '美学表现', '主体场景', '时序动作', '结构物理', '镜头叙事', '音画安全'], footer: '八维检查 · 非评分结果' },
    'review-checksheet': { heading: ['记下问题，', '回到复验。'], items: ['记录证据', '确认原因', '修改规则', '同步团队', '重新验证'], footer: '问题闭环 · 非项目成果' },
    'delivery-checksheet': { heading: ['能打开，', '还不够。'], items: ['格式校验', '有效性检查', '质量复核', '版本追溯'], footer: '交付关口 · 非验收记录' },
  };
  const checksheet = checksheets[variant];
  if (checksheet) return (
    <div className={`note-visual note-visual-checksheet note-visual-${variant}`} aria-label={`${label}的方法检查表示意`}>
      <small className="mono">METHOD NOTES / 方法笔记</small>
      <strong>{checksheet.heading[0]}<br />{checksheet.heading[1]}</strong>
      <ul>{checksheet.items.map((item) => <li key={item}>{item}</li>)}</ul>
      <p>{checksheet.footer}</p>
    </div>
  );
  if (variant === 'synthetic-delivery') return (
    <div className="note-visual note-visual-delivery" aria-label={`${label}：六阶段虚构项目工作单`}>
      <small className="mono">SYNTHETIC CASE / 虚构演练</small>
      <strong>先试标，<br />再放量。</strong>
      <ol>{['需求确认', '执行方案', '小批试标', '团队配置', '培训放量', '终检交付'].map((stage) => <li key={stage}>{stage}</li>)}</ol>
      <p>方法可展示 · 项目独立虚构</p>
    </div>
  );
  if (variant === 'memory-preflight') return (
    <div className="note-visual note-visual-memory-preflight" aria-label={`${label} 的信件准备单示意，所有动作测试待执行`}>
      <small>写给下一次生成</small><div className="preflight-letter"><b>先备齐，<br />再出发。</b><p>人物与道具参照</p><p>文字与声音位置</p><p>02 · 07 · 11 三镜测试</p></div><span>准备单 · 无视频结果</span>
    </div>
  );
  if (variant === 'prompt-comparison') return (
    <div className="note-visual note-visual-prompt-comparison" aria-label={`${label} 的比较协议示意，不是评测结果`}>
      <small className="mono">SAME TASK / ONE CHANGE</small>
      <div className="comparison-tracks"><div><b>A</b><span>基线描述</span></div><div><b>B</b><span>只加一项条件</span></div></div>
      <p>同一任务 · 同一把尺子</p><small>比较方案 · 待执行</small>
    </div>
  );
  return (
    <div className={`note-visual note-visual-${variant}`} aria-label={`${label} 的文章封面`}>
      <span className="note-visual-grid" />
      <span className="note-visual-orbit" />
      <span className="note-visual-mark">J</span>
      <small className="mono">JING NOTES</small>
    </div>
  );
}
