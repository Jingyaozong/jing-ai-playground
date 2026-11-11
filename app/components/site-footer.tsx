import Link from 'next/link';
import { profile } from '../data/profile';
import { ContactList } from './contact-links';
import { navItems } from './site-header';

export function SiteFooter() {
  return (
    <footer className="site-footer pf-footer">
      <div className="pf-footer-main">
        <div>
          <strong>{profile.siteName}</strong>
          <p>{profile.roleLine}</p>
        </div>
        <ContactList />
      </div>
      <div className="pf-footer-bottom">
        <nav aria-label="页脚导航">
          {navItems.map(([id, label, href]) => <Link key={id} href={href}>{label}</Link>)}
          <Link href="/notes/">归档</Link>
        </nav>
        <span>© 2026 {profile.name}</span>
      </div>
    </footer>
  );
}
