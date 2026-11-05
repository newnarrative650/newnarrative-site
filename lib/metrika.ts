'use client';

type Params = Record<string, string | number>;
type YmFn = (id: number, method: string, ...args: unknown[]) => void;

declare global {
  interface Window { ym?: YmFn }
}

export const YM_ID = Number(process.env.NEXT_PUBLIC_YM_ID || 0);

/** Отправляет цель в Яндекс Метрику, если счётчик подключён. */
export function reachGoal(goal: 'cta_click' | 'form_start' | 'form_submit' | 'case_click' | 'scroll_50' | 'scroll_90', params?: Params) {
  if (!YM_ID || typeof window === 'undefined' || !window.ym) return;
  window.ym(YM_ID, 'reachGoal', goal, params);
}
