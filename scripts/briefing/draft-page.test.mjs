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
test('source check card shows metadata-only status and escapes untrusted title', () => {
  const check = { status: 'source-only', stale: false, checkedAt: '2026-09-23T03:00:00.000Z', article: { title: '<img src=x>', publishedAt: '2026-09-22T02:02:00.000Z', url: 'https://mp.weixin.qq.com/s?__biz=MzIyMzA5NjEyMA%3D%3D&mid=123&sn=abc', bodyChars: 600 } };
  const page = renderDraftPage([], null, check);
  assert.ok(page.includes('&lt;img src=x&gt;'));
  assert.ok(!page.includes('<img src=x>'));
  assert.ok(page.includes('尚未拆解') || page.includes('不是 AI 拆解'));
  assert.ok(page.includes('打开微信公众号原文'));
  assert.ok(page.includes('2026年9月23日'));
  assert.ok(!page.includes('2026-09-23T03:00:00.000Z'));
  assert.ok(!page.includes('600 字'));
});
