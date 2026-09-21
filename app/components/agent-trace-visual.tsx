export function AgentTraceVisual() {
  return <div className="note-visual agent-trace-visual" aria-label="虚构轨迹示意：S2 参数先偏离，S3 工具随后报错，两者需要分别判断">
    <small className="mono">FOLLOW THE TRACE / 虚构示意</small>
    <strong>报错之前，<br />可能已经走偏。</strong>
    <ol><li><span>S1</span><b>读取输入</b></li><li className="trace-visual-deviation"><span>S2</span><b>参数偏离</b><em>先偏离</em></li><li><span>S3</span><b>工具报错</b><em>后报错</em></li><li><span>S4</span><b>重试保存</b></li></ol>
    <p>日志状态 ≠ 任务验收</p>
  </div>;
}
