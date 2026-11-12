import type { MetadataRoute } from 'next';
import { methodNoteSlugs } from './data/note-config';
import { blindTest } from './data/blind-test';

export const dynamic = 'force-static';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

// 只收录对外页面；归档页面已设置 noindex，不进入站点地图。
const routes = [
  '/',
  '/cases/',
  `/cases/${blindTest.slug}/`,
  '/experiments/forty-shots-one-character/',
  '/method/',
  ...methodNoteSlugs.map((slug) => `/notes/${slug}/`),
  '/projects/',
  '/stories/',
  '/stories/she-forgets-yesterday/',
  '/about/',
  '/tools/multimodal-evaluation/',
  '/tools/continuity-checker/',
  '/tools/shot-version-recorder/',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({ url: `${siteUrl}${route}`, changeFrequency: 'monthly', priority: route === '/' ? 1 : 0.7 }));
}
