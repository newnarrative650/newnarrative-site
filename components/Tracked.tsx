'use client';

import { reachGoal } from '@/lib/metrika';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & { place: string; interest?: string };

/** Ссылка-призыв: шлёт цель cta_click с местом клика; если задан interest — передаёт услугу в форму. */
export function CtaLink({ place, interest, onClick, ...rest }: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        reachGoal('cta_click', { place });
        if (interest) window.dispatchEvent(new CustomEvent('nn:interest', { detail: interest }));
        onClick?.(e);
      }}
    />
  );
}

export function CaseLink({ name, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { name: string }) {
  return <a {...rest} onClick={() => reachGoal('case_click', { case: name })} />;
}
