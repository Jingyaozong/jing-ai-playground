import Link from 'next/link';
import Image from 'next/image';
import frame from './assets/generated/she-forgets-yesterday-frame-01-v2.webp';
import eveningFrame from './assets/generated/she-forgets-yesterday-frame-03-v2.webp';
import waterFrame from './assets/generated/before-the-water-recedes-frame-01.png';
import { PortfolioFooter, PortfolioHeader } from './components/portfolio-frame';
import './portfolio.css';

export default function Home() {
  return <main className="folio">
    <PortfolioHeader />
    <div className="folio-shell">
      <section className="folio-hero" aria-labelledby="folio-title">
        <div>
          <p className="folio-kicker">AIGC PROJECT / MULTIMODAL AESTHETICS</p>
          <h1 id="folio-title"><span>多模态美学</span><span>评测作品集</span></h1>
          <p className="folio-deck">一张图哪里好，一个镜头哪里失效？从构图、光色和视觉焦点出发，把判断落实到能标注、比较和复查的证据。</p>
          <div className="folio-actions"><Link className="folio-button" href="#cases">查看精选案例 ↓</Link><Link href="#method">查看评测方法 ↗</Link></div>
        </div>
        <figure className="folio-proof">
          <div className="folio-proof-top"><span>FRAME REVIEW</span><span>01 / 画面样张</span></div>
          <div className="folio-proof-image"><Image src={frame} alt="虚构角色知夏坐在蓝色卧室的床边，穿芥末黄色外套" sizes="(max-width: 800px) 100vw, 55vw" preload /><span aria-hidden="true">01</span></div>
          <figcaption><b>01 / 视觉焦点</b><p>蓝色房间托住暖黄色外套，人物先被看见。窗边亮区仍可能争夺注意力，可作为下一版的对照变量。</p><small>AI 概念帧 · 单帧审读 · 非视频结果</small></figcaption>
        </figure>
      </section>
      <section id="cases" className="folio-section">
        <p className="folio-kicker">SELECTED CASES</p><h2>从画面到镜头</h2>
        <div className="folio-cases">
          <article><Image src={eveningFrame} alt="《她每天醒来都会忘记昨天》的傍晚见面概念帧" sizes="(max-width: 800px) 100vw, 50vw" /><div><p className="folio-kicker">视觉开发 / AI 概念帧</p><h3>她每天醒来都会忘记昨天</h3><p>看人物锚点如何贯穿四张概念画面：服装、发饰与光色变化分别承担什么任务。</p><Link href="/stories/she-forgets-yesterday/">查看人物锚点与关键帧 ↗</Link></div></article>
          <article><Image src={waterFrame} alt="《退水以前》档案馆概念画面" sizes="(max-width: 800px) 100vw, 50vw" /><div><p className="folio-kicker">时序评测 / 协议待执行</p><h3>撑伞以后，水面何时开始退？</h3><p>用伞锁定、水首动和退水方向定位失败；九格视频试验尚未执行。</p><Link href="/experiments/can-water-recede-after-the-umbrella-opens/">查看测试协议 ↗</Link></div></article>
        </div>
        <Link className="folio-secondary" href="/stories/">查看全部故事 ↗</Link>
      </section>
      <section id="method" className="folio-section folio-method">
        <div><p className="folio-kicker">REVIEW METHOD</p><h2>先给证据，<br />再下判断。</h2><p>把美学偏好与指令、结构、时序等错误分开。用时间段和可见事实说明判断，把没有证据的项留为待复核。</p></div>
        <div className="folio-method-links">
          <Link href="/notes/video-evaluation-eight-dimensions/"><span>方法</span><strong>视频评测八维</strong><b aria-hidden="true">↗</b></Link>
          <Link href="/tools/multimodal-evaluation/"><span>工具</span><strong>多模态评测记录台</strong><b aria-hidden="true">↗</b></Link>
          <Link href="/notes/synthetic-multimodal-evaluation-delivery/"><span>虚构演练</span><strong>从需求到交付报告</strong><b aria-hidden="true">↗</b></Link>
        </div>
      </section>
      <section className="folio-section folio-reading"><div><p className="folio-kicker">RESEARCH BRIEF</p><h2>从行业访谈提炼测试问题</h2><p>播客精读用于定位观点。每则简报保留出处，并单独列出可验证的任务。</p></div><Link className="folio-button" href="/briefing/">阅读多模态简报 ↗</Link></section>
    </div>
    <PortfolioFooter />
  </main>;
}
