import type { Metadata } from 'next';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import './globals.css';
import './editorial-refinement.css';
import './tool-form-refinement.css';
import './tool-directory.css';
import './note-list-refinement.css';
import './library-reading.css';
import './site.css';

const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')}/`;
const metadataBase = new URL(siteUrl);
const socialImage = new URL('og.png', metadataBase);
const siteTitle = 'JING · AI 视频与多模态评测';
const siteDescription = '荆的作品集：AI 视频与多模态评测案例、评测方法、项目经历与创作实践。';

export const metadata: Metadata = {
  metadataBase,
  title: { default: siteTitle, template: '%s — JING' },
  description: siteDescription,
  openGraph: {
    url: metadataBase,
    siteName: siteTitle,
    title: siteTitle,
    description: siteDescription,
    images: [{ url: socialImage, width: 1200, height: 630, alt: siteTitle }],
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
