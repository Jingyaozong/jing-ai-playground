import type { Metadata } from 'next';
import { PageHead } from '../../components/portfolio-blocks';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';
import { VideoWall } from '../../components/video-wall';
import { clipSrc, promptCases, promptSetup, type Finding, type PromptCase } from '../../data/prompt-cases';
import { pageMeta } from '../../lib/seo';

export const metadata: Metadata = pageMeta({
  title: promptSetup.title,
  description: promptSetup.summary,
});

const withBase = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;
const levelClass: Record<Finding['level'], string> = { 严重: 'MAJOR', 一般: 'MINOR', 轻微: 'MINOR', 通过: 'PASS' };

function Findings({ rows, label }: { rows: Finding[]; label: string }) {
  return (
    <div className="pf-table-wrap" tabIndex={0} role="region" aria-label={label}>
      <table className="pf-table pf-findings">
        <thead><tr><th scope="col">时间码</th><th scope="col">现象</th><th scope="col">判断</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.time + row.issue}><th scope="row">{row.time}</th><td>{row.issue}</td><td><span className="pf-severity" data-level={levelClass[row.level]}>{row.level}</span></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PromptDiff({ item }: { item: PromptCase }) {
  const fields = item.v2.map((row) => row.field);
  return (
    <div className="pf-prompt-diff" role="table" aria-label={`案例 ${item.no} 两版提示词对照`}>
      <div className="pf-prompt-row is-head" role="row"><span role="columnheader">字段</span><span role="columnheader">第一版</span><span role="columnheader">第二版</span></div>
      {fields.map((field) => {
        const before = item.v1.find((row) => row.field === field)?.text;
        const after = item.v2.find((row) => row.field === field)?.text;
        const changed = item.changed.includes(field);
        return (
          <div className={changed ? 'pf-prompt-row is-changed' : 'pf-prompt-row'} role="row" key={field}>
            <span role="rowheader">{field}{changed && <em>已修改</em>}</span>
            <p role="cell" data-label="第一版">{before ?? <i>（第一版没有这一行）</i>}</p>
            <p role="cell" data-label="第二版">{changed ? after : <i>同第一版</i>}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function PromptIterationPage() {
  return (
    <main className="pf">
      <SiteHeader active="Cases" />
      <PageHead title={promptSetup.title} description={promptSetup.summary} back={{ href: '/cases/', label: '评测案例' }} />

      <section className="pf-shell pf-section" aria-labelledby="pi-setup">
        <div className="pf-grid-2">
          <div>
            <div className="pf-section-head"><h2 id="pi-setup">实验设置</h2></div>
            <dl className="pf-facts">{promptSetup.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          </div>
          <div>
            <div className="pf-section-head"><h2>三个案例</h2></div>
            <ol className="pf-pi-index">
              {promptCases.map((item) => (
                <li key={item.id}><a href={`#${item.id}`}><b>{item.no}</b><span><strong>{item.focus}</strong>{item.summary}</span></a></li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {promptCases.map((item) => (
        <section className="pf-shell pf-section pf-pi-case" id={item.id} aria-labelledby={`${item.id}-title`} key={item.id} style={{ scrollMarginTop: 96 }}>
          <p className="pf-card-tag">案例 {item.no} · {item.focus}</p>
          <h2 id={`${item.id}-title`} className="pf-pi-title">{item.title}</h2>
          <p className="pf-lead">{item.summary}</p>

          <h3 className="pf-pi-step"><span>1</span>两版提示词</h3>
          <PromptDiff item={item} />

          <h3 className="pf-pi-step"><span>2</span>生成结果</h3>
          <VideoWall
            columns={item.clips.length === 3 ? 3 : 2}
            note="静音播放。可以同步播放，对照看同一时刻的差别。"
            items={item.clips.map((clip) => ({ id: clip.id, name: clip.name, verdict: clip.verdict, ...clipSrc(clip.id) }))}
          />

          <h3 className="pf-pi-step"><span>3</span>第一版 Bad Case</h3>
          <Findings rows={item.v1Findings} label={`案例 ${item.no} 第一版问题表`} />
          <p className="pf-pi-diagnosis"><b>原因判断</b>{item.diagnosis}</p>

          <h3 className="pf-pi-step"><span>4</span>修改后对比</h3>
          <div className="pf-pi-frames">
            {[item.frames.before, item.frames.after].map((shot) => (
              <figure key={shot.src}>
                <div className="pf-media is-rounded">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={withBase(shot.src)} alt={shot.caption} width={960} height={540} loading="lazy" />
                </div>
                <figcaption>{shot.caption}</figcaption>
              </figure>
            ))}
          </div>
          <Findings rows={item.v2Findings} label={`案例 ${item.no} 第二版结果表`} />
          <p className="pf-pi-lesson"><b>可复用的写法</b>{item.lesson}</p>
        </section>
      ))}

      <section className="pf-shell pf-section" aria-labelledby="pi-limits">
        <div className="pf-section-head"><h2 id="pi-limits">样本范围与局限</h2></div>
        <ul className="pf-pi-limits">{promptSetup.limits.map((line) => <li key={line}>{line}</li>)}</ul>
      </section>
      <SiteFooter />
    </main>
  );
}
