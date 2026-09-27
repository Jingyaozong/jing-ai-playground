type LocalRecordBoundaryProps = {
  loaded: boolean;
  markedCount: number;
};

export function LocalRecordBoundary({ loaded, markedCount }: LocalRecordBoundaryProps) {
  return (
    <aside className="experiment-local-boundary" aria-label="本机记录与公开档案的区别">
      <span className="mono">LOCAL ONLY / 本机工作记录</span>
      <p>
        {loaded ? `当前浏览器标记为已有输出：${markedCount} 条。` : '正在读取当前浏览器的记录。'}
        评分后请在状态栏选择实际进度；填分不会自动完成复核。这里的填写与评分不会更新公开实验进度、样本或结论。公开前仍需核对原始素材，并单独更新网站内容。
      </p>
    </aside>
  );
}
