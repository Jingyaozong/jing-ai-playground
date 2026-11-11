import type { Metadata } from 'next';
import { pageMeta } from '../lib/seo';
import Link from 'next/link';
import { PageHead } from '../components/portfolio-blocks';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { experiments, tools } from '../data/content';
import { libraryItems } from '../data/library';
import { methodNoteSlugs } from '../data/note-config';
import { promptItems } from '../data/prompts';
import { getAllNotes } from '../../lib/notes';

export const metadata: Metadata = pageMeta({ og: 'archive',
  title: '归档',
  description: '学习笔记、方法演示、实验记录与工具的归档。',
  robots: { index: false, follow: true },
});

export default function ArchivePage() {
  const notes = getAllNotes();
  const learning = notes.filter((note) => !note.synthetic && !methodNoteSlugs.includes(note.slug));
  const demos = notes.filter((note) => note.synthetic);
  const archivedExperiments = experiments.filter((item) => item.slug && item.slug !== 'forty-shots-one-character');
  return (
    <main className="pf">
      <SiteHeader />
      <PageHead title="归档" description="学习过程中写下的笔记、方法演示、实验记录和自己做的小工具。核心的评测方法在方法页。" />

      <section className="pf-shell pf-section" id="all-notes" aria-labelledby="archive-notes">
        <div className="pf-section-head"><h2 id="archive-notes">学习笔记</h2><p>{learning.length} 篇，主要是 Prompt、镜头语言和 AI 视频制作流程。</p></div>
        <div className="pf-archive-list">
          {learning.map((note) => <Link href={`/notes/${note.slug}/`} key={note.slug}><strong>{note.title}</strong><span>{note.date.slice(0, 7)}</span></Link>)}
        </div>
      </section>

      <section className="pf-shell pf-section" aria-labelledby="archive-demos">
        <div className="pf-section-head"><h2 id="archive-demos">方法演示</h2><p>用示例情境演示一套方法怎样从头走到尾，非真实项目数据。</p></div>
        <div className="pf-archive-list">
          {demos.map((note) => <Link href={`/notes/${note.slug}/`} key={note.slug}><strong>{note.title}</strong><span>方法演示</span></Link>)}
        </div>
      </section>

      <section className="pf-shell pf-section" aria-labelledby="archive-experiments">
        <div className="pf-section-head"><h2 id="archive-experiments">实验设计</h2><p>已写好对照协议的测试设计。</p></div>
        <div className="pf-archive-list">
          {archivedExperiments.map((item) => <Link href={`/experiments/${item.slug}/`} key={item.id}><strong>{item.title}</strong><span>{item.category}</span></Link>)}
        </div>
      </section>

      <section className="pf-shell pf-section" aria-labelledby="archive-more">
        <div className="pf-section-head"><h2 id="archive-more">其他</h2></div>
        <div className="pf-archive-list">
          <Link href="/tools/"><strong>浏览器本地小工具</strong><span>{tools.length} 个</span></Link>
          <Link href="/prompts/"><strong>Prompt 模板</strong><span>{promptItems.length} 条</span></Link>
          <Link href="/library/"><strong>收藏的文章、视频与论文</strong><span>{libraryItems.length} 条</span></Link>
          <Link href="/briefing/"><strong>多模态行业观察</strong><span>精读</span></Link>
          <Link href="/experiments/"><strong>全部实验设计</strong><span>{experiments.length} 个</span></Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
