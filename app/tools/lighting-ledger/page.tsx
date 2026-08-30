import type { Metadata } from 'next';
import Link from 'next/link';
import { LightingLedgerBuilder } from '../../components/lighting-ledger-builder';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: '光线连续性账本 — JING AI PLAYGROUND',
  description: '固定现实空间里的灯位，根据人物朝向与摄影机位置换算逐镜预期受光方向，并核对真实画面是否发生翻面。',
};

export default function LightingLedgerPage() {
  return (
    <main>
      <SiteHeader active="Tools" />
      <header className="tool-detail-hero lighting-ledger-hero">
        <div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / 015</span></div>
        <div className="tool-detail-title">
          <div><p className="eyebrow mono">Lighting ledger / 光位换算</p><h1>灯留在现实里，<br /><em>画面左右可以变。</em></h1></div>
          <p>先固定灯在房间的哪一侧，再为每个机位换算画面受光方向。填入真实观察后，检查是正常反打，还是主光真的换了边。</p>
        </div>
      </header>

      <div className="tool-detail-shell lighting-ledger-shell">
        <LightingLedgerBuilder />
        <section className="lighting-ledger-method">
          <div><span className="mono">WORLD ≠ SCREEN / 两套坐标</span><h2>先判断灯有没有移动，<br />再讨论画面像不像。</h2></div>
          <p>工具只做透明的方位换算，不会读取图片或视频，也不会判断曝光和色彩是否“高级”。四向模型适合前期协议与粗检；斜向灯位、复杂反射和移动光源仍需平面图、示波器与真实画面共同判断。</p>
          <div><Link href="/notes/ai-video-lighting-continuity/">阅读光线连续性方法 ↗</Link><Link href="/experiments/can-one-light-survive-a-reverse-angle/">打开 12 格光线实验 ↗</Link></div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
