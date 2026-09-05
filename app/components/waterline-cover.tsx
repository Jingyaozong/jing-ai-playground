export function WaterlineCover() {
  return (
    <figure className="waterline-cover">
      <div className="waterline-cover-label"><span className="mono">SHOT 11 / 动作研究</span><span>协议示意 · 无视频</span></div>
      <svg viewBox="0 0 360 300" role="img" aria-label="一把撑开的红伞，水线沿木地板从左前方退向右后方；仅为动作示意">
        <path d="M28 162 220 83 338 155 145 270Z" fill="var(--sky)" stroke="var(--ink)" strokeWidth="1.5" />
        <path d="m28 162 84-35 119 92-86 51Z" fill="var(--paper)" />
        <g fill="none" stroke="var(--ink)" strokeWidth="1" opacity=".18">
          <path d="m67 147 119 98m-80-115 119 93m-80-109 119 86m-80-102 119 80M57 184l190-84M87 208l191-89m-160 113 191-94" />
        </g>
        <path d="m112 127 119 92" fill="none" stroke="var(--blue)" strokeWidth="3" />
        <path d="m242 229 62-37m-18-3 18 3-6 16" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="142" cy="213" rx="32" ry="7" fill="var(--ink)" opacity=".08" />
        <path d="M143 102v99q0 15-13 15t-13-13" fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        <path d="M69 111q74-116 148 0-20-13-38 0-36-16-73 0-18-13-37 0Z" fill="var(--coral)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M143 58q-28 17-37 53m37-53q27 17 36 53m-36-58v-9" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <circle cx="112" cy="127" r="5" fill="var(--yellow)" stroke="var(--ink)" strokeWidth="1.5" />
        <circle cx="231" cy="219" r="5" fill="var(--yellow)" stroke="var(--ink)" strokeWidth="1.5" />
      </svg>
      <figcaption><strong>伞先锁定。<br />水，再向后。</strong><p>左前 → 右后<br />一个连续镜头</p></figcaption>
    </figure>
  );
}
