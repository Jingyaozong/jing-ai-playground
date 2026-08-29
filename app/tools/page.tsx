import type { Metadata } from 'next';
import { PageIntro } from '../components/page-intro';
import { Reveal } from '../components/reveal';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { ToolCard } from '../components/tool-card';
import { ToolWorkflowMap } from '../components/tool-workflow-map';
import { tools } from '../data/content';

export const metadata: Metadata = { title: 'Little Tools — JING AI PLAYGROUND', description: '为创作、评测与日常小麻烦做的轻量工具。' };

export default function ToolsPage() {
  return <main><SiteHeader active="Tools" /><PageIntro eyebrow="Shelf C / Little Tools" count={`${tools.length} tiny helpers`} title="Little Tools" description="不是一套宏大的产品矩阵。只是把创作和工作里那些重复的小麻烦，做成顺手的小按钮。" />
    <ToolWorkflowMap />
    <section className="tool-archive-heading archive-shell" id="all-tools"><div><p className="eyebrow mono">ALL TOOLS / 完整工具箱</p><h2>需要哪一件，<br />就拿哪一件。</h2></div><p>每个工具都可以独立使用，所有输入只在当前浏览器本地处理。</p></section>
    <section className="archive-shell tools-page-grid">{tools.map((tool, index) => <Reveal key={tool.id}><ToolCard tool={tool} index={index} /></Reveal>)}</section><SiteFooter /></main>;
}
