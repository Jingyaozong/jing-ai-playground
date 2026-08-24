import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-lead">
        <p className="eyebrow mono">Find me elsewhere</p>
        <h2>在别的平台，<br />继续看我折腾。</h2>
      </div>
      <div className="social-grid">
        {['抖音', '小红书', 'Bilibili', 'Email / 商务合作'].map((item, index) => (
          <div className="social-placeholder" key={item}>
            <span className="mono">0{index + 1}</span>
            <strong>{item}</strong>
            <small>账号待更新</small>
          </div>
        ))}
      </div>
      <div className="footer-bottom mono">
        <span>© 2026 JING AI PLAYGROUND</span>
        <span>Made with curiosity + AI</span>
        <Link href="/">Back to top ↑</Link>
      </div>
    </footer>
  );
}
