import React from 'react';

const LoanSectionCustomComponents5: React.FC = () => {
    return (
        <section className="bg-white">
  <div className="max-w-6xl mx-auto px-6 py-16">
    <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">Interest Rates &amp; Repayment</h2>
    <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">Transparent pricing with flexible repayment options designed to fit your budget.</p>
    <div className="grid md:grid-cols-3 gap-8">
      <div className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full text-2xl font-bold">%</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Competitive Rates</h3>
        <p className="text-gray-600">
          Personal loans from
          <span className="font-semibold text-blue-700">6.5% p.a.</span>
          and business loans from
          <span className="font-semibold text-blue-700">8.0% p.a.</span>
        </p>
      </div>
      <div className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full text-2xl font-bold">$</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Repayment</h3>
        <p className="text-gray-600">Choose monthly installments that suit your cash flow, with no hidden fees or surprises.</p>
      </div>
      <div className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full text-2xl font-bold">↻</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Early Settlement</h3>
        <p className="text-gray-600">Pay off your loan early and save on interest with low or zero prepayment penalties.</p>
      </div>
    </div>
    <div className="mt-12 bg-blue-50 rounded-2xl p-8 max-w-3xl mx-auto">
      <h3 className="text-xl font-semibold text-blue-900 mb-6 text-center">Representative example</h3>
      <div className="mt-6 text-center">
        <p className="text-gray-600">Amount borrowed</p>
        <p className="text-3xl font-bold text-blue-700 mt-1">RM5,000</p>
        <p className="text-xs text-gray-400 mt-2">180-day period. Interest: RM448. Total payable: RM5,448.</p>
      </div>
    </div>
  </div>
</section>


    );
};

export default LoanSectionCustomComponents5;
