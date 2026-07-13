import { useEffect, useRef } from 'react';
import Head from 'next/head';

export type LegacyPageContent = {
  title: string;
  description: string;
  bodyClassName: string;
  bodyHtml: string;
};

export type LegacyPageProps = LegacyPageContent;

declare global {
  interface Window {
    Alpine?: {
      initTree?: (element: Element) => void;
    };
  }
}

export default function LegacyPage({ title, description, bodyClassName, bodyHtml }: LegacyPageProps) {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pageElement = pageRef.current;

    if (pageElement && pageElement.dataset.legacyPageHydrated !== 'true') {
      pageElement.dataset.legacyPageHydrated = 'true';
      const scripts = Array.from(pageElement.querySelectorAll<HTMLScriptElement>('script'));

      scripts.forEach((script) => {
        const replacement = document.createElement('script');

        Array.from(script.attributes).forEach((attribute) => {
          replacement.setAttribute(attribute.name, attribute.value);
        });

        if (!script.src) {
          replacement.text = script.text;
        }

        script.replaceWith(replacement);
      });

      window.Alpine?.initTree?.(pageElement);
    }

    document.querySelectorAll('[data-next-hide-fouc]').forEach((element) => {
      element.remove();
    });

    document.querySelectorAll('.removed').forEach((element) => {
      element.classList.remove('removed');
    });

    const classes = Array.from(document.body.classList);
    document.body.classList.remove(...classes);

    if (bodyClassName) {
      document.body.classList.add(...bodyClassName.split(/\s+/).filter(Boolean));
    }

    const counters = Array.from(document.querySelectorAll<HTMLElement>('.js-stat-counter'));
    const animateCounter = (counter: HTMLElement) => {
      if (counter.dataset.animated === 'true') return;

      counter.dataset.animated = 'true';
      const target = Number(counter.dataset.target || '0');
      const suffix = counter.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);

        counter.textContent = `${value.toLocaleString()}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach((counter) => observer.observe(counter));

    return () => {
      observer.disconnect();
    };
  }, [bodyClassName, bodyHtml]);

  return (
    <>
      <Head>
        <title>{title}</title>
        {description ? <meta name="description" content={description} /> : null}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>
      <div ref={pageRef} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </>
  );
}
