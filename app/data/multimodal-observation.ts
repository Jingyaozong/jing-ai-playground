export const observationDate = '2026-11-11';

export const selected = [
  {
    title: '端侧语音：听懂了，就一定看对了吗？',
    category: '视觉 × 语音',
    date: '2026-11-10',
    source: 'Google Developers Blog',
    original: 'https://developers.googleblog.com/on-device-speech-recognition-and-text-to-speech-in-google-ai-edge-gallery/',
    index: 'https://aihot.news/items/hq666kd02bayn64cw702xm11w',
    fact: 'Google AI Edge Gallery 加入端侧语音识别和合成，官方演示把摄像头画面和口头提问结合起来。',
    question: '同一画面放两张菜单，交替用语音指向左边和右边。分别记录语音转写、目标选择、价格读取是否出错；不要用一个总分盖过串对象的问题。',
  },
  {
    title: 'OCR 读对了字，是否也读对了版？',
    category: '文档理解',
    date: '2026-11-11',
    source: 'OpenRouter',
    original: 'https://openrouter.ai/blog/insights/best-ocr-model/',
    index: 'https://aihot.news/items/k4yeadirrsze4hfymnfr0vk12',
    fact: 'OpenRouter 用合成扫描页比较多条 OCR 路线，公开了测试方法和结果。它的对比不等于本站评测。',
    question: '给候选同一张含双栏和表格的扫描件，分别核对字符、阅读顺序与单元格归属。即使字全读对，错列或串行也单独记为结构错误。',
  },
];

export const hot = [
  {
    title: 'Seedream 5.5：局部修改会不会动到人物？',
    category: '区域编辑',
    date: '2026-11-09',
    source: '字节跳动 Seed',
    original: 'https://seed.bytedance.com/en/blog/more-realistic-images-more-stable-editing-across-100-rounds-introducing-seedream-5-5',
    index: 'https://aihot.news/story/2b6190d7-3612-47d1-9e63-d75e50b8604d',
    fact: '发布方把多轮编辑中的未编辑区域保持列为重点。该表现待独立复测。',
    question: '固定底图和尺寸，只让模型压低左窗高光。对齐输出后分别检查窗区和蒙版外，记录脸、衣服与墙面是否漂色；多轮编辑逐次留存差异图。',
  },
  {
    title: 'MiniMax H3-Image：多张参考能否各司其职？',
    category: '多图参考',
    date: '2026-11-11',
    source: 'MiniMax',
    original: 'https://www.minimax.io/blog/minimax-h3-image',
    index: 'https://aihot.news/story/7c20f4ef-fe04-4eca-8355-554fa5df4366',
    fact: 'MiniMax 发布开放权重的 H3-Image，支持参考图生成与图像编辑。',
    question: '分别提供人物、服装、场景参考，并固定输出尺寸。交换参考图顺序后盲看，单独记录身份漂移、材质串用和背景错配，不以分辨率替代视觉质量。',
  },
];
