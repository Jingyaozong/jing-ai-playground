// 真实视频评测主案例的数据。所有 `{……}` 都是待填写的占位符。
// 视频文件放到 public/videos/ 下（H.264 MP4、720p、单个 ≤5MB），封面图放到 public/videos/posters/ 下。

import { eightDimensions } from './profile';

export type Severity = 'PASS' | 'MINOR' | 'MAJOR' | 'CRITICAL' | '{严重度}';

export const videoCase = {
  slug: 'video-model-comparison',
  title: '同一条指令，四个视频模型的表现差在哪里',
  summary: '用同一份验收合同评测四个视频模型的文生视频与图生视频结果，按八个维度记录证据，并整理 Bad Case。',
  taskCard: [
    { label: '评测目标', value: '{评测目标}' },
    { label: '生成方式', value: '文生视频一组、图生视频一组' },
    { label: '模型与版本', value: '{模型 A 与版本} / {模型 B 与版本} / {模型 C 与版本} / {模型 D 与版本}' },
    { label: '生成日期', value: '{生成日期}' },
    { label: '时长', value: '{时长}' },
    { label: '分辨率', value: '{分辨率}' },
    { label: '样本数', value: 'N = {n}' },
  ],
  contract: [
    { label: '核心任务', value: '{这条视频最重要、不能漏掉的一个动作或叙事变化}' },
    { label: '身份锚点', value: '短发、蓝色发夹、红色三角耳饰、芥末黄外套' },
    { label: '镜头要求', value: '{景别、机位、摄影机运动与主体运动}' },
    { label: '允许偏差', value: '{哪些细节可以变化}' },
    { label: '关键失败', value: '{出现后直接判为不可用的情况}' },
  ],
  prompt: '{本次评测使用的 Prompt 原文}',
  models: [
    { id: 'a', name: '{模型 A}', video: '{视频路径 A}', poster: '{封面路径 A}', verdict: '{严重度}' as Severity },
    { id: 'b', name: '{模型 B}', video: '{视频路径 B}', poster: '{封面路径 B}', verdict: '{严重度}' as Severity },
    { id: 'c', name: '{模型 C}', video: '{视频路径 C}', poster: '{封面路径 C}', verdict: '{严重度}' as Severity },
    { id: 'd', name: '{模型 D}', video: '{视频路径 D}', poster: '{封面路径 D}', verdict: '{严重度}' as Severity },
  ],
  // 每个维度下按 models 的顺序填写：1–5 分 + 一句证据
  scores: eightDimensions.map((dimension) => ({
    dimension: dimension.name,
    cells: [
      { score: '{分}', evidence: '{证据}' },
      { score: '{分}', evidence: '{证据}' },
      { score: '{分}', evidence: '{证据}' },
      { score: '{分}', evidence: '{证据}' },
    ],
  })),
  badCases: [
    { id: '01', image: '{截帧路径 1}', model: '{模型}', timecode: '{时间码}', type: '{失败类型}', seen: '{可见现象}', hypothesis: '{原因假设}', retest: '{复测设计}' },
    { id: '02', image: '{截帧路径 2}', model: '{模型}', timecode: '{时间码}', type: '{失败类型}', seen: '{可见现象}', hypothesis: '{原因假设}', retest: '{复测设计}' },
    { id: '03', image: '{截帧路径 3}', model: '{模型}', timecode: '{时间码}', type: '{失败类型}', seen: '{可见现象}', hypothesis: '{原因假设}', retest: '{复测设计}' },
  ],
  conclusions: [
    { model: '{模型 A}', fit: '{适合的场景}' },
    { model: '{模型 B}', fit: '{适合的场景}' },
    { model: '{模型 C}', fit: '{适合的场景}' },
    { model: '{模型 D}', fit: '{适合的场景}' },
  ],
  findings: ['{可复现的发现 1}', '{可复现的发现 2}'],
  sampleSize: '{n}',
};

export const failureTypes = [
  '身份漂移', '外观与道具变异', '人体与肢体异常', '遮挡与物体恒存失败', '时序闪烁与纹理沸腾',
  '运动断裂与速度漂移', '空间、碰撞与物理失败', '指令遗漏与绑定错误', '摄影机运动失控', '叙事与长程因果断裂',
];
