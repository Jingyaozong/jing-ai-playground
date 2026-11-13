import data from './daily-news.json';

export type NewsItem = { id: string; title: string; summary: string; category: string; source: string; url: string; publishedAt: string };
export type NewsDay = { date: string; items: NewsItem[] };

export const dailyNews = data as { updatedAt: string; days: NewsDay[] };

// 页面统一按北京时间显示
export function beijingTime(iso: string) {
  const date = new Date(new Date(iso).getTime() + 8 * 3600000);
  return `${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')} ${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
}

export function dayLabel(date: string) {
  const [, month, day] = date.split('-');
  return `${Number(month)} 月 ${Number(day)} 日`;
}
