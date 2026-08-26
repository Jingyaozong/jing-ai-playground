import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import experimentPilotSamples from '../../assets/generated/forty-shots-pilot-samples.png';
import characterAnchor from '../../assets/generated/she-forgets-yesterday-character-anchor.png';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';
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

  return (
    <main className="experiment-detail-page">
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
              {experiment.demo && <b>PILOT · 4 / 40</b>}
            </div>
            <h1>{experiment.title}</h1>
            <p>{experiment.summary}</p>
            <div className="experiment-title-footer mono">
              <span>{experiment.englishTitle}</span>
              <span>{experiment.status}</span>
            </div>
          </div>
          <div className="forty-board" aria-label="40 个测试镜头编号板">
            <div className="forty-board-top mono"><span>TEST SHOTS</span><span>01—40</span></div>
            <strong>40</strong>
            <div className="forty-cells" aria-hidden="true">
              {Array.from({ length: 40 }, (_, index) => <i key={index}>{String(index + 1).padStart(2, '0')}</i>)}
            </div>
          </div>
        </div>
      </header>

      {experiment.demo && (
        <aside className="experiment-demo-notice">
          <span className="mono">PILOT NOTICE</span>
          <p>页面已放入 2026-08-25 生成的四格静态样本，用来验证角色锚点与记录方法；尚未按 A—D 四组完成 40 镜视频测试。以下观察只针对这张样本板，不代表模型排名或正式结论。</p>
        </aside>
      )}

      <section className="experiment-question section-shell">
        <p className="eyebrow mono">The question / 实验问题</p>
        <h2>{experiment.question}</h2>
        <div className="experiment-hypothesis">
          <span className="mono">WORKING HYPOTHESIS</span>
          <p>{experiment.hypothesis}</p>
        </div>
      </section>

      <section className="experiment-protocol">
        <div className="experiment-section-inner">
          <div className="experiment-section-heading">
            <div><p className="eyebrow mono">01 / Protocol</p><h2>先固定什么，<br />再改变什么。</h2></div>
            <p>一次只改变一类主要变量，才能知道角色是从哪里开始失去一致性的。</p>
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
          <div><p className="eyebrow mono">02 / Sample wall</p><h2>不是展示最好看，<br />而是留下变化。</h2></div>
          <p>首轮先放入四格静态样本。正式实验会继续扩展到四十镜，并同时保留最稳定与最容易漂移的结果。</p>
        </div>
        <article className="experiment-reference-card">
          <div className="experiment-reference-image" aria-label="实验角色锚点图" style={{ backgroundImage: `url("${characterAnchor.src}")` }} />
          <div><span className="mono">IDENTITY ANCHOR · 2026-08-25</span><h3>先固定“她是谁”。</h3><p>黑色齐下巴短发、右侧蓝色发夹、红色三角耳饰、黄色针织外套和象牙白上衣，是这轮测试要求保留的五个视觉锚点。角色为 AI 生成的虚构人物。</p></div>
        </article>
        <div className="experiment-sample-grid">
          {experiment.samples.map((sample, index) => (
            <article className="experiment-sample-card" key={sample.shot}>
              <div className={`experiment-sample-visual tone-${sample.tone} has-generated-frame`} aria-label={`${sample.title} AI 生成首轮样本`} style={{ backgroundImage: `url("${experimentPilotSamples.src}")`, backgroundPosition: sample.framePosition }}>
                <span className="sample-crosshair" />
                <b className="mono">AI 首轮样本</b>
                <i className="mono">{String(index + 1).padStart(2, '0')} / 04</i>
              </div>
              <div className="experiment-sample-copy">
                <div className="mono"><span>{sample.shot}</span><span>{sample.status}</span></div>
                <h3>{sample.title}</h3>
                <p className="sample-setting">{sample.setting}</p>
                <p>{sample.observation}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="experiment-checks">
        <div className="experiment-section-inner">
          <div className="experiment-section-heading">
            <div><p className="eyebrow mono">03 / Observation</p><h2>别只写：<br />“这个崩了”。</h2></div>
            <p>把主观感觉拆成可以重复检查的问题，下一次测试才知道该改哪里。</p>
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

      <section className="experiment-next section-shell">
        <div className="experiment-next-title"><span className="mono">NEXT RUN</span><strong>→</strong><h2>下一轮怎么做</h2></div>
        <ol>{experiment.nextSteps.map((step, index) => <li key={step}><span className="mono">{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol>
        <div className="experiment-open-ending"><span className="mono">CURRENT CONCLUSION</span><p>四格静态样本证明这套身份锚点与观察表可以工作；四十镜正式测试尚未开始。</p><b>不做模型排名</b></div>
      </section>

      <nav className="experiment-detail-back"><Link href="/experiments/">← 查看全部实验</Link><Link href="/notes/">去读 AI 笔记 ↗</Link></nav>
      <SiteFooter />
    </main>
  );
}
