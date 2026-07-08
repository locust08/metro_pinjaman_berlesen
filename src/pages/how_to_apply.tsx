import React, { useEffect } from 'react';
import Head from 'next/head';
import HowToApplySectionHeaders2 from '../components/headers/HowToApplySectionHeaders2';
import HowToApplySectionCustomComponents3 from '../components/custom-components/HowToApplySectionCustomComponents3';
import HowToApplySectionFooter6 from '../components/footer/HowToApplySectionFooter6';

const HowToApply: React.FC = () => {
  useEffect(() => {
    // Load custom component scripts after React components are mounted
    const script1 = document.createElement('script');
    script1.src =
      'js/global-88881.js';
    script1.async = true;
    document.head.appendChild(script1);
  }, []);

  return (
    <>
      <Head>
        <title>How To Apply | Metro Pinjaman Berlesen</title>
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon.ico'
        />
      </Head>
      <HowToApplySectionHeaders2 />
      <HowToApplySectionCustomComponents3 />
      <HowToApplySectionFooter6 />
    </>
  );
};

export default HowToApply;
