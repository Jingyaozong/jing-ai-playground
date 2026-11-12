'use client';

import { useRef, useState } from 'react';
import { isPlaceholder } from '../data/profile';

type WallItem = { id: string; name: string; video: string; poster: string; verdict: string };

const withBase = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;

export function VideoWall({ items, note = '四条视频使用同一份验收合同与 Prompt。', columns = 2 }: { items: WallItem[]; note?: string; columns?: 2 | 3 }) {
  const wall = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const ready = items.some((item) => !isPlaceholder(item.video));

  function toggle() {
    const videos = Array.from(wall.current?.querySelectorAll('video') ?? []);
    if (playing) {
      videos.forEach((video) => video.pause());
    } else {
      videos.forEach((video) => { video.currentTime = 0; void video.play(); });
    }
    setPlaying(!playing);
  }

  return (
    <div>
      <div className="pf-wall-bar">
        <p className="pf-note">{note}{ready ? '' : ' 视频文件填入后会在这里播放。'}</p>
        <button className="pf-button" type="button" onClick={toggle} disabled={!ready} aria-pressed={playing}>
          {playing ? '全部暂停' : '同步播放'}
        </button>
      </div>
      <div className={`pf-wall${columns === 3 ? ' is-three' : ''}`} ref={wall}>
        {items.map((item) => (
          <figure key={item.id}>
            {isPlaceholder(item.video) ? (
              <div className="pf-media is-rounded pf-media-pending">{item.video}</div>
            ) : (
              <div className="pf-media is-rounded">
                <video
                  muted
                  controls
                  loop
                  playsInline
                  preload="none"
                  poster={isPlaceholder(item.poster) ? undefined : withBase(item.poster)}
                  src={withBase(item.video)}
                  aria-label={`${item.name} 的生成结果`}
                />
              </div>
            )}
            <div className="pf-wall-hover" aria-hidden="true"><span>{item.name}</span><span>{item.verdict}</span></div>
            <figcaption><span>{item.name}</span>{/^[\d.]+/.test(item.verdict) ? <span className="pf-score">{item.verdict}</span> : <span className="pf-severity" data-level={item.verdict}>{item.verdict}</span>}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
