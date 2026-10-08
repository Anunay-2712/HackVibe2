import React from 'react';
import { Shield, HelpCircle } from 'lucide-react';

const Navbar = ({ onOpenAbout }) => {
  return (
    <header className="h-[68px] border-b border-[#E2E8F0] bg-white sticky top-0 z-40">
      <div className="max-w-[1440px] mx-auto h-full px-[32px] flex items-center justify-between">
        {/* Left: 28x28px indigo rounded square (radius 8px) + "DeepTrace" 700 20px, gap 10px */}
        <a href="/" className="flex items-center gap-[10px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 rounded-[8px]">
          <div className="w-[28px] h-[28px] bg-[#4F46E5] rounded-[8px] flex items-center justify-center text-white shrink-0">
            <Shield className="w-[16px] h-[16px] stroke-[2.5]" />
          </div>
          <span className="font-bold text-[20px] text-[#0F172A] tracking-tight">
            DeepTrace
          </span>
        </a>

        {/* Center links: 14px, #334155, gap 28px */}
        <nav className="hidden md:flex items-center gap-[28px] text-[14px] text-[#334155] font-medium" aria-label="Main Navigation">
          <a
            href="#explore"
            className="hover:text-[#4F46E5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] rounded px-1"
          >
            Explore
          </a>
          <a
            href="#news"
            className="hover:text-[#4F46E5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] rounded px-1"
          >
            News
          </a>
          <a
            href="#features"
            className="hover:text-[#4F46E5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] rounded px-1"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[#4F46E5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] rounded px-1"
          >
            How it works
          </a>
        </nav>

        {/* Right: "About" button */}
        <div className="flex items-center">
          <button
            onClick={onOpenAbout}
            className="flex items-center gap-2 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4338CA] border border-indigo-200 font-bold text-[14px] py-[10px] px-[18px] rounded-[10px] transition-all focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 cursor-pointer shadow-sm hover:shadow"
          >
            <HelpCircle className="w-4 h-4 text-[#4F46E5]" />
            <span>About DeepTrace</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
