import Image from 'next/image';
import frame from '../assets/generated/she-forgets-yesterday-frame-01-v2.webp';

// 画面审美判断小案例：同一张静帧的三版调色对比。
export function AestheticCase() {
  const sizes = '(max-width: 900px) 100vw, 360px';
  return (
    <div className="pf-ab">
      <svg className="pf-ab-filter" aria-hidden="true" width="0" height="0">
        <defs><filter id="window-highlight-rolloff" colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0 .125 .25 .375 .5 .625 .737 .832 .92" />
            <feFuncG type="table" tableValues="0 .125 .25 .375 .5 .625 .737 .832 .92" />
            <feFuncB type="table" tableValues="0 .125 .25 .375 .5 .625 .737 .832 .92" />
          </feComponentTransfer>
        </filter></defs>
      </svg>
      <p className="pf-ab-brief"><strong>镜头要求</strong>固定中景。知夏穿芥末黄外套坐在冷蓝卧室的床边。保留窗侧晨光，但第一眼应落在人物，不是窗户。</p>
      <div className="pf-grid-3">
        <figure>
          <h3>A<span>原始调色</span></h3>
          <div className="pf-ab-image"><Image src={frame} alt="候选 A：窗边晨光照进冷蓝卧室，知夏穿黄色外套坐在床边" sizes={sizes} /><span className="pf-ab-pin pf-ab-person" aria-hidden="true">1</span><span className="pf-ab-pin pf-ab-window" aria-hidden="true">2</span></div>
          <figcaption><p><b>1 人物：</b>暖黄外套与冷蓝墙面分开，人物轮廓清楚。</p><p><b>2 窗户：</b>左窗仍是大块亮面，与人物争抢焦点。</p></figcaption>
        </figure>
        <figure>
          <h3>B<span>提亮增反差</span></h3>
          <div className="pf-ab-image pf-ab-bright"><Image src={frame} alt="候选 B：同一画面整体提亮、增反差，窗边和床单更亮" sizes={sizes} /><span className="pf-ab-pin pf-ab-person" aria-hidden="true">1</span><span className="pf-ab-pin pf-ab-window" aria-hidden="true">2</span></div>
          <figcaption><p><b>1 人物：</b>脸部更亮，晨光氛围更直接。</p><p><b>2 窗户：</b>窗帘褶皱变淡，床单也更抢眼，视线更容易离开人物。</p></figcaption>
        </figure>
        <figure>
          <h3>C<span>局部压高光</span></h3>
          <div className="pf-ab-image">
            <Image src={frame} alt="候选 C：保留 A 的人物和整体曝光，只减弱左窗和白帘的高光" sizes={sizes} />
            <div className="pf-ab-grade" aria-hidden="true"><Image src={frame} alt="" sizes={sizes} /></div>
            <span className="pf-ab-pin pf-ab-person" aria-hidden="true">1</span><span className="pf-ab-pin pf-ab-window" aria-hidden="true">2</span>
          </div>
          <figcaption><p><b>1 人物：</b>脸和黄外套未改，人物与窗边的亮度竞争减弱。</p><p><b>2 窗户：</b>亮面更收敛，原有褶皱仍在；没有补造白窗里缺失的纹理。</p></figcaption>
        </figure>
      </div>
      <p className="pf-note">三版使用同一张 AI 生成的概念帧。B 整体提亮并增加反差；C 只在 A 的左窗与白帘范围内，用羽化蒙版压低高亮。</p>
      <div className="pf-grid-2 pf-ab-verdict">
        <div><h3>为什么从 A 改</h3><p>B 的脸部更亮，却也让窗户和床单更抢眼。A 的冷暖关系更符合镜头要求，问题集中在左窗，没必要再调全图。</p></div>
        <div><h3>结论：保留 C</h3><p>同尺寸看，C 的窗边没有 A 那么刺眼，也不像 B 那样让床单跳出来。白帘原有明暗层次保住了，但没有恢复已经过白的细节。它让人物更容易先被注意到，同时仍看得出是窗侧晨光。</p></div>
      </div>
      <details className="pf-ab-inspect">
        <summary>放大对比 A 与 C</summary>
        <p className="pf-note">切换时先看左窗白帘，再看脸和黄外套。</p>
        <input id="pf-ac-toggle" type="checkbox" />
        <label htmlFor="pf-ac-toggle">显示 C 版局部修正</label>
        <figure className="pf-ab-stage">
          <div className="pf-ab-image">
            <Image src={frame} alt="放大对照：知夏、左窗和白帘" loading="lazy" />
            <div className="pf-ab-grade" aria-hidden="true"><Image src={frame} alt="" loading="lazy" /></div>
          </div>
          <figcaption><span className="pf-ab-a">当前：A 原始调色</span><span className="pf-ab-c">当前：C 仅左窗与白帘压高光</span></figcaption>
        </figure>
      </details>
    </div>
  );
}
