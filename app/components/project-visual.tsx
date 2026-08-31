import experimentPilotSamples from '../assets/generated/forty-shots-pilot-samples.png';
import rainKitchenFrame from '../assets/generated/before-the-rain-ends-frame-01.webp';
import earlyShadowFrame from '../assets/generated/shadow-arrives-five-minutes-early-frame-03.webp';
import objectMemoryFrame from '../assets/generated/objects-remember-frame-03.webp';
import memoryMorningFrame from '../assets/generated/she-forgets-yesterday-frame-01-v2.webp';

const generatedVisuals = {
  memory: { image: memoryMorningFrame, caption: 'Scene 01 · AI concept frame · no video' },
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
