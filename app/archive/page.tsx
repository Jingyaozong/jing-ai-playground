import type { Metadata } from 'next';
import Link from 'next/link';

const home = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/`;

export const metadata: Metadata = {
  title: '正在前往首页',
  robots: { index: false, follow: true },
  alternates: { canonical: '/' },
};

// GitHub Pages 没有服务端重定向，这个地址用 meta refresh 跳到首页。
export default function ArchiveRedirect() {
  return (
    <main className="pf">
      <meta httpEquiv="refresh" content={`0; url=${home}`} />
      <div className="pf-shell pf-page-head">
        <h1>这个页面已并入首页</h1>
        <p><Link className="pf-text-link" href="/">前往首页</Link></p>
      </div>
    </main>
  );
}
