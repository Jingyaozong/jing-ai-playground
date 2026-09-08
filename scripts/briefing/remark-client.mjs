export function mountRemark(key, env) {
  const input=env.document.getElementById('remark');
  const status=env.document.getElementById('remark-status');
  const copy=env.document.getElementById('remark-copy');
  function update(){ copy.disabled=!input.value.trim(); }
  try {
    const value=env.localStorage.getItem(key);
    if(value!==null){ if(value.length>3000) throw new Error('oversize'); input.value=value;status.textContent='已恢复当前稿件版本的备注。'; }
    else status.textContent='输入后自动保存在当前浏览器。';
  }catch{status.textContent='无法恢复备注，请检查浏览器存储；当前仍可输入和复制。';}
  update();
  input.addEventListener('input',()=>{
    update();
    if(input.value.length>3000){status.textContent='备注超过 3000 字符，未保存，请缩短后再试。';return;}
    try {
      if(input.value) env.localStorage.setItem(key,input.value);else env.localStorage.removeItem(key);
      status.textContent=input.value?'备注已保存在本机，未修改原稿。':'备注已清空，未修改原稿。';
    }catch{status.textContent='保存失败，请复制备份；刷新可能丢失修改或恢复旧备注。';}
  });
  copy.addEventListener('click',async()=>{
    try{await env.navigator.clipboard.writeText(input.value);status.textContent='备注已复制，未发送或发布。';}
    catch{input.focus();input.select();status.textContent='无法自动复制，已选中备注，请手动复制。';}
  });
}
