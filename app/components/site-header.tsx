import Link from 'next/link';

export const navItems = [
  ['Cases', '评测案例', '/cases/'],
  ['Method', '方法', '/method/'],
  ['Projects', '项目经历', '/projects/'],
  ['Practice', '创作实践', '/stories/'],
  ['About', '关于与联系', '/about/'],
] as const;

export function SiteHeader({ active = '' }: { active?: string }) {
  return (
    <div className="site-header-shell">
      <header className="site-header">
        <Link className="brand-mark" href="/" title="返回首页">
          <span>JING</span>
          <small>AI 视频与多模态评测</small>
        </Link>
        <nav className="desktop-nav" aria-label="主导航">
          {navItems.map(([id, label, href]) => (
            <Link className={active === id ? 'is-active' : ''} key={id} href={href}>{label}</Link>
          ))}
        </nav>
        <details className="mobile-menu">
          <summary>菜单</summary>
          <nav aria-label="移动端导航">
            {navItems.map(([id, label, href]) => <Link key={id} href={href}>{label}</Link>)}
          </nav>
        </details>
      </header>
    </div>
  );
}
