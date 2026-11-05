// Не больше 5 заявок за 10 минут с одного IP.
// Если заданы UPSTASH_REDIS_REST_URL/TOKEN — счётчик в Upstash, иначе в памяти инстанса.
const LIMIT = 5;
const WINDOW_S = 600;
const memory = new Map<string, number[]>();

async function upstash(key: string): Promise<number | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, String(WINDOW_S), 'NX'],
      ]),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result: number }[];
    return Number(data[0]?.result ?? 0);
  } catch {
    return null;
  }
}

export async function isRateLimited(ip: string): Promise<boolean> {
  const key = `lead:${ip}`;
  const remote = await upstash(key);
  if (remote !== null) return remote > LIMIT;

  const now = Date.now();
  const hits = (memory.get(key) || []).filter((t) => now - t < WINDOW_S * 1000);
  hits.push(now);
  memory.set(key, hits);
  return hits.length > LIMIT;
}
