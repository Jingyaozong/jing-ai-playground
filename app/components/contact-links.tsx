import { isPlaceholder, profile } from '../data/profile';

// 占位符未填写时渲染为不可点击的文字，避免产生死链。
export function ContactList() {
  return (
    <ul className="pf-contact-list">
      <li>
        <span>邮箱</span>
        {isPlaceholder(profile.email) ? <b>{profile.email}</b> : <a href={`mailto:${profile.email}`}>{profile.email}</a>}
      </li>
      {profile.links.map((link) => (
        <li key={link.label}>
          <span>平台</span>
          {isPlaceholder(link.href) ? <b>{link.label}</b> : <a href={link.href} target="_blank" rel="noreferrer">{link.label}</a>}
        </li>
      ))}
    </ul>
  );
}
