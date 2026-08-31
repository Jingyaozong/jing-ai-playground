import type { Metadata } from 'next';
import Link from 'next/link';
import { PromptBrowser } from '../../components/prompt-browser';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';
import { promptItems } from '../../data/prompts';

export const metadata: Metadata = {
  title: '全部 Prompt — JING AI PLAYGROUND',
  description: '浏览、筛选和复制 Prompt 工作台中的通用思考 Prompt 与 AI 视频制作模板。',
};

export default function AllPromptsPage() {
  return (
    <main>
      <SiteHeader active="Notes" />
      <section className="prompt-all-hero page-intro">
        <div className="page-intro-top mono"><Link href="/prompts/">← 返回 Prompt 精选</Link><span>{promptItems.length} 条 Prompt · 完整目录</span></div>
        <h1>ALL<br />PROMPTS</h1>
        <div className="notes-hero-bottom"><p>需要哪一种思考方式，<br />就从哪一个抽屉开始找。</p><span className="mono">Search / Filter / Copy</span></div>
      </section>
      <section className="prompt-collection section-shell">
        <PromptBrowser items={promptItems} />
      </section>
      <SiteFooter />
    </main>
  );
}
