import type { Metadata } from 'next';
import Link from 'next/link';
import { ReviewPaceCalculator } from '../../components/review-pace-calculator';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: '评测排期计算器 — JING AI PLAYGROUND',
  description: '估算内容评测与标注任务的日产能、周期产能和返工缓冲。',
};

export default function ReviewPacePage() {
  return (
    <main>
      <SiteHeader active="Tools" />
      <header className="tool-detail-hero">
        <div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / 001</span></div>
        <div className="tool-detail-title">
          <div>
            <p className="eyebrow mono">Review pace / 评测排期</p>
            <h1>先算清楚，<br /><em>再答应交付。</em></h1>
          </div>
          <p>用五个实际工作条件，估算内容评测、视频质检或标注任务的产能。结果会为返工与争议样本预留缓冲。</p>
        </div>
      </header>

      <div className="tool-detail-shell">
        <ReviewPaceCalculator />
        <section className="pace-method">
          <span className="mono">怎么算 / Method</span>
          <div>
            <h2>一个简单但诚实的估算。</h2>
            <p>基础日产能 = 人数 × 每天有效分钟 ÷ 单条平均耗时。之后再扣除你设置的返工缓冲，得到更接近可交付数量的结果。</p>
          </div>
          <div className="pace-method-note"><strong>JING&apos;S NOTE</strong><p>先试跑一小批，再用真实耗时回来修正参数。排期最容易错的地方，通常不是公式，而是把八小时工作日当成八小时有效评测时间。</p></div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
