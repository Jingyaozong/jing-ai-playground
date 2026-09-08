import test from 'node:test';
import assert from 'node:assert/strict';
import { mountRemark } from './remark-client.mjs';
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)};};
function view(storage,key='a'){
  const node=()=>({value:'',textContent:'',disabled:false,events:{},addEventListener(e,f){this.events[e]=f;},focus(){},select(){}});
  const nodes={remark:node(),'remark-status':node(),'remark-copy':node()};
  mountRemark(key,{document:{getElementById:id=>nodes[id]},localStorage:storage,navigator:{clipboard:{writeText:async()=>{}}}});
  return {nodes,input(value){nodes.remark.value=value;nodes.remark.events.input();}};
}
test('remarks restore per version and clear without altering other records',()=>{
  const s=memory();const a=view(s);a.input('需要核对地区');assert.equal(view(s).nodes.remark.value,'需要核对地区');assert.equal(view(s,'b').nodes.remark.value,'');a.input('');assert.equal(view(s).nodes.remark.value,'');
});
test('unavailable storage and oversized remarks are explicit',()=>{
  const fail=()=>{throw new Error('blocked')};const a=view({getItem:fail,setItem:fail,removeItem:fail});a.input('test');assert.ok(a.nodes['remark-status'].textContent.includes('保存失败'));
  const s=memory();const b=view(s);b.input('x'.repeat(3001));assert.equal(s.getItem('a'),null);assert.ok(b.nodes['remark-status'].textContent.includes('未保存'));
});
