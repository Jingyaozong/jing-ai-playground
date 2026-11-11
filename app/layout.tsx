import type { Metadata } from 'next';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import './globals.css';
import './editorial-refinement.css';
import './tool-form-refinement.css';
import './tool-directory.css';
import './note-list-refinement.css';
import './library-reading.css';

const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')}/`;
const metadataBase = new URL(siteUrl);
const socialImage = new URL('og.png', metadataBase);
const siteTitle = 'JING AI PLAYGROUND — 荆的创作与评测工作台';
const siteDescription = '以多模态美学评测为精选案例，收录荆的故事、实验、笔记、收藏与浏览器工具。';

export const metadata: Metadata = {
  metadataBase,
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    url: metadataBase,
    siteName: 'JING AI PLAYGROUND',
    title: siteTitle,
    description: siteDescription,
    images: [{ url: socialImage, width: 1536, height: 864, alt: 'JING AI PLAYGROUND' }],
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [socialImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
