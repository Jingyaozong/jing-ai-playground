import type { Metadata } from 'next';
import { pageMeta } from '../lib/seo';
import { NewsList } from '../components/daily-news';
import { PageHead } from '../components/portfolio-blocks';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { dailyNews, dayLabel } from '../data/daily-news';

export const metadata: Metadata = pageMeta({
  title: 'AI 日报',
  description: '每天从 AI 公司官方博客和科技媒体中挑出值得看的更新，用一两句中文说清楚，并链接回原文。',
});

const sourceNames = ['OpenAI', 'Google DeepMind', 'Google AI', 'Hugging Face', 'NVIDIA', 'TechCrunch', 'MIT Technology Review', '量子位'];

export default function NewsPage() {
  const [today, ...earlier] = dailyNews.days;
  return (
    <main className="pf">
      <SiteHeader active="News" />
      <PageHead title="AI 日报" description="每天从 AI 公司官方博客和科技媒体里挑出值得看的更新：模型、产品、研究和行业动态，各用一两句话说清楚，点击即回到原文。" />

      {today ? (
        <section className="pf-shell pf-section" aria-labelledby="news-today">
          <div className="pf-section-head"><h2 id="news-today">{dayLabel(today.date)}</h2><p>共 {today.items.length} 条，按重要性排序，时间为北京时间。</p></div>
          <NewsList items={today.items} />
        </section>
      ) : (
        <section className="pf-shell pf-section"><p className="pf-lead">今天的内容还在整理中。</p></section>
      )}

      {earlier.length > 0 && (
        <section className="pf-shell pf-section" aria-labelledby="news-earlier">
          <div className="pf-section-head"><h2 id="news-earlier">往期</h2><p>保留最近 7 天。</p></div>
          <div className="pf-news-archive">
            {earlier.map((day) => (
              <details key={day.date}>
                <summary>{dayLabel(day.date)} · {day.items.length} 条</summary>
                <NewsList items={day.items} />
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="pf-shell pf-section" aria-labelledby="news-method">
        <div className="pf-section-head"><h2 id="news-method">怎么整理的</h2></div>
        <p className="pf-lead">每天北京时间早上自动读取 {sourceNames.join('、')} 的公开 RSS，由 DeepSeek 挑选并用自己的话写摘要，只保留标题、摘要、来源和原文链接。摘要由模型生成，可能有疏漏，事实请以原文为准。</p>
      </section>
      <SiteFooter />
    </main>
  );
}
