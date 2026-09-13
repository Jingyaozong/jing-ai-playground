import type { Metadata } from 'next';
import Link from 'next/link';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SiteHeader } from '../../components/site-header';
import { SiteFooter } from '../../components/site-footer';
import { RuleReview } from '../../components/rule-review';
import { importReviewCsv } from '../../../lib/rule-review';
import './rule-review.css';

export const metadata: Metadata = { title: '规则答疑验收台 — JING AI PLAYGROUND', description: '在浏览器中导入合成题、记录回答和人工判断，导出可恢复的复核 CSV。' };

export default function RuleReviewPage() {
  const sample = importReviewCsv(readFileSync(join(process.cwd(), 'public/downloads/rule-knowledge-desk-practice-v1.0/test-questions.csv'), 'utf8'));
  sample.ruleVersion = 'v1.0';
  return <main className="rule-review-page">
    <SiteHeader active="Tools" />
    <header className="tool-detail-hero">
      <div className="tool-detail-topline mono"><Link href="/tools/#all-tools">← 返回工具箱</Link><span>JING TOOL / 021</span></div>
      <div className="tool-detail-title"><div><p className="eyebrow mono">Rule review / 人工复核</p><h1>逐题看依据，<br /><em>留下判断。</em></h1></div><p>把问题、回答和引用放在同一张复核单里。导入题目后逐条填写，再把结论带走。</p></div>
    </header>
    <div className="tool-detail-shell"><RuleReview sample={sample} />
      <aside className="rule-review-method"><h2>先对照，再判定。</h2><p>内置题目来自独立虚构的纸灯规则台。工具整理人工记录，不调用模型或自动评分。参考答案和规则可在演练包中单独查阅。</p><Link href="/notes/synthetic-rule-knowledge-desk/">阅读案例与下载演练包 ↗</Link></aside>
    </div><SiteFooter />
  </main>;
}
