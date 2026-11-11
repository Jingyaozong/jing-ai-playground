import type { Metadata } from 'next';
import Link from 'next/link';
import { PortfolioFooter, PortfolioHeader } from '../components/portfolio-frame';
import { hot, observationDate, selected } from '../data/multimodal-observation';
import { podcastSources } from '../data/observation-sources.mjs';
import '../portfolio.css';
import './observation.css';

export const metadata: Metadata = { title: '多模态观察 — JING', description: '从每日精选、热点与播客精读，提炼可验证的多模态评测问题。' };

function ObservationCard({ item }: { item: (typeof selected)[number] }) {
  return <article className="observation-card">
    <p className="folio-kicker">{item.category} · {item.source} · <time dateTime={item.date}>{item.date}</time></p>
    <h3>{item.title}</h3>
    <p>{item.fact}</p>
    <div className="observation-question"><strong>怎么验证 · 待执行</strong><p>{item.question}</p></div>
    <div className="folio-actions"><a href={item.original}>发布原文 ↗</a><a href={item.index}>AIHOT 发现入口 ↗</a></div>
  </article>;
}

export default function Briefing() {
  return <main className="folio">
    <PortfolioHeader />
    <div className="folio-shell folio-briefing observation">
      <header className="folio-briefing-title"><p className="folio-kicker">JING / RESEARCH BRIEF · <time dateTime={observationDate}>{observationDate}</time></p><h1>多模态观察</h1><p>不复述热点。把值得关注的新能力，变成一条能验证的问题。</p>
        <nav className="observation-jumps" aria-label="简报目录"><a href="#daily">每日精选</a><a href="#hot">热点速览</a><a href="#podcasts">播客精读</a><a href="#sources">来源</a></nav>
      </header>
      <section id="daily" className="observation-section"><p className="folio-kicker">DAILY PICKS</p><h2>每日精选</h2><div className="observation-grid">{selected.map(item => <ObservationCard key={item.original} item={item} />)}</div></section>
      <section id="hot" className="observation-section"><p className="folio-kicker">TRENDING / AIHOT 选题</p><h2>热点速览</h2><p className="observation-note">选自本期 AIHOT 热点，不复刻实时榜单；热度不等于模型表现。</p><div className="observation-hot">{hot.map(item => <ObservationCard key={item.original} item={item} />)}</div></section>
      <section id="podcasts" className="observation-section"><p className="folio-kicker">PODCAST NOTES</p><h2>播客精读</h2>
      <article className="folio-episode">
        <header><p className="folio-kicker">42章经 · 2026 年 10 月 · 14:11 段落</p><h3>生成缺陷与审美偏好，<br />分开记录</h3><p>来源：曲凯对谈淏楠。精读由第三方 AI 整理，观点应回听原声核对。</p></header>
        <dl><div><dt>节目观点</dt><dd>访谈把选片分成两类情况：排除有明显生成缺陷的片段，以及从可用片段中挑选更符合创作者意图的一条。</dd></div>
        <div><dt>转化为评测任务</dt><dd>给同一镜头要求准备两个匿名候选。先分别记录形变、连续性和指令错误；只有两条都过基础门槛，才比较主体焦点、光色和情绪是否服务叙事。保留平局与弃权选项，并记下判断所依据的画面或时间段。</dd></div>
        <div><dt>当前状态</dt><dd>待执行。尚无样本对比、人工偏好统计或模型排名。</dd></div></dl>
        <div className="folio-actions"><a href="https://42zhangjing.qiaomu.ai/ep/6ada2be4c96c8942ec10cb1e.html">打开精读与节目原声 ↗</a><Link href="/#ab-review">查看静帧对照案例 ↗</Link><Link href="/tools/multimodal-evaluation/">打开评测记录台 ↗</Link></div>
      </article>
      <article className="folio-episode">
        <header><p className="folio-kicker">十字路口 Crossing · 张金涛访谈</p><h3>视频生成变快之后，交互就顺了吗？</h3><p>节目讨论了 Vidu S1、推理加速与实时交互视频。这里只据节目简介提取选题，不代替原声或产品实测。</p></header>
        <div className="observation-question"><strong>怎么验证 · 待执行</strong><p>对同一输入依次提交两条相反的运镜指令。记录每次发出指令到出现首个可用画面的时间，并单独复核转向是否执行、角色是否漂移；不要把首帧快当成整个交互顺畅。</p></div>
        <div className="folio-actions"><a href="https://www.xiaoyuzhoufm.com/episode/6a5c6a91a3fec224d59fd014">节目原声 ↗</a><a href="https://crossing.qiaomu.ai/ep/6a5c6a91a3fec224d59fd014.html">单集精读 ↗</a></div>
      </article>
      <article className="folio-episode">
        <header><p className="folio-kicker">AI 炼金术 · 播客补读 · 26:58 段落</p><h3>旧偏好会不会盖过当前的视觉指令？</h3><p>节目精读在 26:58 标出关于记忆相关性和时效性的讨论。</p></header>
        <div className="observation-question"><strong>怎么验证 · 待执行</strong><p>给同一模型 12 张虚构海报和相同改图指令，比较无历史、相关历史、过期冲突历史三组。例如旧偏好为暖黄，本轮明确要求保留冷蓝。盲审建议，记录当前指令遵循率、过期偏好误用率，以及建议是否指向画面里确实存在的元素。</p></div>
        <div className="folio-actions"><a href="https://aialchemy.qiaomu.ai/ep/6aebf2dec33509d82976625e.html">节目精读与原声（26:58） ↗</a></div>
      </article>
      </section>
      <section id="sources" className="observation-section folio-sources"><h2>取材来源</h2><p>AIHOT 用于发现线索，文章以原始发布为准；播客按单集选编，不转载全文。本页发布的是带日期的核对稿，不是实时镜像或定时更新。</p><p className="observation-source-links"><a href="https://aihot.news/">AIHOT 精选 ↗</a> · <a href="https://aihot.news/hot">AIHOT 热点 ↗</a></p><ul>{podcastSources.map(({name,origin,feed}) => <li key={origin}><a href={origin}>{name} ↗</a><a href={feed} aria-label={`${name} RSS`}>RSS</a></li>)}</ul><p>8 个独立播客订阅源已接入候选采集；并非每期都收录。</p></section>
    </div>
    <PortfolioFooter />
  </main>;
}
