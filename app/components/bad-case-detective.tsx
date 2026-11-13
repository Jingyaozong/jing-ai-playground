'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { blindTest } from '../data/blind-test';
import { NO_ISSUE, detectiveConfig, detectivePoster, detectiveRounds, detectiveVideo, type DetectiveRound } from '../data/detective-rounds';

type Phase = 'intro' | 'answer' | 'reveal' | 'summary';
type Result = { round: DetectiveRound; choice: string | null; correct: boolean; rating: number; jury: number | null };

const withBase = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;
const productName = (round: DetectiveRound) => blindTest.products.find((item) => item.id === round.product)?.name ?? round.product;
const promptOf = (round: DetectiveRound) => blindTest.questions.find((item) => item.no === round.question)!;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// 打乱关卡顺序和问题选项，“没有明显问题”固定放在最后。
function newGame(): DetectiveRound[] {
  return shuffle(detectiveRounds).map((round) => ({
    ...round,
    options: [...shuffle(round.options.filter((option) => option !== NO_ISSUE)), NO_ISSUE],
  }));
}

function verdict(correct: number, total: number, deviation: number, falseAlarms: number) {
  const eye = correct >= total - 1
    ? '眼力很准，真问题和看着像问题的地方都分得清。'
    : correct >= total / 2
      ? '大部分问题都抓到了。回看答错的几关，看看是漏看了还是想多了。'
      : 'AI 视频的问题常藏在一眼看过去很正常的地方，再来一局试试。';
  const scale = deviation <= 1
    ? '你的打分尺度和评审团很接近。'
    : deviation <= 2
      ? '你的打分尺度和评审团大体一致。'
      : '你的打分尺度和评审团差得较多。正式评测前先用几条样片对齐尺度，就是为了解决这个问题。';
  const alarm = falseAlarms > 0 ? `有 ${falseAlarms} 条没有明显问题的视频被你挑出了毛病。` : '';
  return [eye, alarm, scale].filter(Boolean).join('');
}

export function BadCaseDetective({ juryScores }: { juryScores: Record<string, number | null> }) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [rounds, setRounds] = useState<DetectiveRound[]>(detectiveRounds);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [rating, setRating] = useState(5);
  const [timeLeft, setTimeLeft] = useState(detectiveConfig.seconds);
  const [untimed, setUntimed] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const revealButton = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const started = useRef(false);

  const round = rounds[index];
  const total = rounds.length;

  // 每次换关或换阶段，把焦点移到这一屏的标题上，读屏和键盘用户都能接着往下走。
  useEffect(() => {
    if (started.current) heading.current?.focus();
  }, [phase, index]);

  // 新的一关开始时自动静音播放。
  useEffect(() => {
    if (phase !== 'answer') return;
    const element = video.current;
    if (element) { element.currentTime = 0; void element.play().catch(() => {}); }
  }, [phase, index]);

  // 倒计时：选定答案后停止，时间到按未作答处理。
  useEffect(() => {
    if (phase !== 'answer' || locked || untimed) return;
    const timer = window.setTimeout(() => {
      setTimeLeft(timeLeft - 1);
      if (timeLeft <= 1) setLocked(true);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [phase, locked, untimed, timeLeft]);

  useEffect(() => {
    if (locked && phase === 'answer') (slider.current ?? revealButton.current)?.focus();
  }, [locked, phase]);

  function start() {
    started.current = true;
    setRounds(newGame());
    setResults([]);
    setIndex(0);
    beginRound();
    setPhase('answer');
  }

  function beginRound() {
    setChoice(null);
    setLocked(false);
    setRating(5);
    setTimeLeft(detectiveConfig.seconds);
  }

  function pick(option: string) {
    if (locked) return;
    setChoice(option);
    setLocked(true);
  }

  function reveal() {
    setResults((list) => [...list, { round, choice, correct: choice === round.answer, rating, jury: juryScores[round.id] }]);
    setPhase('reveal');
  }

  function next() {
    if (index + 1 >= total) { setPhase('summary'); return; }
    setIndex(index + 1);
    beginRound();
    setPhase('answer');
  }

  if (phase === 'intro') {
    return (
      <section className="pf-det-intro" aria-labelledby="det-intro">
        <h2 id="det-intro">怎么玩</h2>
        <ol className="pf-det-steps">
          <li><b>看</b><span>每关一条 AI 生成的视频和当时给模型的题面，不告诉你是哪款产品。</span></li>
          <li><b>找</b><span>{detectiveConfig.seconds} 秒内从四个选项里选出最主要的问题。也可能没有问题。</span></li>
          <li><b>打分</b><span>可评分关卡打 0–10 分，再和 7 位评审的均分对比。样本错配教学关只判断答题是否正确。</span></li>
        </ol>
        <p className="pf-note">素材来自五款国产视频模型的交叉盲评，共 {detectiveRounds.length} 关。视频静音播放，可以重播。部分视频右下角的模糊块是原始素材里已有的水印遮挡，不算生成问题。</p>
        <div className="pf-det-start">
          <button className="pf-button" type="button" onClick={start}>开始</button>
          <label className="pf-det-check">
            <input type="checkbox" checked={untimed} onChange={(event) => setUntimed(event.target.checked)} />
            <span>不限时</span>
          </label>
        </div>
      </section>
    );
  }

  if (phase === 'summary') {
    const correct = results.filter((item) => item.correct).length;
    const differences = results.flatMap((item) => item.jury === null ? [] : [Math.abs(item.rating - item.jury)]);
    const deviation = differences.reduce((sum, difference) => sum + difference, 0) / differences.length;
    const falseAlarms = results.filter((item) => item.round.answer === NO_ISSUE && item.choice !== null && item.choice !== NO_ISSUE).length;
    return (
      <section className="pf-det-summary" aria-labelledby="det-summary">
        <h2 id="det-summary" ref={heading} tabIndex={-1}>结果</h2>
        <div className="pf-det-stats">
          <div><strong>{correct} / {results.length}</strong><span>找对的条数</span></div>
          <div><strong>{deviation.toFixed(2)}</strong><span>你的打分与评审团均分的平均偏差（{differences.length} 关）</span></div>
        </div>
        <p className="pf-det-verdict">{verdict(correct, results.length, deviation, falseAlarms)}</p>
        <ol className="pf-det-review">
          {results.map((item, order) => (
            <li key={item.round.id}>
              <span className="pf-det-mark" data-ok={item.correct}>{item.correct ? '对' : '错'}</span>
              <span className="pf-det-review-main">
                <b>第 {order + 1} 关 · 题 {item.round.question} {promptOf(item.round).name} · {productName(item.round)}</b>
                <span>{item.round.answer === NO_ISSUE ? NO_ISSUE : item.round.type}</span>
              </span>
              <span className="pf-det-review-score">{item.jury === null ? '教学关 · 无评分对比' : `你 ${item.rating} · 评审团 ${item.jury.toFixed(2)}`}</span>
            </li>
          ))}
        </ol>
        <div className="pf-actions">
          <button className="pf-button" type="button" onClick={start}>再来一局</button>
          <Link className="pf-button is-ghost" href={detectiveConfig.source}>看完整评测案例</Link>
        </div>
      </section>
    );
  }

  const question = promptOf(round);
  const jury = juryScores[round.id];
  const correct = choice === round.answer;
  const urgent = !untimed && !locked && timeLeft <= 5;

  return (
    <section className="pf-det-play" aria-labelledby="det-round">
      <div className="pf-det-progress">
        <span>第 {index + 1} / {total} 关</span>
        <ol aria-hidden="true">{rounds.map((item, order) => <li key={item.id} data-state={order < index || (order === index && phase === 'reveal') ? 'done' : order === index ? 'now' : 'todo'} />)}</ol>
      </div>
      <div className="pf-det-grid">
        <div className="pf-det-stage">
          <div className="pf-media is-rounded">
            <video
              key={round.id}
              ref={video}
              muted
              loop
              controls
              playsInline
              preload="none"
              poster={withBase(detectivePoster(round))}
              src={withBase(detectiveVideo(round))}
              aria-label={`第 ${index + 1} 关的视频，静音`}
            />
          </div>
          <blockquote className="pf-det-prompt">
            <span>题 {question.no} · {question.name} · 当时给模型的题面</span>
            {question.prompt}
          </blockquote>
        </div>

        {phase === 'answer' ? (
          <div className="pf-det-panel">
            <h2 id="det-round" ref={heading} tabIndex={-1}>这条视频最主要的问题是什么？</h2>
            {untimed ? (
              <p className="pf-det-timer">不限时</p>
            ) : (
              <div className="pf-det-timer" data-urgent={urgent}>
                <span role="timer" aria-live="off">{locked ? (choice ? '已作答' : '时间到') : `剩余 ${timeLeft} 秒`}</span>
                <span className="pf-det-bar" aria-hidden="true"><span style={{ width: `${(timeLeft / detectiveConfig.seconds) * 100}%` }} /></span>
              </div>
            )}
            <p className="sr-only" aria-live="assertive">{!untimed && !locked && (timeLeft === 10 || timeLeft === 5) ? `还剩 ${timeLeft} 秒` : ''}{locked && !choice ? '时间到' : ''}</p>
            <div className="pf-det-options" role="group" aria-label="四个选项">
              {round.options.map((option) => (
                <button
                  type="button"
                  key={option}
                  className="pf-det-option"
                  aria-pressed={choice === option}
                  disabled={locked && choice !== option}
                  onClick={() => pick(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            {locked && (
              <div className="pf-det-rate">
                {!choice && <p className="pf-det-timeout">时间到，这一关按未作答计。</p>}
                {jury !== null && <>
                  <label htmlFor="det-rating">给这条视频的综合印象打分</label>
                  <div className="pf-det-slider">
                    <input
                      ref={slider}
                      id="det-rating"
                      type="range"
                      min={0}
                      max={10}
                      step={1}
                      value={rating}
                      onChange={(event) => setRating(Number(event.target.value))}
                      aria-valuetext={`${rating} 分`}
                    />
                    <output htmlFor="det-rating">{rating}</output>
                  </div>
                  <div className="pf-det-scale" aria-hidden="true"><span>0 不可用</span><span>10 可以直接用</span></div>
                </>}
                <button className="pf-button" type="button" ref={revealButton} onClick={reveal}>揭晓答案</button>
              </div>
            )}
          </div>
        ) : (
          <div className="pf-det-panel pf-det-reveal">
            <h2 id="det-round" ref={heading} tabIndex={-1}>
              <span className="pf-det-mark" data-ok={correct} aria-hidden="true">{correct ? '对' : '错'}</span>
              {correct ? '找对了' : choice ? '没找对' : '未作答'}
            </h2>
            <dl className="pf-det-facts">
              <div><dt>正确答案</dt><dd>{round.answer}</dd></div>
              {!correct && choice && <div><dt>你的选择</dt><dd>{choice}</dd></div>}
              <div><dt>为什么</dt><dd>{round.explanation}</dd></div>
              <div><dt>失败类型</dt><dd><span className="pf-det-type" data-pass={round.answer === NO_ISSUE}>{round.type}</span></dd></div>
              <div><dt>产品</dt><dd>{productName(round)}</dd></div>
              <div>
                <dt>打分</dt>
                <dd>{jury === null ? '样本错配教学关 · 无评分对比' : <>你 <b>{rating}</b>　评审团均分 <b>{jury.toFixed(2)}</b>　相差 {Math.abs(rating - jury).toFixed(2)}</>}</dd>
              </div>
            </dl>
            {round.frame && (
              <figure className="pf-det-frame">
                <div className="pf-media is-rounded">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={withBase(round.frame.src)} alt={round.frame.alt} width={1280} height={720} loading="lazy" />
                </div>
                <figcaption>截帧 {round.frame.timecode}</figcaption>
              </figure>
            )}
            {round.note && <p className="pf-note">{round.note}</p>}
            {jury !== null && <p className="pf-note">评审团均分是 7 位评审对这款产品在这道题上 3 次生成的综合印象平均分。</p>}
            <button className="pf-button" type="button" onClick={next}>{index + 1 >= total ? '看结果' : '下一关'}</button>
          </div>
        )}
      </div>
    </section>
  );
}
