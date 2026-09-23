import test from 'node:test';
import assert from 'node:assert/strict';
import { renderDraftPage, renderDraftText } from './draft-page.mjs';
test('list, detail and empty state preserve review-only boundaries', () => {
  assert.ok(renderDraftPage([]).includes('还没有待审稿'));
  assert.ok(renderDraftPage([{name:'2026-09-08-1',ids:['a']}]).includes('/drafts/2026-09-08-1/'));
  const detail=renderDraftPage([],{text:'# 测试\n\n**核对边界**\n\n- [ ] 核对原文'});
  assert.ok(detail.includes('<h2>测试</h2>'));
  assert.ok(detail.includes('<h3>核对边界</h3>'));
  assert.ok(detail.includes('待荆确认 · 未发布'));
  assert.ok(!detail.includes('<input'));
});
test('draft HTML and foreign links remain inert while known sources are clickable', () => {
  const result=renderDraftText('<script>alert(1)</script>\n![image](https://example.com/a)\n[外链](<https://example.com/>)\n[来源](<https://www.qbitai.com/2026/09/test.html>)');
  assert.ok(!result.includes('<script>'));
  assert.ok(!result.includes('<img'));
  assert.ok(!result.includes('href="https://example.com'));
  assert.ok(result.includes('href="https://www.qbitai.com/2026/09/test.html"'));
  const wechat=renderDraftText('[原文](<https://mp.weixin.qq.com/s?__biz=MzIyMzA5NjEyMA%3D%3D&mid=123&sn=abc>)\n[外号](<https://mp.weixin.qq.com/s?__biz=OTHER&mid=123&sn=abc>)');
  assert.ok(wechat.includes('href="https://mp.weixin.qq.com/s?'));
  assert.ok(!wechat.includes('href="https://mp.weixin.qq.com/s?__biz=OTHER'));
});
