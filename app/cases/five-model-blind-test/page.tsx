import type { Metadata } from 'next';
import Link from 'next/link';
import { BadCaseCard, PageHead } from '../../components/portfolio-blocks';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';
import { VideoWall } from '../../components/video-wall';
import { blindTest } from '../../data/blind-test';
import { blindScores } from '../../data/blind-test-scores';
import { pageMeta } from '../../lib/seo';

export const metadata: Metadata = pageMeta({
  og: 'five-model-blind-test',
  title: blindTest.title,
  description: blindTest.summary,
});

type ProductId = keyof typeof blindScores.overall;
const fixed = (value: number) => value.toFixed(2);

export default function BlindTestCasePage() {
  const products = blindTest.products;
  const byQuestion = blindScores.byQuestion as Record<string, Record<ProductId, number>>;

  return (
    <main className="pf">
      <SiteHeader active="Cases" />
      <PageHead title={blindTest.title} description={blindTest.summary} back={{ href: '/cases/', label: '评测案例' }} />

      <section className="pf-shell pf-section" aria-labelledby="case-role">
        <div className="pf-section-head"><h2 id="case-role">我做了什么</h2><p>{blindTest.period}，7 人小组，我是总负责人。五位组员各负责一款产品的生成，一位负责市场调研。</p></div>
        <ol className="pf-role">{blindTest.role.map((item) => <li key={item}>{item}</li>)}</ol>
      </section>

      <section className="pf-shell pf-section" aria-labelledby="case-task">
        <div className="pf-grid-2">
          <div>
            <div className="pf-section-head"><h2 id="case-task">任务卡</h2></div>
            <dl className="pf-facts">{blindTest.taskCard.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
          </div>
          <div>
            <div className="pf-section-head"><h2>统一的生成参数</h2></div>
            <dl className="pf-facts">{blindTest.parameters.map((row) => <div key={row.name}><dt>{row.name}</dt><dd><b>{row.value}</b>　{row.note}</dd></div>)}</dl>
          </div>
        </div>
        <p className="pf-note">参数不统一，盲评打出来的分数有一半是在比参数，不是在比产品。</p>
      </section>

      <section className="pf-shell pf-section" aria-labelledby="case-questions">
        <div className="pf-section-head"><h2 id="case-questions">10 道测试题</h2><p>基础题测共性，陷阱题拉开差距，专项题对准人物一致性和音画同出。所有人用同一段文字，一个字不改。</p></div>
        <div className="pf-table-wrap" tabIndex={0} role="region" aria-label="测试题表，可横向滚动">
          <table className="pf-table">
            <thead><tr><th scope="col">题号</th><th scope="col">类型</th><th scope="col">题面</th><th scope="col">重点看什么</th></tr></thead>
            <tbody>
              {blindTest.questions.map((question) => (
                <tr key={question.no}><th scope="row">{question.no} {question.name}</th><td>{question.type}</td><td>{question.prompt}</td><td><span>{question.focus}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <ol className="pf-flow" aria-label="评测流程">{blindTest.flow.map((step) => <li key={step}>{step}</li>)}</ol>
      </section>

      <section className="pf-shell pf-section" aria-labelledby="case-scores">
        <div className="pf-section-head"><h2 id="case-scores">盲评结果</h2><p>每个数字是 7 位评审在 10 道题上的平均分，满分 10 分。</p></div>
        <div className="pf-table-wrap" tabIndex={0} role="region" aria-label="各模型四维均分表，可横向滚动">
          <table className="pf-table">
            <thead><tr><th scope="col">产品</th><th scope="col">版本</th><th scope="col">实际分辨率</th>{blindTest.dimensions.map((dimension) => <th scope="col" className="is-num" key={dimension}>{dimension}</th>)}<th scope="col" className="is-num">四维均值</th></tr></thead>
            <tbody>
              {products.map((product) => {
                const id = product.id as ProductId;
                return (
                  <tr key={product.id}>
                    <th scope="row">{product.name}</th><td><span>{product.version}</span></td><td><span>{product.resolution}</span></td>
                    {blindScores.dimMeans[id].map((value, index) => <td className="is-num" key={index}>{fixed(value)}</td>)}
                    <td className="is-num is-top">{fixed(blindScores.overall[id])}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="pf-note">即梦剔除交错素材的题 3 后，四维均值为 {fixed(blindScores.jimengOverallExcludingQ3)}。版本号按组员当时记录的填写。</p>

        <h3 style={{ margin: '40px 0 12px', fontSize: '1.15rem' }}>每道题的综合印象</h3>
        <div className="pf-table-wrap" tabIndex={0} role="region" aria-label="每题综合印象得分表，可横向滚动">
          <table className="pf-table">
            <thead><tr><th scope="col">题目</th>{products.map((product) => <th scope="col" className="is-num" key={product.id}>{product.name}</th>)}</tr></thead>
            <tbody>
              {blindTest.questions.map((question) => {
                const row = byQuestion[String(question.no)];
                const top = Math.max(...Object.values(row));
                return (
                  <tr key={question.no}>
                    <th scope="row">{question.no} {question.name}</th>
                    {products.map((product) => {
                      const value = row[product.id as ProductId];
                      const flagged = question.no === 3 && product.id === 'jimeng';
                      return <td className={`is-num${value === top ? ' is-top' : ''}${flagged ? ' is-flag' : ''}`} key={product.id}>{fixed(value)}{flagged ? ' *' : ''}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="pf-note">底色标出每题最高分。* 即梦题 3 提交的视频与题面不符，见下方“局限与复盘”。</p>

        <h3 style={{ margin: '40px 0 12px', fontSize: '1.15rem' }}>负责人自评（不是盲评）</h3>
        <div className="pf-table-wrap" tabIndex={0} role="region" aria-label="负责人自评表，可横向滚动">
          <table className="pf-table">
            <thead><tr><th scope="col">产品</th><th scope="col">套餐</th><th scope="col" className="is-num">可用次数（满分 30）</th><th scope="col" className="is-num">产品功能</th><th scope="col" className="is-num">用户体验</th><th scope="col" className="is-num">易用性</th><th scope="col" className="is-num">运镜可控性</th></tr></thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <th scope="row">{product.name}</th><td><span>{product.plan}</span></td>
                  <td className="is-num">{product.success.reduce((sum, value) => sum + value, 0)}</td>
                  <td className="is-num">{product.featureScore}</td><td className="is-num">{product.uxScore}</td><td className="is-num">{product.easeScore}</td><td className="is-num">{product.cameraScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="pf-note">可用次数是每题 3 次生成里负责人认为可用的条数。这一栏由使用者自己填，尺度没有统一，只作参考。</p>
      </section>

      <section className="pf-shell pf-section" aria-labelledby="case-wall">
        <div className="pf-section-head"><h2 id="case-wall">视频对比</h2><p>选了三道题。每款产品固定展示第 1 次生成的结果，不挑最好的一条。分数是这道题的综合印象均分。</p></div>
        {blindTest.walls.map((no) => {
          const question = blindTest.questions.find((item) => item.no === no)!;
          const row = byQuestion[String(no)];
          return (
            <div className="pf-wall-block" key={no}>
              <h3>题 {no} · {question.name}</h3>
              <blockquote>{question.prompt}</blockquote>
              <VideoWall
                columns={3}
                note={`重点看：${question.focus}。`}
                items={products.map((product) => ({
                  id: `q${no}-${product.id}`,
                  name: product.name,
                  video: `/videos/blind/q${no}-${product.id}.mp4`,
                  poster: `/videos/blind/posters/q${no}-${product.id}.webp`,
                  verdict: fixed(row[product.id as ProductId]),
                }))}
              />
            </div>
          );
        })}
      </section>

      <section className="pf-shell pf-section" aria-labelledby="case-bad">
        <div className="pf-section-head"><h2 id="case-bad">Bad Case</h2><p>前三条是模型问题，失败类型来自<Link className="pf-text-link" href="/notes/video-failure-cases/">十类 AI 视频失败词典</Link>。第四条是执行问题，单独标出。</p></div>
        <div className="pf-grid-2">
          {blindTest.badCases.map((item) => <BadCaseCard item={{ ...item, model: `${item.model} · ${item.question}` }} key={item.id} />)}
        </div>
      </section>

      <section className="pf-shell pf-section" aria-labelledby="case-limits">
        <div className="pf-section-head"><h2 id="case-limits">局限与复盘</h2><p>这次评测有五处做得不够好。下一次我会在开工前把它们堵上。</p></div>
        <ul className="pf-limits">{blindTest.limitations.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.copy}</span></li>)}</ul>
        <p className="pf-note">这次之后，我把评测维度和问题归因整理成了<Link className="pf-text-link" href="/notes/video-evaluation-eight-dimensions/">八维评测框架</Link>和<Link className="pf-text-link" href="/notes/bad-case-review-loop/">Bad Case 复盘方法</Link>。</p>
      </section>

      <section className="pf-shell pf-section" aria-labelledby="case-conclusion">
        <div className="pf-section-head"><h2 id="case-conclusion">结论</h2></div>
        <ul className="pf-findings">{blindTest.conclusions.map((item) => <li key={item}>{item}</li>)}</ul>
        <p className="pf-note">样本：{blindTest.scope}</p>
      </section>
      <SiteFooter />
    </main>
  );
}
