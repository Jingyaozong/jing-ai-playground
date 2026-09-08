// Kept self-contained so the read-only local page can embed it without network assets.
export function mountReview(file, batch, env) {
  const doc = env.document;
  const boxes = [...doc.querySelectorAll('input[type=checkbox]')];
  const command = doc.getElementById('command');
  const copy = doc.getElementById('copy');
  const status = doc.getElementById('status');
  const saved = doc.getElementById('saved');
  const key = 'jing-briefing-selection-v1:' + batch;
  const blocked = new Set(boxes.filter(b => b.disabled));
  const chosen = () => boxes.filter(b => b.checked && !blocked.has(b)).map(b => b.value);
  function update() {
    const values = chosen();
    boxes.forEach(b => { b.disabled = blocked.has(b) || (values.length >= 5 && !b.checked); });
    doc.getElementById('count').textContent = '已选 ' + values.length + ' / 5 篇';
    command.value = values.length ? 'npm run briefing:draft -- --file ' + file + ' --pick ' + values.join(',') + ' --check' : '';
    copy.disabled = !values.length;
    status.textContent = '';
  }
  function persist() {
    try {
      if (chosen().length) env.localStorage.setItem(key, JSON.stringify(chosen()));
      else env.localStorage.removeItem(key);
      saved.textContent = chosen().length ? '已保存在本机浏览器，刷新可恢复。' : '本批选择已清空，刷新不会恢复。';
    } catch {
      saved.textContent = '浏览器无法保存或清除记录；当前勾选仍可使用，刷新可能丢失或恢复旧选择。';
    }
  }
  try {
    const raw = env.localStorage.getItem(key);
    if (raw !== null) {
      const values = JSON.parse(raw);
      if (!Array.isArray(values) || values.length > 5 || new Set(values).size !== values.length || values.some(v => !boxes.some(b => b.value === v))) throw new Error('invalid selection');
      boxes.forEach(b => { b.checked = values.includes(b.value) && !blocked.has(b); });
      const removed = values.length - chosen().length;
      if (removed) {
        persist();
        saved.textContent = '已移除 ' + removed + ' 篇已生成待审稿的选择。' + saved.textContent;
      } else saved.textContent = '已恢复本批保存的 ' + values.length + ' 篇选择。';
    } else saved.textContent = '勾选后自动保存在本机浏览器。';
  } catch {
    saved.textContent = '无法恢复本批记录，未套用旧选择；请重新勾选。';
  }
  update();
  boxes.forEach(b => b.addEventListener('change', () => { update(); persist(); }));
  doc.getElementById('clear').addEventListener('click', () => { boxes.forEach(b => { b.checked = false; }); update(); persist(); });
  copy.addEventListener('click', async () => {
    try { await env.navigator.clipboard.writeText(command.value); status.textContent = '已复制免费预检命令；尚未执行。'; }
    catch { command.focus(); command.select(); status.textContent = '无法自动复制，命令已选中，请手动复制。'; }
  });
}
