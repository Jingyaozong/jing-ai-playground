import test from 'node:test';
import assert from 'node:assert/strict';
import { mountReview } from './review-client.mjs';

function view(storage, batch = 'a') {
  const element = (value = '') => ({ value, checked:false, disabled:false, textContent:'', handlers:{}, addEventListener(name, fn) { this.handlers[name] = fn; }, focus() {}, select() {} });
  const boxes = Array.from({length:7}, (_,i) => element(String(i+1)));
  const nodes = Object.fromEntries(['command','copy','status','saved','count','clear'].map(id => [id,element()]));
  mountReview('candidates-1788859143946.json', batch, { document:{querySelectorAll:()=>boxes,getElementById:id=>nodes[id]}, localStorage:storage, navigator:{clipboard:{writeText:async()=>{}}} });
  return { boxes, nodes, choose(i) { boxes[i].checked=true; boxes[i].handlers.change(); } };
}
const memory = () => { const values = new Map(); return { getItem:k=>values.get(k)??null, setItem:(k,v)=>values.set(k,v), removeItem:k=>values.delete(k) }; };
test('selection survives reload, batch isolation and clear persist', () => {
  const storage=memory(); const first=view(storage);first.choose(0);first.choose(2);
  const reload=view(storage); assert.equal(reload.nodes.count.textContent,'已选 2 / 5 篇');assert.ok(reload.nodes.command.value.includes('--pick 1,3 --check'));
  assert.equal(view(storage,'different').nodes.command.value,'');
  reload.nodes.clear.handlers.click();assert.equal(view(storage).nodes.command.value,'');
});
test('restore rejects malformed, excessive, duplicate and unknown selections', () => {
  for (const raw of ['bad','null','{}','["1","1"]','["99"]','[1]','["1","2","3","4","5","6"]']) {
    const storage=memory();storage.setItem('jing-briefing-selection-v1:a',raw);
    const page=view(storage);assert.equal(page.nodes.command.value,'');assert.ok(page.nodes.saved.textContent.includes('无法恢复'));
  }
});
test('five restored choices retain selection limit', () => {
  const storage=memory();storage.setItem('jing-briefing-selection-v1:a','["1","2","3","4","5"]');
  assert.equal(view(storage).boxes.filter(b=>b.disabled).length,2);
});
test('blocked storage does not disable current selection and warns on save and clear', () => {
  const fail=()=>{throw new Error('blocked');};const page=view({getItem:fail,setItem:fail,removeItem:fail});
  page.choose(0);assert.ok(page.nodes.command.value.includes('--pick 1'));assert.ok(page.nodes.saved.textContent.includes('无法保存'));
  page.nodes.clear.handlers.click();assert.equal(page.nodes.command.value,'');assert.ok(page.nodes.saved.textContent.includes('恢复旧选择'));
});
