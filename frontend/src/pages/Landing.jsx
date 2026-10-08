import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import NewsCarousel from '../components/NewsCarousel';
import HeroInput from '../components/HeroInput';
import ToolGrid from '../components/ToolGrid';
import HowItWorks from '../components/HowItWorks';
import FeaturesCard from '../components/FeaturesCard';
import UsageCard from '../components/UsageCard';
import LiveStatusCard from '../components/LiveStatusCard';

const Landing = () => {
  const [selectedToolMode, setSelectedToolMode] = useState(null);

  const handleStartInvestigation = () => {
    // Smoothly scroll to the input card and focus it
    const inputCard = document.querySelector('input[type="file"], textarea');
    if (inputCard) {
      inputCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      inputCard.focus();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectTool = (mode) => {
    setSelectedToolMode(mode);
    // Scroll to input card
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans antialiased">
      {/* NAVBAR (height 68px, bottom border 1px #E2E8F0, flex, space-between, vertically centered) */}
      <Navbar onStartInvestigation={handleStartInvestigation} />

      {/* PAGE CONTAINER: max-width 1440px, centered, horizontal padding 32px, bottom padding 40px */}
      <main className="max-w-[1440px] mx-auto px-[32px] pb-[40px]">
        {/* MAIN GRID: below the navbar, margin-top 28px. 1fr 2fr 1fr (25% / 50% / 25%), gap 24px, align-items start */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="mt-[28px] grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-[24px] items-start"
        >
          {/* LEFT COLUMN: news carousel (one card). Sticky on desktop */}
          <aside className="order-2 lg:order-1 lg:sticky lg:top-[88px] self-start w-full">
            <NewsCarousel />
          </aside>

          {/* CENTER COLUMN: flex column, gap 20px. Order 1 on mobile (<1100px) */}
          <section className="order-1 lg:order-2 flex flex-col gap-[20px] w-full min-w-0">
            {/* 1. Hero & 2. Input card & 3. Probabilistic note */}
            <HeroInput selectedToolMode={selectedToolMode} />

            {/* 4. "Explore tools": h3 then 2-column grid of 6 tool cards */}
            <ToolGrid onSelectTool={handleSelectTool} />

            {/* 5. "How it works" strip: card with 4 items in one row */}
            <HowItWorks />
          </section>

          {/* RIGHT COLUMN: flex column, gap 16px, three cards. Sticky on desktop */}
          <aside className="order-3 lg:order-3 lg:sticky lg:top-[88px] self-start flex flex-col gap-[16px] w-full">
            {/* 1. "Features" card */}
            <FeaturesCard />

            {/* 2. "How to use" card */}
            <UsageCard />

            {/* 3. "Live system status" card */}
            <LiveStatusCard />
          </aside>
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
