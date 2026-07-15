import React from 'react';

const whatsappUrl = 'https://wa.me/60102150037?text=Hi%20Metro%20Pinjaman%20Berlesen%2C%20I%20would%20like%20to%20enquire%20about%20a%20loan%20appointment.';

const AboutUsSectionFooter2: React.FC = () => {
  return (
    <footer className="relative mt-16 lg:mt-24 overflow-hidden border-t border-gray-100 lg:min-h-[520px]" style={{ backgroundColor: '#fafafa' }}>
      <img className="absolute left-0 bottom-0 hidden lg:block w-[760px] max-w-none opacity-35 pointer-events-none" src="flow-assets/footer/waves-lines-left-bottom.png" alt="" />
      <div className="relative max-w-[1500px] mx-auto px-6 md:px-10 lg:px-24 xl:px-36 py-12 md:py-16 lg:pt-24 lg:pb-16 lg:min-h-[520px] flex flex-col">
        <div className="grid gap-y-10 md:grid-cols-2 lg:grid-cols-[1.55fr_0.75fr_0.95fr_1.35fr] lg:gap-x-14 xl:gap-x-20">
          <div>
            <a className="inline-flex items-center mb-5 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="index.html">
              <img className="h-10 w-auto brightness-0" src="logo.png" alt="Metro Pinjaman Berlesen logo" />
            </a>
            <p className="text-sm leading-6 lg:leading-7 text-gray-600 max-w-sm mb-6 lg:mb-8">
              Personal and business loan enquiries with clear information and direct assistance throughout the application process.
            </p>
            <a className="inline-flex min-h-11 px-5 lg:px-6 py-3 items-center justify-center text-sm font-medium text-white bg-teal-900 hover:bg-lime-500 hover:text-teal-900 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Chat on WhatsApp
            </a>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-teal-900 mb-4 lg:mb-5">Quick Links</h3>
            <ul className="space-y-3 lg:space-y-4 text-sm">
              <li><a className="inline-block text-gray-600 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="index.html">Home</a></li>
              <li><a className="inline-block text-gray-600 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="loan.html">Loan Options</a></li>
              <li><a className="inline-block text-gray-600 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="how_to_apply.html">How to Apply</a></li>
              <li><a className="inline-block text-gray-600 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="about_us.html">About Us</a></li>
              <li><a className="inline-block text-gray-600 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="contact.html">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-teal-900 mb-4 lg:mb-5">Loan Information</h3>
            <ul className="space-y-3 lg:space-y-4 text-sm">
              <li><a className="inline-block text-gray-600 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="loan.html#personal-loan">Personal Loan</a></li>
              <li><a className="inline-block text-gray-600 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="loan.html#business-loan">Business Loan</a></li>
              <li><a className="inline-block text-gray-600 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="loan.html#required-documents">Required Documents</a></li>
              <li><a className="inline-block text-gray-600 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="loan.html#interest-rate">Interest &amp; Repayment</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-teal-900 mb-4 lg:mb-5">Contact</h3>
            <ul className="space-y-3 lg:space-y-4 text-sm leading-6 text-gray-600">
              <li className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="font-medium text-teal-900">Phone / WhatsApp:</span> <a className="hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="tel:+60102150037">+60 10-215 0037</a><button type="button" className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-sm text-teal-900 hover:border-lime-500 hover:bg-lime-50 focus:outline-none focus:ring-2 focus:ring-lime-500" data-copy-value="+60 10-215 0037" aria-label="Copy phone number" title="Copy phone number">⧉</button></li>
              <li><span className="font-medium text-teal-900">Email:</span> <a className="break-all hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded" href="mailto:metropinjamanberlesan@gmail.com">metropinjamanberlesan@gmail.com</a></li>
              <li><span className="font-medium text-teal-900">Office:</span> <span className="break-words">Jalan Metro 1, Metro Prima, 52100 Kuala Lumpur, Federal Territory of Kuala Lumpur</span></li>
              <li><span className="font-medium text-teal-900">Hours:</span> Open 24 hours, 7 days a week</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 md:mt-16 lg:mt-auto lg:pt-32">
          <p className="text-sm text-gray-500 lg:text-right">© 2026 Metro Pinjaman Berlesen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default AboutUsSectionFooter2;
