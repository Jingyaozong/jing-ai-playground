import type { Metadata } from 'next';
import Link from 'next/link';
import { ShotListCleaner } from '../../components/shot-list-cleaner';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: '分镜整理器 — JING AI PLAYGROUND',
  description: '把散乱的分镜笔记整理成带时长、完整度和 Prompt 骨架的可编辑镜头表。',
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
          <p>把脑子里跳来跳去的画面先写下来，再整理成包含镜号、景别、时长、动作、运镜和声音的工作表，并导出逐镜 Prompt 骨架。</p>
        </div>
      </header>

      <div className="tool-detail-shell shot-detail-shell"><ShotListCleaner /></div>
      <SiteFooter />
    </main>
  );
}
