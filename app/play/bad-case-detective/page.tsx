import type { Metadata } from 'next';
import Link from 'next/link';
import { BadCaseDetective } from '../../components/bad-case-detective';
import { PageHead } from '../../components/portfolio-blocks';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';
import { pageMeta } from '../../lib/seo';
import './detective.css';

const description = '看一条 AI 生成的视频，在 25 秒内找出它最主要的问题，再打分，和 7 位评审的盲评结果对比。素材来自五款国产视频模型的真实盲评。';

export const metadata: Metadata = pageMeta({
  og: 'bad-case-detective',
  title: 'Bad Case 侦探',
  description,
});

export default function BadCaseDetectivePage() {
  return (
    <main className="pf">
      <SiteHeader active="Practice" />
      <PageHead
        title="Bad Case 侦探"
        description="评测 AI 视频，第一步是看出哪里坏了。这个小游戏把这一步拿出来让你试：每关一条真实的生成视频，找出问题，再打个分，看看和评审团差多少。"
        back={{ href: '/stories/', label: '创作实践' }}
      />
      <div className="pf-shell" style={{ paddingBottom: 72 }}>
        <BadCaseDetective />
        <p className="pf-note" style={{ marginTop: 40 }}>
          视频和分数都来自<Link className="pf-text-link" href="/cases/five-model-blind-test/">五款国产视频模型的交叉盲评</Link>，每条取该产品这道题的第 1 次生成。失败类型沿用<Link className="pf-text-link" href="/notes/video-failure-cases/">十类 AI 视频失败词典</Link>。
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
