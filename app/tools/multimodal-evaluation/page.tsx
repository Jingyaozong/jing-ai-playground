import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';
import { MultimodalEvaluationDesk } from '../../components/multimodal-evaluation-desk';
import './multimodal-evaluation.css';

export const metadata: Metadata = {
  title: '多模态评测记录台 — JING AI PLAYGROUND',
  description: '在浏览器本地按八个维度记录视频评测证据，导入或导出可恢复的 CSV。',
};

export default function MultimodalEvaluationPage() {
  return <main className="evaluation-desk-page">
    <SiteHeader active="Tools" />
    <header className="tool-detail-hero evaluation-desk-hero">
      <div className="tool-detail-topline mono"><Link href="/tools/#all-tools">← 返回工具箱</Link><span>JING TOOL / 022</span></div>
      <div className="tool-detail-title"><div><p className="eyebrow mono">Multimodal evaluation / 本地记录</p><h1>八个维度，<br /><em>一条证据链。</em></h1></div><p>不替你打分，也不上传素材。逐项写下观看结果、时间段与证据，再由人确认这条记录能否进入复核。</p></div>
    </header>
    <div className="tool-detail-shell evaluation-desk-shell">
      <MultimodalEvaluationDesk />
      <aside className="evaluation-desk-method"><div><span className="mono">METHOD / 方法连接</span><h2>先记录证据，<br />再讨论原因。</h2></div><p>八维框架、异常归因和交付路径来自荆提供的方法；工具只有空白记录，不含视频、模型输出或预设结论。</p><nav><Link href="/notes/synthetic-multimodal-evaluation-delivery/">阅读完整虚构演练 ↗</Link><Link href="/notes/video-evaluation-eight-dimensions/">查看八维定义 ↗</Link></nav></aside>
    </div>
    <SiteFooter />
  </main>;
}
