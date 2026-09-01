import type { Metadata } from 'next';
import Link from 'next/link';
import { WaterlineMotionCardBuilder } from '../../components/waterline-motion-card-builder';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: '水线动作卡 — JING AI PLAYGROUND',
  description: '把伞的锁定时刻、水线方向、机位与环境常量拆开，生成五点动作账本、视频 Prompt、负面约束与验收清单。',
};

export default function WaterlineMotionCardPage() {
  return (
    <main>
      <SiteHeader active="Tools" />
      <header className="tool-detail-hero waterline-card-hero">
        <div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / 020</span></div>
        <div className="tool-detail-title">
          <div><p className="eyebrow mono">Waterline motion card / 因果动作闸门</p><h1>别让水抢跑，<br /><em>先给动作立闸。</em></h1></div>
          <p>先写清伞何时完全锁定，再允许水线从固定起点向固定终点移动。五点账本会把一句“随后退去”变成可以逐帧核对的动作协议。</p>
        </div>
      </header>

      <div className="tool-detail-shell waterline-card-shell">
        <WaterlineMotionCardBuilder />
        <section className="waterline-card-method">
          <div><span className="mono">LOCK → HOLD → MOVE / 先后不是同时</span><h2>因果关系，<br />要留下可见间隔。</h2></div>
          <p>工具只整理待测试的镜头条件，不调用视频模型，也不会把 Prompt 当作结果。生成以后仍需逐帧填写真实的伞锁定帧、水首动帧和失败标签。</p>
          <nav><Link href="/notes/causal-motion-five-point-ledger/">阅读五点账本方法 ↗</Link><Link href="/experiments/can-water-recede-after-the-umbrella-opens/">查看配套九格实验 ↗</Link><Link href="/stories/before-the-water-recedes/">返回《退水以前》 ↗</Link><Link href="/tools/shot-prompt-builder/">继续组装单镜 Prompt ↗</Link></nav>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
