import React, { useRef, useState, useEffect } from 'react';
import { Article } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PopularArticlesCarouselProps = {
  articles: Article[];
  className?: string;
};

const PopularArticlesCarousel = ({ articles, className = '' }: PopularArticlesCarouselProps): React.ReactElement => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition();

    // Auto-scroll functionality
    let scrollInterval: number | null = null;
    if (autoScroll) {
      scrollInterval = window.setInterval(() => {
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          // Reset to start
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 400, behavior: 'smooth' });
        }
      }, 3000);
    }

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [autoScroll]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = 400;
    const newPosition =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setAutoScroll(false); // Stop auto-scroll when user manually scrolls
    setTimeout(() => setAutoScroll(true), 10000); // Resume after 10 seconds
  };

  return (
    <section className={`relative ${className}`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-12 h-[2px] bg-[#f9b233]"></div>
          <h2 className="text-3xl md:text-4xl font-black font-serif">Most Popular</h2>
        </div>
        
        {/* Navigation Arrows */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => scroll('left')}
            disabled={!showLeftArrow}
            className={`p-3 rounded-full border-2 transition-all ${
              showLeftArrow
                ? 'border-[#f9b233] text-[#f9b233] hover:bg-[#f9b233] hover:text-black'
                : 'border-neutral-200 text-neutral-300 cursor-not-allowed'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!showRightArrow}
            className={`p-3 rounded-full border-2 transition-all ${
              showRightArrow
                ? 'border-[#f9b233] text-[#f9b233] hover:bg-[#f9b233] hover:text-black'
                : 'border-neutral-200 text-neutral-300 cursor-not-allowed'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onMouseEnter={() => setAutoScroll(false)}
        onMouseLeave={() => setAutoScroll(true)}
      >
        {articles.map((article) => (
          <div
            key={article.id}
            onClick={() => (window.location.hash = `#/article/${article.id}`)}
            className="group cursor-pointer flex-shrink-0 w-[320px] md:w-[400px] reveal"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 shadow-lg">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-[#f9b233] text-black px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                  {article.category}
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white text-xl md:text-2xl font-black font-serif leading-tight group-hover:text-[#f9b233] transition-colors mb-2">
                  {article.title}
                </h3>
                <div className="flex items-center text-[9px] text-white/80 font-medium uppercase tracking-widest">
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularArticlesCarousel;

