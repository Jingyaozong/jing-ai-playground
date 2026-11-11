import type { Metadata } from 'next';
import { pageMeta } from '../../lib/seo';
import Link from 'next/link';
import { BadCaseCard, PageHead, ScoreTable } from '../../components/portfolio-blocks';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';
import { VideoWall } from '../../components/video-wall';
import { videoCase } from '../../data/video-case';

export const metadata: Metadata = pageMeta({ og: 'video-model-comparison',
  title: videoCase.title,
  description: videoCase.summary,
});

export default function VideoCasePage() {
  return (
    <main className="pf">
      <SiteHeader active="Cases" />
      <PageHead title={videoCase.title} description={videoCase.summary} back={{ href: '/cases/', label: '评测案例' }} />

      <section className="pf-shell pf-section" aria-labelledby="case-task">
        <div className="pf-grid-2">
          <div>
            <div className="pf-section-head"><h2 id="case-task">任务卡</h2></div>
            <dl className="pf-facts">{videoCase.taskCard.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
          </div>
          <div>
            <div className="pf-section-head"><h2>验收合同</h2></div>
            <dl className="pf-facts">{videoCase.contract.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
          </div>
        </div>
        <p className="pf-prompt"><b>Prompt</b>{videoCase.prompt}</p>
        <p className="pf-note">验收合同在生成之前写好。写法见<Link className="pf-text-link" href="/notes/ai-video-evaluation/">《AI 视频到底应该怎么评》</Link>。</p>
      </section>

      <section className="pf-shell pf-section" aria-labelledby="case-wall">
        <div className="pf-section-head"><h2 id="case-wall">视频对比</h2></div>
        <VideoWall items={videoCase.models} />
      </section>

      <section className="pf-shell pf-section" aria-labelledby="case-scores">
        <div className="pf-section-head"><h2 id="case-scores">八维评分</h2><p>每格是 1–5 分加一句证据。各维度不合成总分，最后一行给严重度结论。</p></div>
        <ScoreTable models={videoCase.models} rows={videoCase.scores} />
        <p className="pf-note">打分锚点与严重度定义见<Link className="pf-text-link" href="/notes/video-evaluation-eight-dimensions/">八维评测框架</Link>。</p>
      </section>

      <section className="pf-shell pf-section" aria-labelledby="case-bad">
        <div className="pf-section-head"><h2 id="case-bad">Bad Case</h2><p>失败类型来自<Link className="pf-text-link" href="/notes/video-failure-cases/">十类 AI 视频失败词典</Link>。</p></div>
        <div className="pf-grid-3">{videoCase.badCases.map((item) => <BadCaseCard item={item} key={item.id} />)}</div>
      </section>

      <section className="pf-shell pf-section" aria-labelledby="case-conclusion">
        <div className="pf-section-head"><h2 id="case-conclusion">结论</h2></div>
        <ul className="pf-conclusions">{videoCase.conclusions.map((item, index) => <li key={index}><b>{item.model}</b><span>{item.fit}</span></li>)}</ul>
        <ul className="pf-findings">{videoCase.findings.map((finding) => <li key={finding}>{finding}</li>)}</ul>
        <p className="pf-note">样本 N={videoCase.sampleSize}，结论仅限本测试集。</p>
      </section>
      <SiteFooter />
    </main>
  );
}
