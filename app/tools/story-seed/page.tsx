import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';
import { StorySeedGenerator } from '../../components/story-seed-generator';

export const metadata: Metadata = {
  title: '故事种子生成器 — JING AI PLAYGROUND',
  description: '抽取人物、意外、地点和规则，组合成一个可以继续写下去的故事种子。',
};

export default function StorySeedPage() {
  return (
    <main>
      <SiteHeader active="Tools" />
      <header className="tool-detail-hero seed-detail-hero">
        <div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / 002</span></div>
        <div className="tool-detail-title">
          <div>
            <p className="eyebrow mono">Random story seed / 故事种子</p>
            <h1>先抽四张，<br /><em>再把意外写下去。</em></h1>
          </div>
          <p>人物让我们在乎，意外迫使故事开始，地点决定它的气味，规则则让选择变得困难。</p>
        </div>
      </header>

      <div className="tool-detail-shell seed-detail-shell">
        <StorySeedGenerator />
        <section className="seed-method">
          <span className="mono">怎么用 / Method</span>
          <div><strong>先看组合有没有画面。</strong><p>不要急着追求完整剧情。先找到一张让你想继续问“然后呢？”的卡，再锁住它。</p></div>
          <div><strong>再制造一个困难选择。</strong><p>好的规则不是限制字数，而是让主角必须在两件都舍不得的东西之间做决定。</p></div>
          <div><strong>最后才交给 AI 扩写。</strong><p>先由你决定故事真正想讲什么，再让 AI 帮忙补充场景、对白和分镜。</p></div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
