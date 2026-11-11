export const podcastSources = [
  ['42章经', '42zhangjing'],
  ['晚点聊 LateTalk', 'latetalk'],
  ['张小珺商业访谈录', 'zhangxiaojun'],
  ['十字路口 Crossing', 'crossing'],
  ['AI炼金术', 'aialchemy'],
  ['三五环', '35huan'],
  ['知行小酒馆', 'zhixing'],
  ['面基', 'mianji'],
].map(([name, slug]) => {
  const origin = `https://${slug}.qiaomu.ai`;
  return { name, origin, feed: `${origin}/feed.xml`, path: '/ep/' };
});
