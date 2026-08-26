import experimentPilotSamples from '../assets/generated/forty-shots-pilot-samples.png';
import storyKeyframes from '../assets/generated/she-forgets-yesterday-keyframes.png';

const generatedVisuals = {
  memory: { image: storyKeyframes, caption: 'AI concept board · 4 frames' },
  faces: { image: experimentPilotSamples, caption: 'Pilot samples · 4 / 40' },
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
