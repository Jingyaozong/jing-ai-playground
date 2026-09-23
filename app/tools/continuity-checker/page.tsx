import type { Metadata } from 'next';
import Link from 'next/link';
import { ContinuityChecker } from '../../components/continuity-checker';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: '相邻镜头连续性检查器 — JING AI PLAYGROUND',
  description: '检查镜头 A 出口与镜头 B 入口之间的人物、方向、视线、动作、场景事实和声音交接。',
};

export default function ContinuityCheckerPage() {
  return (
    <main>
      <SiteHeader active="Tools" />
      <header className="tool-detail-hero continuity-detail-hero">
        <div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / 007</span></div>
        <div className="tool-detail-title">
          <div><p className="eyebrow mono">Continuity checker / 切点检查</p><h1>单镜会发生，<br /><em>切点要会交接。</em></h1></div>
          <p>把镜头 A 的出口和镜头 B 的入口放在一起，沿六条连续线检查真正需要保持、解释或重做的部分。</p>
        </div>
      </header>

      <div className="tool-detail-shell continuity-detail-shell">
        <ContinuityChecker />
        <section className="continuity-method-note">
          <div><span className="mono">A → B / 检查单位</span><h2>连续性不在一镜里，<br />它发生在两镜之间。</h2></div>
          <p>工具只根据你选择的人物、方向、视线、动作、事实和声音状态进行透明判断。它不会读取或上传视频，也不能代替把真实镜头放进时间线逐帧验收。</p>
          <nav className="tool-method-links" aria-label="跨镜连续性相关内容"><Link href="/notes/ai-video-shot-continuity/">阅读完整跨镜连续性方法 ↗</Link><Link href="/prompts/all/?category=AI%20%E8%A7%86%E9%A2%91%E5%88%B6%E4%BD%9C#prompt-video-cut-continuity-handoff">复制镜头交接模板 ↗</Link></nav>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
