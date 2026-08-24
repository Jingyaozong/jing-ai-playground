import type { Metadata } from 'next';
import { PageIntro } from '../components/page-intro';
import { Reveal } from '../components/reveal';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { ToolCard } from '../components/tool-card';
import { tools } from '../data/content';

export const metadata: Metadata = { title: 'Little Tools — JING AI PLAYGROUND', description: '为创作、评测与日常小麻烦做的轻量工具。' };

export default function ToolsPage() {
  return <main><SiteHeader active="Tools" /><PageIntro eyebrow="Shelf C / Little Tools" count={`${tools.length} tiny helpers`} title="Little Tools" description="不是一套宏大的产品矩阵。只是把创作和工作里那些重复的小麻烦，做成顺手的小按钮。" />
    <section className="archive-shell tools-page-grid">{tools.map((tool, index) => <Reveal key={tool.id}><ToolCard tool={tool} index={index} /></Reveal>)}<article className="tool-idea-card"><span className="mono">Next empty slot</span><h2>这里还可以放一个<br />新的小东西。</h2><p>有想法时再填，不为了凑数。</p></article></section><SiteFooter /></main>;
}
