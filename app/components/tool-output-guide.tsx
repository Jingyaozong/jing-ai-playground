import Link from 'next/link';

export function ToolOutputGuide() {
  return <aside className="tool-output-guide" id="tool-output-guide" aria-labelledby="tool-output-guide-title">
    <header><h3 id="tool-output-guide-title">先看拿到什么，<br />再选怎么带走。</h3><p>同一个工具可能兼具几种能力。下面是产物说明，不是模型效果评级。</p></header>
    <div className="tool-output-guide-grid">
      <section><h4>生成草案</h4><p>把填写的信息整理成 Prompt、计划或清单。不调用模型生成图片或视频，也不保证执行效果。</p><Link href="/tools/shot-prompt-builder/">试用单镜 Prompt 工作台 ↗</Link></section>
      <section><h4>记录人工判断</h4><p>保存你填写的观察与依据，汇总待复核项。工具不会代看素材、自动判分或验证交付文件。</p><Link href="/tools/multimodal-evaluation/">打开多模态评测记录台 ↗</Link></section>
      <section><h4>导入后续填</h4><p>规则与多模态台支持复核 CSV；Agent 台支持 JSON 复核包。请导出对应格式，文字副本不能代替它。</p><Link href="/tools/rule-review/">打开规则答疑验收台 ↗</Link><Link href="/tools/agent-trace-review/">打开 Agent 轨迹复核台 ↗</Link></section>
    </div>
    <p className="tool-output-guide-note">复制不等于保存。本地缓存也不是备份；关闭页面前，请按各工具提示下载或导出。这里只接收各工具约定的记录格式，不解析任意文件。</p>
  </aside>;
}
