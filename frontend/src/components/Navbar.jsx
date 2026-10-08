import React from 'react';
import { Shield } from 'lucide-react';

const Navbar = ({ onStartInvestigation }) => {
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

        {/* Right: primary button "Start investigation" */}
        <div className="flex items-center">
          <button
            onClick={onStartInvestigation}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-[14px] py-[12px] px-[20px] rounded-[10px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 cursor-pointer"
          >
            Start investigation
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
