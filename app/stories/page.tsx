import type { Metadata } from 'next';
import { pageMeta } from '../lib/seo';
import Image from 'next/image';
import Link from 'next/link';
import rainFrame from '../assets/generated/before-the-rain-ends-frame-01.webp';
import waterFrame from '../assets/generated/before-the-water-recedes-frame-01.webp';
import pierFrame from '../assets/generated/no-boat-at-pier-seven-frame-01.webp';
import objectFrame from '../assets/generated/objects-remember-frame-01.webp';
import shadowFrame from '../assets/generated/shadow-arrives-five-minutes-early-frame-01.webp';
import anchor from '../assets/generated/she-forgets-yesterday-character-anchor.webp';
import keyframes from '../assets/generated/she-forgets-yesterday-keyframes.webp';
import { PageHead } from '../components/portfolio-blocks';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { stories } from '../data/content';
import { getStoryBySlug } from '../data/stories';

export const metadata: Metadata = pageMeta({ og: 'practice',
  title: '创作实践',
  description: '荆的 AI 短片前期开发：分镜、人物锚点、动作风险拆解，以及它们怎样反过来支撑评测。',
});

const frames: Record<string, typeof rainFrame> = {
  'no-boat-at-pier-seven': pierFrame,
  'before-the-rain-ends': rainFrame,
  'shadow-arrives-five-minutes-early': shadowFrame,
  'objects-remember-the-last-sentence': objectFrame,
  'before-the-water-recedes': waterFrame,
};

export default function PracticePage() {
  const main = getStoryBySlug('she-forgets-yesterday');
  const others = stories.filter((story) => story.slug && story.slug !== 'she-forgets-yesterday');
  return (
    <main className="pf">
      <SiteHeader active="Practice" />
      <PageHead title="创作实践" description="我自己做 AI 短片的前期开发：写分镜、定人物锚点、拆动作风险。知道生产端哪里容易出问题，评测时才知道该看哪里。" />

      <section className="pf-shell pf-section" aria-labelledby="practice-main">
        <div className="pf-grid-2">
          <div className="pf-media is-rounded"><Image src={keyframes} alt="短片《她每天醒来都会忘记昨天》的四张概念关键帧" sizes="(max-width: 900px) 100vw, 540px" /></div>
          <div>
            <div className="pf-section-head"><h2 id="practice-main">她每天醒来都会忘记昨天</h2></div>
            <p className="pf-lead">{main?.logline}</p>
            <p className="pf-note">90 秒短片 · 六场 · 十四镜。已完成剧本、分镜、人物锚点、概念关键帧和生成 Prompt 包。</p>
            <p className="pf-note"><Link className="pf-text-link" href="/stories/she-forgets-yesterday/">查看完整开发稿</Link></p>
          </div>
        </div>
      </section>

      <section className="pf-shell pf-section" id="anchor" aria-labelledby="practice-anchor" style={{ scrollMarginTop: 96 }}>
        <div className="pf-section-head"><h2 id="practice-anchor">人物锚点</h2><p>先锁定脸、发型、配饰与服装，再把同一组特征带进所有镜头。评测人物一致性时，我逐项核对这些锚点。</p></div>
        <div className="pf-grid-2">
          <div className="pf-media is-rounded"><Image src={anchor} alt="角色知夏的人物锚点图：短发、蓝色发夹、红色三角耳饰、芥末黄外套" sizes="(max-width: 900px) 100vw, 540px" /></div>
          <ul className="pf-findings">{main?.characterAnchor?.locks.map((lock) => <li key={lock}>{lock}</li>)}</ul>
        </div>
      </section>

      <section className="pf-shell pf-section" id="storyboard" aria-labelledby="practice-risk" style={{ scrollMarginTop: 96 }}>
        <div className="pf-section-head"><h2 id="practice-risk">从分镜到动作风险拆解</h2><p>十四个镜头里，我先挑出三个最容易生成失败的动作，提前写好通过和失败的判断标准。</p></div>
        <div className="pf-table-wrap" tabIndex={0} role="region" aria-label="动作风险拆解表，可横向滚动">
          <table className="pf-table">
            <thead><tr><th scope="col">镜头</th><th scope="col">动作</th><th scope="col">检验什么</th><th scope="col">通过标准</th><th scope="col">失败表现</th></tr></thead>
            <tbody>
              {main?.motionTests.map((test) => (
                <tr key={test.shot}><th scope="row">{test.shot} {test.title}</th><td>{test.action}</td><td>{test.purpose}</td><td>{test.pass}</td><td>{test.fail}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="pf-note">这些失败表现对应<Link className="pf-text-link" href="/notes/video-failure-cases/">十类 AI 视频失败词典</Link>里的类型，评测时直接用同一套标签。</p>
      </section>

      <section className="pf-shell pf-section" aria-labelledby="practice-others">
        <div className="pf-section-head"><h2 id="practice-others">其他短片开发稿</h2></div>
        <div className="pf-grid-3">
          {others.map((story) => (
            <Link className="pf-card" href={`/stories/${story.slug}/`} key={story.id}>
              {story.slug && frames[story.slug] && <div className="pf-media"><Image src={frames[story.slug]} alt={`《${story.title}》的概念关键帧`} sizes="(max-width: 900px) 100vw, 360px" /></div>}
              <div className="pf-card-body"><h3>{story.title}</h3><p>{story.description}</p></div>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
