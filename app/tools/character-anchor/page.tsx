import type { Metadata } from 'next';
import Link from 'next/link';
import { CharacterAnchorBuilder } from '../../components/character-anchor-builder';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: '角色锚点卡生成器 — JING AI PLAYGROUND',
  description: '把人物外貌、配饰、服装和允许变化整理成角色参考卡、图像锚点与视频验收清单。',
};

export default function CharacterAnchorPage() {
  return (
    <main>
      <SiteHeader active="Tools" />
      <header className="tool-detail-hero anchor-detail-hero">
        <div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / 004</span></div>
        <div className="tool-detail-title">
          <div>
            <p className="eyebrow mono">Character anchor / 角色锚点</p>
            <h1>先认出她，<br /><em>再让她动起来。</em></h1>
          </div>
          <p>把人物身份拆成看得见、能核对的细节，再分别生成参考卡、图像锚点和视频验收清单。</p>
        </div>
      </header>

      <div className="tool-detail-shell anchor-detail-shell">
        <CharacterAnchorBuilder />
        <section className="anchor-method">
          <div><span className="mono">WHY / 为什么</span><h2>Prompt 负责描述，<br />参考图负责证明。</h2></div>
          <p>角色锚点的作用，是让团队知道哪些变化属于表演、哪些变化已经破坏身份。它不能代替清晰的人物母版，也不能保证任何模型百分之百一致。</p>
          <Link href="/notes/ai-video-character-consistency/">先读人物一致性方法 ↗</Link>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
