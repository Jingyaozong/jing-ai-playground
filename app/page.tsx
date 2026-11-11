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
      <section id="ab-review" className="folio-ab" aria-labelledby="folio-title">
        <div className="folio-ab-intro">
          <p className="folio-kicker">AIGC PROJECT / MULTIMODAL AESTHETICS</p>
          <h1 id="folio-title">晨光里，先看见谁？</h1>
          <p className="folio-ab-status">首页主案例 · 虚构静帧实评 · 非视频结果</p>
        </div>
        <p className="folio-ab-brief"><strong>同一镜头要求</strong>固定中景。知夏穿芥末黄外套坐在冷蓝卧室的床边。保留窗侧晨光，但第一眼应落在人物，不是窗户。</p>
        <div className="folio-ab-pair">
          <figure className="folio-ab-frame">
            <div className="folio-ab-label"><h2>A <span>原始调色</span></h2><span className="folio-ab-pick">选为底版</span></div>
            <div className="folio-ab-image"><Image src={frame} alt="候选 A：窗边晨光照进冷蓝卧室，知夏穿黄色外套坐在床边" sizes="(max-width: 540px) 50vw, (max-width: 1250px) 48vw, 580px" preload /><span className="folio-ab-pin folio-ab-person" aria-hidden="true">①</span><span className="folio-ab-pin folio-ab-window" aria-hidden="true">②</span></div>
            <figcaption><p><b>① 好：</b>暖黄外套与冷蓝墙面分开，人物轮廓清楚。</p><p><b>② 问题：</b>左窗仍是大块亮面，与人物争抢焦点。</p></figcaption>
          </figure>
          <figure className="folio-ab-frame">
            <div className="folio-ab-label"><h2>B <span>提亮增反差</span></h2></div>
            <div className="folio-ab-image folio-ab-bright"><Image src={frame} alt="候选 B：同一画面整体提亮、增反差，窗边和床单更亮" sizes="(max-width: 540px) 50vw, (max-width: 1250px) 48vw, 580px" /><span className="folio-ab-pin folio-ab-person" aria-hidden="true">①</span><span className="folio-ab-pin folio-ab-window" aria-hidden="true">②</span></div>
            <figcaption><p><b>① 好：</b>脸部更亮，晨光氛围更直接。</p><p><b>② 问题：</b>窗帘褶皱变淡，床单也更抢眼，视线更容易离开人物。</p></figcaption>
          </figure>
        </div>
        <p className="folio-ab-origin">两版使用同一张虚构 AI 概念帧；B 仅在浏览器中改变亮度和反差。构图与人物不变，不代表两次模型生成或盲评统计。</p>
        <div className="folio-ab-verdict">
          <div><h2>为什么选 A</h2><p>B 的脸部更亮，但连窗户和床单一起提亮了。A 的人物与环境更容易分开，更符合「先看见知夏」的镜头意图。</p></div>
          <div><h2>下一版怎么改</h2><p>以 A 为底，只对左窗和白帘做局部蒙版，高光先压约 0.3 EV，边缘羽化；不动脸、外套或全局曝光。缩到同尺寸并排复看：白帘仍有层次，第一眼能落在人物，才保留修改。</p></div>
        </div>
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
