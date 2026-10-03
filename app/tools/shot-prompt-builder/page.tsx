import type { Metadata } from 'next';
import Link from 'next/link';
import { ShotPromptBuilder } from '../../components/shot-prompt-builder';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: 'AI 视频 Prompt 组装器 — JING AI PLAYGROUND',
  description: '把角色、场景、动作、摄影机与失败边界整理成单镜 Prompt、验收清单和返修记录。',
};

export default function ShotPromptBuilderPage() {
  return (
    <main>
      <SiteHeader active="Tools" />
      <header className="tool-detail-hero shot-prompt-hero">
        <div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / 018</span></div>
        <div className="tool-detail-title"><div><p className="eyebrow mono">Shot prompt builder / 镜头任务卡</p><h1>别把所有要求，<br /><em>塞进同一句话。</em></h1></div><p>把主体、场景、起点、动作、终点和摄影机分层填写，再生成单镜 Prompt、验收清单与返修记录。</p></div>
      </header>

      <div className="tool-detail-shell shot-prompt-shell">
        <ShotPromptBuilder />
        <section className="shot-prompt-method">
          <div><span className="mono">FACTS BEFORE STYLE / 先写事实</span><h2>先让镜头可执行，<br />再讨论它好不好看。</h2></div>
          <p>工具不会读取参考图、调用视频模型或自动判断成片。它只把镜头事实组织清楚，并保留待填写的真实验收位置。不同模型的参数和语法仍需在生成当天核对。</p>
          <nav aria-label="镜头 Prompt 相关内容"><Link href="/prompts/all/?category=AI%20%E8%A7%86%E9%A2%91%E5%88%B6%E4%BD%9C#prompt-video-single-shot-motion">复制单镜动作模板 ↗</Link><Link href="/prompts/all/?category=AI%20%E8%A7%86%E9%A2%91%E5%88%B6%E4%BD%9C#prompt-collection">查看 10 条制作模板 ↗</Link><Link href="/tools/shot-risk-checker/">进行镜头风险预检 ↗</Link><Link href="/tools/continuity-checker/">检查相邻镜头连续性 ↗</Link><Link href="/notes/first-last-frame-motion-prompt/">阅读首尾帧方法 ↗</Link><Link href="/library/?type=VIDEO#library-adobe-structuring-video-prompts">回看 Adobe Prompt 教程 ↗</Link></nav>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
