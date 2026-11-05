'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

const COUNT_MS = 1200;
const STAGGER_MS = 200;

type Stat = {
  value: number;
  unit: string;
  caption: string;
  note: string;
};

type Props = {
  stats: readonly Stat[];
  /** Заголовочная часть секции (метка, h2, вводный текст): рендерится на сервере. */
  children: ReactNode;
};

/**
 * Два больших числа. Финальное значение показано по умолчанию: без JS, при prefers-reduced-motion
 * и если блок уже виден при загрузке страницы. Иначе число считает от 0 один раз, когда блок
 * доезжает до экрана; вторая ячейка стартует чуть позже первой.
 */
function StatCell({ value, unit, caption, note, tone, delay }: Stat & { tone: 'dark' | 'glow'; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // блок уже на экране при загрузке: анимировать нечего
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return;

    let raf = 0;
    let timer = 0;
    setShown(0);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(() => {
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / COUNT_MS);
            setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }, delay);
      },
      // срабатывает, когда верх ячейки заходит в верхние 85% экрана: не зависит от высоты экрана
      { rootMargin: '0px 0px -15% 0px', threshold: 0 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [value, delay]);

  const glow = tone === 'glow';

  return (
    <div
      ref={ref}
      className={`flex flex-col justify-between gap-10 p-6 md:p-10 lg:min-h-[360px] lg:p-12 ${
        glow ? 'bg-glow text-void' : 'bg-void text-light'
      }`}
    >
      <div className="font-display text-[length:clamp(88px,22vw,180px)] font-extrabold leading-[0.9] tracking-[-0.04em] lg:text-[length:clamp(96px,10vw,176px)]">
        <span className="sr-only">
          {value}
          {unit}
        </span>
        <span aria-hidden="true" className="tabular-nums">
          {/* невидимая копия держит ширину, пока число считает от 0 */}
          <span className="relative inline-block">
            <span className="invisible">{value}</span>
            <span className="absolute inset-0 text-right">{shown}</span>
          </span>
          <span className={glow ? 'text-light' : 'text-glow'}>{unit}</span>
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-balance font-display text-lg font-semibold uppercase leading-snug md:text-2xl">{caption}</p>
        <p
          className={`font-mono text-xs uppercase tracking-[0.12em] ${glow ? 'text-void' : 'text-glow-hover'}`}
        >
          {note}
        </p>
      </div>
    </div>
  );
}

export default function AudienceStats({ stats, children }: Props) {
  return (
    <div className="flex flex-col gap-12 md:gap-14">
      <div className="flex max-w-[720px] flex-col gap-4">{children}</div>
      <div className="grid gap-0.5 border-2 border-grid bg-grid lg:grid-cols-2">
        {stats.map((s, i) => (
          <StatCell key={s.caption} {...s} tone={i === 0 ? 'dark' : 'glow'} delay={i * STAGGER_MS} />
        ))}
      </div>
    </div>
  );
}
