import type { Metadata } from 'next';
import Link from 'next/link';
import { ShotVersionRecorder } from '../../components/shot-version-recorder';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: '镜头版本记录器 — JING AI PLAYGROUND',
  description: '记录生成批次、候选状态、可用区间、淘汰原因与剪辑采用方式，并导出 Markdown 和 CSV。',
};

export default function ShotVersionRecorderPage() {
  return (
    <main>
      <SiteHeader active="Tools" />
      <header className="tool-detail-hero version-detail-hero">
        <div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / 010</span></div>
        <div className="tool-detail-title">
          <div><p className="eyebrow mono">Shot version recorder / 候选留档</p><h1>别只留下成片，<br /><em>留下为什么选它。</em></h1></div>
          <p>把镜头、生成批次与候选版本分开记录，为每个 Take 标注状态、可用区间、淘汰原因和剪辑采用方式。</p>
        </div>
      </header>
      <div className="tool-detail-shell version-detail-shell">
        <ShotVersionRecorder />
        <section className="version-method-note">
          <div><span className="mono">DECISION BEFORE STORAGE / 先做决定</span><h2>文件名负责找到，<br />记录表负责解释。</h2></div>
          <p>工具不会读取、上传或评价视频，也不保证通过 Seed 复现结果。它只把你填写的当前输入和选择理由整理成可继续使用的记录。</p>
          <nav className="tool-method-links" aria-label="镜头版本相关内容"><Link href="/notes/ai-video-generation-version-log/">阅读完整候选镜头留档方法 ↗</Link><Link href="/prompts/all/?category=AI%20%E8%A7%86%E9%A2%91%E5%88%B6%E4%BD%9C#prompt-video-candidate-review-table">复制候选验收模板 ↗</Link></nav>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
