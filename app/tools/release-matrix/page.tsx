import type { Metadata } from 'next';
import Link from 'next/link';
import { ReleaseMatrixPlanner } from '../../components/release-matrix-planner';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: '多平台发布规格规划器 — JING AI PLAYGROUND',
  description: '从一个视频母版规划横版、竖版、方版与短版输出，估算画幅裁切、时长调整、安全区、字幕和音频交付要求。',
};

export default function ReleaseMatrixPage() {
  return (
    <main>
      <SiteHeader active="Tools" />
      <header className="tool-detail-hero release-detail-hero">
        <div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / 013</span></div>
        <div className="tool-detail-title">
          <div><p className="eyebrow mono">Release matrix / 发布拆版</p><h1>一支母版，<br /><em>不是所有屏幕的答案。</em></h1></div>
          <p>录入当前发布位置的真实要求，查看画幅裁切和时长差异，再生成横版、竖版、方版与短版的输出矩阵。</p>
        </div>
      </header>
      <div className="tool-detail-shell release-detail-shell">
        <ReleaseMatrixPlanner />
        <section className="release-method-note">
          <div><span className="mono">RULES EXPIRE / 规则会过期</span><h2>保留母版，<br />每次发布重新核对。</h2></div>
          <p>工具不内置任何平台的永久规格，也不会上传、裁切或检查视频。发布当天应重新查看目标平台的官方帮助页，并用真实账号、设备和成片做一次私密测试。</p>
          <Link href="/notes/multi-platform-video-export/">阅读完整多平台拆版方法 ↗</Link>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
