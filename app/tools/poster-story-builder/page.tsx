import type { Metadata } from 'next';
import Link from 'next/link';
import { PosterStoryBuilder } from '../../components/poster-story-builder';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: '海报反推故事组装器 — JING AI PLAYGROUND',
  description: '把海报里的可见证据、合理推测和主动创作选择分开记录，生成证据账本、故事任务卡和可复制 Prompt。',
};

export default function PosterStoryBuilderPage() {
  return (
    <main>
      <SiteHeader active="Tools" />
      <header className="tool-detail-hero poster-story-hero">
        <div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / 019</span></div>
        <div className="tool-detail-title">
          <div><p className="eyebrow mono">Poster to story / 来源分层</p><h1>别急着讲故事，<br /><em>先把海报分三层。</em></h1></div>
          <p>把“画面确实给了什么”“证据允许怎样推测”和“创作者决定加入什么”分开，再把它们组装成能追溯来源的故事任务。</p>
        </div>
      </header>

      <div className="tool-detail-shell poster-story-shell">
        <PosterStoryBuilder />
        <section className="poster-story-method">
          <div><span className="mono">E → I → C / 来源不是灵感</span><h2>海报可以触发故事，<br />但不能替故事背书。</h2></div>
          <p>这个工具只整理创作输入，不读取图片、不调用模型，也不验证推测。示例来自现有海报反推故事实验，用来演示方法，不代表已经完成的个人作品。</p>
          <nav><Link href="/experiments/can-a-fictional-poster-grow-a-story/">查看首轮 9 格实验 ↗</Link><Link href="/experiments/does-the-short-evidence-ledger-travel/">查看第二轮复测 ↗</Link><Link href="/prompts/all/?category=AI%20%E8%A7%86%E9%A2%91%E5%88%B6%E4%BD%9C#prompt-poster-to-story-short-ledger">打开配套 Prompt 模板 ↗</Link><Link href="/tools/story-seed/">从零生成故事种子 ↗</Link></nav>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
