import type { Metadata } from 'next';
import { pageMeta } from '../lib/seo';
import { PageIntro } from '../components/page-intro';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { ToolDirectory } from '../components/tool-directory';
import { ToolHashFocus } from '../components/tool-hash-focus';
import { ToolWorkflowMap } from '../components/tool-workflow-map';
import { ToolWorkScenes } from '../components/tool-work-scenes';
import { tools } from '../data/content';

export const metadata: Metadata = pageMeta({ title: '小工具', description: '为评测和 AI 视频制作做的浏览器本地工具。', robots: { index: false, follow: true } });

export default function ToolsPage() {
  return <main className="tools-index-page"><ToolHashFocus /><SiteHeader active="Tools" /><PageIntro eyebrow="归档 / 工具" count={`${tools.length} 个`} title="小工具" description="把创作和工作里重复的小麻烦，做成在浏览器本地使用的小工具。输入不会上传；生成的计划与记录仍需人工核对。" />
    <nav className="tool-entry-links archive-shell" aria-label="工具箱浏览方式"><a href="#work-scenes">按工作场景进入 ↓</a><a href="#tool-workflow-title">按制作阶段浏览 ↓</a><a href="#all-tools">按名称找工具 ↓</a></nav>
    <ToolWorkScenes />
    <ToolWorkflowMap />
    <ToolDirectory /><SiteFooter /></main>;
}
