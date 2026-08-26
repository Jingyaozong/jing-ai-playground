import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import storyKeyframes from '../../assets/generated/she-forgets-yesterday-keyframes.png';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';
import { getStoryBySlug, storyDetails } from '../../data/stories';

export const dynamicParams = false;

export function generateStaticParams() {
  return storyDetails.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) return {};
  return { title: `${story.title} — JING STORIES`, description: story.logline };
}

export default async function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  return (
    <main className="story-detail-page">
      <SiteHeader active="Stories" />

      <header className="story-detail-hero">
        <div className="story-detail-rail mono"><Link href="/stories/">← 返回故事</Link><span>JING STORY · {story.number}</span></div>
        <div className="story-detail-hero-grid">
          <div className="story-detail-title">
            <div className="story-detail-labels mono"><span>{story.type}</span><span>{story.duration}</span><b>{story.status}</b></div>
            <h1>{story.title}</h1>
            <p>{story.logline}</p>
            <div className="story-title-footer mono"><span>{story.englishTitle}</span><span>{story.date}</span></div>
          </div>
          <div className="memory-letter" aria-label="写给明天的信件概念视觉">
            <div className="memory-letter-stamp mono">DO NOT THROW AWAY</div>
            <span className="mono">TO / 明天醒来的我</span>
            <strong>DAY<br />01</strong>
            <p>如果你正在读这封信，<br />说明我又忘记了。</p>
            <div className="memory-letter-bottom mono"><span>OPEN AT 06:42</span><span>↘</span></div>
          </div>
        </div>
      </header>

      {story.draft && <aside className="story-draft-notice"><span className="mono">AI-ASSISTED DRAFT</span><p>这是由 AI 编辑与图像生成工具完成的原创概念稿，尚未由荆确认或进入正式制作。四张画面是 2026-08-25 生成的视觉开发素材，不代表已经完成的成片或个人制作经历。</p></aside>}

      <section className="story-premise section-shell">
        <p className="eyebrow mono">The heart of the story / 故事真正想问</p>
        <h2>{story.premise}</h2>
      </section>

      <section className="story-dayline">
        <div className="story-section-inner">
          <div className="story-section-heading"><div><p className="eyebrow mono">01 / One day</p><h2>她只有一天，<br />重新认识昨天。</h2></div><p>剧情结构草案按照一天中的真实时间推进。时间不是装饰，而是记忆再次清零前的倒计时。</p></div>
          <div className="story-beat-grid">
            {story.beats.map((beat, index) => <article className={`story-beat tone-${beat.tone}`} key={beat.time}><div className="mono"><span>{beat.time}</span><span>{String(index + 1).padStart(2, '0')} / 06</span></div><h3>{beat.title}</h3><p>{beat.copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="story-rules section-shell">
        <div className="story-section-heading"><div><p className="eyebrow mono">02 / Memory rules</p><h2>三个东西，<br />帮她熬过今天。</h2></div><p>故事里的道具都有明确作用：保存事实、制造疑问，或者提醒时间正在消失。</p></div>
        <div className="story-rule-list">
          {story.rules.map((rule, index) => <article key={rule.label}><span className="mono">{String(index + 1).padStart(2, '0')} · {rule.label}</span><h3>{rule.title}</h3><p>{rule.copy}</p></article>)}
        </div>
      </section>

      <section className="story-stills">
        <div className="story-section-inner">
          <div className="story-section-heading"><div><p className="eyebrow mono">03 / Key frames</p><h2>四张图，先把<br />故事的呼吸定下来。</h2></div><p>下面是首轮 AI 概念关键帧。它们用于建立人物锚点、光线和情绪节奏，明确标注为视觉开发素材，不冒充成片剧照。</p></div>
          <div className="story-still-grid">
            {story.stills.map((still, index) => <article className="story-still-card" key={still.shot}><div className={`story-still-placeholder tone-${still.tone} has-generated-frame`} aria-label={`${still.title} AI 概念关键帧`} style={{ backgroundImage: `url("${storyKeyframes.src}")`, backgroundPosition: still.framePosition }}><span className="story-frame-corner corner-a" /><span className="story-frame-corner corner-b" /><b className="mono">AI 概念关键帧</b></div><div className="story-still-copy"><div className="mono"><span>{still.shot}</span><span>{still.status}</span></div><h3>{still.title}</h3><p>{still.direction}</p><small className="mono">FRAME {String(index + 1).padStart(2, '0')} / 04</small></div></article>)}
          </div>
        </div>
      </section>

      <section className="story-script">
        <div className="story-section-inner">
          <div className="story-section-heading"><div><p className="eyebrow mono">04 / Screenplay draft</p><h2>九十秒，<br />把一天留给明天。</h2></div><p>第一版原创短片剧本，按成片时间码编排。对白、旁白与节奏均为 AI 共创草案，等待荆确认后再进入制作。</p></div>
          <div className="story-script-list">
            {story.script.map((scene, index) => <article key={scene.timecode}>
              <div className="story-script-time"><b>{String(index + 1).padStart(2, '0')}</b><span className="mono">{scene.timecode}</span></div>
              <div className="story-script-scene"><span className="mono">SCENE</span><h3>{scene.scene}</h3><p>{scene.visual}</p></div>
              <div className="story-script-voice"><span className="mono">VOICE / 对白</span><p>{scene.voice}</p><small>{scene.sound}</small></div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="story-shots section-shell">
        <div className="story-section-heading"><div><p className="eyebrow mono">05 / Shot list</p><h2>十四个镜头，<br />刚好九十秒。</h2></div><p>镜头表把叙事意图换成可以执行的画面、运镜和声音。当前只锁定节奏，不假装已经完成视频测试。</p></div>
        <div className="story-shot-summary mono"><span>14 SHOTS</span><span>90 SECONDS</span><span>1 DAY</span><span>DRAFT 01</span></div>
        <div className="story-shot-board">
          {story.shotList.map((shot) => <article key={shot.shot}>
            <div className="story-shot-number"><b>{shot.shot}</b><span className="mono">{shot.duration} SEC</span></div>
            <div><span className="mono">景别</span><strong>{shot.size}</strong></div>
            <div className="story-shot-visual"><span className="mono">画面与动作</span><p>{shot.visual}</p></div>
            <div><span className="mono">运镜</span><strong>{shot.camera}</strong></div>
            <div><span className="mono">对白与声音</span><p>{shot.sound}</p></div>
          </article>)}
        </div>
      </section>

      <section className="story-production section-shell">
        <div className="story-section-heading"><div><p className="eyebrow mono">06 / Making of</p><h2>现在做到哪了？</h2></div><p>不是把“制作中”当成一句模糊状态，而是公开每个阶段已经完成什么、接下来缺什么。</p></div>
        <div className="story-production-board">
          {story.production.map((item, index) => <article key={item.phase}><span className="mono">{String(index + 1).padStart(2, '0')}</span><h3>{item.phase}</h3><p>{item.note}</p><b className={`status-${item.status === '完成草案' ? 'done' : item.status === '制作中' ? 'active' : 'waiting'}`}>{item.status}</b></article>)}
        </div>
      </section>

      <section className="story-next">
        <div className="story-section-inner">
          <span className="eyebrow mono">NEXT / 接下来</span>
          <ol>{story.nextSteps.map((step, index) => <li key={step}><b>{String(index + 1).padStart(2, '0')}</b><p>{step}</p></li>)}</ol>
          <div className="story-ending-card"><span className="mono">CURRENT ENDING</span><p>故事还没有结束。<br />它正在被做出来。</p><Link href="/experiments/">查看相关实验 ↗</Link></div>
        </div>
      </section>

      <nav className="story-detail-back"><Link href="/stories/">← 查看全部故事</Link><Link href="/notes/">阅读制作笔记 ↗</Link></nav>
      <SiteFooter />
    </main>
  );
}
