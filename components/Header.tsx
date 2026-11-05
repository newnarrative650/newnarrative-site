'use client';

import { useEffect, useRef, useState } from 'react';
import { content } from '@/content';
import { reachGoal } from '@/lib/metrika';

const h = content.header;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) { setMenuOpen(false); burgerRef.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-edge bg-void/90 backdrop-blur" style={{ height: 'var(--header-h)' }}>
        <div className="container-page flex h-full items-center justify-between gap-4">
          <a href="#top" className="font-display text-lg font-extrabold tracking-[0.02em]">{h.logo}</a>

          <nav aria-label="Главное меню" className="hidden items-center gap-6 font-display text-xs uppercase lg:flex xl:gap-8">
            {h.nav.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-glow-hover">{l.label}</a>
            ))}
            <a href={h.cta.href} onClick={() => reachGoal('cta_click', { place: 'header' })} className="bg-glow px-5 py-3.5 font-semibold text-void hover:bg-glow-hover">{h.cta.label}</a>
          </nav>

          <button ref={burgerRef} type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(true)} className="flex items-center gap-2.5 border border-rim px-3.5 py-3 font-display text-xs uppercase lg:hidden">
            <span aria-hidden="true" className="flex flex-col gap-1">
              <span className="h-0.5 w-[18px] bg-light" /><span className="h-0.5 w-[18px] bg-light" /><span className="h-0.5 w-3 bg-glow" />
            </span>
            {h.menuLabel}
          </button>
        </div>
      </header>

      {/* Меню вынесено из <header>: backdrop-blur у шапки делает её контейнером для fixed-потомков и сжимало бы меню до высоты шапки */}
      {menuOpen && (
        <div id="mobile-menu" role="dialog" aria-modal="true" aria-label={h.menuLabel} className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-void px-4 pb-8 pt-[18px] lg:hidden">
          <div aria-hidden="true" className="stripes absolute bottom-0 right-0 h-2/5 w-3/5 opacity-60" />
          <div className="relative flex items-center justify-between border-b border-grid pb-[18px]">
            <span className="font-display text-lg font-extrabold">{h.logo}</span>
            <button type="button" autoFocus aria-label={h.closeLabel} onClick={() => { setMenuOpen(false); burgerRef.current?.focus(); }} className="flex h-11 w-11 items-center justify-center border border-rim text-2xl">×</button>
          </div>
          <nav aria-label="Мобильное меню" className="relative mt-4 flex flex-col font-display text-2xl font-semibold uppercase">
            {h.nav.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="border-b border-edge py-[18px]">{l.label}</a>
            ))}
          </nav>
          <a href={h.cta.href} onClick={() => { setMenuOpen(false); reachGoal('cta_click', { place: 'mobile_menu' }); }} className="btn-primary relative mt-auto">{h.cta.label}</a>
        </div>
      )}
    </>
  );
}
