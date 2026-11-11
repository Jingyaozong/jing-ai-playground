import type { Metadata } from 'next';
import { pageMeta } from '../../lib/seo';
import Link from 'next/link';
import { DatasetReleaseDesk } from '../../components/dataset-release-desk';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';
import './dataset-release.css';

export const metadata: Metadata = pageMeta({ og: 'tool-dataset-release', robots: { index: false, follow: true },
  title: '数据交付四关检查台',
  description: '在浏览器本地记录格式、有效性、质量与追溯四关的人工判断和依据，生成待复核交接记录。',
});

export default function DatasetReleasePage() {
  return <main className="dataset-release-page"><SiteHeader active="Tools" />
    <header className="tool-detail-hero release-hero"><div className="tool-detail-topline mono"><Link href="/tools/#all-tools">← 返回工具箱</Link></div>
      <div className="tool-detail-title"><div><h1>文件能导出，<br /><em>还不等于能交付。</em></h1></div><p>格式、有效性、质量与追溯，按顺序留下人工核对依据。任何未关闭的问题，都不该被一键抹成“已完成”。</p></div></header>
    <div className="tool-detail-shell release-shell"><DatasetReleaseDesk />
      <aside className="release-method"><div><span className="mono">方法连接</span><h2>判断写在前面，<br />责任留在后面。</h2></div><p>四道关口是我做数据交付时用的检查方法。工具只在浏览器本地记录，不接入任何业务数据。</p><Link href="/notes/dataset-release-gates/">阅读四关方法笔记 ↗</Link></aside>
    </div><SiteFooter /></main>;
}
