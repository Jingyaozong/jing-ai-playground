import type { Metadata } from 'next';

const siteUrl = `${(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')}/`;
export const siteName = 'JING · AI 视频与多模态评测';

// meta description 控制在 80 字以内。
const clip = (text: string) => (text.length > 80 ? `${text.slice(0, 79)}…` : text);

type PageMeta = Omit<Metadata, 'title' | 'description' | 'openGraph' | 'twitter'> & {
  title: string;
  description: string;
  /** public/og/ 下的分享图文件名（不含扩展名），由 scripts/generate-og.mjs 生成 */
  og?: string;
};

/** 让每个页面都有自己的 title、description、og:title、og:description 和 og:image。 */
export function pageMeta({ title, description, og = 'default', ...rest }: PageMeta): Metadata {
  const text = clip(description);
  const image = new URL(`og/${og}.png`, siteUrl).toString();
  return {
    ...rest,
    title,
    description: text,
    openGraph: { title, description: text, siteName, type: 'website', locale: 'zh_CN', images: [{ url: image, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description: text, images: [image] },
  };
}
