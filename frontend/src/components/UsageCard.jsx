import React from 'react';

const STEPS = [
  'Choose a file, text or URL',
  'Click Analyze',
  'Watch agents work live',
  'Read the verdict and sources'
];

const UsageCard = () => {
  return (
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] p-[18px] shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      {/* Section heading h3: 15px, 700, margin-bottom 12px */}
      <h3 className="text-[15px] font-bold text-[#0F172A] mb-[12px]">
        How to use
      </h3>

      {/* Numbered rows (number bold indigo) */}
      <div className="flex flex-col gap-[8px]">
        {STEPS.map((step, idx) => (
          <div key={idx} className="flex items-center gap-[8px] text-[13px] text-[#334155]">
            <strong className="font-bold text-[#4F46E5] w-[14px] inline-block shrink-0">
              {idx + 1}
            </strong>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsageCard;
