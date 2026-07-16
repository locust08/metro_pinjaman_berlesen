import React from 'react';

const AboutUsSectionCustomComponents1: React.FC = () => {
    return (
        <section className="bg-white">
  {/* Page Hero */}
  <div className="relative overflow-hidden bg-white">
    <img className="absolute right-0 top-0 hidden lg:block w-[420px] opacity-20 pointer-events-none" src="flow-assets/pricing/waves-right-top.png" alt="" />
    <div className="container mx-auto px-4 py-20 lg:py-24">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 xl:gap-16 items-center">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-1 mb-6 text-sm font-medium tracking-wide bg-lime-500 text-gray-900 rounded-full">About Us</span>
          <h1 className="font-heading text-4xl xs:text-5xl lg:text-6xl tracking-tight mb-6 text-gray-900">Supporting Personal and Business Loan Enquiries</h1>
          <p className="text-lg text-gray-600 max-w-xl mb-8">Clear loan information and application guidance for individuals and businesses across Malaysia.</p>
          <a className="inline-flex py-4 px-6 items-center justify-center text-lg font-medium text-white hover:text-teal-900 border border-teal-900 hover:border-lime-500 bg-teal-900 hover:bg-lime-500 rounded-full transition duration-200" href="contact.html">Contact Us</a>
        </div>
        <div className="relative">
          <div className="absolute -right-4 -bottom-4 w-40 h-40 bg-lime-500 rounded-3xl opacity-80" />
          <div className="relative p-3 bg-white border border-gray-100 shadow-xl rounded-3xl">
            <img className="w-full h-80 md:h-[420px] object-cover rounded-2xl" src="flow-assets/metro/customer-support-consultation.webp" alt="Customer-service representative assisting with a loan enquiry" />
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* Who We Are */}
  <div className="max-w-7xl mx-auto px-4 py-20 lg:py-24">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <img className="w-full rounded-3xl shadow-xl object-cover" src="flow-assets/metro/about-company-adviser.webp" alt="Adviser reviewing loan service documents" />
      </div>
      <div>
        <h2 className="font-heading text-4xl xs:text-6xl tracking-tight mb-6">Who we are</h2>
        <p className="text-lg mb-8 text-gray-600">Metro Pinjaman Berlesen provides enquiry support for personal and business loans. We help customers understand available loan information, prepare the required documents and follow the application process.</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="font-semibold text-teal-900">Clear loan information</p>
          </div>
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="font-semibold text-teal-900">Application guidance</p>
          </div>
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="font-semibold text-teal-900">Personal and business loan support</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <p className="font-heading text-5xl tracking-tight text-lime-600 mb-2">2</p>
          <p className="text-gray-600">Loan types</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <p className="font-heading text-5xl tracking-tight text-lime-600 mb-2">24/7</p>
          <p className="text-gray-600">Service availability</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <p className="font-heading text-5xl tracking-tight text-lime-600 mb-2">6–60</p>
          <p className="text-gray-600">6–60 month repayment options</p>
        </div>
      </div>
    </div>
  </div>
  {/* Why Choose Us */}
  <div className="max-w-7xl mx-auto px-4 py-20 lg:py-24">
    <div className="max-w-3xl mb-14">
      <h2 className="font-heading text-4xl xs:text-6xl tracking-tight mb-6">Why choose us</h2>
      <p className="text-lg text-gray-600">Practical application requirements and availability, clearly presented for loan enquiries.</p>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-8 rounded-3xl shadow hover:shadow-lg transition border border-gray-100">
        <div className="w-14 h-14 flex items-center justify-center bg-lime-100 text-lime-600 rounded-2xl mb-6 text-2xl font-bold">✓</div>
        <h6 className="font-heading text-2xl tracking-tight mb-3">Open to all Malaysians</h6>
        <p className="text-gray-600">Loan enquiry support is available for Malaysian applicants.</p>
      </div>
      <div className="bg-white p-8 rounded-3xl shadow hover:shadow-lg transition border border-gray-100">
        <div className="w-14 h-14 flex items-center justify-center bg-lime-100 text-lime-600 rounded-2xl mb-6 text-2xl font-bold">✓</div>
        <h6 className="font-heading text-2xl tracking-tight mb-3">No ATM card required</h6>
        <p className="text-gray-600">Applicants do not need to provide an ATM card.</p>
      </div>
      <div className="bg-white p-8 rounded-3xl shadow hover:shadow-lg transition border border-gray-100">
        <div className="w-14 h-14 flex items-center justify-center bg-lime-100 text-lime-600 rounded-2xl mb-6 text-2xl font-bold">✓</div>
        <h6 className="font-heading text-2xl tracking-tight mb-3">No guarantor required</h6>
        <p className="text-gray-600">A guarantor is not required for the loan application.</p>
      </div>
      <div className="bg-white p-8 rounded-3xl shadow hover:shadow-lg transition border border-gray-100">
        <div className="w-14 h-14 flex items-center justify-center bg-lime-100 text-lime-600 rounded-2xl mb-6 text-2xl font-bold">✓</div>
        <h6 className="font-heading text-2xl tracking-tight mb-3">Available 24 hours, 7 days a week</h6>
        <p className="text-gray-600">Our team is available for enquiries every day.</p>
      </div>
    </div>
  </div>
  {/* Who We Help */}
  <div className="bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 py-20 lg:py-24">
      <div className="max-w-3xl mb-14">
        <h2 className="font-heading text-4xl xs:text-6xl tracking-tight mb-6">Who we help</h2>
        <p className="text-lg text-gray-600">We support individuals, small-business owners and companies looking for personal or business loan information.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-3xl overflow-hidden bg-white shadow border border-gray-100">
          <img className="w-full h-44 object-cover" src="flow-assets/metro/who-help-phone-support.webp" alt="Support representative answering a loan enquiry by phone" />
          <div className="p-6">
            <h6 className="font-heading text-2xl tracking-tight mb-2">Individuals</h6>
            <p className="text-gray-600">Support for personal loan information, enquiry steps and application preparation.</p>
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden bg-white shadow border border-gray-100">
          <img className="w-full h-44 object-cover" src="flow-assets/metro/who-help-food-business.webp" alt="Food-business owner preparing financing records" />
          <div className="p-6">
            <h6 className="font-heading text-2xl tracking-tight mb-2">Small-business owners</h6>
            <p className="text-gray-600">Guidance for business loan enquiries related to working capital, stock or overheads.</p>
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden bg-white shadow border border-gray-100">
          <img className="w-full h-44 object-cover" src="flow-assets/metro/who-help-document-prep.webp" alt="Applicant organising loan application documents" />
          <div className="p-6">
            <h6 className="font-heading text-2xl tracking-tight mb-2">Companies and corporate groups</h6>
            <p className="text-gray-600">Information support for company loan enquiries and application requirements.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* CTA */}
  <div className="max-w-7xl mx-auto px-4 py-20 lg:py-24">
    <div className="bg-lime-500 rounded-3xl px-6 py-14 sm:px-16 text-center">
      <h2 className="font-heading text-4xl xs:text-6xl tracking-tight mb-6 text-gray-900">Need help with your loan enquiry?</h2>
      <p className="text-lg text-gray-800 max-w-2xl mx-auto mb-10">Contact our team for information about personal loans, business loans and the application process.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center"><a className="inline-flex px-8 py-4 items-center justify-center bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition" href="contact.html">Apply Now</a><a className="inline-flex px-8 py-4 items-center justify-center bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition" href="https://wa.me/60102150037?text=Hi%20Metro%20Pinjaman%20Berlesen%2C%20I%20would%20like%20to%20enquire%20about%20a%20loan%20appointment." target="_blank" rel="noopener">Chat on WhatsApp</a></div>
    </div>
  </div>
</section>


    );
};

export default AboutUsSectionCustomComponents1;
