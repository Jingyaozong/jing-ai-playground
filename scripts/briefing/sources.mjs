import { sources } from './pipeline.mjs';

// Target names are not collection endpoints. Only verified feeds in sources run.
export const pendingSources = [
  { name: '数字生命卡兹克', reason: '尚未验证官方自动订阅入口；不使用第三方拆解替代原文。' },
  { name: 'AI前线', reason: 'InfoQ 官方账号目录确认账号 ai-front；尚未验证该账号自动订阅入口。' },
  { name: '机器之心', reason: '官网可访问；本次首页未发现声明的 RSS，未接入抓取。' },
  { name: '极客公园', reason: '官网本次返回 HTTP 403；停止请求，未绕过限制。' },
  { name: 'Founder Park', reason: '尚未验证独立官方自动订阅入口；不以极客公园全站内容替代。' },
];

export function sourceReport() {
  return [
    '已接通：仅采集 RSS 标题、摘要、发布时间和原文链接，不核实全文。',
    ...sources.map((source) => `- ${source.name}：${source.feed}`),
    '',
    '待接通（不会发送采集请求）：',
    ...pendingSources.map((source) => `- ${source.name}：${source.reason}`),
    '',
    '入口核验日期：2026-09-08；本命令离线展示配置，不代表实时健康检查。',
    '没有微信自动读取、语鲸接口、自动发布或定时任务。',
  ].join('\n');
}
