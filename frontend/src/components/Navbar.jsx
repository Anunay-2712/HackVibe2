import React from 'react';
import { Shield, HelpCircle, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = ({ onOpenAbout }) => {
  const { lang, setLang, t, languages } = useLanguage();

  return (
    <header className="h-[68px] border-b border-[#E2E8F0] bg-white sticky top-0 z-40">
      <div className="max-w-[1440px] mx-auto h-full px-4 sm:px-[32px] flex items-center justify-between gap-2">
        {/* Left: Logo */}
        <a href="/" className="flex items-center gap-[10px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 rounded-[8px]">
          <div className="w-[28px] h-[28px] bg-[#4F46E5] rounded-[8px] flex items-center justify-center text-white shrink-0">
            <Shield className="w-[16px] h-[16px] stroke-[2.5]" />
          </div>
          <span className="font-bold text-[20px] text-[#0F172A] tracking-tight">
            DeepTrace
          </span>
        </a>

        {/* Center links: Localized */}
        <nav className="hidden lg:flex items-center gap-[28px] text-[14px] text-[#334155] font-medium" aria-label="Main Navigation">
          <a
            href="#explore"
            className="hover:text-[#4F46E5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] rounded px-1"
          >
            {t('navbar.explore')}
          </a>
          <a
            href="#news"
            className="hover:text-[#4F46E5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] rounded px-1"
          >
            {t('navbar.news')}
          </a>
          <a
            href="#features"
            className="hover:text-[#4F46E5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] rounded px-1"
          >
            {t('navbar.features')}
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[#4F46E5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] rounded px-1"
          >
            {t('navbar.howItWorks')}
          </a>
        </nav>

        {/* Right: Language Switcher + "About" button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher Pill */}
          <div className="flex items-center bg-[#F1F5F9] p-1 rounded-[10px] border border-[#E2E8F0]">
            <Globe className="w-3.5 h-3.5 text-[#64748B] ml-1 mr-1 hidden sm:inline-block shrink-0" />
            {languages.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                className={`px-2 sm:px-2.5 py-1 text-[12px] sm:text-[13px] font-semibold rounded-[7px] transition-all cursor-pointer ${
                  lang === l.code
                    ? 'bg-white text-[#4F46E5] shadow-xs font-bold'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
                aria-label={`Switch language to ${l.label}`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* About DeepTrace button */}
          <button
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 sm:gap-2 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4338CA] border border-indigo-200 font-bold text-[13px] sm:text-[14px] py-[8px] sm:py-[10px] px-3 sm:px-[18px] rounded-[10px] transition-all focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 cursor-pointer shadow-xs hover:shadow-sm shrink-0"
          >
            <HelpCircle className="w-4 h-4 text-[#4F46E5]" />
            <span className="hidden sm:inline">{t('navbar.about')}</span>
            <span className="sm:hidden">{t('navbar.about').split(' ')[0]}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
