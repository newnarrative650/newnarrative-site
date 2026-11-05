import { z } from 'zod';
import { content } from '@/content';

const e = content.contact.errors;

const tg = /^@[A-Za-z0-9_]{5,32}$/;
const mail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidContact(v: string) {
  const s = v.trim();
  return tg.test(s) || mail.test(s) || (s.match(/\d/g) || []).length >= 10;
}

/** Общие правила проверки заявки: клиент и сервер. */
export const leadSchema = z.object({
  name: z.string().trim().min(2, e.name).max(60, e.name),
  contact: z.string().trim().refine(isValidContact, e.contact),
  task: z.string().trim().min(10, e.task).max(600, e.task),
  budget: z.string().trim().max(40, e.budget).optional().default(''),
  margin: z.string().trim().max(60, e.margin).optional().default(''),
  consent: z.literal(true, { errorMap: () => ({ message: e.consent }) }),
  interest: z.string().trim().max(120).optional().default(''),
  utm_source: z.string().max(200).optional().default(''),
  utm_medium: z.string().max(200).optional().default(''),
  utm_campaign: z.string().max(200).optional().default(''),
  referrer: z.string().max(500).optional().default(''),
  page: z.string().max(500).optional().default(''),
  website: z.string().optional().default(''),
});

export type Lead = z.infer<typeof leadSchema>;
export type LeadField = 'name' | 'contact' | 'task' | 'budget' | 'margin' | 'consent';
export const fieldOrder: LeadField[] = ['name', 'contact', 'task', 'budget', 'margin', 'consent'];
