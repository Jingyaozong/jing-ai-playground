import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import experimentPilotSamples from '../../assets/generated/forty-shots-pilot-samples.png';
import fictionalPosterInputs from '../../assets/generated/fictional-poster-inputs.webp';
import floodedLibraryPoster from '../../assets/generated/poster-pilot-02-flooded-library.png';
import orchardElevatorPoster from '../../assets/generated/poster-pilot-02-orchard-elevator.png';
import oceanLaundromatPoster from '../../assets/generated/poster-pilot-02-ocean-laundromat.png';
import rainCharacterAnchor from '../../assets/generated/before-the-rain-ends-character-anchor.webp';
import shadowCharacterAnchor from '../../assets/generated/shadow-arrives-five-minutes-early-character-anchor.webp';
import characterAnchor from '../../assets/generated/she-forgets-yesterday-character-anchor.png';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';
import { EditorialHeading, editorialLines } from '../../components/editorial-heading';
import { ExperimentRecordBoard } from '../../components/experiment-record-board';
import { LightingContinuityBoard } from '../../components/lighting-continuity-board';
import { RainFollowRecordBoard } from '../../components/rain-follow-record-board';
import { ReferenceComparisonBoard } from '../../components/reference-comparison-board';
import { ShadowOffsetRecordBoard } from '../../components/shadow-offset-record-board';
import { ContactActionRecordBoard } from '../../components/contact-action-record-board';
import { StoryboardAuditBoard } from '../../components/storyboard-audit-board';
import { PosterStoryAuditBoard } from '../../components/poster-story-audit-board';
import { WaterlineMotionRecordBoard } from '../../components/waterline-motion-record-board';
import { WaterlineCover } from '../../components/waterline-cover';
import { experimentEvidenceLabels, experiments } from '../../data/content';
import { experimentDetails, getExperimentBySlug } from '../../data/experiments';

export const dynamicParams = false;

export function generateStaticParams() {
  return experimentDetails.map((experiment) => ({ slug: experiment.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const experiment = getExperimentBySlug(slug);
  if (!experiment) return {};
  return {
    title: `${experiment.title} — JING EXPERIMENTS`,
    description: experiment.summary,
  };
}

export default async function ExperimentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const experiment = getExperimentBySlug(slug);
  if (!experiment) notFound();
  const archiveExperiment = experiments.find((item) => item.slug === slug);
  if (!archiveExperiment) notFound();
  const evidenceKind = archiveExperiment.evidenceKind;
  const testCount = experiment.testCount ?? 40;
  const testUnit = experiment.testUnit ?? 'TEST SHOTS';
  const reference = experiment.reference ?? {
    kind: 'character' as const,
    label: 'IDENTITY ANCHOR · 2026-08-25',
    title: '先固定“她是谁”。',
    description: '黑色齐下巴短发、右侧蓝色发夹、红色三角耳饰、黄色针织外套和象牙白上衣，是这轮测试要求保留的五个视觉锚点。角色为 AI 生成的虚构人物。',
  };
  const referenceImage = reference.asset === 'rain-character-anchor'
    ? rainCharacterAnchor
    : reference.asset === 'shadow-character-anchor'
      ? shadowCharacterAnchor
      : characterAnchor;

  return (
    <main className={`experiment-detail-page${experiment.recordBoard === 'waterline-motion' ? ' waterline-detail' : ''}`}>
      <SiteHeader active="Experiments" />

      <header className="experiment-detail-hero">
        <div className="experiment-detail-rail mono">
          <Link href="/experiments/">← 返回实验</Link>
          <span>JING LAB NOTE · EXP. {experiment.number}</span>
        </div>
        <div className="experiment-detail-hero-grid">
          <div className="experiment-detail-title">
            <div className="experiment-detail-labels mono">
              <span>{experiment.category}</span>
              <span>{experiment.date.replaceAll('.', ' / ')}</span>
              {experiment.demo && <b>{experiment.pilotLabel ?? 'PILOT · 4 / 40'}</b>}
            </div>
            <span className={`project-truth-badge truth-${evidenceKind} mono`}>{experimentEvidenceLabels[evidenceKind]}</span>
            <h1>{experiment.titleLines ? experiment.titleLines.map((line) => <span key={line}>{line}</span>) : experiment.title}</h1>
            <p>{experiment.summary}</p>
            <p className="experiment-evidence-note">{evidenceKind === 'static-pilot'
              ? '现有四格静态生成图；40 镜是后续测试计划。没有视频样本，也没有正式模型结论。'
              : evidenceKind === 'text-pilot'
                ? '现有九份故事文本输出与页面编辑初审；海报是视觉输入，不是视频结果。评分尚待荆或第二位评审者确认。'
                : `当前只有测试协议；${testCount} 个位置均待执行。没有生成输出或模型结论。`}</p>
            <div className="experiment-title-footer mono">
              <span>{experiment.englishTitle}</span>
              <span>{experiment.status}</span>
            </div>
            {experiment.recordBoard === 'waterline-motion' && <a className="experiment-record-jump" href="#record-desk"><span>打开本地执行记录</span><b>↓</b></a>}
          </div>
          {experiment.recordBoard === 'waterline-motion' ? <WaterlineCover /> : <div className="forty-board" aria-label={`${testCount} 个测试单元编号板`}>
            <div className="forty-board-top mono"><span>{testUnit}</span><span>01—{String(testCount).padStart(2, '0')}</span></div>
            <strong>{testCount}</strong>
            <span className="forty-board-evidence mono">{evidenceKind === 'static-pilot' ? '40 PLANNED · 4 STATIC · NO VIDEO' : evidenceKind === 'text-pilot' ? 'TEXT OUTPUTS · NO VIDEO' : 'PLANNED CELLS · 0 GENERATED'}</span>
            <div className="forty-cells" aria-hidden="true">
              {Array.from({ length: testCount }, (_, index) => <i key={index}>{String(index + 1).padStart(2, '0')}</i>)}
            </div>
          </div>}
        </div>
      </header>

      {experiment.demo && (
        <aside className="experiment-demo-notice">
          <span className="mono">PILOT NOTICE</span>
          <p>{experiment.notice ?? '页面已放入 2026-08-25 生成的四格静态样本，用来验证角色锚点与记录方法；尚未按 A—D 四组完成 40 镜视频测试。以下观察只针对这张样本板，不代表模型排名或正式结论。'}</p>
        </aside>
      )}

      <section className="experiment-question section-shell">
        <p className="eyebrow mono">The question / 实验问题</p>
        <EditorialHeading lines={experiment.questionLines} mode="statement" />
        <div className="experiment-hypothesis">
          <span className="mono">WORKING HYPOTHESIS</span>
          <p>{experiment.hypothesis}</p>
        </div>
      </section>

      <section className="experiment-protocol">
        <div className="experiment-section-inner">
          <div className="experiment-section-heading">
            <div><p className="eyebrow mono">01 / Protocol</p><EditorialHeading lines={editorialLines(experiment.protocolTitle ?? '先固定什么，\n再改变什么。')} /></div>
            <p>{experiment.protocolDescription ?? '一次只改变一类主要变量，才能知道角色是从哪里开始失去一致性的。'}</p>
          </div>
          <div className="experiment-constants">
            <span className="mono">CONTROL / 保持不变</span>
            <ol>{experiment.constants.map((item) => <li key={item}>{item}</li>)}</ol>
          </div>
          <div className="experiment-group-grid">
            {experiment.groups.map((group) => (
              <article className={`experiment-group-card tone-${group.tone}`} key={group.code}>
                <div><b>{group.code}</b><span className="mono">{group.shots}</span></div>
                <h3>{group.title}</h3>
                <p>{group.variable}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="experiment-samples section-shell">
        <div className="experiment-section-heading">
          <div><p className="eyebrow mono">{evidenceKind === 'protocol' ? '02 / Planned cells · 待执行' : evidenceKind === 'static-pilot' ? '02 / Static pilot · 静态图' : '02 / Text outputs · 故事文本'}</p><EditorialHeading lines={editorialLines(experiment.sampleTitle ?? '不是展示最好看，\n而是留下变化。')} /></div>
          <p>{experiment.sampleDescription ?? '首轮先放入四格静态样本。正式实验会继续扩展到四十镜，并同时保留最稳定与最容易漂移的结果。'}</p>
        </div>
        <article className={`experiment-reference-card${evidenceKind === 'protocol' ? ' is-protocol' : ''}`}>
          {evidenceKind === 'protocol' && <span className="experiment-reference-kind mono">{reference.kind === 'reference-pack' ? '参考图待制作 · 非实验结果' : reference.kind === 'character' ? 'AI 角色锚点 · 非实验结果' : '协议示意图 · 非实验结果'}</span>}
          {reference.kind === 'character'
            ? <div className="experiment-reference-image" aria-label={reference.imageAlt ?? '实验角色锚点图'} style={{ backgroundImage: `url("${referenceImage.src}")` }} />
            : reference.kind === 'light-map'
              ? <div className="experiment-reference-image is-light-map" aria-label="北窗冷光、桌灯暖光、人物与四个摄影机位的世界坐标图"><span className="light-map-window mono">NORTH WINDOW · COOL</span><span className="light-map-ray ray-one" /><span className="light-map-ray ray-two" /><b className="light-map-subject">S<small className="mono">SUBJECT</small></b><i className="light-map-lamp">●<small className="mono">WARM DESK LAMP</small></i>{['C1', 'C2', 'C3', 'C4'].map((camera) => <em className={`light-map-camera camera-${camera.toLowerCase()}`} key={camera}>{camera}</em>)}<strong className="mono">LIGHTS STAY · CAMERAS MOVE</strong></div>
              : reference.kind === 'contact-layout'
                ? <div className="experiment-reference-image is-contact-layout" aria-label="右手、杯柄与桌面的接触关系示意图"><div className="contact-reference-hand"><i /><i /><i /><b /></div><div className="contact-reference-cup"><i /><b /></div><em>＋</em><span className="mono">GAP → CONTACT → SUPPORT</span></div>
                : reference.kind === 'storyboard-benchmark'
                  ? <div className="experiment-reference-image is-storyboard-benchmark" aria-label="原故事、人工最低拍点与自动分镜输出的对照关系图"><article><span className="mono">01 / SOURCE</span><b>原故事</b><i /><i /><i /></article><em>→</em><article><span className="mono">02 / BASELINE</span><b>人工拍点</b><i /><i /><i /></article><em>↔</em><article><span className="mono">03 / AUDIT</span><b>自动输出</b><i /><i /><i /></article><strong className="mono">FACTS → MINIMUM BEATS → COMPARE</strong></div>
                : reference.kind === 'waterline-sequence'
                  ? <div className="experiment-reference-image is-waterline-sequence" aria-label="红伞先完全撑开，水线随后沿左前到右后的单一方向退去"><span className="mono">CAUSAL ORDER / 因果顺序</span><div><figure><b>01</b><i /><small>伞保持合拢</small></figure><em>→</em><figure><b>02</b><i className="is-open" /><small>伞骨完全锁定</small></figure><em>→</em><figure><b>03</b><i className="is-receding" /><small>水线单向后退</small></figure></div><strong className="mono">CLOSED → LOCKED OPEN → WATER RECEDES</strong></div>
                : reference.kind === 'poster-inputs-v2'
                  ? <div className="experiment-reference-image is-poster-inputs-v2" aria-label="三张 AI 生成虚构电影海报输入：水中图书馆、果园电梯与海中洗衣机"><figure style={{ backgroundImage: `url("${floodedLibraryPoster.src}")` }}><span className="mono">P04 · FLOODED LIBRARY</span></figure><figure style={{ backgroundImage: `url("${orchardElevatorPoster.src}")` }}><span className="mono">P05 · ORCHARD ELEVATOR</span></figure><figure style={{ backgroundImage: `url("${oceanLaundromatPoster.src}")` }}><span className="mono">P06 · OCEAN LAUNDROMAT</span></figure><b className="mono">AI-GENERATED INPUTS · NO TITLE · NO REAL FILM</b></div>
                : reference.kind === 'poster-inputs'
                  ? <div className="experiment-reference-image is-poster-inputs" aria-label="三张 AI 生成虚构电影海报输入：双月公交站、退潮电影院与室内落雪的失物招领处" style={{ backgroundImage: `url("${fictionalPosterInputs.src}")` }}><span className="mono">P01 · DOUBLE MOON</span><span className="mono">P02 · LOW TIDE CINEMA</span><span className="mono">P03 · INDOOR SNOW</span><b className="mono">AI-GENERATED INPUTS · NOT STORY OUTPUTS</b></div>
                : <div className="experiment-reference-image is-reference-pack" aria-label="待制作的正面、侧面与全身参考图位置"><i>FRONT</i><i>SIDE</i><i>FULL</i><b className="mono">WAITING FOR CONSISTENT SOURCES</b></div>}
          <div><span className="mono">{reference.label}</span><h3>{reference.title}</h3><p>{reference.description}</p></div>
        </article>
        <div className="experiment-sample-grid">
          {experiment.samples.map((sample, index) => (
            <article className="experiment-sample-card" key={sample.shot}>
              <div className={`experiment-sample-visual tone-${sample.tone} ${sample.outputText ? 'has-text-output' : sample.generated === false ? 'is-planned-frame' : 'has-generated-frame'}`} aria-label={sample.generated === false ? `${sample.title}，${sample.status}` : sample.outputText ? `${sample.title} AI 生成故事文本` : `${sample.title} AI 生成静态图，非视频`} style={sample.generated === false || sample.outputText ? undefined : { backgroundImage: `url("${experimentPilotSamples.src}")`, backgroundPosition: sample.framePosition }}>
                <span className="sample-crosshair" />
                {sample.outputText && <p>{sample.outputText}</p>}
                <b className="mono">{sample.generated === false ? sample.status : sample.outputText ? '真实文本 · 编辑初审' : 'AI 静态图 · 非视频'}</b>
                <i className="mono">{String(index + 1).padStart(2, '0')} / {String(experiment.samples.length).padStart(2, '0')}</i>
              </div>
              <div className="experiment-sample-copy">
                <div className="mono"><span>{sample.shot}</span><span>{sample.status}</span></div>
                <h3>{sample.title}</h3>
                <p className="sample-setting">{sample.setting}</p>
                <p>{sample.observation}</p>
                {sample.rawHref && <Link className="sample-raw-link" href={sample.rawHref}>查看原始输出 ↗</Link>}
              </div>
            </article>
          ))}
        </div>
      </section>

      {experiment.sources && experiment.sources.length > 0 && <section className="experiment-source-strip"><div className="experiment-section-inner"><div className="experiment-section-heading"><div><p className="eyebrow mono">Capability sources / 能力边界</p><EditorialHeading lines={['先看官方怎么说，', '再决定怎么测。']} /></div><p>这些链接只用于确认参考模式和输入边界，不会被当成实验结果。功能可能随模型版本变化，执行当天仍需复核。</p></div><div className="experiment-source-grid">{experiment.sources.map((source, index) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><span className="mono">SOURCE {String(index + 1).padStart(2, '0')}</span><h3>{source.title}</h3><p>{source.note}</p><i>打开官方资料 ↗</i></a>)}</div></div></section>}

      <section className="experiment-checks">
        <div className="experiment-section-inner">
          <div className="experiment-section-heading">
            <div><p className="eyebrow mono">03 / Observation</p><EditorialHeading lines={editorialLines(experiment.observationTitle ?? '别只写：\n“这个崩了”。')} /></div>
            <p>{experiment.observationDescription ?? '把主观感觉拆成可以重复检查的问题，下一次测试才知道该改哪里。'}</p>
          </div>
          <div className="experiment-check-grid">
            {experiment.checks.map((check) => (
              <article className={`experiment-check-card tone-${check.tone}`} key={check.label}>
                <span className="mono">{check.label}</span>
                <h3>{check.question}</h3>
                <p>{check.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {experiment.recordBoard === 'reference-comparison'
        ? <ReferenceComparisonBoard />
        : experiment.recordBoard === 'rain-follow'
          ? <RainFollowRecordBoard />
        : experiment.recordBoard === 'lighting-continuity'
            ? <LightingContinuityBoard />
          : experiment.recordBoard === 'shadow-offset'
            ? <ShadowOffsetRecordBoard />
          : experiment.recordBoard === 'contact-action'
            ? <ContactActionRecordBoard />
          : experiment.recordBoard === 'storyboard-audit'
            ? <StoryboardAuditBoard />
          : experiment.recordBoard === 'poster-story-audit'
            ? <PosterStoryAuditBoard />
          : experiment.recordBoard === 'poster-story-retest'
            ? <PosterStoryAuditBoard mode="retest" />
          : experiment.recordBoard === 'waterline-motion'
            ? <WaterlineMotionRecordBoard />
          : <ExperimentRecordBoard />}

      <section className="experiment-next section-shell">
        <div className="experiment-next-title"><span className="mono">NEXT RUN</span><strong>→</strong><h2>下一轮怎么做</h2></div>
        <ol>{experiment.nextSteps.map((step, index) => <li key={step}><span className="mono">{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol>
        <div className="experiment-open-ending"><span className="mono">CURRENT CONCLUSION</span><p>{experiment.currentConclusion ?? '四格静态样本证明这套身份锚点与观察表可以工作；四十镜正式测试尚未开始。'}</p><b>{experiment.conclusionBadge ?? '不做模型排名'}</b></div>
      </section>

      <nav className="experiment-detail-back"><Link href="/experiments/">← 查看全部实验</Link>{experiment.toolHref && <Link href={experiment.toolHref}>{experiment.toolLabel ?? '打开配套工具 ↗'}</Link>}<Link href={experiment.relatedHref ?? '/notes/ninety-second-storyboard/'}>{experiment.relatedLabel ?? '阅读拆镜方法 ↗'}</Link>{experiment.relatedLinks?.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}</nav>
      <SiteFooter />
    </main>
  );
}
