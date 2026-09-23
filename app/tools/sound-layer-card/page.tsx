import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';
import { SoundLayerBuilder } from '../../components/sound-layer-builder';

export const metadata: Metadata = {
  title: '声音分层卡生成器 — JING AI PLAYGROUND',
  description: '把对白、声音表演、环境底、动作音效与音乐整理成可复制的单镜声音 Brief 和验收清单。',
};

export default function SoundLayerCardPage() {
  return (
    <main>
      <SiteHeader active="Tools" />
      <header className="tool-detail-hero sound-detail-hero">
        <div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / 006</span></div>
        <div className="tool-detail-title">
          <div><p className="eyebrow mono">Sound layer card / 声音分层</p><h1>别说“加点声音”，<br /><em>把每一层写清楚。</em></h1></div>
          <p>为单个镜头选择声音路线，把对白、表演、环境、音效和音乐放回各自的轨道，再生成制作 Brief 与验收清单。</p>
        </div>
      </header>

      <div className="tool-detail-shell sound-detail-shell">
        <SoundLayerBuilder />
        <section className="sound-method-note">
          <div><span className="mono">LAYER FIRST / 先分层</span><h2>声音不是装饰，<br />它也有镜头任务。</h2></div>
          <p>这张卡只负责把责任写清楚，不会替你生成配音、音效或音乐，也不会承诺任何模型能够一次完成全部声音层。真正进入制作后，仍要用实际录音和时间线逐项对齐。</p>
          <nav className="tool-method-links" aria-label="声音分层相关内容"><Link href="/notes/ai-video-sound-workflow/">阅读完整声音工作流 ↗</Link><Link href="/prompts/all/?category=AI%20%E8%A7%86%E9%A2%91%E5%88%B6%E4%BD%9C#prompt-video-sound-layer-brief">复制单镜声音模板 ↗</Link></nav>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
