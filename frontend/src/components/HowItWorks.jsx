import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const HowItWorks = () => {
  const { t } = useLanguage();

  return (
    <section
      id="how-it-works"
      aria-label="How it works"
      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] p-[18px] shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
    >
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-[13px] text-[#334155] text-center">
        <span className="whitespace-nowrap font-medium">
          {t('workflow.step1', '1 Upload')}
        </span>

        <span className="text-[#94A3B8] font-mono hidden sm:inline" aria-hidden="true">
          →
        </span>

        <span className="whitespace-nowrap font-medium">
          {t('workflow.step2', '2 Agents investigate')}
        </span>

        <span className="text-[#94A3B8] font-mono hidden sm:inline" aria-hidden="true">
          →
        </span>

        <span className="whitespace-nowrap font-medium">
          {t('workflow.step3', '3 Evidence fused')}
        </span>

        <span className="text-[#94A3B8] font-mono hidden sm:inline" aria-hidden="true">
          →
        </span>

        <span className="whitespace-nowrap font-medium">
          {t('workflow.step4', '4 Explained verdict')}
        </span>
      </div>
    </section>
  );
};

export default HowItWorks;
