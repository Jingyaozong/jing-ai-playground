import type { Metadata } from 'next';
import { PageIntro } from '../components/page-intro';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { ToolDirectory } from '../components/tool-directory';
import { ToolWorkflowMap } from '../components/tool-workflow-map';
import { ToolWorkScenes } from '../components/tool-work-scenes';
import { tools } from '../data/content';

export const metadata: Metadata = { title: 'Little Tools — JING AI PLAYGROUND', description: '为创作、评测与日常小麻烦做的轻量工具。' };

export default function ToolsPage() {
  return <main className="tools-index-page"><SiteHeader active="Tools" /><PageIntro eyebrow="Shelf C / Little Tools" count={`${tools.length} tiny helpers`} title="Little Tools" description="不是一套宏大的产品矩阵。只是把创作和工作里那些重复的小麻烦，做成顺手的小按钮。" />
    <nav className="tool-entry-links archive-shell" aria-label="工具箱浏览方式"><a href="#work-scenes">按工作场景进入 ↓</a><a href="#tool-workflow-title">按制作阶段浏览 ↓</a><a href="#all-tools">按名称找工具 ↓</a></nav>
    <ToolWorkScenes />
    <ToolWorkflowMap />
    <ToolDirectory /><SiteFooter /></main>;
}
