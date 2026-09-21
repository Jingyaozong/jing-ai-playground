import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../../components/site-header';
import { SiteFooter } from '../../components/site-footer';
import { AgentTraceDesk } from '../../components/agent-trace-desk';
import { AgentTraceVisual } from '../../components/agent-trace-visual';
import './agent-trace-review.css';

export const metadata: Metadata = {
  title: 'Agent 轨迹复核台 — JING AI PLAYGROUND',
  description: '本地解析办公 Agent 动作日志，定位首个偏离、记录产物验收，导出可恢复的人工复核包。',
};

export default function AgentTraceReviewPage() {
  return <main className="agent-trace-page"><SiteHeader active="Tools" />
    <header className="tool-detail-hero agent-trace-hero"><div className="tool-detail-topline mono"><Link href="/tools/#all-tools">← 返回工具箱</Link><span>JING TOOL / 023</span></div>
      <div className="agent-trace-intro"><div><p className="eyebrow mono">Agent trace review / 轨迹复核台</p><h1><span>找准一步，</span><span>才改得动。</span></h1><p>把输入、调用、返回与产物放在一起。找到任务从哪里开始偏离，留下证据，再决定怎样复验。</p><Link href="/notes/office-agent-trajectory-review/">先读过程评估方法 ↗</Link></div><AgentTraceVisual /></div>
    </header>
    <div className="tool-detail-shell"><AgentTraceDesk /><aside className="trace-method-link"><span className="mono">KEEP THE LOOP OPEN</span><h2>一条轨迹，<br />回到一套方法。</h2><p>继续阅读评估集设计、失败分类与报告口径，再把单条记录带回问题复盘。</p><nav><Link href="/notes/office-agent-trajectory-review/">办公 Agent 过程评估 ↗</Link><Link href="/notes/bad-case-review-loop/">Bad Case 复验闭环 ↗</Link></nav></aside></div>
    <SiteFooter />
  </main>;
}
