import type { Metadata } from 'next';
import { pageMeta } from '../lib/seo';
import Link from 'next/link';
import { ContactList } from '../components/contact-links';
import { PageHead } from '../components/portfolio-blocks';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { capabilities, profile } from '../data/profile';

export const metadata: Metadata = pageMeta({ og: 'about',
  title: '关于与联系',
  description: '荆：AI 视频与多模态评测，兼具艺术审美、评测方法与项目交付能力。附联系方式。',
});

const path = ['雕塑本科', '视觉设计', 'AI 数据', '多模态数据', '项目管理', 'AIGC / 视频评测'];

export default function AboutPage() {
  return (
    <main className="pf">
      <SiteHeader active="About" />
      <PageHead title="关于荆" description={profile.tagline} />

      <section className="pf-shell pf-section" aria-labelledby="about-path">
        <div className="pf-section-head"><h2 id="about-path">职业路线</h2></div>
        <ol className="pf-path">{path.map((step) => <li key={step}>{step}</li>)}</ol>
        <p className="pf-lead" style={{ marginTop: 24 }}>{profile.narrative}</p>
        <p className="pf-lead" style={{ marginTop: 12 }}>我的优势是三样东西合在一起：艺术训练带来的审美判断，把判断写成规则的评测方法，以及带团队按期交付的能力。</p>
      </section>

      <section className="pf-shell pf-section" aria-labelledby="about-capabilities">
        <div className="pf-section-head"><h2 id="about-capabilities">核心能力</h2></div>
        <div className="pf-grid-2">
          {capabilities.map((item) => (
            <article className="pf-card" key={item.title}><div className="pf-card-body"><h3>{item.title}</h3><p>{item.copy}</p></div></article>
          ))}
        </div>
        <p className="pf-note"><Link className="pf-text-link" href="/method/">查看评测方法</Link></p>
        <p className="pf-note">我也持续跟进行业动态，把值得关注的新能力整理成可以验证的问题：<Link className="pf-text-link" href="/briefing/">多模态观察</Link></p>
      </section>

      <section className="pf-shell pf-section" id="contact" aria-labelledby="about-contact" style={{ scrollMarginTop: 96 }}>
        <div className="pf-contact">
          <div>
            <div className="pf-section-head"><h2 id="about-contact">联系我</h2></div>
            <p className="pf-lead">目前在看 AI 视频主观评测、多模态评测、AIGC 质量、AI 数据 PM 与交付运营方向的机会。</p>
          </div>
          <ContactList />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
