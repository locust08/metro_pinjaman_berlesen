import React, { useEffect } from 'react';
import Head from 'next/head';
import LoanSectionHeaders2 from '../components/headers/LoanSectionHeaders2';
import LoanSectionBlog3 from '../components/blog/LoanSectionBlog3';
import LoanSectionBlog4 from '../components/blog/LoanSectionBlog4';
import LoanSectionPricing1 from '../components/pricing/LoanSectionPricing1';
import LoanSectionCustomComponents5 from '../components/custom-components/LoanSectionCustomComponents5';
import LoanSectionFooter6 from '../components/footer/LoanSectionFooter6';

const Loan: React.FC = () => {
  useEffect(() => {
    // Load custom component scripts after React components are mounted
    const script1 = document.createElement('script');
    script1.src =
      'js/1286481.js?v=1783477646';
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
        <title>Loan | Metro Pinjaman Berlesen</title>
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon.ico'
        />
      </Head>
      <LoanSectionHeaders2 />
      <LoanSectionBlog3 />
      <LoanSectionBlog4 />
      <LoanSectionPricing1 />
      <LoanSectionCustomComponents5 />
      <LoanSectionFooter6 />
    </>
  );
};

export default Loan;
