import type { Metadata } from 'next';
import Link from 'next/link';
import { ShotRhythmPlanner } from '../../components/shot-rhythm-planner';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: '镜头节奏规划器 — JING AI PLAYGROUND',
  description: '按镜头职责分配段落时长，用可伸缩时间带检查超时、留白与过度平均的镜头节奏。',
};

export default function ShotRhythmPlannerPage() {
  return (
    <main>
      <SiteHeader active="Tools" />
      <header className="tool-detail-hero rhythm-detail-hero">
        <div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / 008</span></div>
        <div className="tool-detail-title">
          <div><p className="eyebrow mono">Shot rhythm planner / 节奏草剪</p><h1>别让每镜同速，<br /><em>给变化留出呼吸。</em></h1></div>
          <p>输入段落目标时长，为每镜安排职责与秒数。时间带会按实际长度展开，帮你在生成素材前先看见节奏。</p>
        </div>
      </header>

      <div className="tool-detail-shell rhythm-detail-shell">
        <ShotRhythmPlanner />
        <section className="rhythm-method-note">
          <div><span className="mono">CUT BEFORE GENERATE / 先草剪</span><h2>秒数不是答案，<br />它是镜头任务的结果。</h2></div>
          <p>工具只检查可见的时长差异、镜头职责和段落总长。它不会判断表演是否成立，也不会替你决定最佳切点；最终仍要把真实画面与声音放进时间线验收。</p>
          <Link href="/notes/ai-video-shot-rhythm/">阅读完整镜头节奏方法 ↗</Link>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
