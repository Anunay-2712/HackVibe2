import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const FALLBACK_STORIES = [
  {
    id: 1,
    title: "Fact-checking coalitions establish shared hash database for synthetic political ads",
    source: "Poynter Institute",
    publishedAt: "Oct 2, 2026",
    country: "World",
    url: "https://www.poynter.org/fact-checking/2024/how-fact-checkers-are-using-technology-to-detect-ai-deepfakes/",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Indian CERT-In issues high-severity advisory on synthetic identity fraud via audio cloning",
    source: "Indian Express",
    publishedAt: "Oct 3, 2026",
    country: "India",
    url: "https://indianexpress.com/article/technology/tech-news-technology/cert-in-warns-users-against-ai-deepfake-scams-9245171/",
    image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Election Commission flags viral deepfake video targeting voting integrity in state polls",
    source: "The Hindu",
    publishedAt: "Oct 7, 2026",
    country: "India",
    url: "https://www.thehindu.com/news/national/election-commission-issues-directions-on-ai-misinformation-and-deepfakes/article68146747.ece",
    image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Global cybersecurity coalition uncovers coordinated AI voice cloning campaign against financial institutions",
    source: "Reuters",
    publishedAt: "Oct 6, 2026",
    country: "World",
    url: "https://www.reuters.com/technology/cybersecurity/deepfake-fraud-financial-sector-2024-03-12/",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Telugu film industry warns against unauthorized generative deepfakes of prominent actors",
    source: "Deccan Chronicle",
    publishedAt: "Oct 5, 2026",
    country: "India",
    url: "https://www.deccanchronicle.com/entertainment/tollywood/telugu-actors-warn-against-ai-deepfakes-891042",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "Tech summits debate binding watermarking protocols for commercial AI video synthesis models",
    source: "BBC Tech",
    publishedAt: "Oct 4, 2026",
    country: "World",
    url: "https://www.bbc.com/news/technology-67280385",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
  }
];

const NewsCarousel = () => {
  const { t } = useLanguage();
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

  const filterButtons = [
    { id: 'All', label: t('news.filterAll', 'All') },
    { id: 'India', label: t('news.filterIndia', 'India') },
    { id: 'World', label: t('news.filterWorld', 'World') },
  ];

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
          {t('news.title', 'Deepfake news worldwide')}
        </h3>
        <span className="text-[12px] text-[#475569] flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] inline-block animate-pulse"></span>
          {t('news.live', 'Live')}
        </span>
      </div>

      {/* Filter pills row */}
      <div className="flex items-center gap-[6px] mb-[12px]" role="tablist" aria-label="News region filters">
        {filterButtons.map(({ id, label }) => {
          const isActive = filter === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setFilter(id)}
              className={
                isActive
                  ? 'bg-[#4F46E5] text-white border border-[#4F46E5] font-medium text-[13px] py-[8px] px-[14px] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer'
                  : 'bg-white text-[#334155] border border-[#CBD5E1] font-medium text-[13px] py-[8px] px-[14px] rounded-full hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer'
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Story card */}
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
        {/* Image Area */}
        <a
          href={currentStory.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block aspect-video w-full bg-[#F1F5F9] relative overflow-hidden group cursor-pointer"
        >
          {currentStory.image && !imageErrors[currentStory.id || currentStory.title] ? (
            <img
              src={currentStory.image}
              alt={currentStory.title}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setImageErrors((prev) => ({ ...prev, [currentStory.id || currentStory.title]: true }))}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center text-[12px] text-[#1E293B] font-semibold p-4 text-center select-none"
              style={{
                background: 'linear-gradient(135deg, #C7D2FE 0%, #A5F3FC 100%)'
              }}
            >
              <span>{currentStory.source} {t('news.editorialCoverage', 'Editorial Coverage')}</span>
              <span className="text-[11px] text-[#4338CA] mt-1 font-mono">{t('news.clickViewArticle', 'Click to view article ↗')}</span>
            </div>
          )}
          {/* Publisher tag badge */}
          <div className="absolute top-2 left-2 px-2.5 py-1 rounded bg-black/70 backdrop-blur text-[10px] font-bold text-white uppercase tracking-wider shadow">
            {currentStory.source}
          </div>
        </a>

        {/* Body */}
        <div className="p-[14px]">
          <h4 className="font-bold text-[15px] leading-[1.35] text-[#0F172A] line-clamp-3 mb-[6px]">
            <a
              href={currentStory.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#4F46E5] transition-colors"
            >
              {currentStory.title}
            </a>
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
            {t('news.readSource', 'Read at source →')}
          </a>
        </div>
      </article>

      {/* Controls row */}
      <div className="flex items-center justify-between mt-[12px]">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous story"
          className="bg-white text-[#334155] border border-[#CBD5E1] font-medium text-[13px] py-[8px] px-[14px] rounded-full hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
        >
          ←
        </button>

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

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next story"
          className="bg-white text-[#334155] border border-[#CBD5E1] font-medium text-[13px] py-[8px] px-[14px] rounded-full hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
        >
          →
        </button>
      </div>

      {/* Footnote */}
      {isFallback && (
        <p className="text-[12px] text-[#475569] mt-[10px]">
          {t('news.fallbackNotice', 'Sample news shown. Live feed loads via the backend.')}
        </p>
      )}
    </section>
  );
};

export default NewsCarousel;
