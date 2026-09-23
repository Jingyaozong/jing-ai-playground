import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import rainCharacterAnchor from '../../assets/generated/before-the-rain-ends-character-anchor.webp';
import rainFrame01 from '../../assets/generated/before-the-rain-ends-frame-01.webp';
import rainFrame02 from '../../assets/generated/before-the-rain-ends-frame-02.webp';
import rainFrame03 from '../../assets/generated/before-the-rain-ends-frame-03.webp';
import rainFrame04 from '../../assets/generated/before-the-rain-ends-frame-04.webp';
import pierCharacterAnchor from '../../assets/generated/no-boat-at-pier-seven-character-anchor.webp';
import pierFrame01 from '../../assets/generated/no-boat-at-pier-seven-frame-01.webp';
import pierFrame02 from '../../assets/generated/no-boat-at-pier-seven-frame-02.webp';
import pierFrame03 from '../../assets/generated/no-boat-at-pier-seven-frame-03.webp';
import pierFrame04 from '../../assets/generated/no-boat-at-pier-seven-frame-04.webp';
import shadowCharacterAnchor from '../../assets/generated/shadow-arrives-five-minutes-early-character-anchor.webp';
import shadowFrame01 from '../../assets/generated/shadow-arrives-five-minutes-early-frame-01.webp';
import shadowFrame02 from '../../assets/generated/shadow-arrives-five-minutes-early-frame-02.webp';
import shadowFrame03 from '../../assets/generated/shadow-arrives-five-minutes-early-frame-03.webp';
import shadowFrame04 from '../../assets/generated/shadow-arrives-five-minutes-early-frame-04.webp';
import objectMemoryCharacterAnchor from '../../assets/generated/objects-remember-character-anchor.webp';
import objectMemoryFrame01 from '../../assets/generated/objects-remember-frame-01.webp';
import objectMemoryFrame02 from '../../assets/generated/objects-remember-frame-02.webp';
import objectMemoryFrame03 from '../../assets/generated/objects-remember-frame-03.webp';
import objectMemoryFrame04 from '../../assets/generated/objects-remember-frame-04.webp';
import memoryCharacterAnchor from '../../assets/generated/she-forgets-yesterday-character-anchor.png';
import memoryFrame01 from '../../assets/generated/she-forgets-yesterday-frame-01-v2.webp';
import memoryFrame02 from '../../assets/generated/she-forgets-yesterday-frame-02-v2.webp';
import memoryFrame03 from '../../assets/generated/she-forgets-yesterday-frame-03-v2.webp';
import memoryFrame04 from '../../assets/generated/she-forgets-yesterday-frame-04-v2.webp';
import storyKeyframes from '../../assets/generated/she-forgets-yesterday-keyframes.png';
import waterRecedesCharacterAnchor from '../../assets/generated/before-the-water-recedes-character-anchor.png';
import waterRecedesFrame01 from '../../assets/generated/before-the-water-recedes-frame-01.png';
import waterRecedesFrame02 from '../../assets/generated/before-the-water-recedes-frame-02.png';
import waterRecedesFrame03 from '../../assets/generated/before-the-water-recedes-frame-03.png';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';
import { EditorialHeading, editorialLines } from '../../components/editorial-heading';
import { StoryPromptPack } from '../../components/story-prompt-pack';
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

  const sectionCopy = story.sectionCopy ?? {
    beats: { eyebrow: '01 / One day', heading: '她只有一天，\n重新认识昨天。', description: '剧情结构草案按照一天中的真实时间推进。时间不是装饰，而是记忆再次清零前的倒计时。' },
    rules: { eyebrow: '02 / Memory rules', heading: '三个东西，\n帮她熬过今天。', description: '故事里的道具都有明确作用：保存事实、制造疑问，或者提醒时间正在消失。' },
    stills: { eyebrow: '03 / Key frames', heading: '四张图，先把\n故事的呼吸定下来。', description: '下面是四张独立 AI 概念关键帧。它们用于检查人物锚点、光线和情绪节奏，明确标注为视觉开发素材，不冒充成片剧照。' },
    script: { eyebrow: '04 / Screenplay draft', heading: '九十秒，\n把一天留给明天。', description: '第一版原创短片剧本，按成片时间码编排。对白、旁白与节奏均为 AI 共创草案，等待荆确认后再进入制作。' },
    shots: { eyebrow: '05 / Shot list', heading: '十四个镜头，\n刚好九十秒。', description: '镜头表把叙事意图换成可以执行的画面、运镜和声音。当前只锁定节奏，不假装已经完成视频测试。' },
  };
  const shotSummary = story.shotSummary ?? ['14 SHOTS', '90 SECONDS', '1 DAY', 'DRAFT 01'];
  const stillsGenerated = story.stillsGenerated ?? true;
  const individualFrames = story.slug === 'she-forgets-yesterday'
    ? [memoryFrame01, memoryFrame02, memoryFrame03, memoryFrame04]
    : story.slug === 'no-boat-at-pier-seven'
      ? [pierFrame01, pierFrame02, pierFrame03, pierFrame04]
    : story.slug === 'before-the-rain-ends'
      ? [rainFrame01, rainFrame02, rainFrame03, rainFrame04]
      : story.slug === 'shadow-arrives-five-minutes-early'
        ? [shadowFrame01, shadowFrame02, shadowFrame03, shadowFrame04]
        : story.slug === 'objects-remember-the-last-sentence'
          ? [objectMemoryFrame01, objectMemoryFrame02, objectMemoryFrame03, objectMemoryFrame04]
        : story.slug === 'before-the-water-recedes'
          ? [waterRecedesFrame01, waterRecedesFrame02, waterRecedesFrame03]
        : null;
  const characterAnchorImage = story.slug === 'she-forgets-yesterday'
    ? memoryCharacterAnchor
    : story.slug === 'no-boat-at-pier-seven'
      ? pierCharacterAnchor
    : story.slug === 'before-the-rain-ends'
      ? rainCharacterAnchor
      : story.slug === 'shadow-arrives-five-minutes-early'
        ? shadowCharacterAnchor
        : story.slug === 'objects-remember-the-last-sentence'
          ? objectMemoryCharacterAnchor
        : story.slug === 'before-the-water-recedes'
          ? waterRecedesCharacterAnchor
        : null;
  const characterAnchorPosition: Record<string, string> = {
    'she-forgets-yesterday': 'center 28%',
    'no-boat-at-pier-seven': 'center 30%',
    'before-the-rain-ends': 'center 54%',
    'shadow-arrives-five-minutes-early': 'center 55%',
    'objects-remember-the-last-sentence': 'center 52%',
    'before-the-water-recedes': 'center 56%',
  };
  const ending = story.ending ?? { label: 'CURRENT ENDING', copy: '故事还没有结束。\n它正在被做出来。', href: '/experiments/', link: '查看相关实验 ↗' };
  const related = story.related ?? { href: '/notes/ninety-second-storyboard/', label: '阅读拆镜方法 ↗' };

  return (
    <main className="story-detail-page">
      <SiteHeader active="Stories" />

      <header className="story-detail-hero">
        <div className="story-detail-rail mono"><Link href="/stories/">← 返回故事</Link><span>JING STORY · {story.number}</span></div>
        <div className="story-detail-hero-grid">
          <div className="story-detail-title">
            <div className="story-detail-labels mono"><span>{story.type}</span><span>{story.duration}</span><b>{story.status}</b></div>
            <h1>{story.titleLines ? story.titleLines.map((line) => <span key={line}>{line}</span>) : story.title}</h1>
            <p>{story.logline}</p>
            <div className="story-title-footer mono"><span>{story.englishTitle}</span><span>{story.date}</span></div>
          </div>
          {story.heroVisual === 'water-ledger' ? (
            <div className="water-ledger-card" aria-label="一条路线与一次退水选择的概念视觉">
              <div className="water-ledger-head mono"><span>ROUTE LEDGER / 撤离证据</span><b>12:00</b></div>
              <div className="water-ledger-stage" aria-hidden="true">
                <div className="water-ledger-route"><i /><i /><i /><i /><i /><i /><i /></div>
                <div className="water-ledger-umbrella"><span /><b /></div>
                <div className="water-ledger-level"><span className="mono">WATERLINE</span></div>
              </div>
              <div className="water-ledger-choice mono"><span><b>09</b> ROUTES SEEN</span><span><b>01</b> ROUTE KEPT</span></div>
              <div className="water-ledger-foot mono"><span>SKIN STORES</span><span>UMBRELLA ERASES</span><b>ONE CHOICE ↗</b></div>
            </div>
          ) : story.heroVisual === 'echo-cup' ? (
            <div className="echo-cup-card" aria-label="白杯接触后播放最后一句话的概念视觉">
              <div className="echo-cup-head mono"><span>TOUCH TO HEAR / 接触后播放</span><b>01×</b></div>
              <div className="echo-cup-stage" aria-hidden="true">
                <div className="echo-cup-hand"><i /><i /><i /><i /></div>
                <div className="echo-cup-object"><span /></div>
                <div className="echo-cup-gap mono">1 CM</div>
                <div className="echo-cup-wave"><span>水凉了</span><span>就别喝了</span></div>
              </div>
              <div className="echo-cup-states mono"><span><b>01</b> GAP</span><span><b>02</b> TOUCH</span><span><b>03</b> LIFT</span></div>
              <div className="echo-cup-foot mono"><span>ONE CUP</span><span>ONE SENTENCE</span><b>NO REPLAY</b></div>
            </div>
          ) : story.heroVisual === 'early-shadow' ? (
            <div className="early-shadow-card" aria-label="影子提前五分钟行动的概念视觉">
              <div className="early-shadow-head mono"><span>CAST SHADOW / 行动草稿</span><b>+05:00</b></div>
              <div className="early-shadow-stage" aria-hidden="true">
                <div className="early-shadow-sun" />
                <div className="early-shadow-person"><i /><b /></div>
                <div className="early-shadow-cast"><i /><b /></div>
                <div className="early-shadow-route"><span /><span /><span /></div>
              </div>
              <div className="early-shadow-times mono"><span><b>17:50</b> / 她还没动</span><span><b>17:55</b> / 影子已改道</span></div>
              <div className="early-shadow-foot mono"><span>ONE LIGHT</span><span>ONE CHOICE</span><b>STILL CHANGEABLE ↗</b></div>
            </div>
          ) : story.heroVisual === 'personal-rain' ? (
            <div className="personal-rain-card" aria-label="只为一个人预报的局部降雨概念视觉">
              <div className="personal-rain-forecast mono"><span>LOCAL FORECAST</span><b>100%</b><small>RAIN / 仅限一人</small></div>
              <div className="personal-rain-stage" aria-hidden="true">
                <div className="personal-rain-cloud" />
                <div className="personal-rain-lines">{Array.from({ length: 9 }, (_, index) => <span key={index} />)}</div>
                <div className="personal-rain-person"><i /><b /></div>
                <div className="personal-rain-radius" />
              </div>
              <div className="personal-rain-footer mono"><span>RADIUS / 1.2 M</span><span>FOLLOWING SUBJECT</span><b>07:20 → 17:03</b></div>
            </div>
          ) : story.heroVisual === 'pier-ticket' ? (
            <div className="pier-ticket" aria-label="第七码头未来船票概念视觉">
              <div className="pier-ticket-route mono"><span>DEPARTURE</span><b>00:17</b><small>ONE WAY / 单程</small></div>
              <div className="pier-ticket-number"><span className="mono">PIER</span><strong>07</strong><em className="mono">NOT ON MAP</em></div>
              <div className="pier-ticket-details mono"><span>PASSENGER / 周渡</span><span>ISSUED BY / 周遥</span><span>DATE / 2036.08.29</span></div>
              <div className="pier-ticket-stub mono"><span>KEEP THIS STUB</span><b>NO BOAT<br />IN SIGHT</b><span>↗ BOARDING</span></div>
            </div>
          ) : (
            <div className="memory-letter" aria-label="写给明天的信件概念视觉">
              <div className="memory-letter-stamp mono">DO NOT THROW AWAY</div>
              <span className="mono">TO / 明天醒来的我</span>
              <strong>DAY<br />01</strong>
              <p>如果你正在读这封信，<br />说明我又忘记了。</p>
              <div className="memory-letter-bottom mono"><span>OPEN AT 06:42</span><span>↘</span></div>
            </div>
          )}
        </div>
      </header>

      {story.draft && <aside className="story-draft-notice"><span className="mono">AI-ASSISTED DRAFT</span><p>{story.draftNotice ?? '这是由 AI 编辑与图像生成工具完成的原创概念稿，尚未由荆确认或进入正式制作。四张画面是 2026-08-25 生成的视觉开发素材，不代表已经完成的成片或个人制作经历。'}</p></aside>}

      <section className="story-premise section-shell">
        <p className="eyebrow mono">The heart of the story / 故事真正想问</p>
        <EditorialHeading lines={story.premiseLines} mode="statement" />
      </section>

      <section className="story-dayline">
        <div className="story-section-inner">
          <div className="story-section-heading"><div><p className="eyebrow mono">{sectionCopy.beats.eyebrow}</p><EditorialHeading lines={editorialLines(sectionCopy.beats.heading)} /></div><p>{sectionCopy.beats.description}</p></div>
          <div className="story-beat-grid">
            {story.beats.map((beat, index) => <article className={`story-beat tone-${beat.tone}`} key={beat.time}><div className="mono"><span>{beat.time}</span><span>{String(index + 1).padStart(2, '0')} / {String(story.beats.length).padStart(2, '0')}</span></div><h3>{beat.title}</h3><p>{beat.copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="story-rules section-shell">
        <div className="story-section-heading"><div><p className="eyebrow mono">{sectionCopy.rules.eyebrow}</p><EditorialHeading lines={editorialLines(sectionCopy.rules.heading)} /></div><p>{sectionCopy.rules.description}</p></div>
        <div className="story-rule-list">
          {story.rules.map((rule, index) => <article key={rule.label}><span className="mono">{String(index + 1).padStart(2, '0')} · {rule.label}</span><h3>{rule.title}</h3><p>{rule.copy}</p></article>)}
        </div>
      </section>

      <section className="story-stills">
        <div className="story-section-inner">
          <div className="story-section-heading"><div><p className="eyebrow mono">{sectionCopy.stills.eyebrow}</p><EditorialHeading lines={editorialLines(sectionCopy.stills.heading)} /></div><p>{sectionCopy.stills.description}</p></div>
          {story.characterAnchor && <article className={`story-character-anchor${characterAnchorImage ? '' : ' is-brief'}`} id="character-anchor">
            {characterAnchorImage ? <div className="story-character-anchor-image" role="img" aria-label={`${story.characterAnchor.name} AI 角色锚点图`} style={{ backgroundImage: `url("${characterAnchorImage.src}")`, backgroundPosition: characterAnchorPosition[story.slug] ?? 'center 28%' }} /> : <div className="story-character-anchor-image is-brief" role="img" aria-label={`${story.characterAnchor.name}角色与道具锚点任务书`}><div className="anchor-brief-person" aria-hidden="true"><i /><b /></div><div className="anchor-brief-cup" aria-hidden="true"><span /></div><div className="anchor-brief-rule mono" aria-hidden="true">FACE / HAND / CUP<br />LOCK BEFORE GENERATION</div></div>}
            <div className="story-character-anchor-copy"><span className="mono">CHARACTER ANCHOR / AI 视觉开发</span><h3>{story.characterAnchor.titleLines ? story.characterAnchor.titleLines.map((line) => <span key={line}>{line}</span>) : story.characterAnchor.title}</h3><p>{story.characterAnchor.copy}</p><ul>{story.characterAnchor.locks.map((lock) => <li key={lock}>{lock}</li>)}</ul><small className="mono">{characterAnchorImage ? (story.characterAnchor.generatedLabel ?? 'GENERATED 2026.08 · FICTIONAL CHARACTER') : 'BRIEF 2026.08 · NO GENERATED IMAGE'}</small></div>
          </article>}
          <div className={`story-still-grid${story.stills.length === 3 ? ' is-three' : ''}`}>
            {story.stills.map((still, index) => <article className="story-still-card" key={still.shot}><div className={`story-still-placeholder tone-${still.tone}${stillsGenerated ? ' has-generated-frame' : ' is-brief'}`} aria-label={stillsGenerated ? `${still.title} AI 概念关键帧` : `${still.title} 待生成关键帧任务书`} style={stillsGenerated ? { backgroundImage: `url("${(individualFrames?.[index] ?? storyKeyframes).src}")`, backgroundPosition: individualFrames ? 'center' : still.framePosition, backgroundSize: individualFrames ? 'cover' : '200% 200%' } : undefined}><span className="story-frame-corner corner-a" /><span className="story-frame-corner corner-b" />{!stillsGenerated && <div className="story-frame-brief mono" aria-hidden="true"><span>IMAGE<br />PENDING</span><strong>{String(index + 1).padStart(2, '0')}</strong><i /></div>}<b className="mono">{stillsGenerated ? 'AI 概念关键帧' : '待生成 · 画面任务书'}</b></div><div className="story-still-copy"><div className="mono"><span>{still.shot}</span><span>{still.status}</span></div><h3>{still.title}</h3><p>{still.direction}</p><small className="mono">FRAME {String(index + 1).padStart(2, '0')} / {String(story.stills.length).padStart(2, '0')}</small></div></article>)}
          </div>
        </div>
      </section>

      <section className="story-script">
        <div className="story-section-inner">
          <div className="story-section-heading"><div><p className="eyebrow mono">{sectionCopy.script.eyebrow}</p><EditorialHeading lines={editorialLines(sectionCopy.script.heading)} /></div><p>{sectionCopy.script.description}</p></div>
          <div className="story-script-list">
            {story.script.map((scene, index) => <article key={scene.timecode}>
              <div className="story-script-time"><b>{String(index + 1).padStart(2, '0')}</b><span className="mono">{scene.timecode}</span></div>
              <div className="story-script-scene"><span className="mono">SCENE</span><h3>{scene.scene}</h3><p>{scene.visual}</p></div>
              <div className="story-script-voice"><span className="mono">VOICE / 对白</span><p>{scene.voice}</p><small>{scene.sound}</small></div>
            </article>)}
          </div>
        </div>
      </section>

      {story.soundPlan && <section className="story-sound-map" id="sound-map">
        <div className="story-section-inner">
          <div className="story-section-heading"><div><p className="eyebrow mono">04B / Sound trigger map</p><EditorialHeading lines={editorialLines(story.soundPlan.heading)} /></div><p>{story.soundPlan.description}</p></div>
          <div className="story-sound-ruler" aria-label={`${story.soundPlan.duration} 秒声音时间尺`}>
            {Array.from({ length: Math.floor(story.soundPlan.duration / 10) + 1 }, (_, index) => <span key={index} className="mono" style={{ left: `${(index * 10 / story.soundPlan!.duration) * 100}%` }}>{String(index * 10).padStart(2, '0')}s</span>)}
          </div>
          <div className="story-sound-lanes">
            {story.soundPlan.lanes.map((lane) => <article className={`story-sound-lane sound-tone-${lane.tone}`} key={lane.label}>
              <header><span className="mono">{lane.label}</span><h3>{lane.role}</h3><b className="mono">{String(lane.cues.length).padStart(2, '0')} CUES</b></header>
              <div className="story-sound-track" aria-label={`${lane.role}时间分布`}>
                {lane.cues.map((cue, index) => <span key={`${cue.start}-${cue.title}`} style={{ left: `${(cue.start / story.soundPlan!.duration) * 100}%`, width: `${((cue.end - cue.start) / story.soundPlan!.duration) * 100}%` }}><b className="mono">{String(index + 1).padStart(2, '0')}</b></span>)}
              </div>
              <div className="story-sound-cue-list">
                {lane.cues.map((cue, index) => <div key={cue.title}><span className="mono">{String(index + 1).padStart(2, '0')} · {String(cue.start).padStart(2, '0')}—{String(cue.end).padStart(2, '0')}s</span><h4>{cue.title}</h4><p>{cue.detail}</p></div>)}
              </div>
            </article>)}
          </div>
          <aside className="story-sound-checks"><div><span className="mono">SYNC CHECK / 时间验收</span><h3>先听接触，<br />再听见一句话。</h3></div><ol>{story.soundPlan.checks.map((check, index) => <li key={check}><b className="mono">{String(index + 1).padStart(2, '0')}</b><p>{check}</p></li>)}</ol></aside>
          <nav className="story-sound-links"><Link href="/notes/ai-video-sound-workflow/">阅读完整声音工作流 ↗</Link><Link href="/tools/sound-layer-card/">打开声音分层卡 ↗</Link></nav>
        </div>
      </section>}

      <section className="story-shots section-shell">
        <div className="story-section-heading"><div><p className="eyebrow mono">{sectionCopy.shots.eyebrow}</p><EditorialHeading lines={editorialLines(sectionCopy.shots.heading)} /></div><p>{sectionCopy.shots.description}</p></div>
        <div className="story-shot-summary mono">{shotSummary.map((item) => <span key={item}>{item}</span>)}</div>
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

      <StoryPromptPack promptGuide={story.promptGuide} prompts={story.prompts} motionTests={story.motionTests} promptTemplate={story.promptTemplate} />

      <section className="story-production section-shell">
        <div className="story-section-heading"><div><p className="eyebrow mono">08 / Making of</p><h2>现在做到哪了？</h2></div><p>每个阶段分别记录已完成内容和仍然缺少的材料，方便后续从故事稿直接进入视觉制作。</p></div>
        <div className="story-production-board">
          {story.production.map((item, index) => <article key={item.phase}><span className="mono">{String(index + 1).padStart(2, '0')}</span><h3>{item.phase}</h3><p>{item.note}</p><b className={`status-${item.status === '完成草案' ? 'done' : item.status === '制作中' ? 'active' : 'waiting'}`}>{item.status}</b></article>)}
        </div>
      </section>

      <section className="story-next">
        <div className="story-section-inner">
          <span className="eyebrow mono">NEXT / 接下来</span>
          <ol>{story.nextSteps.map((step, index) => <li key={step}><b>{String(index + 1).padStart(2, '0')}</b><p>{step}</p></li>)}</ol>
          <div className="story-ending-card"><span className="mono">{ending.label}</span><p>{ending.copy}</p><Link href={ending.href}>{ending.link}</Link></div>
        </div>
      </section>

      <nav className="story-detail-back"><Link href="/stories/">← 查看全部故事</Link><Link href={related.href}>{related.label}</Link></nav>
      <SiteFooter />
    </main>
  );
}
