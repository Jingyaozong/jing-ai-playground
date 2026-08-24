import type { Metadata } from 'next';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(`${(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')}/`),
  title: 'JING AI PLAYGROUND — 荆的 AI 创作游乐场',
  description: '用 AI 做故事、影像、工具，以及一些有意思的小东西。',
  openGraph: {
    title: 'JING AI PLAYGROUND',
    description: 'Stories, visuals, tools and weird little things made with AI.',
    images: [{ url: '/og.png', width: 1536, height: 864, alt: 'JING AI PLAYGROUND' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JING AI PLAYGROUND',
    description: 'Stories, visuals, tools and weird little things made with AI.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
