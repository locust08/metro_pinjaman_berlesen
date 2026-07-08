import React, { useEffect } from 'react';
import Head from 'next/head';
import IndexSectionNavigations10 from '../components/navigations/IndexSectionNavigations10';
import IndexSectionHeaders6 from '../components/headers/IndexSectionHeaders6';
import IndexSectionStats9 from '../components/stats/IndexSectionStats9';
import IndexSectionCustomComponents8 from '../components/custom-components/IndexSectionCustomComponents8';
import IndexSectionFooter7 from '../components/footer/IndexSectionFooter7';

const Index: React.FC = () => {
  useEffect(() => {
    // Custom CSS classes for elements from the index.html
    const classes = Array.from(document.body.classList);
    document.body.classList.remove(...classes);
    document.body.classList.add(
      ...'antialiased font-body bg-body text-body'.split(' ')
    );
    // Load custom component scripts after React components are mounted
    const script1 = document.createElement('script');
    script1.src =
      'js/1286561.js?v=1783477642';
    script1.async = true;
    document.head.appendChild(script1);
    const script2 = document.createElement('script');
    script2.src =
      'js/global-88881.js';
    script2.async = true;
    document.head.appendChild(script2);
  }, []);

  return (
    <>
      <Head>
        <title>Metro Pinjaman Berlesen</title>
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon.ico'
        />
      </Head>
      <IndexSectionNavigations10 />
      <IndexSectionHeaders6 />
      <IndexSectionStats9 />
      <IndexSectionCustomComponents8 />
      <IndexSectionFooter7 />
    </>
  );
};

export default Index;
