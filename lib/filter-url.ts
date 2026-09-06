/** Pure URL operations shared by local archive filters and regression tests. */
export function readUrlFilter(search: string, key: string, allowed: readonly string[]) {
  const value = new URLSearchParams(search).get(key);
  return value && allowed.includes(value) ? value : '全部';
}

export function writeUrlFilter(href: string, key: string, value: string) {
  const url = new URL(href);
  if (value === '全部') url.searchParams.delete(key);
  else url.searchParams.set(key, value);
  return url;
}
