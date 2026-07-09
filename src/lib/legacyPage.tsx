import { useEffect } from 'react';
import Head from 'next/head';

export type LegacyPageProps = {
  title: string;
  bodyClassName: string;
  bodyHtml: string;
};

export default function LegacyPage({ title, bodyClassName, bodyHtml }: LegacyPageProps) {
  useEffect(() => {
    const classes = Array.from(document.body.classList);
    document.body.classList.remove(...classes);

    if (bodyClassName) {
      document.body.classList.add(...bodyClassName.split(/\s+/).filter(Boolean));
    }
  }, [bodyClassName]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </>
  );
}
