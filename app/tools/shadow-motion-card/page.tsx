import type { Metadata } from 'next';
import Link from 'next/link';
import { ShadowMotionCardBuilder } from '../../components/shadow-motion-card-builder';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: '影子动作拆分卡 — JING AI PLAYGROUND',
  description: '把实体、影子、光线和摄影机拆成四条控制轨，生成双时间线 Prompt、九格变量矩阵与五点验收表。',
};

export default function ShadowMotionCardPage() {
  return (
    <main>
      <SiteHeader active="Tools" />
      <header className="tool-detail-hero shadow-motion-hero">
        <div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / 016</span></div>
        <div className="tool-detail-title">
          <div><p className="eyebrow mono">Shadow motion card / 双时间线</p><h1>人物留在现在，<br /><em>影子先走一步。</em></h1></div>
          <p>先锁住实体、光线与摄影机，再给单一影子一条独立时间线。把一句容易耦合的指令，拆成可以逐帧核对的四轨控制卡。</p>
        </div>
      </header>

      <div className="tool-detail-shell shadow-motion-shell">
        <ShadowMotionCardBuilder />
        <section className="shadow-motion-method">
          <div><span className="mono">PROMPT ≠ PROOF / 提示不是证据</span><h2>先把关系写清楚，<br />再让真实画面回答。</h2></div>
          <p>工具不会读取参考图、生成视频或判断模型能力。若实体仍被带动，先降低动作幅度并拆短；若多轮仍无法分离，再转向遮罩、跟踪和合成，不把失败继续藏进更长的提示词。</p>
          <nav><Link href="/notes/ai-video-shadow-motion-separation/">阅读双时间线方法 ↗</Link><Link href="/experiments/can-a-shadow-move-on-its-own/">打开九格影子实验 ↗</Link><Link href="/stories/shadow-arrives-five-minutes-early/">查看故事应用 ↗</Link></nav>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
