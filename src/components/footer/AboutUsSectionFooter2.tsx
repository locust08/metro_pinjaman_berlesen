import React from 'react';

const AboutUsSectionFooter2: React.FC = () => {
  return (
    <footer className="relative py-12 lg:py-24 overflow-hidden border-t border-gray-100" style={{ backgroundColor: '#fafafa' }}>
      <img className="absolute bottom-0 left-0 w-[720px] max-w-none opacity-30 pointer-events-none" src="flow-assets/footer/waves-lines-left-bottom.png" alt="" />
      <div className="container px-4 mx-auto relative">
        <div className="grid gap-y-10 md:grid-cols-2 lg:grid-cols-[1.7fr_0.8fr_1fr_1.35fr] lg:gap-x-16 xl:gap-x-24 mb-12 md:mb-24 xl:mb-40">
          <div>
            <a className="inline-flex items-center mb-5 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="index.html">
              <img className="h-8 lg:h-12 w-auto brightness-0" src="logo.png" alt="Metro Pinjaman Berlesen logo" />
            </a>
            <p className="text-sm lg:text-base leading-6 lg:leading-7 text-gray-600 max-w-md mb-4 lg:mb-8">
              Personal and business loan enquiries with clear information and direct assistance throughout the application process.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-teal-900 mb-3 lg:mb-5">Quick Links</h3>
            <ul className="space-y-1.5 lg:space-y-4 text-sm">
              <li><a className="inline-block text-gray-600 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="index.html">Home</a></li>
              <li><a className="inline-block text-gray-600 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="loan.html">Loan Options</a></li>
              <li><a className="inline-block text-gray-600 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="how_to_apply.html">How to Apply</a></li>
              <li><a className="inline-block text-gray-600 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="about_us.html">About Us</a></li>
              <li><a className="inline-block text-gray-600 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="contact.html">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-teal-900 mb-3 lg:mb-5">Loan Information</h3>
            <ul className="space-y-1.5 lg:space-y-4 text-sm">
              <li><a className="inline-block text-gray-600 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="loan.html#personal-loan">Personal Loan</a></li>
              <li><a className="inline-block text-gray-600 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="loan.html#business-loan">Business Loan</a></li>
              <li><a className="inline-block text-gray-600 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="loan.html#required-documents">Required Documents</a></li>
              <li><a className="inline-block text-gray-600 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="loan.html#interest-rate">Interest &amp; Repayment</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-teal-900 mb-3 lg:mb-5">Contact</h3>
            <ul className="space-y-1.5 lg:space-y-4 text-sm leading-6 text-gray-600">
              <li className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="font-medium text-teal-900">Phone / WhatsApp:</span> <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><a className="hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="tel:+60102150037">+60 10-215 0037</a><button type="button" className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-xs text-teal-900 hover:border-lime-500 hover:bg-lime-50 focus:outline-none focus:ring-2 focus:ring-lime-500" data-copy-value="+60 10-215 0037" aria-label="Copy phone number" title="Copy phone number">⧉</button></span></li>
              <li className="whitespace-nowrap"><span className="font-medium text-teal-900">Email:</span> <a className="hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="mailto:metropinjamanberlesan@gmail.com">metropinjamanberlesan@gmail.com</a></li>
              <li><span className="font-medium text-teal-900">Office:</span> <span className="break-words">Jalan Metro 1, Metro Prima, 52100 Kuala Lumpur, Federal Territory of Kuala Lumpur</span></li>
              <li><span className="font-medium text-teal-900">Hours:</span> Open 24 hours, 7 days a week</li>
            </ul>
          </div>
        </div>
        <div className="md:text-right">
          <p className="text-sm text-gray-500">© 2026 Metro Pinjaman Berlesen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default AboutUsSectionFooter2;
