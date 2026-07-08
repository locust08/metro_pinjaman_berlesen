import React, { useEffect } from 'react';
import Head from 'next/head';
import ContactSectionNavigations6 from '../components/navigations/ContactSectionNavigations6';
import ContactSectionContact2 from '../components/contact/ContactSectionContact2';
import ContactSectionContact4 from '../components/contact/ContactSectionContact4';
import ContactSectionFaq5 from '../components/faq/ContactSectionFaq5';
import ContactSectionFooter3 from '../components/footer/ContactSectionFooter3';

const Contact: React.FC = () => {
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
        <title>Contact Us | Metro Pinjaman Berlesen</title>
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon.ico'
        />
      </Head>
      <ContactSectionNavigations6 />
      <ContactSectionContact2 />
      <ContactSectionContact4 />
      <ContactSectionFaq5 />
      <ContactSectionFooter3 />
    </>
  );
};

export default Contact;
