'use client';

import { useEffect, useRef, useState } from 'react';
import { content } from '@/content';
import { leadSchema, fieldOrder, type LeadField } from '@/lib/lead';
import { reachGoal } from '@/lib/metrika';

const c = content.contact;
const privacy = content.footer.legal[0];
const tg = content.footer.contacts.find((x) => x.href?.startsWith('https://t.me'));
const mail = content.footer.contacts.find((x) => x.href?.startsWith('mailto:'));

type Values = { name: string; contact: string; task: string; budget: string; margin: string; consent: boolean };
const empty: Values = { name: '', contact: '', task: '', budget: '', margin: '', consent: false };
type Status = 'idle' | 'sending' | 'success' | 'error';

function validate(v: Values, only?: LeadField): Partial<Record<LeadField, string>> {
  const r = leadSchema.safeParse({ ...v });
  if (r.success) return {};
  const errs: Partial<Record<LeadField, string>> = {};
  for (const i of r.error.issues) {
    const k = i.path[0] as LeadField;
    if (fieldOrder.includes(k) && !errs[k]) errs[k] = i.message;
  }
  if (only) return errs[only] ? { [only]: errs[only] } : {};
  return errs;
}

export default function LeadForm() {
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<LeadField, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [interest, setInterest] = useState('');
  const [hidden, setHidden] = useState({ utm_source: '', utm_medium: '', utm_campaign: '', referrer: '', page: '' });
  const started = useRef(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setHidden({
      utm_source: q.get('utm_source') || '',
      utm_medium: q.get('utm_medium') || '',
      utm_campaign: q.get('utm_campaign') || '',
      referrer: document.referrer || '',
      page: window.location.href,
    });
    const onInterest = (e: Event) => setInterest(String((e as CustomEvent).detail || ''));
    window.addEventListener('nn:interest', onInterest);
    return () => window.removeEventListener('nn:interest', onInterest);
  }, []);

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = k === 'consent' ? (e.target as HTMLInputElement).checked : e.target.value;
    setV((s) => ({ ...s, [k]: value }));
    if (errors[k as LeadField]) setErrors((s) => ({ ...s, [k]: undefined }));
  };
  const onBlur = (k: LeadField) => () => {
    if (k === 'consent') return;
    const msg = validate(v, k)[k];
    setErrors((s) => ({ ...s, [k]: msg }));
  };
  const onFocus = () => {
    if (!started.current) { started.current = true; reachGoal('form_start'); }
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(v);
    setErrors(errs);
    const first = fieldOrder.find((k) => errs[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...v, interest, ...hidden, website: honeypot.current?.value || '' }),
      });
      if (!res.ok) throw new Error(String(res.status));
      reachGoal('form_submit');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="flex flex-col items-start gap-5">
        <span aria-hidden="true" className="h-3 w-24 stripes-accent" />
        <p className="font-display text-[22px] font-semibold uppercase leading-snug">{c.success}</p>
      </div>
    );
  }

  const field = (k: Exclude<LeadField, 'consent'>, label: string, required: boolean, area = false) => {
    const id = `lead-${k}`;
    const common = {
      id, name: k, value: v[k], onChange: set(k), onBlur: onBlur(k), onFocus,
      'aria-invalid': errors[k] ? true : undefined,
      'aria-describedby': errors[k] ? `${id}-err` : undefined,
      'aria-required': required || undefined,
    };
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className="font-mono text-xs uppercase tracking-[0.1em] text-soft">{label}{required ? ' *' : ''}</label>
        {area ? <textarea {...common} rows={3} className="field resize-y py-3.5" /> : <input {...common} type="text" className="field h-[52px]" autoComplete={k === 'name' ? 'name' : 'off'} />}
        {errors[k] && <span id={`${id}-err`} className="text-sm text-error">{errors[k]}</span>}
      </div>
    );
  };

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="flex flex-col gap-[18px]">
      {interest && (
        <span className="self-start border border-glow px-3 py-2 font-mono text-xs tracking-[0.06em] text-glow-hover">{c.interestLabel}: {interest}</span>
      )}
      {field('name', c.fields.name, true)}
      {field('contact', c.fields.contact, true)}
      {field('task', c.fields.task, true, true)}
      {field('budget', c.fields.budget, false)}
      {field('margin', c.fields.margin, false)}

      {/* ловушка для ботов */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="lead-website">Website</label>
        <input ref={honeypot} id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <input id="lead-consent" name="consent" type="checkbox" checked={v.consent} onChange={set('consent')} onFocus={onFocus} aria-invalid={errors.consent ? true : undefined} className="mt-0.5 h-[22px] w-[22px] flex-none accent-glow" />
          <label htmlFor="lead-consent" className="text-sm leading-relaxed text-soft">
            {c.consent.before} (<a href={privacy.href && !privacy.href.startsWith('[') ? privacy.href : '#'} className="underline underline-offset-4" target="_blank" rel="noopener">{c.consent.linkLabel}</a>)
          </label>
        </div>
        {errors.consent && <span className="text-sm text-error">{errors.consent}</span>}
      </div>

      <button type="submit" disabled={!v.consent || status === 'sending'} className="btn-primary self-start">
        {status === 'sending' ? (
          <span className="flex items-center gap-3"><span aria-hidden="true" className="h-3 w-3 animate-spin border-2 border-void border-t-transparent" />{c.sending}</span>
        ) : c.submit}
      </button>

      {status === 'error' && (
        <p role="alert" className="border border-error px-4 py-3 text-[15px] text-error">
          {c.error}{' '}
          {tg?.href && <a href={tg.href} className="underline underline-offset-4">{tg.label}</a>}
          {tg?.href && mail?.href ? ' · ' : ''}
          {mail?.href && <a href={mail.href} className="underline underline-offset-4">{mail.label}</a>}
        </p>
      )}
    </form>
  );
}
