import type { Metadata } from 'next';
import { pageMeta } from '../lib/seo';
import Link from 'next/link';
import { AestheticCase } from '../components/aesthetic-case';
import { DimensionGrid, EvaluationFlow, PageHead } from '../components/portfolio-blocks';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { getAllNotes } from '../../lib/notes';
import { methodNoteSlugs } from '../data/note-config';

export const metadata: Metadata = pageMeta({ og: 'method',
  title: '评测方法',
  description: '荆的 AI 视频、多模态与文本大模型评测方法：八维框架、验收合同、Bad Case 归因、知识库问答验收与模型裁判校准。',
});

export default function MethodPage() {
  const notes = getAllNotes();
  const textEvaluationNotes = ['llm-text-eval-rubric', 'wiki-rag-poc-evaluation', 'llm-judge-human-agreement']
    .map((slug) => notes.find((note) => note.slug === slug))
    .filter((note) => note !== undefined);
  const methodNotes = methodNoteSlugs.map((slug) => notes.find((note) => note.slug === slug)).filter((note) => note !== undefined);
  return (
    <main className="pf">
      <SiteHeader active="Method" />
      <PageHead title="评测方法" description="我把主观判断拆成可以复核的步骤：先写验收合同，再按八个维度看，用时间码和可见事实记录，最后对 Bad Case 归因并闭环。文本大模型与知识库评测沿用同一思路，用评分锚点、引用核对和人工校准落到证据。" />

      <section className="pf-shell pf-section" id="text-and-knowledge-evaluation" aria-labelledby="method-text-and-knowledge" style={{ scrollMarginTop: 96 }}>
        <div className="pf-section-head">
          <h2 id="method-text-and-knowledge">文本大模型与知识库评测</h2>
          <p>三篇方法笔记用合成样例演示文本判分、Wiki／RAG 验收和模型裁判校准。</p>
        </div>
        <div className="pf-method-list">
          {textEvaluationNotes.map((note, index) => (
            <Link className="pf-method-item" href={`/notes/${note.slug}/`} key={note.slug}>
              <b>{String(index + 1).padStart(2, '0')}</b>
              <div><h3>{note.title}</h3><p>{note.description}</p></div>
              <span>阅读 →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="pf-shell pf-section" aria-labelledby="method-dimensions">
        <div className="pf-section-head"><h2 id="method-dimensions">八个维度</h2><p>各维度分开记录，不合成总分。每条视频最后给一个严重度结论：PASS、MINOR、MAJOR 或 CRITICAL。</p></div>
        <DimensionGrid />
      </section>

      <section className="pf-shell pf-section" aria-labelledby="method-flow">
        <div className="pf-section-head"><h2 id="method-flow">评测流程</h2></div>
        <EvaluationFlow />
      </section>

      <section className="pf-shell pf-section" aria-labelledby="method-notes">
        <div className="pf-section-head"><h2 id="method-notes">方法详解</h2><p>六篇文章分别讲清一个环节。</p></div>
        <div className="pf-method-list">
          {methodNotes.map((note, index) => (
            <Link className="pf-method-item" href={`/notes/${note.slug}/`} key={note.slug}>
              <b>{String(index + 1).padStart(2, '0')}</b>
              <div><h3>{note.title}</h3><p>{note.description}</p></div>
              <span>阅读 →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="pf-shell pf-section" id="aesthetic" aria-labelledby="method-aesthetic" style={{ scrollMarginTop: 96 }}>
        <div className="pf-section-head"><h2 id="method-aesthetic">小案例：画面审美判断</h2><p>晨光里，先看见谁？同一张静帧做三版调色，比较视觉焦点落在哪里。</p></div>
        <AestheticCase />
      </section>
      <SiteFooter />
    </main>
  );
}
