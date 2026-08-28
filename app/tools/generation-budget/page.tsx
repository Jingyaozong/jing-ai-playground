import type { Metadata } from 'next';
import Link from 'next/link';
import { GenerationBudgetCalculator } from '../../components/generation-budget-calculator';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: '生成预算计算器 — JING AI PLAYGROUND',
  description: '按风险组计算镜头候选、生成秒数、返工预留、后期、声音与人工成本。',
};

export default function GenerationBudgetPage() {
  return (
    <main>
      <SiteHeader active="Tools" />
      <header className="tool-detail-hero budget-detail-hero">
        <div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / 011</span></div>
        <div className="tool-detail-title">
          <div><p className="eyebrow mono">Generation budget / 制作预算</p><h1>别先问一秒多贵，<br /><em>先算要试多少次。</em></h1></div>
          <p>填写自己的单位成本，把镜头按风险分组，再加入候选数量、生成秒数、返工预留、后期和人工时间。</p>
        </div>
      </header>
      <div className="tool-detail-shell budget-detail-shell">
        <GenerationBudgetCalculator />
        <section className="budget-method-note">
          <div><span className="mono">ASSUMPTIONS BEFORE TOTAL / 先写假设</span><h2>单价会变，<br />计算结构留下来。</h2></div>
          <p>工具不会读取平台账户、Credits 或账单，也不预测模型成功率。费率、候选数和返工预留都由你填写；执行当天仍应核对官方价格、套餐、税费与币种。</p>
          <Link href="/notes/ai-video-production-budget/">阅读完整 AI 视频预算方法 ↗</Link>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
