import type { Metadata } from 'next';
import Link from 'next/link';
import { ReviewPaceCalculator } from '../../components/review-pace-calculator';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: '评测排期计算器 — JING AI PLAYGROUND',
  description: '分开估算常规与高风险样本的耗时、返工缓冲，并对照目标条数与可用工作日。',
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
          <p>把常规与高风险样本分开估时，再为意外返工留缓冲。也可填入目标条数，对照可用工作日。结果是计划估算，不是已完成的评测量。</p>
        </div>
      </header>

      <div className="tool-detail-shell">
        <ReviewPaceCalculator />
        <section className="pace-method">
          <span className="mono">怎么算 / Method</span>
          <div>
            <h2>一个简单但诚实的估算。</h2>
            <p>先用两类样本占比计算加权单条耗时；团队有效分钟扣除额外返工缓冲后，再按整数条数和预计的高风险条数复算容量。周期量用整个周期的可用分钟计算，允许未用完的日内时间跨日累计。高风险耗时已包含计划内复核，避免再用缓冲重复计算。</p>
            <p>目标对照用同一组假设反推所需工作日，与填写的可用工作日比较。假期和停工日需先自行扣除；显示“落在估算量内”也不等于承诺按期通过验收。</p>
            <p>试标数字从哪里来、怎样区分净工时与质量结果，可读 <Link href="/notes/trial-to-review-pace/">试标之后，排期怎么算？ ↗</Link>。</p>
            <p>需要先记下逐条耗时，可<Link href="/downloads/trial-review-time-log-v1.csv" download>下载空白 CSV 模板 ↓</Link>。模板不含项目数据；完成人工核对后，可在上方本地导入、预览汇总，再确认填入。原始记录不会上传。</p>
            <p>风险怎样分层、随机抽检与定向复核为什么分账，可读 <Link href="/notes/dataset-release-gates/">数据交付四关与分流依据 ↗</Link>。</p>
          </div>
          <div className="pace-method-note"><strong>编辑候选 · 待荆确认</strong><p>先试跑一小批，再用实际耗时修正比例、单条时间与返工缓冲。不要把八小时工作日当成八小时净评测时间，也不要把处理量写成验收通过量。</p></div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
