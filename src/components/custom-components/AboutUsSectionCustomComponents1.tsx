import React from 'react';

const AboutUsSectionCustomComponents1: React.FC = () => {
    return (
        <section className="bg-white">
  {/* Page Hero */}
  <div className="relative overflow-hidden">
    <img className="absolute inset-0 w-full h-full object-cover" src="flow-assets/metro/customer-support-consultation.webp" alt="Customer-service representative assisting with a loan enquiry" />
    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/60" />
    <div className="relative max-w-7xl mx-auto px-4 py-24 xs:py-32">
      <span className="inline-block px-4 py-1 mb-6 text-sm font-medium tracking-wide bg-lime-500 text-gray-900 rounded-full">About Us</span>
      <h1 className="font-heading text-5xl xs:text-7xl xl:text-8xl tracking-tight mb-6 text-white">Lending you trust, building your future.</h1>
      <p className="text-lg text-gray-200 max-w-2xl">We help individuals and businesses access clear and transparent loan information, so you can focus on what matters most.</p>
    </div>
  </div>
  {/* Company Overview */}
  <div className="max-w-7xl mx-auto px-4 py-20">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <img className="w-full rounded-3xl shadow-xl object-cover" src="flow-assets/metro/about-company-adviser.webp" alt="Adviser reviewing loan service documents" />
      </div>
      <div>
        <h2 className="font-heading text-5xl xs:text-7xl tracking-tight mb-6">Who we are</h2>
        <p className="text-lg mb-4 text-gray-600">Founded with a simple mission—to make borrowing simpler, smarter and more human—we've helped thousands of customers secure the funding they need with confidence.</p>
        <p className="text-lg mb-8 text-gray-600">Our team of financial experts combines years of industry experience with modern technology to deliver loan services that are transparent, secure and tailored to your goals.</p>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="font-heading text-4xl tracking-tight text-lime-600 mb-1">15K+</p>
            <p className="text-sm text-gray-500">Loans funded</p>
          </div>
          <div>
            <p className="font-heading text-4xl tracking-tight text-lime-600 mb-1">Varies</p>
            <p className="text-sm text-gray-500">Processing and disbursement time</p>
          </div>
          <div>
            <p className="font-heading text-4xl tracking-tight text-lime-600 mb-1">98%</p>
            <p className="text-sm text-gray-500">Satisfaction rate</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* Why Choose Us */}
  <div className="bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="max-w-3xl mb-14">
        <h2 className="font-heading text-5xl xs:text-7xl tracking-tight mb-6">Why choose us</h2>
        <p className="text-lg text-gray-600">We go beyond just approving loans. Here's what sets our service apart from the rest.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow hover:shadow-lg transition">
          <div className="w-14 h-14 flex items-center justify-center bg-lime-100 text-lime-600 rounded-2xl mb-6 text-2xl font-bold">⚡</div>
          <h6 className="font-heading text-2xl tracking-tight mb-3">Clear review process</h6>
          <p className="text-gray-600">Our team reviews your enquiry and contacts you about the next step.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow hover:shadow-lg transition">
          <div className="w-14 h-14 flex items-center justify-center bg-lime-100 text-lime-600 rounded-2xl mb-6 text-2xl font-bold">%</div>
          <h6 className="font-heading text-2xl tracking-tight mb-3">Rate information</h6>
          <p className="text-gray-600">Transparent pricing with no hidden fees. You always know exactly what you'll pay.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow hover:shadow-lg transition">
          <div className="w-14 h-14 flex items-center justify-center bg-lime-100 text-lime-600 rounded-2xl mb-6 text-2xl font-bold">♥</div>
          <h6 className="font-heading text-2xl tracking-tight mb-3">Personalised service</h6>
          <p className="text-gray-600">Real people, real support. Our advisors guide you through every step of the journey.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow hover:shadow-lg transition">
          <div className="w-14 h-14 flex items-center justify-center bg-lime-100 text-lime-600 rounded-2xl mb-6 text-2xl font-bold">✓</div>
          <h6 className="font-heading text-2xl tracking-tight mb-3">Monthly repayment plan</h6>
          <p className="text-gray-600">Choose repayment plans that fit your budget and lifestyle, not the other way around.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow hover:shadow-lg transition">
          <div className="w-14 h-14 flex items-center justify-center bg-lime-100 text-lime-600 rounded-2xl mb-6 text-2xl font-bold">📱</div>
          <h6 className="font-heading text-2xl tracking-tight mb-3">100% online</h6>
          <p className="text-gray-600">Apply, track and manage your loan entirely from your phone or computer—anytime.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow hover:shadow-lg transition">
          <div className="w-14 h-14 flex items-center justify-center bg-lime-100 text-lime-600 rounded-2xl mb-6 text-2xl font-bold">★</div>
          <h6 className="font-heading text-2xl tracking-tight mb-3">Trusted reputation</h6>
          <p className="text-gray-600">Thousands of happy customers and top industry ratings back our commitment to you.</p>
        </div>
      </div>
    </div>
  </div>
  {/* Trust & Security */}
  <div className="max-w-7xl mx-auto px-4 py-20">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div className="order-2 md:order-1">
        <h2 className="font-heading text-5xl xs:text-7xl tracking-tight mb-6">Trust &amp; security</h2>
        <p className="text-lg mb-8 text-gray-600">Your data and money are protected by industry-leading standards. We treat your security as seriously as you do.</p>
        <ul className="space-y-5">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-lime-500 text-gray-900 rounded-full mr-4 font-bold">✓</span>
            <div>
              <p className="font-semibold mb-1">Bank-level encryption</p>
              <p className="text-gray-600">256-bit SSL encryption keeps every transaction safe.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-lime-500 text-gray-900 rounded-full mr-4 font-bold">✓</span>
            <div>
              <p className="font-semibold mb-1">Fully licensed &amp; regulated</p>
              <p className="text-gray-600">We operate in full compliance with financial authorities.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-lime-500 text-gray-900 rounded-full mr-4 font-bold">✓</span>
            <div>
              <p className="font-semibold mb-1">Privacy first</p>
              <p className="text-gray-600">Your personal information is never sold or shared without consent.</p>
            </div>
          </li>
        </ul>
      </div>
      <div className="order-1 md:order-2">
        <img className="w-full rounded-3xl shadow-xl object-cover" src="flow-assets/metro/about-document-review.webp" alt="Adviser checking loan documents carefully" />
      </div>
    </div>
  </div>
  {/* Who We Help */}
  <div className="bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="max-w-3xl mb-14">
        <h2 className="font-heading text-5xl xs:text-7xl tracking-tight mb-6">Who we help</h2>
        <p className="text-lg text-gray-300">Whatever your goal, we have a loan solution designed for you.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-3xl overflow-hidden bg-gray-800">
          <img className="w-full h-44 object-cover" src="flow-assets/metro/who-help-personal-budget.webp" alt="Applicant reviewing a personal budget and documents" />
          <div className="p-6">
            <h6 className="font-heading text-2xl tracking-tight mb-2">Home buyers</h6>
            <p className="text-gray-400">Affordable mortgages to help you own your dream home.</p>
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden bg-gray-800">
          <img className="w-full h-44 object-cover" src="flow-assets/metro/who-help-food-business.webp" alt="Food-business owner preparing financing records" />
          <div className="p-6">
            <h6 className="font-heading text-2xl tracking-tight mb-2">Small businesses</h6>
            <p className="text-gray-400">Working capital and growth funding for entrepreneurs.</p>
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden bg-gray-800">
          <img className="w-full h-44 object-cover" src="flow-assets/metro/who-help-phone-support.webp" alt="Support representative answering a loan enquiry by phone" />
          <div className="p-6">
            <h6 className="font-heading text-2xl tracking-tight mb-2">Individuals</h6>
            <p className="text-gray-400">Personal loans for life's planned and unexpected moments.</p>
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden bg-gray-800">
          <img className="w-full h-44 object-cover" src="flow-assets/metro/who-help-document-prep.webp" alt="Applicant organising loan application documents" />
          <div className="p-6">
            <h6 className="font-heading text-2xl tracking-tight mb-2">Students</h6>
            <p className="text-gray-400">Education financing to invest in your future career.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* CTA */}
  <div className="max-w-7xl mx-auto px-4 py-20">
    <div className="bg-lime-500 rounded-3xl px-6 py-16 sm:px-16 text-center">
      <h2 className="font-heading text-5xl xs:text-7xl tracking-tight mb-6 text-gray-900">Ready to get started?</h2>
      <p className="text-lg text-gray-800 max-w-2xl mx-auto mb-10">Join thousands of satisfied customers who trust us with their financial goals. Apply today and get a decision in minutes.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center"><a className="inline-block px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition" href="contact.html">Apply Now</a><a className="inline-block px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition" href="contact.html">Contact Us</a></div>
    </div>
  </div>
</section>


    );
};

export default AboutUsSectionCustomComponents1;
