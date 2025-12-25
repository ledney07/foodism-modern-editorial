
import React from 'react';
import { getAllArticles, CATEGORIES, CONTENT } from '../constants';
import ArticleCard from '../components/ArticleCard';
import NewsletterBox from '../components/NewsletterBox';
import PopularArticlesCarousel from '../components/PopularArticlesCarousel';
import { Play, ChevronRight, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const articles = getAllArticles();
  const trending = articles.slice(0, 3);
  const iconAwards = articles.filter(a => a.category === 'Culture' || a.category === 'Eat & Drink');

  return (
    <div className="bg-[#fcfcfc] min-h-screen pt-24 md:pt-32 pb-20">
      <div className="max-w-[1440px] mx-auto px-6">
        
        {/* Trending Section - Apex High-End Grid */}
        <section className="mb-32">
          <div className="flex items-end justify-between mb-8 reveal-hero">
            <div className="flex items-center space-x-6">
              <div className="p-3 bg-black rounded-full">
                <TrendingUp className="w-6 h-6 text-[#f9b233]" />
              </div>
              <div>
                <h2 className="text-5xl font-black font-serif tracking-tighter">{CONTENT.sections.mustReads.title}</h2>
                <div className="hidden md:flex space-x-6 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 mt-2">
                  <a href="#icon-awards" className="hover-yellow transition-colors">ICON Awards 2025</a>
                  <span className="opacity-20">•</span>
                  <a href="#eat-drink" className="hover-yellow transition-colors">Top 10 Openings</a>
                  <span className="opacity-20">•</span>
                  <a href="#travel" className="hover-yellow transition-colors">Niagara Guide</a>
                </div>
              </div>
            </div>
            <a href="#magazine" className="text-xs font-black uppercase tracking-widest flex items-center group hover-yellow border-b-2 border-transparent hover:border-[#f9b233] pb-1 transition-all">
              See the latest Issue <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:items-stretch">
            {/* Main Featured Trending Item */}
            <div className="lg:col-span-8 reveal-hero group cursor-pointer flex flex-col" onClick={() => window.location.hash = `#/article/${trending[0].id}`}>
              <div className="relative aspect-[16/9] lg:h-full rounded-3xl overflow-hidden mb-8 lg:mb-0 shadow-2xl">
                <img src={trending[0].image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="bg-[#f9b233] text-black px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                    {trending[0].category}
                  </span>
                  <h3 className="text-white text-4xl md:text-5xl font-black font-serif leading-none tracking-tight group-hover:text-[#f9b233] transition-colors">
                    {trending[0].title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Sidebar Trending List */}
            <div className="lg:col-span-4 flex flex-col gap-8 lg:gap-0">
               <div className="reveal delay-100 group cursor-pointer lg:mb-8" onClick={() => window.location.hash = `#/article/${trending[1].id}`}>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-xl">
                    <img src={trending[1].image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-[#f9b233] rounded-full flex items-center justify-center">
                        <Play className="w-5 h-5 text-black fill-black ml-1" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-2xl font-black font-serif group-hover:text-[#f9b233] transition-colors leading-tight">
                    {trending[1].title}
                  </h4>
               </div>

               <div className="reveal reveal-hero-desktop delay-200 bg-[#111] text-white rounded-3xl p-10 flex flex-col justify-center items-center text-center shadow-xl group hover:bg-[#f9b233] transition-all duration-500 cursor-pointer" onClick={() => window.location.hash = '#icon-awards'}>
                  <Sparkles className="w-10 h-10 mb-8 text-[#f9b233] group-hover:text-black transition-colors" />
                  <h3 className="text-3xl font-black font-serif leading-[1.1] mb-6 group-hover:text-black transition-colors">
                    {CONTENT.sections.iconAwards.title}
                  </h3>
                  <button className="text-[10px] uppercase tracking-widest font-black group-hover:text-black underline underline-offset-8">{CONTENT.sections.iconAwards.buttonText}</button>
               </div>
            </div>
          </div>
        </section>

        {/* Mid-Page Feature Section */}
        <section className="mb-32">
          <div className="flex items-center space-x-6 mb-12 reveal">
             <div className="w-12 h-[2px] bg-neutral-200"></div>
             <h2 className="text-2xl font-black font-serif italic">{CONTENT.sections.foodismSelects.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {articles.slice(1, 5).map((article, idx) => {
              const delayClasses = ['delay-0', 'delay-100', 'delay-200', 'delay-300'];
              return (
                <div key={article.id} className={`reveal group cursor-pointer ${delayClasses[idx] || 'delay-0'}`} onClick={() => window.location.hash = `#/article/${article.id}`}>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 shadow-lg">
                  <img src={article.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <span className="text-white/80 text-[8px] uppercase tracking-[0.3em] font-black">{article.category}</span>
                  </div>
                </div>
                <h4 className="text-xl font-black font-serif leading-tight group-hover:text-[#f9b233] transition-colors">
                  {article.title}
                </h4>
                </div>
              );
            })}
          </div>
        </section>

        {/* Most Popular Articles Carousel */}
        <section className="mb-32">
          <PopularArticlesCarousel articles={articles.slice(0, 8)} />
        </section>

        {/* Bottom CTA Block */}
        <NewsletterBox variant="full" />

      </div>
    </div>
  );
};

export default LandingPage;
