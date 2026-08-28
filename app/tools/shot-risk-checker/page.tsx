import type { Metadata } from 'next';
import Link from 'next/link';
import { ShotRiskChecker } from '../../components/shot-risk-checker';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: 'AI 视频镜头风险预检器 — JING AI PLAYGROUND',
  description: '用透明规则检查镜头时长、动作数量、运镜冲突与首尾帧差异，并给出减项或拆镜建议。',
};

export default function ShotRiskCheckerPage() {
  return (
    <main>
      <SiteHeader active="Tools" />
      <header className="tool-detail-hero risk-detail-hero">
        <div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / 005</span></div>
        <div className="tool-detail-title">
          <div><p className="eyebrow mono">Shot pre-flight / 镜头预检</p><h1>生成以前，<br /><em>先给镜头减负。</em></h1></div>
          <p>检查短镜头里同时发生了多少变化，提前发现时长、运镜、首尾帧和身份一致性之间的结构冲突。</p>
        </div>
      </header>

      <div className="tool-detail-shell risk-detail-shell">
        <ShotRiskChecker />
        <section className="risk-rule-note">
          <div><span className="mono">OPEN RULES / 透明规则</span><h2>预警来自条件，<br />不是神秘分数。</h2></div>
          <p>所有结论都能在右侧看到触发原因与修改动作。工具不会根据模型名称伪造成功率；正式生成后仍应保存样本，用真实结果校准自己的工作流。</p>
          <Link href="/notes/first-last-frame-motion-prompt/">阅读首尾帧与运动分工 ↗</Link>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
