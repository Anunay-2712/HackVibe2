import React from 'react';

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      aria-label="How it works"
      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] p-[18px] shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
    >
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-[13px] text-[#334155] text-center">
        <span className="whitespace-nowrap">
          <strong className="font-bold text-[#4F46E5] mr-1">1</strong> Upload
        </span>

        <span className="text-[#94A3B8] font-mono hidden sm:inline" aria-hidden="true">
          →
        </span>

        <span className="whitespace-nowrap">
          <strong className="font-bold text-[#4F46E5] mr-1">2</strong> Agents investigate
        </span>

        <span className="text-[#94A3B8] font-mono hidden sm:inline" aria-hidden="true">
          →
        </span>

        <span className="whitespace-nowrap">
          <strong className="font-bold text-[#4F46E5] mr-1">3</strong> Evidence fused
        </span>

        <span className="text-[#94A3B8] font-mono hidden sm:inline" aria-hidden="true">
          →
        </span>

        <span className="whitespace-nowrap">
          <strong className="font-bold text-[#4F46E5] mr-1">4</strong> Explained verdict
        </span>
      </div>
    </section>
  );
};

export default HowItWorks;
