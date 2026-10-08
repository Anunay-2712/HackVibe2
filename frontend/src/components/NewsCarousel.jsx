import React, { useState, useEffect, useRef } from 'react';

const FALLBACK_STORIES = [
  {
    id: 1,
    title: "Election Commission flags viral deepfake video targeting voting integrity in state polls",
    source: "The Hindu",
    publishedAt: "Oct 7, 2026",
    country: "India",
    url: "https://www.thehindu.com",
    image: null
  },
  {
    id: 2,
    title: "Global cybersecurity coalition uncovers coordinated AI voice cloning campaign against financial institutions",
    source: "Reuters",
    publishedAt: "Oct 6, 2026",
    country: "World",
    url: "https://www.reuters.com",
    image: null
  },
  {
    id: 3,
    title: "Telugu film industry warns against unauthorized generative deepfakes of prominent actors",
    source: "Deccan Chronicle",
    publishedAt: "Oct 5, 2026",
    country: "India",
    url: "https://www.deccanchronicle.com",
    image: null
  },
  {
    id: 4,
    title: "Tech summits debate binding watermarking protocols for commercial AI video synthesis models",
    source: "BBC Tech",
    publishedAt: "Oct 4, 2026",
    country: "World",
    url: "https://www.bbc.com/news/technology",
    image: null
  }
];

const NewsCarousel = () => {
  const [filter, setFilter] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stories, setStories] = useState(FALLBACK_STORIES);
  const [isFallback, setIsFallback] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const touchStartX = useRef(null);

  // Fetch from backend /api/news with fallback
  useEffect(() => {
    let isMounted = true;
    fetch('/api/news')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && Array.isArray(data.articles) && data.articles.length > 0) {
          setStories(data.articles);
          setIsFallback(Boolean(data.isFallback));
        }
      })
      .catch(() => {
        // Fallback remains active
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredStories = stories.filter((story) => {
    if (filter === 'All') return true;
    if (filter === 'India') return story.country?.toLowerCase() === 'india' || story.country?.toLowerCase() === 'in';
    if (filter === 'World') return story.country?.toLowerCase() !== 'india' && story.country?.toLowerCase() !== 'in';
    return true;
  });

  const activeStories = filteredStories.length > 0 ? filteredStories : stories;

  // Keep index within bounds when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [filter]);

  // Autoplay every 6s, pauses on hover/focus, respects prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches || isPaused || activeStories.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeStories.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, activeStories.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeStories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeStories.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  const currentStory = activeStories[currentIndex] || activeStories[0] || FALLBACK_STORIES[0];

  return (
    <section
      id="news"
      aria-label="Deepfake news worldwide"
      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] p-[18px] shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Card Header Row */}
      <div className="flex items-center justify-between mb-[12px]">
        <h3 className="text-[15px] font-bold text-[#0F172A] m-0">
          Deepfake news worldwide
        </h3>
        <span className="text-[12px] text-[#475569] flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] inline-block animate-pulse"></span>
          Live
        </span>
      </div>

      {/* Filter pills row (gap 6px) */}
      <div className="flex items-center gap-[6px] mb-[12px]" role="tablist" aria-label="News region filters">
        {['All', 'India', 'World'].map((category) => {
          const isActive = filter === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setFilter(category)}
              className={
                isActive
                  ? 'bg-[#4F46E5] text-white border border-[#4F46E5] font-medium text-[13px] py-[8px] px-[14px] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer'
                  : 'bg-white text-[#334155] border border-[#CBD5E1] font-medium text-[13px] py-[8px] px-[14px] rounded-full hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer'
              }
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Story card (white bg, 1px #E2E8F0 border, radius 12px, overflow hidden) */}
      <article
        className="bg-white border border-[#E2E8F0] rounded-[12px] overflow-hidden"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const touchEndX = e.changedTouches[0].clientX;
          const diff = touchStartX.current - touchEndX;
          if (diff > 40) handleNext();
          if (diff < -40) handlePrev();
          touchStartX.current = null;
        }}
      >
        {/* Image Area: aspect-ratio 16/9, object-cover */}
        <div className="aspect-video w-full bg-[#F1F5F9] relative overflow-hidden flex items-center justify-center">
          {currentStory.image && !imageErrors[currentStory.id || currentStory.title] ? (
            <img
              src={currentStory.image}
              alt={currentStory.title}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setImageErrors((prev) => ({ ...prev, [currentStory.id || currentStory.title]: true }))}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-[12px] text-[#334155] font-medium p-4 text-center select-none"
              style={{
                background: 'linear-gradient(135deg, #C7D2FE 0%, #A5F3FC 100%)'
              }}
            >
              Article image from publisher
            </div>
          )}
        </div>

        {/* Body padding 14px */}
        <div className="p-[14px]">
          <h4 className="font-bold text-[15px] leading-[1.35] text-[#0F172A] line-clamp-3 mb-[6px]">
            {currentStory.title}
          </h4>
          <p className="text-[12px] text-[#475569] mb-[10px]">
            {currentStory.source || 'News Wire'} · {currentStory.publishedAt || 'Recent'} · {currentStory.country || 'Global'}
          </p>
          <a
            href={currentStory.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[13px] text-[#4F46E5] hover:underline inline-flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] rounded"
          >
            Read at source →
          </a>
        </div>
      </article>

      {/* Controls row: space-between, margin-top 12px */}
      <div className="flex items-center justify-between mt-[12px]">
        {/* Left pill button "←" */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous story"
          className="bg-white text-[#334155] border border-[#CBD5E1] font-medium text-[13px] py-[8px] px-[14px] rounded-full hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
        >
          ←
        </button>

        {/* Center pagination dots */}
        <div className="flex items-center gap-[6px]" aria-label="Pagination dots">
          {activeStories.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to story ${idx + 1}`}
              className={
                currentIndex === idx
                  ? 'w-[18px] h-[6px] bg-[#4F46E5] rounded-full transition-all'
                  : 'w-[6px] h-[6px] bg-[#CBD5E1] rounded-full transition-all hover:bg-[#94A3B8]'
              }
            />
          ))}
        </div>

        {/* Right pill button "→" */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next story"
          className="bg-white text-[#334155] border border-[#CBD5E1] font-medium text-[13px] py-[8px] px-[14px] rounded-full hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
        >
          →
        </button>
      </div>

      {/* Footnote, muted 12px, margin-top 10px */}
      {isFallback && (
        <p className="text-[12px] text-[#475569] mt-[10px]">
          Sample news shown. Live feed loads via the backend.
        </p>
      )}
    </section>
  );
};

export default NewsCarousel;
