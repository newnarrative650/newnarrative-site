'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { YM_ID, reachGoal } from '@/lib/metrika';

/** Яндекс Метрика: загружается после интерактивности страницы, плюс цели глубины скролла 50% и 90%. */
export default function Metrika() {
  useEffect(() => {
    if (!YM_ID) return;
    const sent = { 50: false, 90: false };
    const onScroll = () => {
      const h = document.documentElement;
      const depth = ((h.scrollTop + window.innerHeight) / h.scrollHeight) * 100;
      if (!sent[50] && depth >= 50) { sent[50] = true; reachGoal('scroll_50'); }
      if (!sent[90] && depth >= 90) { sent[90] = true; reachGoal('scroll_90'); window.removeEventListener('scroll', onScroll); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!YM_ID) return null;
  return (
    <Script id="ym" strategy="lazyOnload">
      {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(${YM_ID},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:false});`}
    </Script>
  );
}
