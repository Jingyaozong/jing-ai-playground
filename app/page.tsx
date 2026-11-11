import Link from 'next/link';
import Image from 'next/image';
import frame from './assets/generated/she-forgets-yesterday-frame-01-v2.webp';
import { HomeCollection } from './components/home-collection';
import { SiteFooter } from './components/site-footer';
import { SiteHeader } from './components/site-header';
import './portfolio.css';

export default function Home() {
  return <main>
    <SiteHeader />
    <div className="folio">
    <div className="folio-shell">
      <section id="ab-review" className="folio-ab" aria-labelledby="folio-title">
        <svg className="folio-ab-filter" aria-hidden="true" width="0" height="0">
          <defs><filter id="window-highlight-rolloff" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0 .125 .25 .375 .5 .625 .737 .832 .92" />
              <feFuncG type="table" tableValues="0 .125 .25 .375 .5 .625 .737 .832 .92" />
              <feFuncB type="table" tableValues="0 .125 .25 .375 .5 .625 .737 .832 .92" />
            </feComponentTransfer>
          </filter></defs>
        </svg>
        <div className="folio-ab-intro">
          <p className="folio-kicker">AIGC PROJECT / MULTIMODAL AESTHETICS</p>
          <h1 id="folio-title">晨光里，先看见谁？</h1>
          <p className="folio-ab-status">首页主案例 · 虚构静帧实评 · 非视频结果</p>
        </div>
        <p className="folio-ab-brief"><strong>同一镜头要求</strong>固定中景。知夏穿芥末黄外套坐在冷蓝卧室的床边。保留窗侧晨光，但第一眼应落在人物，不是窗户。</p>
        <div className="folio-ab-pair">
          <figure className="folio-ab-frame">
            <div className="folio-ab-label"><h2>A <span>原始调色</span></h2></div>
            <div className="folio-ab-image"><Image src={frame} alt="候选 A：窗边晨光照进冷蓝卧室，知夏穿黄色外套坐在床边" sizes="(max-width: 540px) 50vw, (max-width: 1250px) 48vw, 580px" preload /><span className="folio-ab-pin folio-ab-person" aria-hidden="true">①</span><span className="folio-ab-pin folio-ab-window" aria-hidden="true">②</span></div>
            <figcaption><p><b>① 好：</b>暖黄外套与冷蓝墙面分开，人物轮廓清楚。</p><p><b>② 问题：</b>左窗仍是大块亮面，与人物争抢焦点。</p></figcaption>
          </figure>
          <figure className="folio-ab-frame">
            <div className="folio-ab-label"><h2>B <span>提亮增反差</span></h2></div>
            <div className="folio-ab-image folio-ab-bright"><Image src={frame} alt="候选 B：同一画面整体提亮、增反差，窗边和床单更亮" sizes="(max-width: 540px) 50vw, (max-width: 1250px) 48vw, 580px" /><span className="folio-ab-pin folio-ab-person" aria-hidden="true">①</span><span className="folio-ab-pin folio-ab-window" aria-hidden="true">②</span></div>
            <figcaption><p><b>① 好：</b>脸部更亮，晨光氛围更直接。</p><p><b>② 问题：</b>窗帘褶皱变淡，床单也更抢眼，视线更容易离开人物。</p></figcaption>
          </figure>
          <figure className="folio-ab-frame">
            <div className="folio-ab-label"><h2>C <span>局部压高光</span></h2></div>
            <div className="folio-ab-image">
              <Image src={frame} alt="候选 C：保留 A 的人物和整体曝光，只减弱左窗和白帘的高光" sizes="(max-width: 1250px) 33vw, 390px" />
              <div className="folio-ab-window-grade" aria-hidden="true"><Image src={frame} alt="" sizes="(max-width: 1250px) 33vw, 390px" /></div>
              <span className="folio-ab-pin folio-ab-person" aria-hidden="true">①</span><span className="folio-ab-pin folio-ab-window" aria-hidden="true">②</span>
            </div>
            <figcaption><p><b>① 人物：</b>脸和黄外套未改，人物与窗边的亮度竞争减弱。</p><p><b>② 白帘：</b>亮面更收敛，原有褶皱仍在；没有补造白窗里缺失的纹理。</p></figcaption>
          </figure>
        </div>
        <p className="folio-ab-origin">三版使用同一张虚构 AI 概念帧。B 整体提亮并增加反差；C 只在 A 的左窗与白帘范围内，用羽化蒙版压低高亮。没有重新生成图片，也不是视频或盲评结果。</p>
        <div className="folio-ab-verdict">
          <div><h2>为什么从 A 改</h2><p>B 的脸部更亮，却也让窗户和床单更抢眼。A 的冷暖关系更符合镜头要求，问题集中在左窗，没必要再调全图。</p></div>
          <div><h2>C 版复看</h2><p>同尺寸看，C 的窗边没有 A 那么刺眼，也不像 B 那样让床单跳出来。白帘原有明暗层次保住了，但没有恢复已经过白的细节。建议保留 C：它让人物更容易先被注意到，同时仍看得出是窗侧晨光。</p></div>
        </div>
        <details className="folio-ac-inspect">
          <summary>放大复看 A / C：在同一画面切换修正</summary>
          <p>切换时重点看左窗白帘，再看脸和黄外套。只比较这个静帧，不推断视频一致性。</p>
          <input id="folio-ac-toggle" type="checkbox" />
          <label htmlFor="folio-ac-toggle">显示 C 版局部修正</label>
          <figure className="folio-ac-stage">
            <div className="folio-ab-image">
              <Image src={frame} alt="放大对照：知夏、左窗和白帘" loading="lazy" />
              <div className="folio-ab-window-grade" aria-hidden="true"><Image src={frame} alt="" loading="lazy" /></div>
            </div>
            <figcaption><span className="folio-ac-a">A / 原始调色</span><span className="folio-ac-c">C / 仅左窗与白帘压高光</span></figcaption>
          </figure>
        </details>
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
      <nav className="folio-collection-link" aria-label="继续浏览个人网站"><Link href="#cases">继续浏览：故事、实验、笔记与工具 ↓</Link><Link href="/archive/">查看旧版首页 ↗</Link></nav>
    </div>
    </div>
    <div id="cases"><HomeCollection embedded /></div>
    <SiteFooter />
  </main>;
}
