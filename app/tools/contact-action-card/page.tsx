import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactActionCardBuilder } from '../../components/contact-action-card-builder';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: '接触动作拆分卡 — JING AI PLAYGROUND',
  description: '把手、物体、接触点和承重点拆成五个阶段，生成接触链 Prompt、九格变量矩阵与逐阶段验收表。',
};

export default function ContactActionCardPage() {
  return (
    <main>
      <SiteHeader active="Tools" />
      <header className="tool-detail-hero contact-action-hero">
        <div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / 017</span></div>
        <div className="tool-detail-title">
          <div><p className="eyebrow mono">Contact action card / 接触链</p><h1>手先碰到，<br /><em>物体才知道要动。</em></h1></div>
          <p>把“拿起来”拆成接近、预接触、闭合、承重移动和结束状态。先确认因果顺序，再生成 Prompt 与验收文件。</p>
        </div>
      </header>

      <div className="tool-detail-shell contact-action-shell">
        <ContactActionCardBuilder />
        <section className="contact-action-method">
          <div><span className="mono">CONTACT BEFORE MOTION / 先接触</span><h2>先让关系成立，<br />再让动作变复杂。</h2></div>
          <p>工具不会读取图片、生成视频或判断手部是否正确。它只把可见关系整理成测试文件。基础触碰仍失败时，应先换干净首帧、放大接触区域或简化抓握，而不是继续叠加喝水、转身和运镜。</p>
          <nav><Link href="/notes/ai-video-hand-object-contact/">阅读完整接触方法 ↗</Link><Link href="/experiments/can-one-hand-lift-the-same-cup/">打开九格接触实验 ↗</Link><Link href="/stories/objects-remember-the-last-sentence/">查看故事中的接触镜头 ↗</Link><Link href="/tools/shot-risk-checker/">进行镜头风险预检 ↗</Link></nav>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
