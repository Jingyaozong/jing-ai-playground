/** Clipboard permission prompts may never settle. Timeout means unconfirmed, not cancelled. */
export async function copyWithTimeout(value: string, write: ((value: string) => Promise<void>) | undefined, timeoutMs = 1500): Promise<boolean> {
  if (!write) return false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve().then(() => write(value)).then(() => true, () => false),
      new Promise<boolean>((resolve) => { timer = setTimeout(() => resolve(false), timeoutMs); }),
    ]);
  } catch {
    return false;
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}
