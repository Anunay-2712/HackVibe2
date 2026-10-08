import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const UsageCard = () => {
  const { t } = useLanguage();

  const steps = [
    t('sidebar.howStep1', 'Choose a file, text or URL'),
    t('sidebar.howStep2', 'Click Analyze'),
    t('sidebar.howStep3', 'Watch agents work live'),
    t('sidebar.howStep4', 'Read the verdict and sources'),
  ];

  return (
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] p-[18px] shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <h3 className="text-[15px] font-bold text-[#0F172A] mb-[12px]">
        {t('sidebar.howToUseTitle', 'How to use')}
      </h3>

      <div className="flex flex-col gap-[8px]">
        {steps.map((step, idx) => (
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
