import { useEffect, useRef } from 'react';
import Head from 'next/head';

export type LegacyPageProps = {
  title: string;
  metaDescription: string;
  bodyClassName: string;
  bodyHtml: string;
};

export type LegacyPageContent = {
  title: string;
  description: string;
  metaDescription: string;
  bodyClassName: string;
  bodyHtml: string;
};

declare global {
  interface Window {
    Alpine?: {
      initTree?: (element: Element) => void;
    };
  }
}

export default function LegacyPage({ title, metaDescription, bodyClassName, bodyHtml }: LegacyPageProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const whatsappUrl =
    'https://wa.me/60102150037?text=Hi%20Metro%20Pinjaman%20Berlesen%2C%20I%20would%20like%20to%20enquire%20about%20a%20loan%20appointment.';

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
        {metaDescription ? <meta name="description" content={metaDescription} /> : null}
        {metaDescription ? <meta property="og:description" content={metaDescription} /> : null}
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>
      <div suppressHydrationWarning ref={pageRef} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <a
        className="metro-floating-whatsapp"
        href={whatsappUrl}
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
      >
        <span className="metro-floating-whatsapp-label">WhatsApp</span>
        <span className="metro-floating-whatsapp-icon">
          <svg aria-hidden="true" viewBox="0 0 32 32" focusable="false">
            <path d="M16.02 4C9.4 4 4.02 9.22 4.02 15.64c0 2.05.56 4.06 1.63 5.82L4 28l6.78-1.71A12.37 12.37 0 0 0 16.02 27C22.64 27 28 21.78 28 15.36S22.64 4 16.02 4Zm0 20.98c-1.65 0-3.27-.43-4.69-1.24l-.34-.19-4.02 1.01.98-3.81-.22-.36a9.1 9.1 0 0 1-1.45-4.75c0-5.31 4.38-9.62 9.76-9.62 5.37 0 9.74 4.19 9.74 9.34 0 5.3-4.38 9.62-9.76 9.62Zm5.34-7.2c-.29-.14-1.73-.83-2-.92-.27-.1-.47-.14-.67.14-.2.28-.76.91-.94 1.1-.17.19-.35.21-.64.07-.29-.14-1.22-.44-2.32-1.39-.86-.74-1.44-1.66-1.61-1.94-.17-.28-.02-.43.13-.57.13-.13.29-.33.44-.49.15-.16.2-.28.29-.47.1-.19.05-.35-.02-.49-.07-.14-.67-1.57-.92-2.15-.24-.56-.49-.49-.67-.5h-.57c-.2 0-.52.07-.79.35-.27.28-1.04 1-1.04 2.43s1.06 2.82 1.21 3.01c.15.19 2.09 3.1 5.07 4.35.71.3 1.26.48 1.69.61.71.22 1.36.19 1.87.12.57-.08 1.73-.69 1.98-1.35.24-.66.24-1.23.17-1.35-.07-.12-.27-.19-.56-.33Z" />
          </svg>
        </span>
      </a>
    </>
  );
}
