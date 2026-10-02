import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro } from '../components/page-intro';
import { Reveal } from '../components/reveal';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { tools } from '../data/content';
import { libraryItems } from '../data/library';
import { promptItems } from '../data/prompts';
import { getAllNotes } from '../../lib/notes';
import './about.css';

export const metadata: Metadata = {
  title: 'About JING — JING AI PLAYGROUND',
  description: '关于荆，以及这个持续生长的 AI 创作工作台。',
};

export default function AboutPage() {
  const notes = getAllNotes();
  const reviewedVideoExcerpts = libraryItems.filter((item) => item.sourceStatus === 'excerpt-reviewed').length;
  const answers = [
    {
      label: 'WHAT I MAKE',
      title: '我做了什么',
      copy: '从故事种子、90 秒剧本和十四镜分镜开始，搭出一支 AI 短片真正进入制作前需要的结构；同时把重复工作做成浏览器本地工具。',
      evidence: `1 个故事制作系统 · ${tools.length} 个浏览器本地工具`,
      href: '/stories/she-forgets-yesterday/',
      action: '查看故事现场',
      tone: 'yellow',
    },
    {
      label: 'WHAT I KNOW',
      title: '我懂什么',
      copy: '把 Prompt、景别、运镜、失败现象和视频评测拆成可以学习、执行和复核的方法，不把复杂术语当成答案。',
      evidence: `${notes.length} 篇方法与制作笔记`,
      href: '/notes/',
      action: '进入笔记路线',
      tone: 'sky',
    },
    {
      label: 'WHAT I STUDY',
      title: '最近研究什么',
      copy: '动作之间的先后能否被模型清楚执行；把伞锁定、水线首动、固定方向和世界连续拆成可以逐帧核对的条件。',
      evidence: 'EXP.010 协议完成 · 0 / 9 待执行',
      href: '/experiments/can-water-recede-after-the-umbrella-opens/',
      action: '查看九格实验协议',
      tone: 'coral',
    },
    {
      label: 'WHAT IS WORTH SEEING',
      title: '什么值得看',
      copy: '优先整理能追溯到原始来源的文章、视频、论文和工具；视频讲解要点注明核对依据，编辑观点与荆已确认观点分开。',
      evidence: `${libraryItems.length} 条收藏附原链接 · ${reviewedVideoExcerpts} 条视频附时间点要点`,
      href: '/library/',
      action: '打开收藏路线',
      tone: 'mint',
    },
  ] as const;
  const methodRoute = [
    {
      step: '01', label: 'DEFINE', title: '先把交付说清楚',
      copy: '确认目标、数据边界、周期、验收标准、争议处理与保密要求，再把口头需求拆成可以执行的规则。',
      href: '/notes/synthetic-annotation-delivery/', action: '看六阶段演练', tone: 'white',
    },
    {
      step: '02', label: 'PILOT', title: '用小批量暴露问题',
      copy: '先试标、测产能和一致性，记录分歧点与人员适配；标准稳定以后再逐步放量。',
      href: '/notes/synthetic-annotation-delivery/', action: '看试标位置', tone: 'sky',
    },
    {
      step: '03', label: 'EVALUATE', title: '把感受变成证据',
      copy: '按固定维度记录问题、严重度和出现位置；把模型问题、数据问题、规则问题与执行偏差分开。',
      href: '/notes/video-evaluation-eight-dimensions/', action: '看八维框架', tone: 'yellow',
    },
    {
      step: '04', label: 'CLOSE THE LOOP', title: '让交付可以追溯',
      copy: '完成格式、有效性、质量和版本检查；高频问题回到规则库，回答保留依据并设置人工升级。',
      href: '/notes/synthetic-rule-knowledge-desk/', action: '看规则答疑案例', tone: 'mint',
    },
  ] as const;

  return (
    <main>
      <SiteHeader active="About" />
      <PageIntro eyebrow="About / 荆" count="A living creative workspace" title="This is JING’s working desk." description="这里不是写完就不动的简历，而是一张持续更新的 AI 创作工作台。" />

      <section className="about-page section-shell">
        <Reveal><div className="about-manifesto"><span className="mono">Why this site exists</span><p>我想把脑子里的想法做成故事，也把它们怎样变成镜头、工具和判断的过程留下来。</p><p>完成的作品会被展示；还在制作的内容会标注状态；没有真实样本支持的判断，不会被写成结论。</p></div></Reveal>

        <Reveal><section className="about-answers" aria-labelledby="about-answers-title">
          <div className="section-title-row compact"><div><p className="eyebrow mono">Four answers / 四个回答</p><h2 id="about-answers-title">认识这个网站，<br />先看它留下什么。</h2></div><p>每张工作单都连接到已经存在的页面和可检查内容，而不是一段无法验证的自我介绍。</p></div>
          <div className="about-answer-grid">
            {answers.map((answer) => <article className={`about-answer-card about-answer-${answer.tone}`} key={answer.label}><span className="mono">{answer.label}</span><h3>{answer.title}</h3><p>{answer.copy}</p><div><b className="mono">Evidence / 当前证据</b><strong>{answer.evidence}</strong></div><Link href={answer.href}>{answer.action} ↗</Link></article>)}
          </div>
        </section></Reveal>

        <Reveal><section className="about-methods" aria-labelledby="about-methods-title">
          <div className="about-methods-heading">
            <div><p className="eyebrow mono">How I work / 工作方法</p><h2 id="about-methods-title">从接到问题，<br />到留下证据。</h2></div>
            <p>这里展示的是荆提供的方法框架，以及用独立虚构情境整理的公开演练。它说明怎样推进项目，不公开真实业务材料，也不把演练写成客户成果。</p>
          </div>
          <div className="about-method-route">
            {methodRoute.map((method) => <article className={`about-method-card about-method-${method.tone}`} key={method.step}>
              <div className="about-method-marker"><b>{method.step}</b><span className="mono">{method.label}</span></div>
              <h3>{method.title}</h3><p>{method.copy}</p><Link href={method.href}>{method.action} ↗</Link>
            </article>)}
          </div>
          <div className="about-method-footnote"><span className="mono">LOCAL REVIEW DESK</span><p>规则答疑演练还配有浏览器本地验收台：导入虚构题目、逐条记录回答与引用，再导出人工复核 CSV。</p><Link href="/tools/rule-review/">打开规则答疑验收台 ↗</Link></div>
        </section></Reveal>

        <Reveal><section className="about-status" aria-labelledby="about-status-title">
          <div className="about-status-heading"><div><span className="mono">On the desk now / 当前工作台</span><h2 id="about-status-title">现在进行到哪里？</h2></div><p>状态只描述网站里已经留下的文件、结构和记录，不把计划写成完成。</p></div>
          <div className="about-status-grid">
            <article><span className="status-chip status-draft mono">结构已完成</span><small className="mono">STORY 001</small><h3>她每天醒来都会忘记昨天</h3><p>六段时间剧本、十四镜分镜、人物锚点和三条动作测试方案已经就位；真实视频生成、剪辑和声音仍待开始。</p><Link href="/stories/she-forgets-yesterday/#generation-pack">查看生成包 ↗</Link></article>
            <article><span className="status-chip status-open mono">协议已完成</span><small className="mono">EXPERIMENT 010</small><h3>撑伞以后，<br />水面能沿一个方向<br />连续退去吗？</h3><p>九格协议、五点动作账本和浏览器本地工具已经就位；真实视频仍为 0 / 9，目前没有模型结论。</p><Link href="/experiments/can-water-recede-after-the-umbrella-opens/">查看实验协议 ↗</Link></article>
            <article><span className="status-chip status-source mono">来源分级标注</span><small className="mono">CONTENT SYSTEM</small><h3>方法、Prompt 与收藏</h3><p>{notes.length} 篇笔记、{promptItems.length} 个 Prompt、{libraryItems.length} 条收藏和 {tools.length} 个工具已进入网站；收藏中 {reviewedVideoExcerpts} 条视频附时间点要点与核对依据，编辑稿与观点候选也有状态标签。</p><Link href="/notes/">从笔记开始 ↗</Link></article>
          </div>
        </section></Reveal>

        <Reveal><div className="about-boundaries"><span className="mono">Editorial boundaries / 内容边界</span><div><p>项目方法通过独立虚构案例展示，不公开真实业务材料。<br /><Link href="/notes/synthetic-annotation-delivery/">阅读六阶段标注演练 ↗</Link></p><p>虚构背景、样本与数字明确标注，不作为真实履历或客户成果。</p><p>编辑初稿与荆确认的观点分开呈现。</p><p>外部文章只保存摘要、理由和原链接。</p></div></div></Reveal>

        <Reveal><div className="principles"><div><span>01</span><h3>好奇比熟练更重要</h3><p>工具会变，持续追问问题、验证结果的习惯可以留下。</p></div><div><span>02</span><h3>作品比术语更诚实</h3><p>少讲空泛概念，多完成一个真的能看、能玩、能用的东西。</p></div><div><span>03</span><h3>过程也值得存档</h3><p>把试错、偏差、条件和没成功的版本一起留下来。</p></div></div></Reveal>
      </section>
      <SiteFooter />
    </main>
  );
}
