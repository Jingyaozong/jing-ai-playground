import type { Metadata } from 'next';
import { pageMeta } from '../lib/seo';
import Link from 'next/link';
import aestheticFrame from '../assets/generated/she-forgets-yesterday-frame-01-v2.webp';
import pilotSamples from '../assets/generated/forty-shots-pilot-samples.webp';
import { CaseCard, PageHead } from '../components/portfolio-blocks';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { blindTest } from '../data/blind-test';

export const metadata: Metadata = pageMeta({ og: 'cases',
  title: '评测案例',
  description: 'AI 视频与多模态评测案例：五款视频模型的交叉盲评、Prompt 编排迭代、人物一致性评测与画面审美判断。',
});

const evidenceTools = [
  { href: '/tools/multimodal-evaluation/', title: '多模态评测记录台', copy: '按八个维度记录结果、严重度、时间段与证据，支持 CSV 导入导出。' },
  { href: '/tools/continuity-checker/', title: '相邻镜头连续性检查器', copy: '把前一镜的出口和后一镜的入口放在一起，检查人物、方向、视线与动作交接。' },
  { href: '/tools/shot-version-recorder/', title: '镜头版本记录器', copy: '记录生成批次、候选状态、可用区间与淘汰原因，导出 Markdown 和 CSV。' },
];

export default function CasesPage() {
  return (
    <main className="pf">
      <SiteHeader active="Cases" />
      <PageHead title="评测案例" description="每个案例都先定规则再看结果，用可见事实写证据，并写明样本范围和局限。" />
      <section className="pf-shell pf-section">
        <div className="pf-grid-3">
          <CaseCard href={`/cases/${blindTest.slug}/`} tag="视频评测 · 五模型交叉盲评" title={blindTest.title} description={blindTest.summary} poster="/videos/blind/posters/q1-happyhorse.webp" alt="盲评题 1 的一帧：雨天窗边木桌上一杯冒着热气的咖啡" />
          <CaseCard href="/cases/prompt-iteration/" tag="AIGC · Prompt 编排与迭代" title="三条 AI 视频提示词的两轮迭代" description="原始 Prompt、生成结果、逐帧 Bad Case、修改后的 Prompt 与前后对比。" poster="/videos/prompt-cases/c2-v2.webp" alt="海边步道上踩滑板的少年侧身滑行，背后是夕阳下的大海" />
          <CaseCard href="/experiments/forty-shots-one-character/" tag="视频评测 · 人物一致性" title="同一个角色，换景别、光线、情绪和动作后还是她吗" description="固定角色锚点，逐步叠加变量，记录身份特征在哪一步开始漂移。" image={pilotSamples} alt="同一角色在四种条件下的样本：正面近景、侧逆光、哭泣特写、奔跑回头" />
          <CaseCard href="/method/#aesthetic" tag="画面审美判断" title="晨光里，先看见谁" description="同一张静帧的三版调色对比：用视觉焦点和明暗层次说明为什么保留其中一版。" image={aestheticFrame} alt="知夏穿芥末黄外套坐在冷蓝卧室的床边，左侧窗户透进晨光" />
        </div>
      </section>
      <section className="pf-shell pf-section" aria-labelledby="cases-tools">
        <div className="pf-section-head"><h2 id="cases-tools">我做评测时用的记录工具</h2><p>三个工具都在浏览器本地运行，输入不会上传。</p></div>
        <div className="pf-grid-3">
          {evidenceTools.map((tool) => (
            <Link className="pf-card" href={tool.href} key={tool.href}>
              <div className="pf-card-body"><h3>{tool.title}</h3><p>{tool.copy}</p><span className="pf-card-more">打开工具 →</span></div>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
