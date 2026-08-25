'use client';

import { useState } from 'react';

const decks = {
  character: [
    { title: '修复旧照片的夜班店员', detail: '只接收那些已经没人记得原主人的照片。' },
    { title: '替陌生人保管梦境的快递员', detail: '从不拆开包裹，也从来没有做过自己的梦。' },
    { title: '能听见旧物说话的搬家工', detail: '每件被丢弃的东西，都在请求去往不同的地址。' },
    { title: '专门替人写告别信的代笔者', detail: '写过上千次再见，却从没真正离开过这座城。' },
    { title: '记不住人脸的失物招领员', detail: '可以认出每一件遗失物，却认不出前来领取的人。' },
    { title: '给废弃机器人上课的老师', detail: '每天教它们一种已经没有人使用的情绪。' },
    { title: '只拍空房间的婚礼摄影师', detail: '照片里从不出现新人，却总能拍到一位相同的陌生人。' },
    { title: '负责删除城市噪音的剪辑师', detail: '剪掉的每一种声音，都会从现实里真正消失。' },
  ],
  incident: [
    { title: '收到一张来自明天的合照', detail: '照片里所有人都在笑，只有主角没有出现。' },
    { title: '发现一封自己尚未写出的辞职信', detail: '信里准确记录了三天后才会发生的争吵。' },
    { title: '听见失踪十年的广播再次开播', detail: '广播正在逐分钟预告身边正在发生的事。' },
    { title: '被一个陌生孩子准确叫出旧名字', detail: '那个名字只在一段已经删除的记忆里存在。' },
    { title: '发现每天都有一个影子拒绝回家', detail: '太阳落下后，影子仍停在原地等待某个人。' },
    { title: '收到一把打不开任何门的钥匙', detail: '钥匙只会在有人说谎时变得温热。' },
    { title: '发现城市少了一种颜色', detail: '没有人意识到变化，除了一个正在学画画的人。' },
    { title: '接到一通来自废弃电话亭的求救', detail: '电话里的人说，自己被困在同一晚的七分钟前。' },
  ],
  place: [
    { title: '只在下雨时出现的公交站', detail: '雨停后，站牌和所有等车的人都会消失。' },
    { title: '每天凌晨移动一层的旧公寓', detail: '住户醒来时，窗外总是另一条街。' },
    { title: '没有出口编号的地下车站', detail: '每一班列车都驶向乘客最不愿回去的地方。' },
    { title: '只收藏未完成作品的美术馆', detail: '作品完成的那一刻，就会从展厅和作者记忆里消失。' },
    { title: '时间比城里慢十分钟的便利店', detail: '有人把它当作避难所，也有人来这里等待错误发生。' },
    { title: '漂在云层下面的海边旅馆', detail: '退房时，客人必须留下一段不再需要的回忆。' },
    { title: '会替住客做决定的老酒店', detail: '房卡每天早上都会显示一个无法拒绝的目的地。' },
    { title: '永远放映同一部电影的影院', detail: '只有最后一排的观众知道结局每天都在改变。' },
  ],
  rule: [
    { title: '必须在天亮前让一个人记起真相', detail: '每找回一段记忆，主角自己就会忘掉一件事。' },
    { title: '不能向任何人说出真正目的', detail: '只要说出口，已经发生的事情就会换一种结果。' },
    { title: '只能相信故事里最像反派的人', detail: '其他人说的都是真话，但真话会把主角带向错误结局。' },
    { title: '必须主动放弃最想保留的证据', detail: '证据一旦被保存，真正需要被救的人就会消失。' },
    { title: '每次改变过去都会失去一种感官', detail: '主角必须决定，什么值得用看见、听见或触碰来交换。' },
    { title: '只有在无人相信时计划才会成功', detail: '主角需要一边完成任务，一边让所有人觉得自己失败了。' },
    { title: '必须把唯一的机会让给陌生人', detail: '陌生人离开后，主角才发现两人曾经认识。' },
    { title: '结局必须由一次没有回答的问题触发', detail: '真正的选择不是说什么，而是决定对谁保持沉默。' },
  ],
} as const;

type DeckKey = keyof typeof decks;
type Selection = Record<DeckKey, number>;
type Locked = Record<DeckKey, boolean>;

const deckOrder: DeckKey[] = ['character', 'incident', 'place', 'rule'];
const deckLabels: Record<DeckKey, { number: string; en: string; zh: string }> = {
  character: { number: '01', en: 'CHARACTER', zh: '人物' },
  incident: { number: '02', en: 'INCIDENT', zh: '意外' },
  place: { number: '03', en: 'PLACE', zh: '地点' },
  rule: { number: '04', en: 'RULE', zh: '规则' },
};

const initialSelection: Selection = { character: 0, incident: 0, place: 0, rule: 0 };
const initialLocked: Locked = { character: false, incident: false, place: false, rule: false };

function nextIndex(current: number, length: number) {
  const candidate = Math.floor(Math.random() * (length - 1));
  return candidate >= current ? candidate + 1 : candidate;
}

export function StorySeedGenerator() {
  const [selection, setSelection] = useState<Selection>(initialSelection);
  const [locked, setLocked] = useState<Locked>(initialLocked);
  const [copied, setCopied] = useState(false);
  const allLocked = deckOrder.every((key) => locked[key]);

  const chosen = {
    character: decks.character[selection.character],
    incident: decks.incident[selection.incident],
    place: decks.place[selection.place],
    rule: decks.rule[selection.rule],
  };
  const seedId = `J-${deckOrder.map((key) => selection[key] + 1).join('')}`;
  const logline = `${chosen.character.title}来到${chosen.place.title}，却${chosen.incident.title}；接下来，主角${chosen.rule.title}。`;

  function redrawOne(key: DeckKey) {
    setSelection((current) => ({ ...current, [key]: nextIndex(current[key], decks[key].length) }));
    setCopied(false);
  }

  function redrawUnlocked() {
    if (allLocked) return;
    setSelection((current) => {
      const next = { ...current };
      deckOrder.forEach((key) => {
        if (!locked[key]) next[key] = nextIndex(current[key], decks[key].length);
      });
      return next;
    });
    setCopied(false);
  }

  async function copySeed() {
    const text = `故事种子 ${seedId}\n\n人物：${chosen.character.title}\n${chosen.character.detail}\n\n意外：${chosen.incident.title}\n${chosen.incident.detail}\n\n地点：${chosen.place.title}\n${chosen.place.detail}\n\n规则：${chosen.rule.title}\n${chosen.rule.detail}\n\n一句话：${logline}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="seed-workbench" aria-label="故事种子生成器">
      <div className="seed-deck-panel">
        <div className="seed-panel-heading">
          <span className="mono">01 / 抽取创作卡</span>
          <p>锁住有感觉的卡片，重新抽取其余部分。单独换一张，不会影响其他三张。</p>
        </div>

        <div className="seed-card-grid">
          {deckOrder.map((key) => {
            const item = decks[key][selection[key]];
            const label = deckLabels[key];
            return (
              <article className={`seed-card seed-card-${key} ${locked[key] ? 'is-locked' : ''}`} key={`${key}-${selection[key]}`}>
                <div className="seed-card-topline mono"><span>{label.number} / {label.en}</span><span>{locked[key] ? 'LOCKED' : 'OPEN'}</span></div>
                <p>{label.zh}</p>
                <h2>{item.title}</h2>
                <small>{item.detail}</small>
                <div className="seed-card-actions">
                  <button type="button" onClick={() => redrawOne(key)} disabled={locked[key]} aria-label={`重新抽取${label.zh}`}>↻ 换一张</button>
                  <button type="button" className="seed-lock-button" aria-pressed={locked[key]} onClick={() => setLocked((current) => ({ ...current, [key]: !current[key] }))}>{locked[key] ? '解锁' : '锁住'} {locked[key] ? '○' : '●'}</button>
                </div>
              </article>
            );
          })}
        </div>

        <button className="seed-redraw-button" type="button" disabled={allLocked} onClick={redrawUnlocked}>{allLocked ? '四张卡都锁住了' : '重新抽取未锁定卡片 ↻'}</button>
      </div>

      <aside className="seed-result-ticket" aria-live="polite">
        <div className="seed-ticket-topline mono"><span>02 / TODAY&apos;S SEED</span><span>{seedId}</span></div>
        <p className="seed-ticket-label">一句话故事</p>
        <h2>{logline}</h2>

        <div className="seed-beats">
          <div><span className="mono">开场</span><p>{chosen.character.detail}地点是{chosen.place.title}：{chosen.place.detail}</p></div>
          <div><span className="mono">意外</span><p>{chosen.incident.detail}</p></div>
          <div><span className="mono">代价</span><p>{chosen.rule.detail}</p></div>
        </div>

        <button className="seed-copy-button" type="button" onClick={copySeed}>{copied ? '已复制故事种子 ✓' : '复制这个故事种子 ↗'}</button>
        <small>随机组合只负责推开第一扇门。真正的故事，仍然来自你选择保留什么、删掉什么。</small>
      </aside>
    </section>
  );
}
