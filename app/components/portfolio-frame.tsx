import Link from 'next/link';

export function PortfolioHeader() {
  return <header className="folio-header"><Link className="folio-brand" href="/"><b>荆</b> JING / AIGC</Link><nav aria-label="作品集导航"><Link href="/#ab-review">案例</Link><Link href="/#method">评测</Link><Link href="/briefing/">精读</Link><Link href="/about/">关于</Link></nav></header>;
}

export function PortfolioFooter() {
  return <footer className="folio-footer"><span>JING / 多模态美学</span><nav aria-label="历史资料"><Link href="/archive/">旧站归档 ↗</Link><Link href="/notes/">笔记档案 ↗</Link><Link href="/about/">关于荆 ↗</Link></nav></footer>;
}
