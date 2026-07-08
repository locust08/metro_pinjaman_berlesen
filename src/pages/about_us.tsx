import React, { useEffect } from 'react';
import Head from 'next/head';
import AboutUsSectionNavigations4 from '../components/navigations/AboutUsSectionNavigations4';
import AboutUsSectionCustomComponents1 from '../components/custom-components/AboutUsSectionCustomComponents1';
import AboutUsSectionFooter2 from '../components/footer/AboutUsSectionFooter2';
import AboutUsSectionNavigations3 from '../components/navigations/AboutUsSectionNavigations3';

const AboutUs: React.FC = () => {
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
        <title>About Us | Metro Pinjaman Berlesen</title>
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon.ico'
        />
      </Head>
      <AboutUsSectionNavigations4 />
      <AboutUsSectionCustomComponents1 />
      <AboutUsSectionFooter2 />
      <AboutUsSectionNavigations3 />
    </>
  );
};

export default AboutUs;
