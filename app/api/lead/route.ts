import { NextResponse } from 'next/server';
import { leadSchema, type Lead } from '@/lib/lead';
import { isRateLimited } from '@/lib/rateLimit';

export const runtime = 'nodejs';
const MAX_BODY = 10 * 1024;

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
const dash = (v: string) => (v && v.trim() ? v.trim() : '—');

function lines(l: Lead) {
  return [
    'Новая заявка с сайта',
    `Имя: ${dash(l.name)}`,
    `Контакт: ${dash(l.contact)}`,
    `Задача: ${dash(l.task)}`,
    `Бюджет: ${dash(l.budget)}`,
    `Чек или маржа: ${dash(l.margin)}`,
    `Интерес: ${dash(l.interest)}`,
    `UTM: ${dash(l.utm_source)} / ${dash(l.utm_medium)} / ${dash(l.utm_campaign)}`,
    `Страница: ${dash(l.page)}`,
  ];
}

async function sendTelegram(l: Lead): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text: lines(l).map(esc).join('\n'), parse_mode: 'HTML', disable_web_page_preview: true }),
      cache: 'no-store',
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function sendEmail(l: Lead): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_EMAIL_FROM;
  const to = process.env.LEAD_EMAIL_TO || 'main@newnarrative.ru';
  if (!key || !from) return false;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Заявка с сайта: ${l.name.slice(0, 60)}`,
        text: lines(l).join('\n'),
        html: `<pre style="font:14px/1.5 system-ui">${lines(l).map(esc).join('\n')}</pre>`,
      }),
      cache: 'no-store',
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const raw = await req.text();
  if (raw.length > MAX_BODY) return NextResponse.json({ ok: false }, { status: 413 });

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    const errors = Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message]));
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }
  const lead = parsed.data;

  // Ловушка для ботов: отвечаем «успешно», но ничего не отправляем
  if (lead.website) return NextResponse.json({ ok: true });

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (await isRateLimited(ip)) return NextResponse.json({ ok: false }, { status: 429 });

  const [tg, mail] = await Promise.all([sendTelegram(lead), sendEmail(lead)]);
  if (!tg && !mail) {
    // В логах нет персональных данных — только статус каналов
    console.error('lead: delivery failed', { telegram: tg, email: mail });
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
