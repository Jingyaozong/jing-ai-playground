import type { Metadata } from 'next';
import Link from 'next/link';
import { LocalEffectBuilder } from '../../components/local-effect-builder';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: '局部特效约束卡生成器 — JING AI PLAYGROUND',
  description: '把局部雨、雾、微光和粒子整理成锚点、边界、区外状态、时间规则、九格测试与逐帧验收表。',
};

export default function LocalEffectCardPage() {
  return (
    <main>
      <SiteHeader active="Tools" />
      <header className="tool-detail-hero effect-detail-hero">
        <div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / 014</span></div>
        <div className="tool-detail-title">
          <div><p className="eyebrow mono">Local effect / 空间关系</p><h1>别只写一场雨，<br /><em>写清它跟着谁。</em></h1></div>
          <p>把局部雨、雾、微光或粒子拆成锚点、边界、区外状态和时间规则，再生成待测试 Prompt、九格矩阵与逐帧验收表。</p>
        </div>
      </header>
      <div className="tool-detail-shell effect-detail-shell">
        <LocalEffectBuilder />
        <section className="effect-method-note">
          <div><span className="mono">RELATION OVER EFFECT / 先看关系</span><h2>首帧画起点，<br />逐帧查跟随。</h2></div>
          <p>工具只整理你填写的空间与时间规则，不会读取图片、生成视频或判断模型能力。九格测试执行前仍需固定真实模型版本、输出数量和平台设置。</p>
          <nav><Link href="/notes/ai-video-local-effects-spatial-control/">阅读完整方法 ↗</Link><Link href="/experiments/can-local-rain-follow-a-character/">打开九格实验 ↗</Link></nav>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
