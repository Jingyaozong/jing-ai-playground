import Link from 'next/link';

const navItems = [
  ['Home', '首页', '/'],
  ['Stories', '故事', '/stories'],
  ['Experiments', '实验', '/experiments'],
  ['Notes', '笔记', '/notes'],
  ['Library', '收藏', '/library'],
  ['Tools', '工具', '/tools'],
  ['About', '关于', '/about'],
];

export function SiteHeader({ active = 'Home' }: { active?: string }) {
  return (
    <header className="site-header">
      <Link className="brand-mark" href="/" aria-label="JING AI Playground 首页">
        <span>荆</span>
        <small>AI playground</small>
      </Link>
      <nav className="desktop-nav" aria-label="主导航">
        {navItems.map(([id, label, href]) => (
          <Link className={active === id ? 'is-active' : ''} key={id} href={href}>{label}</Link>
        ))}
      </nav>
      <Link className="contact-link" href="/#contact">联系我 <span>↗</span></Link>
      <details className="mobile-menu">
        <summary>Menu</summary>
        <nav aria-label="移动端导航">
          {navItems.map(([id, label, href]) => <Link key={id} href={href}>{label}</Link>)}
        </nav>
      </details>
    </header>
  );
}
