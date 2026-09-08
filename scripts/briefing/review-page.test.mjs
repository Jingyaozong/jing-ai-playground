import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { renderReviewPage } from './review-page.mjs';
const now = new Date('2026-09-08T12:00:00Z');
const url = 'https://www.qbitai.com/2026/09/test.html';
const data = () => ({ fetchedAt: now.toISOString(), candidates: [{ id:createHash('sha256').update(url).digest('hex').slice(0,16),source:'量子位官网（非公众号全量）',url,publishedAt:now.toISOString(),title:'虚构测试标题',excerpt:'仅用于离线测试' }] });
test('drafted status disables selection but retains the original link', () => {
  const snapshot=data();const page=renderReviewPage(snapshot,'candidates-1788859143946.json',now,[snapshot.candidates[0].id]);
  assert.ok(page.includes('已生成待审稿 · 尚未发布'));
  assert.ok(page.includes('disabled data-drafted="true"'));
  assert.ok(page.includes(`href="${url}"`));
});
test('review contains explicit privacy boundary, source link and free command only', () => {
  const page = renderReviewPage(data(),'candidates-1788859143946.json',now);
  assert.ok(page.includes('未审核 · 未发布'));
  assert.ok(page.includes('--check'));
  assert.ok(page.includes('type="checkbox" value="1"'));
  assert.ok(page.includes(`href="${url}"`));
  assert.ok(!page.includes('fetch('));
  assert.ok(!page.includes('DEEPSEEK_API_KEY'));
});
test('untrusted titles and summaries cannot inject HTML or scripts', () => {
  const snapshot = data(); snapshot.candidates[0].title = '</script><script>alert(1)</script>'; snapshot.candidates[0].excerpt = '<img src=x onerror=alert(1)>';
  const page = renderReviewPage(snapshot,'candidates-1788859143946.json',now);
  assert.equal((page.match(/<script>/g)||[]).length,1);
  assert.ok(!page.includes('<img'));
  assert.ok(page.includes('&lt;img'));
  assert.throws(()=>renderReviewPage(data(),"bad';alert(1)",now));
});
test('empty list is explicit; invalid or stale records do not render', () => {
  assert.ok(renderReviewPage({fetchedAt:now.toISOString(),candidates:[]},'candidates-1788859143946.json',now).includes('没有新的候选'));
  const snapshot=data(); snapshot.candidates[0].url='https://example.com/';
  assert.throws(()=>renderReviewPage(snapshot,'candidates-1788859143946.json',now));
  assert.throws(()=>renderReviewPage(data(),'candidates-1788859143946.json',new Date('2026-10-01')));
});
