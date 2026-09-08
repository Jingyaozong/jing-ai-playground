import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export function shanghaiDay(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

// Reserve before sending the request. Retain the reservation even on timeout:
// the provider may have processed a request whose response never reached us.
export async function reserveDailyRequest(directory, now = new Date()) {
  const day = shanghaiDay(now);
  const ledger = resolve(directory, '.requests');
  await mkdir(ledger, { recursive: true });
  const path = resolve(ledger, `${day}.json`);
  try {
    await writeFile(path, JSON.stringify({ day, reservedAt: now.toISOString(), status: 'reserved', note: '已占用一次请求机会；不代表供应商已计费或已生成成功。' }, null, 2), { flag: 'wx' });
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error(`北京时间 ${day} 已占用模型请求机会；为避免重复费用，本次未调用模型。超时或失败也不自动重试，请先核对供应商账单。`);
    throw error;
  }
  return path;
}
