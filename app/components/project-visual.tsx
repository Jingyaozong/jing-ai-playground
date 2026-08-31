import experimentPilotSamples from '../assets/generated/forty-shots-pilot-samples.png';
import pierTicketFrame from '../assets/generated/no-boat-at-pier-seven-frame-01.webp';
import rainKitchenFrame from '../assets/generated/before-the-rain-ends-frame-01.webp';
import earlyShadowFrame from '../assets/generated/shadow-arrives-five-minutes-early-frame-03.webp';
import objectMemoryFrame from '../assets/generated/objects-remember-frame-03.webp';
import memoryMorningFrame from '../assets/generated/she-forgets-yesterday-frame-01-v2.webp';

const generatedVisuals = {
  memory: { image: memoryMorningFrame, caption: 'Scene 01 · AI concept frame · no video' },
  pier: { image: pierTicketFrame, caption: 'Scene 01 · AI concept frame · no video' },
  rain: { image: rainKitchenFrame, caption: 'Scene 01 · AI concept frame · no video' },
  faces: { image: experimentPilotSamples, caption: 'Pilot samples · 4 / 40' },
  rainstudy: { image: rainKitchenFrame, caption: 'Story concept frame · no video' },
  earlyshadow: { image: earlyShadowFrame, caption: 'AI concept frame · no video' },
  echo: { image: objectMemoryFrame, caption: 'AI concept frame · no video' },
};

export function ProjectVisual({ variant, label }: { variant: string; label: string }) {
  const visualKey = variant.split(' ')[0];
  const generated = generatedVisuals[visualKey as keyof typeof generatedVisuals];

  if (visualKey === 'contact') {
    const stages = [['01', '接近'], ['02', '接触'], ['03', '承重'], ['04', '移动'], ['05', '释放']];
    return (
      <div className={`project-visual visual-${variant} is-protocol-diagram`} aria-label={`${label}的五阶段接触动作实验协议图；不是模型样本`}>
        <span className="contact-protocol-kicker mono">CONTACT CHAIN / 实验协议图</span>
        <div className="contact-protocol-stage" aria-hidden="true">
          <div className="contact-protocol-hand"><b /><i /><i /><i /></div>
          <div className="contact-protocol-cup"><i /><b /></div>
          <em>＋</em>
          <strong className="mono">TABLE → HAND</strong>
        </div>
        <div className="contact-protocol-steps" aria-label="接近、接触、承重、移动、释放">
          {stages.map(([number, stage]) => <span key={number}><small className="mono">{number}</small><b>{stage}</b></span>)}
        </div>
        <span className="grain" />
        <span className="visual-caption mono">Protocol diagram · 0 / 9 samples</span>
      </div>
    );
  }

  if (visualKey === 'lighting') {
    const locks = [['01', '灯位固定'], ['02', '人物转向'], ['03', '机位 A'], ['04', '机位 B']];
    return (
      <div className={`project-visual visual-${variant} is-protocol-diagram`} aria-label={`${label}的世界坐标光线实验协议图；不是模型样本`}>
        <span className="lighting-protocol-kicker mono">WORLD LIGHT MAP / 实验协议图</span>
        <div className="lighting-protocol-map" aria-hidden="true">
          <div className="lighting-north-window"><span className="mono">NORTH WINDOW</span></div>
          <div className="lighting-cold-beams"><i /><i /><i /></div>
          <div className="lighting-subject"><i /><b className="mono">SUBJECT</b></div>
          <div className="lighting-table-lamp"><i /><b className="mono">TABLE<br />LIGHT</b></div>
          <div className="lighting-camera camera-a"><i /><b className="mono">A</b></div>
          <div className="lighting-camera camera-b"><i /><b className="mono">B</b></div>
          <span className="lighting-axis mono">180° AXIS</span>
        </div>
        <div className="lighting-protocol-locks" aria-label="灯位固定、人物转向、机位 A、机位 B">
          {locks.map(([number, lock]) => <span key={number}><small className="mono">{number}</small><b>{lock}</b></span>)}
        </div>
        <span className="grain" />
        <span className="visual-caption mono">Protocol diagram · 0 / 12 samples</span>
      </div>
    );
  }

  if (visualKey === 'reference') {
    const groups = [
      { code: 'A', label: '无参考', count: 0, tone: 'none' },
      { code: 'B', label: '单张正面', count: 1, tone: 'one' },
      { code: 'C', label: '三张多角度', count: 3, tone: 'three' },
    ];
    return (
      <div className={`project-visual visual-${variant} is-protocol-diagram`} aria-label={`${label}的三组参考输入实验协议图；不是模型样本`}>
        <span className="reference-protocol-kicker mono">REFERENCE INPUT / 实验协议图</span>
        <div className="reference-protocol-groups">
          {groups.map((group) => <article className={`reference-group-card is-${group.tone}`} key={group.code}>
            <div className="reference-group-top mono"><b>{group.code}</b><span>INPUT</span></div>
            <div className="reference-portrait-set" aria-hidden="true">
              {group.count === 0 ? <span className="reference-none-mark">×</span> : Array.from({ length: group.count }, (_, index) => <span className={`reference-portrait view-${index + 1}`} key={index} />)}
            </div>
            <div className="reference-group-foot"><b>{group.label}</b><small className="mono">0 / 4</small></div>
          </article>)}
        </div>
        <span className="reference-shared-tasks mono">SAME 4 SHOT TASKS × 3 INPUT GROUPS</span>
        <span className="grain" />
        <span className="visual-caption mono">Protocol diagram · 0 / 12 samples</span>
      </div>
    );
  }

  if (generated) {
    return (
      <div
        className={`project-visual visual-${variant} has-generated-image`}
        aria-label={`${label} 的 AI 生成概念视觉`}
        style={{ backgroundImage: `url("${generated.image.src}")` }}
      >
        <span className="grain" />
        <span className="visual-caption mono">{generated.caption}</span>
      </div>
    );
  }

  return (
    <div className={`project-visual visual-${variant}`} aria-label={`${label} 概念占位视觉`}>
      <span className="visual-shape shape-a" />
      <span className="visual-shape shape-b" />
      <span className="visual-shape shape-c" />
      <span className="grain" />
      <span className="visual-caption mono">Concept visual</span>
    </div>
  );
}
