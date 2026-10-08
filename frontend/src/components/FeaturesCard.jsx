import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const FeaturesCard = () => {
  const { t } = useLanguage();

  const features = [
    t('sidebar.featMultiAgent', 'Multi-agent investigation'),
    t('sidebar.featVoiceClone', 'Deepfake and voice clone detection'),
    t('sidebar.featClaimChecks', 'Claim checks with real sources'),
    t('sidebar.featInconclusive', 'Inconclusive-aware verdicts'),
    t('sidebar.featLanguages', 'Hindi and Telugu speech support'),
  ];

  return (
    <div
      id="features"
      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] p-[18px] shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
    >
      <h3 className="text-[15px] font-bold text-[#0F172A] mb-[12px]">
        {t('sidebar.featuresTitle', 'Features')}
      </h3>

      <div className="flex flex-col gap-[8px]">
        {features.map((feature, idx) => (
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
