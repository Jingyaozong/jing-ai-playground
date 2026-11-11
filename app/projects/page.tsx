import type { Metadata } from 'next';
import { pageMeta } from '../lib/seo';
import { PageHead, ProjectCard } from '../components/portfolio-blocks';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { projects } from '../data/profile';

export const metadata: Metadata = pageMeta({ og: 'projects',
  title: '项目经历',
  description: '荆的项目经历：AIGC 文生图评测、多模态图文匹配与 OCR 数据交付、Dify 工作流自动化。',
});

export default function ProjectsPage() {
  return (
    <main className="pf">
      <SiteHeader active="Projects" />
      <PageHead title="项目经历" description="2023 年起我在 AI 数据行业工作，做过标注交付、评测团队管理和流程自动化。客户与业务信息已脱敏。" />
      <section className="pf-shell pf-section">
        <div className="pf-grid-2">{projects.map((project) => <ProjectCard project={project} key={project.id} />)}</div>
      </section>
      <SiteFooter />
    </main>
  );
}
