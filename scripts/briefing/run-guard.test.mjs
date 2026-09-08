import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { reserveDailyRequest, shanghaiDay } from './run-guard.mjs';

test('daily boundary uses Shanghai time regardless of host timezone', () => {
  assert.equal(shanghaiDay(new Date('2026-09-08T15:59:59Z')), '2026-09-08');
  assert.equal(shanghaiDay(new Date('2026-09-08T16:00:00Z')), '2026-09-09');
});

test('concurrent runs reserve once; retries stay blocked and next day is independent', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'jing-briefing-guard-'));
  try {
    const now = new Date('2026-09-08T08:00:00Z');
    const results = await Promise.allSettled(Array.from({ length: 8 }, () => reserveDailyRequest(directory, now)));
    assert.equal(results.filter((item) => item.status === 'fulfilled').length, 1);
    assert.equal(results.filter((item) => item.status === 'rejected').length, 7);
    const path = results.find((item) => item.status === 'fulfilled').value;
    const reservation = JSON.parse(await readFile(path, 'utf8'));
    assert.equal(reservation.status, 'reserved');
    assert.equal(reservation.day, '2026-09-08');
    await assert.rejects(reserveDailyRequest(directory, now), /本次未调用模型/);
    assert.notEqual(await reserveDailyRequest(directory, new Date('2026-09-08T16:00:00Z')), path);
  } finally {
    // Only remove the exact disposable directory created by this test.
    await rm(directory, { recursive: true, force: true });
  }
});
