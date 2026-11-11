import Link from 'next/link';
import aestheticFrame from './assets/generated/she-forgets-yesterday-frame-01-v2.webp';
import pilotSamples from './assets/generated/forty-shots-pilot-samples.webp';
import anchor from './assets/generated/she-forgets-yesterday-character-anchor.webp';
import keyframes from './assets/generated/she-forgets-yesterday-keyframes.webp';
import { ContactList, ResumeButton } from './components/contact-links';
import { CaseCard, DimensionGrid, EvaluationFlow, ProjectCard } from './components/portfolio-blocks';
import { SiteFooter } from './components/site-footer';
import { SiteHeader } from './components/site-header';
import { profile, projects } from './data/profile';
import { videoCase } from './data/video-case';

export default function Home() {
  return (
    <main className="pf">
      <SiteHeader />
      <section className="pf-hero pf-shell">
        <p className="pf-hero-role">{profile.roleLine}</p>
        <h1>{profile.tagline}</h1>
        <ul className="pf-stats">
          {profile.stats.map((stat) => <li className="pf-stat" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></li>)}
        </ul>
        <div className="pf-actions">
          <Link className="pf-button" href="/cases/">看评测案例</Link>
          <ResumeButton className="pf-button is-ghost" />
        </div>
      </section>

      <section className="pf-section pf-shell" aria-labelledby="home-cases">
        <div className="pf-section-head"><h2 id="home-cases">精选评测案例</h2><Link className="pf-text-link" href="/cases/">全部案例</Link></div>
        <div className="pf-grid-3">
          <CaseCard href={`/cases/${videoCase.slug}/`} tag="视频评测 · 多模型对比" title={videoCase.title} description={videoCase.summary} pending={videoCase.models[0].poster} />
          <CaseCard href="/experiments/forty-shots-one-character/" tag="视频评测 · 人物一致性" title="同一个角色，换景别、光线、情绪和动作后还是她吗" description="固定角色锚点，逐步叠加变量，记录身份特征在哪一步开始漂移。" image={pilotSamples} alt="同一角色在四种条件下的样本：正面近景、侧逆光、哭泣特写、奔跑回头" />
          <CaseCard href="/method/#aesthetic" tag="画面审美判断" title="晨光里，先看见谁" description="同一张静帧的三版调色对比：用视觉焦点和明暗层次说明为什么保留其中一版。" image={aestheticFrame} alt="知夏穿芥末黄外套坐在冷蓝卧室的床边，左侧窗户透进晨光" />
        </div>
      </section>

      <section className="pf-section pf-shell" aria-labelledby="home-method">
        <div className="pf-section-head"><h2 id="home-method">评测方法</h2><p>我用八个维度看一条视频，每个判断都对应时间码和可见事实，最后给严重度结论。</p></div>
        <DimensionGrid />
        <EvaluationFlow />
        <p className="pf-note"><Link className="pf-text-link" href="/method/">查看完整方法</Link></p>
      </section>

      <section className="pf-section pf-shell" aria-labelledby="home-projects">
        <div className="pf-section-head"><h2 id="home-projects">项目经历</h2><Link className="pf-text-link" href="/projects/">全部项目</Link></div>
        <div className="pf-grid-3">
          {projects.slice(0, 3).map((project) => <ProjectCard project={project} compact key={project.id} />)}
        </div>
      </section>

      <section className="pf-section pf-shell" aria-labelledby="home-practice">
        <div className="pf-section-head"><h2 id="home-practice">创作实践</h2><p>我自己也做 AI 短片的前期开发。懂生产端的难点，所以评得准。</p></div>
        <div className="pf-grid-3">
          <CaseCard href="/stories/she-forgets-yesterday/" tag="AI 短片" title="她每天醒来都会忘记昨天" description="90 秒短片的剧本、十四镜分镜与生成 Prompt 包。" image={keyframes} alt="短片《她每天醒来都会忘记昨天》的四张概念关键帧" />
          <CaseCard href="/stories/#anchor" tag="人物一致性" title="四个视觉锚点固定一个角色" description="短发、蓝色发夹、红色三角耳饰、芥末黄外套，贯穿所有镜头。" image={anchor} alt="角色知夏的人物锚点图" />
          <CaseCard href="/stories/#storyboard" tag="分镜开发" title="从分镜到动作风险拆解" description="把每个镜头的动作拆开，提前标出最容易生成失败的位置。" image={aestheticFrame} alt="短片第一场的概念关键帧：清晨醒来" />
        </div>
      </section>

      <section className="pf-section pf-shell" id="contact" aria-labelledby="home-about">
        <div className="pf-contact">
          <div>
            <div className="pf-section-head"><h2 id="home-about">关于与联系</h2></div>
            <p className="pf-lead">{profile.narrative}</p>
            <p className="pf-note"><Link className="pf-text-link" href="/about/">了解更多</Link></p>
          </div>
          <ContactList />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
