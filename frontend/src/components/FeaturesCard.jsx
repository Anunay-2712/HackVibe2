import React from 'react';

const FEATURES = [
  'Multi-agent investigation',
  'Deepfake and voice clone detection',
  'Claim checks with real sources',
  'Inconclusive-aware verdicts',
  'Hindi and Telugu speech support'
];

const FeaturesCard = () => {
  return (
    <div
      id="features"
      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] p-[18px] shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
    >
      {/* Section heading h3: 15px, 700, margin-bottom 12px */}
      <h3 className="text-[15px] font-bold text-[#0F172A] mb-[12px]">
        Features
      </h3>

      {/* Rows: 13px #334155, gap 8px, indigo dot bullet */}
      <div className="flex flex-col gap-[8px]">
        {FEATURES.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-[8px] text-[13px] text-[#334155]">
            <span
              className="w-[6px] h-[6px] rounded-full bg-[#4F46E5] inline-block shrink-0"
              aria-hidden="true"
            />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesCard;
