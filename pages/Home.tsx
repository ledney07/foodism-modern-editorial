
import React from 'react';
import { getAllArticles, CONTENT } from '../constants';
import ArticleCard from '../components/ArticleCard';
import NewsletterBox from '../components/NewsletterBox';
import SplitFeatureSection from '../components/SplitFeatureSection';
import { ChevronDown, TrendingUp } from 'lucide-react';

const Home = () => {
  const articles = getAllArticles();
  const featured = articles[0];
  const trending = articles.filter(a => a.trending);
  const latest = articles.slice(1);

  return (
    <div className="min-h-screen">
      {/* Full-Bleed Hero */}
      <section className="relative flex items-center justify-center overflow-hidden min-h-screen pt-24 md:pt-32">
        <img 
          src={featured.image} 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.7] transition-transform duration-[20s] hover:scale-105" 
          alt="Hero" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 text-center text-white">
          <div className="reveal-hero">
            <span className="text-xs md:text-sm uppercase tracking-[0.4em] font-bold mb-6 block text-[#f9b233]">
              Featured Selection
            </span>
            <h1 className="font-serif text-5xl md:text-[7rem] font-black mb-10 leading-[0.95] tracking-tight">
              {featured.title}
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-2xl text-white/80 font-light mb-12">
              {featured.excerpt}
            </p>
            <button 
              onClick={() => window.location.hash = `#/article/${featured.id}`}
              className="group inline-flex items-center space-x-6 text-sm uppercase tracking-[0.2em] font-black border-b-2 border-[#f9b233] pb-3 hover:text-[#f9b233] transition-all"
            >
              <span>Explore Story</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <ChevronDown className="text-white w-8 h-8" />
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-[1440px] mx-auto px-6 py-32">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* Latest Feed (Left/Main) */}
          <div className="flex-[2.5]">
            <div className="flex items-center justify-between mb-16 border-b border-neutral-100 pb-10 reveal">
              <div>
                <h2 className="font-serif text-5xl font-black mb-2">{CONTENT.sections.theDigest.title}</h2>
                <p className="text-neutral-400 font-light italic">{CONTENT.sections.theDigest.description}</p>
              </div>
              <div className="hidden md:flex space-x-8 text-[11px] uppercase tracking-widest font-black text-neutral-400">
                <span className="text-black border-b-2 border-[#f9b233] cursor-pointer">Latest</span>
                <span className="hover:text-black cursor-pointer transition-colors">Popular</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {latest.map((article, idx) => {
                const delayClasses = ['delay-0', 'delay-100', 'delay-200', 'delay-300', 'delay-400'];
                return (
                  <div key={article.id} className={`reveal ${delayClasses[idx] || 'delay-0'}`}>
                    <ArticleCard article={article} />
                  </div>
                );
              })}
            </div>

            <div className="mt-20 text-center reveal">
              <button className="px-16 py-6 border-2 border-black text-[12px] uppercase tracking-[0.3em] font-black hover:bg-black hover:text-white transition-all hover:scale-105 active:scale-95">
                Discover More
              </button>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <aside className="flex-1">
            <div className="sticky top-32">
              {/* Trending Section */}
              <div className="mb-20 reveal">
                <div className="flex items-center space-x-3 mb-10">
                  <TrendingUp className="w-5 h-5 text-[#f9b233]" />
                  <h3 className="text-[12px] uppercase tracking-[0.2em] font-black text-neutral-900">Must Reads</h3>
                </div>
                <div className="space-y-4">
                  {trending.map(article => (
                    <ArticleCard key={article.id} article={article} variant="minimal" />
                  ))}
                </div>
              </div>

              {/* Newsletter Box */}
              <NewsletterBox variant="sidebar" />
            </div>
          </aside>
        </div>
      </main>

      <SplitFeatureSection
        title={CONTENT.sections.travelGuide.title.split('<br/>').map((line, i, arr) => (
          <React.Fragment key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </React.Fragment>
        ))}
        description={CONTENT.sections.travelGuide.description}
        badge={CONTENT.sections.travelGuide.badge}
        linkText={CONTENT.sections.travelGuide.linkText}
      />
    </div>
  );
};

export default Home;
