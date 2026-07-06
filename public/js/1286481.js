(function() {
  const init = () => {
    const estimators = document.querySelectorAll(".loan-estimator");
    estimators.forEach((est) => {
      const amountEl = est.querySelector(".est-amount");
      const rateEl = est.querySelector(".est-rate");
      const tenureEl = est.querySelector(".est-tenure");
      const resultEl = est.querySelector(".est-result");

      const calculate = () => {
        const principal = parseFloat(amountEl.value) || 0;
        const annualRate = parseFloat(rateEl.value) || 0;
        const years = parseFloat(tenureEl.value) || 0;
        const months = years * 12;
        const monthlyRate = annualRate / 100 / 12;

        let monthly = 0;
        if (principal > 0 && months > 0) {
          if (monthlyRate === 0) {
            monthly = principal / months;
          } else {
            monthly = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
          }
        }

        resultEl.textContent = "$" + monthly.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
      };

      [amountEl, rateEl, tenureEl].forEach((el) => {
        el.addEventListener("input", calculate);
      });

      calculate();
    });
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();