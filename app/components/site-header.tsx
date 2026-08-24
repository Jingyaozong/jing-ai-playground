import Link from 'next/link';

const navItems = [
  ['Home', '/'],
  ['Stories', '/stories'],
  ['Experiments', '/experiments'],
  ['Tools', '/tools'],
  ['About', '/about'],
];

export function SiteHeader({ active = 'Home' }: { active?: string }) {
  return (
    <header className="site-header">
      <Link className="brand-mark" href="/" aria-label="JING AI Playground 首页">
        <span>荆</span>
        <small>AI playground</small>
      </Link>
      <nav className="desktop-nav" aria-label="主导航">
        {navItems.map(([label, href]) => (
          <Link className={active === label ? 'is-active' : ''} key={label} href={href}>{label}</Link>
        ))}
      </nav>
      <Link className="contact-link" href="/#contact">Contact <span>↗</span></Link>
      <details className="mobile-menu">
        <summary>Menu</summary>
        <nav aria-label="移动端导航">
          {navItems.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
        </nav>
      </details>
    </header>
  );
}
