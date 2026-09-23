import { sources } from './pipeline.mjs';

// Target names are not collection endpoints. Only verified feeds in sources run.
export const pendingSources = [
  { name: '数字生命卡兹克', reason: 'AIHOT 可私有发现原文链接；另有 BestBlogs / Wechat2RSS 第三方正文副本供 briefing:wechat:check/draft 私有待核对使用，非微信官方原文或授权转载。' },
  { name: 'AI前线', reason: 'InfoQ 确认公众号名称；BestBlogs / Wechat2RSS 第三方源只做私有元数据核验，未独立确认其微信账号身份或接入模型。' },
  { name: '机器之心', reason: 'BestBlogs / Wechat2RSS 第三方源只做私有元数据核验；非官网 RSS 或微信官方接口，未接入模型。' },
  { name: '极客公园', reason: 'BestBlogs / Wechat2RSS 第三方源只做私有元数据核验；官网先前返回 403，未绕过，也未接入模型。' },
  { name: 'Founder Park', reason: '尚未验证独立官方自动订阅入口；不以极客公园全站内容替代。' },
];

export function sourceReport() {
  return [
    '已接通：仅采集 RSS 标题、摘要、发布时间和原文链接，不核实全文。',
    ...sources.map((source) => `- ${source.name}：${source.feed}`),
    '',
    '未进入普通 collect/draft 白名单（私有实验命令另行说明）：',
    ...pendingSources.map((source) => `- ${source.name}：${source.reason}`),
    '',
    'RSS 入口核验日期：2026-09-08；本命令离线展示配置，不代表实时健康检查。',
    '数字生命卡兹克链接发现入口核验日期：2026-09-23；运行 briefing:watch 才会实际请求 AIHOT。',
    '四个指定公众号的第三方元数据核验入口：运行 briefing:wechat:sources；不保存正文，不调用模型。',
    '第三方 RSS 正文仅供私有待核对草稿；没有微信官方原文核验、语鲸接口、自动发布或定时任务。',
  ].join('\n');
}
