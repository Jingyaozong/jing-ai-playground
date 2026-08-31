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
  const visualKey = variant.split(' ')[0] as keyof typeof generatedVisuals;
  const generated = generatedVisuals[visualKey];

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
