import Link from 'next/link';

export function SiteFooter() {
  const destinations = [
    { name: '抖音', status: '主页尚未公开' },
    { name: '小红书', status: '主页尚未公开' },
    { name: 'Bilibili', status: '主页尚未公开' },
    { name: 'Email / 商务合作', status: '联系地址尚未公开' },
  ];

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-lead">
        <div>
          <p className="eyebrow mono">Elsewhere / pending</p>
          <p className="footer-status-note">当前没有公开的社交账号或联系邮箱；确认真实地址后，再开放可以使用的链接。</p>
        </div>
        <h2><span>其他平台，</span><span>确认以后再见。</span></h2>
      </div>
      <div className="social-grid" aria-label="尚未公开的站外连接">
        {destinations.map((item) => (
          <div className="social-placeholder" key={item.name}>
            <strong>{item.name === 'Email / 商务合作' ? <>Email<span>商务合作</span></> : item.name}</strong>
            <small>{item.status}</small>
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
