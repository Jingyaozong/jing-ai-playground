import type { Metadata } from 'next';
import Link from 'next/link';
import { ShotListCleaner } from '../../components/shot-list-cleaner';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: '分镜整理器 — JING AI PLAYGROUND',
  description: '把散乱的分镜笔记整理成可编辑、可复制的镜头表。',
};

export default function ShotListCleanerPage() {
  return (
    <main>
      <SiteHeader active="Tools" />
      <header className="tool-detail-hero shot-detail-hero">
        <div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / 003</span></div>
        <div className="tool-detail-title">
          <div>
            <p className="eyebrow mono">Shot list cleaner / 分镜整理</p>
            <h1>乱写没关系，<br /><em>开拍前排整齐。</em></h1>
          </div>
          <p>把脑子里跳来跳去的画面先写下来，再整理成镜号、景别、动作、运镜和声音都清楚的工作表。</p>
        </div>
      </header>

      <div className="tool-detail-shell shot-detail-shell"><ShotListCleaner /></div>
      <SiteFooter />
    </main>
  );
}
