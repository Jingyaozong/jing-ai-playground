import type { Metadata } from 'next';
import Link from 'next/link';
import { SceneAnchorBuilder } from '../../components/scene-anchor-builder';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: '场景锚点卡生成器 — JING AI PLAYGROUND',
  description: '把空间结构、固定家具、道具状态、材质、光线和天气整理成场景母版、单镜 Prompt 块与验收清单。',
};

export default function SceneAnchorPage() {
  return <main><SiteHeader active="Tools" /><header className="tool-detail-hero scene-detail-hero"><div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / 009</span></div><div className="tool-detail-title"><div><p className="eyebrow mono">Scene anchor / 场景蓝图</p><h1>不是相似房间，<br /><em>就是同一个空间。</em></h1></div><p>把门窗、家具、道具、材质、光线和天气写成可核对事实，再生成场景母版、单镜接口与验收清单。</p></div></header><div className="tool-detail-shell scene-detail-shell"><SceneAnchorBuilder /><section className="scene-method-note"><div><span className="mono">WORLD BEFORE SHOT / 先有世界</span><h2>参考图给证据，<br />状态表让时间向前。</h2></div><p>工具只整理你填写的场景事实，不会读取图片、补全画外空间或保证模型保持一致。真正制作时，仍要准备环境 Plates，并把候选镜头并排和放进时间线检查。</p><Link href="/notes/ai-video-scene-consistency/">阅读完整场景一致性方法 ↗</Link></section></div><SiteFooter /></main>;
}
