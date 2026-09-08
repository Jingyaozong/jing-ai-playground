import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { draftedIds } from './draft-records.mjs';

test('only complete real manifests contribute drafted IDs, and invalid data stops reading', async () => {
  const dir=await mkdtemp(join(tmpdir(),'jing-draft-record-test-'));
  try {
    await mkdir(join(dir,'demo-2026-09-08-1'));
    await mkdir(join(dir,'.requests'));
    assert.deepEqual(await draftedIds(dir),[]);
    const folder=join(dir,'2026-09-08-1');await mkdir(folder);
    const record={demo:false,status:'pending-review',ids:['1234567890abcdef']};
    await writeFile(join(folder,'manifest.json'),JSON.stringify(record));
    await assert.rejects(draftedIds(dir));
    await writeFile(join(folder,'review.md'),'离线测试');
    assert.deepEqual(await draftedIds(dir),record.ids);
    for (const invalid of [{...record,demo:true},{...record,ids:['bad']},{...record,status:'invented'}]) {
      await writeFile(join(folder,'manifest.json'),JSON.stringify(invalid));await assert.rejects(draftedIds(dir));
    }
  } finally { await rm(dir,{recursive:true,force:true}); }
});
