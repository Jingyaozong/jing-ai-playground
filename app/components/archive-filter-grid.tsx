'use client';

import { useState } from 'react';
import type { Experiment, Story } from '../data/content';
import { ExperimentCard } from './experiment-card';
import { Reveal } from './reveal';
import { StoryCard } from './story-card';

type StageFilter = 'all' | 'documented' | 'concept';

type ArchiveFilterGridProps =
  | { kind: 'stories'; items: Story[] }
  | { kind: 'experiments'; items: Experiment[] };

const filterLabels: Record<StageFilter, string> = {
  all: '全部',
  documented: '已有记录',
  concept: '概念候选',
};

export function ArchiveFilterGrid(props: ArchiveFilterGridProps) {
  const [filter, setFilter] = useState<StageFilter>('all');
  const documentedCount = props.items.filter((item) => item.stage === 'documented').length;
  const conceptCount = props.items.length - documentedCount;
  const counts: Record<StageFilter, number> = {
    all: props.items.length,
    documented: documentedCount,
    concept: conceptCount,
  };
  const visibleCount = filter === 'all' ? props.items.length : counts[filter];
  const archiveName = props.kind === 'stories' ? '故事' : '实验';

  return (
    <>
      <div className="archive-filter-row">
        <div className="archive-filter mono" role="group" aria-label={`筛选${archiveName}`}>
          {(Object.keys(filterLabels) as StageFilter[]).map((option) => (
            <button
              className={filter === option ? 'is-active' : ''}
              type="button"
              aria-pressed={filter === option}
              onClick={() => setFilter(option)}
              key={option}
            >
              <span>{filterLabels[option]}</span>
              <strong>{counts[option]}</strong>
            </button>
          ))}
        </div>
        <p className="archive-result-count mono" aria-live="polite">
          正在显示 {visibleCount} / {props.items.length} 个{archiveName}
        </p>
      </div>

      <div className={`${props.kind === 'stories' ? 'story-grid' : 'experiment-grid'} archive-grid`}>
        {props.kind === 'stories'
          ? (filter === 'all' ? props.items : props.items.filter((story) => story.stage === filter)).map((story) => {
              const index = props.items.findIndex((item) => item.id === story.id);
              return <Reveal key={story.id}><StoryCard story={story} index={index} /></Reveal>;
            })
          : (filter === 'all' ? props.items : props.items.filter((experiment) => experiment.stage === filter)).map((experiment) => {
              return <Reveal key={experiment.id}><ExperimentCard experiment={experiment} isLatest={experiment.id === props.items[0]?.id} /></Reveal>;
            })}
      </div>
    </>
  );
}
