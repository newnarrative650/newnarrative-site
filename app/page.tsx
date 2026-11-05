import Image from 'next/image';
import { content } from '@/content';
import Header from '@/components/Header';
import AudienceStats from '@/components/AudienceStats';
import LeadForm from '@/components/LeadForm';
import { CtaLink, CaseLink } from '@/components/Tracked';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newnarrative.ru';
const { hero, clients, audience, services, cases, tasks, contact, footer } = content;

/** Сколько нумерованных секций на странице: «01 / 05». */
const SECTIONS = 5;

/** Ссылка-заглушка вида "[URL …]" до замены ведёт на "#". */
const safe = (href: string | null | undefined) => (href && !href.startsWith('[') ? href : '#');

function SecHead({ n, tag }: { n: number; tag: string }) {
  return (
    <div aria-hidden="true" className="label flex items-center gap-4">
      <span className="text-glow">{String(n).padStart(2, '0')} / {String(SECTIONS).padStart(2, '0')}</span>
      <span className="h-px flex-1 bg-grid" />
      <span>{tag}</span>
    </div>
  );
}

function Corners({ size = 18, which = ['tl', 'tr', 'bl', 'br'] }: { size?: number; which?: string[] }) {
  return (
    <>
      {which.map((w) => (
        <span key={w} aria-hidden="true" className={`corner corner-${w}`} style={{ width: size, height: size }} />
      ))}
    </>
  );
}

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: content.seo.siteName,
    url: SITE_URL,
    email: 'main@newnarrative.ru',
    telephone: '+7 925 247-62-23',
    address: { '@type': 'PostalAddress', addressLocality: 'Москва', addressCountry: 'RU' },
    description: content.seo.description,
  };

  return (
    <div id="top" className="relative overflow-x-clip">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-glow focus:px-4 focus:py-2 focus:text-void">{content.a11y.skip}</a>
      <div aria-hidden="true" className="cols pointer-events-none absolute inset-y-0 left-0 right-0 mx-auto max-w-page" />
      <Header />

      <main id="main">
        {/* Первый экран: заголовок и три скрина проектов */}
        <section className="relative">
          <div aria-hidden="true" className="glow-bg absolute -right-[12%] -top-[10%] h-[130%] w-[70%]" />
          <div className="container-page relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] xl:py-28">
            <div className="flex min-w-0 flex-col gap-8">
              <h1 className="font-display text-[28px] font-semibold uppercase leading-[1.08] tracking-[-0.02em] sm:text-[40px] lg:text-[length:clamp(34px,3.5vw,52px)]">
                {hero.h1.before} <span className="text-glow">{hero.h1.accent}</span> {hero.h1.after}
              </h1>
              <p className="max-w-[560px] text-[17px] leading-relaxed text-soft md:text-xl">{hero.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                <CtaLink place="hero_primary" href={hero.primaryCta.href} className="btn-primary">{hero.primaryCta.label}</CtaLink>
                <CtaLink place="hero_secondary" href={hero.secondaryCta.href} className="btn-secondary">{hero.secondaryCta.label}</CtaLink>
              </div>
              <div aria-hidden="true" className="flex items-center gap-3.5 font-mono text-[11px] tracking-[0.14em] text-dim">
                <span className="stripes-accent h-2.5 w-24" />
                <span className="h-px flex-1 bg-grid" />
                <span>SCROLL ↓</span>
              </div>
            </div>

            <div className="relative min-w-0">
              <div aria-hidden="true" className="stripes absolute -bottom-5 -right-5 left-5 top-5" />
              <div className="relative grid grid-cols-2 gap-3 md:gap-4">
                {hero.screens.map((s, i) => (
                  <CtaLink
                    key={s.src}
                    place="hero_screen"
                    href="#cases"
                    className={`group relative block overflow-hidden border border-grid bg-screen ${i === 0 ? 'col-span-2 aspect-[16/10]' : 'aspect-[4/3]'}`}
                  >
                    <Image
                      src={s.src}
                      alt={s.alt}
                      fill
                      priority={i === 0}
                      sizes={i === 0 ? '(min-width: 1024px) 55vw, 100vw' : '(min-width: 1024px) 27vw, 50vw'}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                    <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#08080C66 0%,transparent 30%,transparent 65%,#08080CCC 100%)' }} />
                    <div aria-hidden="true" className="scan absolute inset-0" />
                    <Corners size={i === 0 ? 18 : 12} which={i === 0 ? ['tl', 'tr', 'bl', 'br'] : ['tr', 'bl']} />
                    {i === 0 && (
                      <div aria-hidden="true" className="absolute left-4 right-4 top-4 flex justify-between font-mono text-[11px] tracking-[0.12em]">
                        <span className="bg-void/80 px-2 py-1"><span className="text-glow">●</span> REC 00:00:14</span>
                        <span className="bg-void/80 px-2 py-1">1920 × 1080</span>
                      </div>
                    )}
                    <span className="absolute bottom-3 left-3 bg-void/80 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.12em]">{s.label}</span>
                  </CtaLink>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Ваша аудитория уже играет */}
        <section id="audience" aria-labelledby="audience-title" className="relative border-y border-edge">
          <div aria-hidden="true" className="glow-bg absolute -left-[12%] top-[6%] h-[75%] w-[55%] opacity-40" />
          <div className="container-page relative flex flex-col gap-8 py-20 md:py-28">
            <AudienceStats stats={audience.stats}>
              <SecHead n={1} tag={audience.tag} />
              <h2 id="audience-title" className="h2">{audience.title}</h2>
              <p className="text-lg leading-relaxed text-soft">{audience.intro}</p>
            </AudienceStats>

            <p className="max-w-[900px] font-mono text-xs leading-relaxed tracking-[0.04em] text-dim">
              {audience.source.definition} Источник:{' '}
              <a href={audience.source.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-glow-hover">
                {audience.source.label}
              </a>
              , {audience.source.meta} {audience.source.baseNote}
            </p>
          </div>
        </section>

        {/* Кейсы */}
        <div className="container-page">
          <section id="cases" aria-labelledby="cases-title" className="flex flex-col gap-8 pt-24 md:pt-36">
            <SecHead n={2} tag="#cases" />
            <h2 id="cases-title" className="h2">{cases.title}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {cases.items.map((c) => (
                <CaseLink key={c.title} name={c.title} href={c.href} className="group flex flex-col border border-grid bg-panel">
                  <div className="relative flex aspect-[16/10] items-end overflow-hidden bg-screen p-4">
                    <Image src={c.image} alt={c.alt} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none" />
                    <div aria-hidden="true" className="scan absolute inset-0" />
                    <Corners size={12} which={['tr', 'bl']} />
                    <span className="relative bg-void/80 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.12em]">{c.label}</span>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-[22px]">
                    <h3 className="font-display text-lg font-semibold uppercase leading-snug">{c.title}</h3>
                    <p className="text-[15px] leading-relaxed text-soft">{c.text}</p>
                    <p className="mt-auto font-mono text-xs uppercase tracking-[0.08em] text-glow-hover">{c.metric}</p>
                    <span className="link-mono self-start">{cases.cta} →</span>
                  </div>
                </CaseLink>
              ))}
            </div>
            <a href={safe(cases.more.href)} className="link-mono self-start">{cases.more.label} →</a>
          </section>
        </div>

        {/* Нам доверяют */}
        <div aria-hidden="true" className="stripes mt-24 h-3.5 border-t border-edge md:mt-36" />
        <section aria-label={clients.title} className="ticker-wrap overflow-hidden border-y border-edge py-[22px]">
          <div className="ticker-track ticker flex w-max items-center gap-16 whitespace-nowrap font-display text-xl font-semibold text-dim">
            <span className="label font-medium">{clients.title}</span>
            {clients.items.map((n) => <span key={n}>{n}</span>)}
            {clients.items.map((n) => <span key={`d-${n}`} aria-hidden="true" className="ticker-dup">{n}</span>)}
          </div>
        </section>

        <div className="container-page">
          {/* Что мы делаем */}
          <section id="services" aria-labelledby="services-title" className="flex flex-col gap-8 pt-24 md:pt-36">
            <SecHead n={3} tag="#services" />
            <h2 id="services-title" className="h2">{services.title}</h2>
            <div className="grid grid-cols-1 gap-0.5 border-2 border-grid bg-grid md:grid-cols-2 xl:grid-cols-3">
              {services.items.map((s, i) => (
                <article key={s.title} className="relative flex flex-col gap-[18px] bg-void p-7 transition-colors hover:bg-screen">
                  <Corners size={12} which={['tl']} />
                  <div className="flex items-center justify-between font-mono text-[13px]">
                    <span className="text-glow">{String(i + 1).padStart(2, '0')}</span>
                    <span aria-hidden="true" className="stripes h-2 w-16" />
                  </div>
                  <h3 className="font-display text-xl font-semibold uppercase leading-tight">{s.title}</h3>
                  <p className="flex-1 text-base leading-relaxed text-soft">{s.text}</p>
                  <CtaLink place="service" interest={s.title} href="#contact" className="link-mono self-start">{services.cta} →</CtaLink>
                </article>
              ))}
            </div>
          </section>

          {/* Какие задачи решаем */}
          <section id="tasks" aria-labelledby="tasks-title" className="flex flex-col gap-8 pt-24 md:pt-36">
            <SecHead n={4} tag="#tasks" />
            <h2 id="tasks-title" className="h2">{tasks.title}</h2>
            <ol className="grid grid-cols-1 gap-0.5 border-2 border-grid bg-grid md:grid-cols-2 xl:grid-cols-3">
              {tasks.items.map((t, i) => (
                <li key={t} className="flex flex-col gap-5 bg-panel p-7 md:min-h-[190px]">
                  <div className="flex items-center gap-3.5">
                    <span className="font-display text-[40px] font-extrabold text-glow">{String(i + 1).padStart(2, '0')}</span>
                    <span aria-hidden="true" className="flex-1 border-t border-dashed border-rim" />
                    <span aria-hidden="true" className="h-2 w-2 bg-glow" />
                  </div>
                  <strong className="font-display text-lg font-semibold uppercase leading-snug md:text-xl">{t}</strong>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Финальный призыв и форма */}
        <section id="contact" aria-labelledby="contact-title" className="relative mt-24 border-t border-grid md:mt-36">
          <div aria-hidden="true" className="glow-bg absolute -left-[10%] top-0 h-full w-[70%] opacity-70" />
          <div className="container-page relative grid items-start gap-12 py-20 md:py-32 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <SecHead n={5} tag="#contact" />
              <h2 id="contact-title" className="font-display text-[28px] font-extrabold uppercase leading-[1.08] md:text-[40px] xl:text-[54px]">{contact.title}</h2>
              {contact.text && <p className="max-w-[520px] text-lg leading-relaxed text-soft">{contact.text}</p>}
            </div>
            <div className="relative">
              <div aria-hidden="true" className="stripes-accent absolute -bottom-4 -right-4 left-4 top-4 opacity-[0.45]" />
              <div className="relative border border-grid bg-panel p-5 md:p-9">
                <Corners which={['tl', 'br']} />
                <LeadForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-grid">
        <div className="container-page flex flex-col gap-12 pb-10 pt-14">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-3">
              <span className="font-display text-lg font-extrabold">{content.header.logo}</span>
              <span className="text-[15px] leading-relaxed text-dim">{footer.tagline}</span>
            </div>
            {footer.columns.map((col) => (
              <nav key={col.title} aria-label={col.title} className="flex flex-col gap-3 text-[15px]">
                <span className="label">{col.title}</span>
                {col.links.filter((l) => l.href).map((l) => (
                  <a key={l.label} href={l.href!} className="hover:text-glow-hover">{l.label}</a>
                ))}
              </nav>
            ))}
            <div className="flex flex-col gap-3 text-[15px]">
              <span className="label">{footer.contactsTitle}</span>
              {footer.contacts.map((l) => l.href ? <a key={l.label} href={l.href} className="hover:text-glow-hover">{l.label}</a> : <span key={l.label} className="text-soft">{l.label}</span>)}
            </div>
          </div>
          <div aria-hidden="true" className="outline-text overflow-hidden whitespace-nowrap font-display text-[40px] font-extrabold leading-[0.9] tracking-[-0.04em] md:text-[10vw] 2xl:text-[150px]">{content.header.logo}</div>
          <div aria-hidden="true" className="stripes h-3.5" />
          <div className="flex flex-wrap justify-between gap-x-8 gap-y-4 border-t border-edge pt-5 font-mono text-xs uppercase tracking-[0.08em] text-dim">
            <span>{footer.copyright}</span>
            <div className="flex gap-6">
              {footer.legal.map((l) => <a key={l.label} href={safe(l.href)} className="hover:text-light">{l.label}</a>)}
            </div>
          </div>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
