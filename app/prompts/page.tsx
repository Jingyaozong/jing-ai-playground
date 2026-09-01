import type { Metadata } from 'next';
import Link from 'next/link';
import { PromptBrowser } from '../components/prompt-browser';
import { Reveal } from '../components/reveal';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import type { PromptCategory } from '../data/prompts';
import { promptItems, promptSource } from '../data/prompts';
import { promptResources } from '../data/prompt-resources';

export const metadata: Metadata = {
  title: 'Prompt 精选 — JING AI PLAYGROUND',
  description: '从 Prompt 工作台中精选几条值得先试的内容，并按场景进入完整 Prompt 库。',
};

const featuredIds = ['socratic-questioning', 'two-layer-explanation', 'first-principles', 'minimum-experiment'];
const featuredPrompts = featuredIds.map((id) => promptItems.find((item) => item.id === id)).filter((item) => item !== undefined);
const productionIds = ['video-causal-motion-gate', 'poster-to-story-short-ledger', 'video-character-anchor-brief', 'video-single-shot-motion', 'video-sound-layer-brief', 'video-failure-revision'];
const productionPrompts = productionIds.map((id) => promptItems.find((item) => item.id === id)).filter((item) => item !== undefined);

const categoryCopy: Array<{ id: PromptCategory; label: string; description: string; color: string }> = [
  { id: '问清问题', label: '把真正的问题找出来', description: '先澄清事实、解释、目标和假设，再开始回答。', color: 'yellow' },
  { id: '学习', label: '从听懂走到真正理解', description: '解释、拆解、研究和事实核查。', color: 'sky' },
  { id: '解决问题', label: '换一个结构寻找解法', description: '专家会诊、第一性原理和跨领域借解。', color: 'blue' },
  { id: '决策', label: '从两个答案里做选择', description: '公平论证两个方向，再用现实实验拿反馈。', color: 'coral' },
  { id: '认识自己', label: '回看经历，也设计未来', description: '寻找底层天赋，生成可以验证的人生版本。', color: 'mint' },
  { id: 'AI 视频制作', label: '把想法变成可验收镜头', description: '角色、场景、动作、声音、连续性和返修记录。', color: 'video' },
];

export default function PromptsPage() {
  return (
    <main>
      <SiteHeader active="Notes" />
      <section className="prompt-hero page-intro">
        <div className="page-intro-top mono"><span>JING PROMPT BOX / 提示词工作台</span><span>先看精选，再打开全部</span></div>
        <div className="prompt-title-lockup"><h1>PROMPTS</h1><span aria-hidden="true">{'{ }'}</span></div>
        <div className="notes-hero-bottom"><p>先放几条真正值得试的，<br />其余内容收进分类抽屉。</p><span className="mono">Pick / Try / Open more</span></div>
      </section>

      <Reveal><section className="prompt-featured section-shell">
          <div className="section-title-row compact"><div><p className="eyebrow mono">Start here / 先试这四条</p><h2>少一点，<br />但每条都能用。</h2></div><div className="home-notes-intro"><p>从问清问题、学习、解决问题和决策各选一条。需要更多时，再进入完整目录。</p><Link className="text-link" href="/prompts/all/">查看全部 {promptItems.length} 条 ↗</Link></div></div>
        <PromptBrowser items={featuredPrompts} showToolbar={false} />
      </section></Reveal>

      <Reveal><section className="prompt-story-bridge section-shell">
        <div className="prompt-story-bridge-card">
          <div><span className="mono">PROMPT IN PRODUCTION / 来自真实项目</span><h2>十四镜不是十四句咒语，<br />而是十四个清楚的动作。</h2><p>从 90 秒剧本出发，为每一镜分别锁定人物、动作、画面风格和失败边界。当前是可复制的制作草案，尚未产生视频模型输出。</p></div>
          <div className="prompt-story-bridge-links"><Link href="/stories/she-forgets-yesterday/#generation-pack"><span className="mono">GENERATION PACK</span><b>打开十四镜 Prompt ↗</b></Link><Link href="/notes/ninety-second-storyboard/"><span className="mono">MAKING OF NOTE</span><b>阅读拆镜方法 ↗</b></Link></div>
        </div>
      </section></Reveal>

      <Reveal><section className="prompt-production section-shell" id="production-templates">
        <div className="section-title-row compact"><div><p className="eyebrow mono">AI video production / 视频制作模板</p><h2>不是一句咒语，<br />是一张任务卡。</h2></div><p>10 条本站编辑模板覆盖故事反推、角色、场景、因果动作、首尾帧、声音、连续性、返修与候选验收；没有真实样本时不会替你填写结果。</p></div>
        <PromptBrowser items={productionPrompts} showToolbar={false} />
        <Link className="text-link prompt-production-more" href="/prompts/all/">查看全部 10 条制作模板 ↗</Link>
      </section></Reveal>

      <Reveal><section className="prompt-production-path section-shell" id="production-path" aria-labelledby="prompt-path-title">
        <div className="prompt-path-heading">
          <div><p className="eyebrow mono">Prompt to production / 从模板到镜头</p><h2 className="editorial-heading editorial-heading-lines" id="prompt-path-title"><span><b>从一句模板，</b></span><span><b>走到一个可返修镜头。</b></span></h2></div>
          <p>Prompt 不是终点。沿着这五步，把模糊想法变成镜头事实，再把生成结果变成下一轮能够执行的修改。</p>
        </div>
        <nav className="prompt-path-track" aria-label="AI 视频 Prompt 制作路线">
          <Link href="/prompts/all/"><span className="prompt-path-number mono">01</span><small className="mono">PICK / 选模板</small><h3>先找到<br />任务类型。</h3><p>按角色、场景、动作或连续性选择一份起点，不从空白页硬写。</p><i>打开完整目录 ↗</i></Link>
          <Link href="/notes/ai-video-prompt-shot-facts/"><span className="prompt-path-number mono">02</span><small className="mono">READ / 学方法</small><h3>把要求<br />拆成事实。</h3><p>理解主体、场景、起点、动作、终点与失败边界怎样分工。</p><i>阅读重点文章 ↗</i></Link>
          <Link href="/tools/shot-prompt-builder/"><span className="prompt-path-number mono">03</span><small className="mono">BUILD / 组镜头</small><h3>生成三份<br />制作记录。</h3><p>一次填写，得到单镜 Prompt、验收清单和返修记录模板。</p><i>打开组装器 ↗</i></Link>
          <Link href="/tools/shot-risk-checker/"><span className="prompt-path-number mono">04</span><small className="mono">CHECK / 查风险</small><h3>生成以前<br />先做减法。</h3><p>检查时长、动作数量、运镜和首尾差异是否已经超过单镜任务。</p><i>开始风险预检 ↗</i></Link>
          <Link href="/tools/shot-version-recorder/"><span className="prompt-path-number mono">05</span><small className="mono">LOG / 留版本</small><h3>看到失败，<br />留下证据。</h3><p>记录真实候选、失败时间与下一轮唯一变量，不预写模型结论。</p><i>记录候选版本 ↗</i></Link>
        </nav>
        <div className="prompt-path-footnote"><span className="mono">ONE SHOT · ONE MAIN CHANGE</span><p>每一步都可以单独使用；完整走一遍时，下一轮只改变一个主要变量。</p></div>
      </section></Reveal>

      <Reveal><section className="prompt-categories section-shell">
        <div className="section-title-row compact"><div><p className="eyebrow mono">Six drawers / 六个抽屉</p><h2>先选场景，<br />再找 Prompt。</h2></div><p>完整目录里可以继续搜索和筛选，不需要在这一页一次看完。</p></div>
        <div className="prompt-category-map">{categoryCopy.map((category) => {
          const count = promptItems.filter((item) => item.category === category.id).length;
          return <Link className={`prompt-category-tile prompt-category-${category.color}`} href="/prompts/all/" key={category.id}><span className="mono">{count} 条 Prompt</span><strong>{category.id}</strong><h3>{category.label}</h3><p>{category.description}</p><i>打开完整目录 ↗</i></Link>;
        })}</div>
      </section></Reveal>

      <Reveal><section className="prompt-resources section-shell">
        <div className="section-title-row compact"><div><p className="eyebrow mono">More to learn / 延伸资源</p><h2>别人怎么教，<br />我为什么留下。</h2></div><p>只收录官方或原作者资源。这里保留简介、推荐理由和原始链接，不复制对方全文。</p></div>
        <div className="prompt-resource-grid">{promptResources.map((resource, index) => <article className={`prompt-resource-card resource-${index % 5}`} key={resource.id}>
          <div className="mono"><span>{resource.type}</span><span>0{index + 1}</span></div>
          <p>{resource.source}</p>
          <h3>{resource.title}</h3>
          <p>{resource.description}</p>
          <blockquote><span className="mono">为什么值得看</span>{resource.whyItMatters}</blockquote>
          <div><span className="note-tags">{resource.tags.map((tag) => <span key={tag}>{tag}</span>)}</span><a href={resource.url} target="_blank" rel="noreferrer">查看原资源 ↗</a></div>
        </article>)}</div>
      </section></Reveal>

      <section className="prompt-attribution section-shell">
        <div className="prompt-source-note">
          <span className="mono">首批 12 条来源 / SOURCE</span>
          <div><p>作者：{promptSource.author}</p><h3>{promptSource.title}</h3><p>{promptSource.note}</p></div>
          <a href={promptSource.url} target="_blank" rel="noreferrer">查看原文 ↗</a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
