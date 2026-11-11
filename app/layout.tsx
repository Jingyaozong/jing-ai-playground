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

export const metadata: Metadata = {
  metadataBase,
  title: 'JING — 多模态美学评测作品集',
  description: '荆的 AIGC 项目：视觉案例、视频评测方法、评测记录工具与行业精读。',
  openGraph: {
    url: metadataBase,
    siteName: 'JING / 多模态美学',
    title: 'JING — 多模态美学评测作品集',
    description: '从视觉案例到可复查的评测证据。',
    images: [{ url: socialImage, width: 1536, height: 864, alt: 'JING AI PLAYGROUND' }],
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JING — 多模态美学评测作品集',
    description: '从视觉案例到可复查的评测证据。',
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
