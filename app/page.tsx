import Link from 'next/link';
import aestheticFrame from './assets/generated/she-forgets-yesterday-frame-01-v2.webp';
import pilotSamples from './assets/generated/forty-shots-pilot-samples.webp';
import anchor from './assets/generated/she-forgets-yesterday-character-anchor.webp';
import keyframes from './assets/generated/she-forgets-yesterday-keyframes.webp';
import { ContactList } from './components/contact-links';
import { CaseCard, DimensionGrid, EvaluationFlow } from './components/portfolio-blocks';
import { SiteFooter } from './components/site-footer';
import { SiteHeader } from './components/site-header';
import { isPlaceholder, profile } from './data/profile';
import { blindTest } from './data/blind-test';

export default function Home() {
  // 没填的数字不显示
  const stats = profile.stats.filter((stat) => !isPlaceholder(stat.value));
  return (
    <main className="pf">
      <SiteHeader />
      <section className="pf-hero pf-shell">
        <p className="pf-hero-role">{profile.roleLine}</p>
        <h1>{profile.tagline}</h1>
        {stats.length > 0 && (
          <ul className="pf-stats">
            {stats.map((stat) => <li className="pf-stat" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></li>)}
          </ul>
        )}
        <div className="pf-actions">
          <Link className="pf-button" href="/cases/">看评测案例</Link>
          <Link className="pf-button is-ghost" href="/about/#contact">联系我</Link>
        </div>
      </section>

      <section className="pf-section pf-shell" aria-labelledby="home-game">
        <div className="pf-feature">
          <div>
            <p className="pf-card-tag">网页小游戏 · 约 3 分钟</p>
            <h2 id="home-game">先自己试一次：Bad Case 侦探</h2>
            <p className="pf-lead">看 8 条真实的 AI 生成视频，限时找出每条最主要的问题，再打个分，和 7 位评审的盲评结果对比。其中有几条其实没有问题。</p>
            <div className="pf-actions"><Link className="pf-button" href="/play/bad-case-detective/">开始试玩</Link><Link className="pf-button is-ghost" href={`/cases/${blindTest.slug}/`}>看这次盲评</Link></div>
          </div>
          <Link className="pf-media is-rounded" href="/play/bad-case-detective/" aria-label="开始试玩 Bad Case 侦探">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/videos/blind/badcases/q5-hailuo.webp`} alt="AI 生成的奶茶店视频截帧：红框标出招牌上的假字" width={1280} height={720} />
          </Link>
        </div>
      </section>

      <section className="pf-section pf-shell" aria-labelledby="home-cases">
        <div className="pf-section-head"><h2 id="home-cases">精选评测案例</h2><Link className="pf-text-link" href="/cases/">全部案例</Link></div>
        <div className="pf-grid-3">
          <CaseCard href={`/cases/${blindTest.slug}/`} tag="视频评测 · 五模型交叉盲评" title={blindTest.title} description={blindTest.summary} poster="/videos/blind/posters/q1-happyhorse.webp" alt="盲评题 1 的一帧：雨天窗边木桌上一杯冒着热气的咖啡" />
          <CaseCard href="/experiments/forty-shots-one-character/" tag="视频评测 · 人物一致性" title="同一个角色，换景别、光线、情绪和动作后还是她吗" description="固定角色锚点，逐步叠加变量，记录身份特征在哪一步开始漂移。" image={pilotSamples} alt="同一角色在四种条件下的样本：正面近景、侧逆光、哭泣特写、奔跑回头" />
          <CaseCard href="/method/#aesthetic" tag="画面审美判断" title="晨光里，先看见谁" description="同一张静帧的三版调色对比：用视觉焦点和明暗层次说明为什么保留其中一版。" image={aestheticFrame} alt="知夏穿芥末黄外套坐在冷蓝卧室的床边，左侧窗户透进晨光" />
        </div>
      </section>

      <section className="pf-section pf-shell" aria-labelledby="home-method">
        <div className="pf-section-head"><h2 id="home-method">评测方法</h2><p>我用八个维度看一条视频，每个判断都对应时间码和可见事实，最后给严重度结论。</p></div>
        <DimensionGrid />
        <EvaluationFlow />
        <p className="pf-note"><Link className="pf-text-link" href="/method/">查看完整方法</Link></p>
      </section>

      <section className="pf-section pf-shell" aria-labelledby="home-practice">
        <div className="pf-section-head"><h2 id="home-practice">创作实践</h2><p>我自己也做 AI 短片的前期开发。懂生产端的难点，所以评得准。</p></div>
        <div className="pf-grid-3">
          <CaseCard href="/stories/she-forgets-yesterday/" tag="AI 短片" title="她每天醒来都会忘记昨天" description="90 秒短片的剧本、十四镜分镜与生成 Prompt 包。" image={keyframes} alt="短片《她每天醒来都会忘记昨天》的四张概念关键帧" />
          <CaseCard href="/stories/#anchor" tag="人物一致性" title="四个视觉锚点固定一个角色" description="短发、蓝色发夹、红色三角耳饰、芥末黄外套，贯穿所有镜头。" image={anchor} alt="角色知夏的人物锚点图" />
          <CaseCard href="/stories/#storyboard" tag="分镜开发" title="从分镜到动作风险拆解" description="把每个镜头的动作拆开，提前标出最容易生成失败的位置。" image={aestheticFrame} alt="短片第一场的概念关键帧：清晨醒来" />
        </div>
      </section>

      <section className="pf-section pf-shell" id="contact" aria-labelledby="home-about">
        <div className="pf-contact">
          <div>
            <div className="pf-section-head"><h2 id="home-about">关于与联系</h2></div>
            <p className="pf-lead">{profile.narrative}</p>
            <p className="pf-note"><Link className="pf-text-link" href="/about/">了解更多</Link></p>
          </div>
          <ContactList />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
