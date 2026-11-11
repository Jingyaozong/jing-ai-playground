import type { Metadata } from 'next';
import Link from 'next/link';
import { PortfolioFooter, PortfolioHeader } from '../components/portfolio-frame';
import '../portfolio.css';

export const metadata: Metadata = { title: '多模态精读简报 — JING', description: '把播客观点转成可验证的多模态评测任务。' };

const sources = [
  ['42章经', 'https://42zhangjing.qiaomu.ai/'],
  ['晚点聊 LateTalk', 'https://latetalk.qiaomu.ai/'],
  ['张小珺商业访谈录', 'https://zhangxiaojun.qiaomu.ai/'],
  ['AI炼金术', 'https://aialchemy.qiaomu.ai/'],
  ['面基', 'https://mianji.qiaomu.ai/'],
];

export default function Briefing() {
  return <main className="folio">
    <PortfolioHeader />
    <div className="folio-shell folio-briefing">
      <header className="folio-briefing-title"><p className="folio-kicker">RESEARCH BRIEF / 播客精读</p><h1>多模态精读简报</h1><p>从访谈里找值得测试的问题，不把嘉宾判断当作模型测评结论。</p></header>
      <article className="folio-episode">
        <header><p className="folio-kicker">42章经 · 2026 年 10 月 · 14:11 段落</p><h2>生成缺陷与审美偏好，<br />分开记录</h2><p>来源：曲凯对谈淏楠。精读由第三方 AI 整理，观点应回听原声核对。</p></header>
        <dl><div><dt>节目观点</dt><dd>访谈把选片分成两类情况：排除有明显生成缺陷的片段，以及从可用片段中挑选更符合创作者意图的一条。</dd></div>
        <div><dt>转化为评测任务</dt><dd>给同一镜头要求准备两个匿名候选。先分别记录形变、连续性和指令错误；只有两条都过基础门槛，才比较主体焦点、光色和情绪是否服务叙事。保留平局与弃权选项，并记下判断所依据的画面或时间段。</dd></div>
        <div><dt>当前状态</dt><dd>待执行。尚无样本对比、人工偏好统计或模型排名。</dd></div></dl>
        <div className="folio-actions"><a href="https://42zhangjing.qiaomu.ai/ep/6ada2be4c96c8942ec10cb1e.html">打开精读与节目原声 ↗</a><Link href="/#ab-review">查看静帧对照案例 ↗</Link><Link href="/tools/multimodal-evaluation/">打开评测记录台 ↗</Link></div>
      </article>
      <section className="folio-section folio-sources"><h2>取材来源</h2><p>以下目录已核对可访问。只收录与视觉质量、生成可控性或多模态评测直接相关的节目；本页尚未启用自动更新。</p><ul>{sources.map(([name, href]) => <li key={href}><a href={href}>{name} ↗</a></li>)}</ul><p>另外三个目录和一个短链接暂未核实，未作为内容依据。</p></section>
    </div>
    <PortfolioFooter />
  </main>;
}
