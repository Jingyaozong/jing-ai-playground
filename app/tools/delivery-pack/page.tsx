import type { Metadata } from 'next';
import Link from 'next/link';
import { DeliveryPackBuilder } from '../../components/delivery-pack-builder';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: '交付清单生成器 — JING AI PLAYGROUND',
  description: '规划视频交付目录，检查母版、字幕、声音、工程、授权与清单，并生成 README、CSV 和 SHA-256 命令。',
};

export default function DeliveryPackPage() {
  return (
    <main>
      <SiteHeader active="Tools" />
      <header className="tool-detail-hero delivery-detail-hero">
        <div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / 012</span></div>
        <div className="tool-detail-title">
          <div><p className="eyebrow mono">Delivery pack / 交付封箱</p><h1>别急着发文件，<br /><em>先把交付包封好。</em></h1></div>
          <p>选择本次真正需要交付的目录，逐项确认母版、平台版、字幕、声音、工程与授权，再生成可复制的说明和清单。</p>
        </div>
      </header>
      <div className="tool-detail-shell delivery-detail-shell">
        <DeliveryPackBuilder />
        <section className="delivery-method-note">
          <div><span className="mono">CHECKLIST IS NOT INSPECTION / 清单不是检查结果</span><h2>工具负责列清，<br />人负责真正验收。</h2></div>
          <p>本工具不读取或上传文件，也不会验证编码、字幕、混音、工程恢复与授权。只有在真实目录中逐项检查并完成恢复测试后，才应该把交付包标记为完成。</p>
          <Link href="/notes/ai-video-asset-archive-delivery/">阅读完整素材归档与交付方法 ↗</Link>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
