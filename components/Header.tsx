
import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, ArrowRight } from 'lucide-react';
import { CATEGORIES, getAllArticles } from '../constants';
import { Article, Category } from '../types';
import Logo from './Logo';
import SocialLinks from './SocialLinks';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ articles: Article[], categories: Category[] }>({ articles: [], categories: [] });
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen || isSearchOpen || isJoinOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      // Delay restoring scroll to allow animation to complete
      setTimeout(() => {
        document.body.style.overflow = 'unset';
      }, 700);
    }
    if (isSearchOpen) {
      // Delay focus to allow animation to start
      setTimeout(() => searchInputRef.current?.focus(), 200);
    }
  }, [isMenuOpen, isSearchOpen, isJoinOpen]);

      useEffect(() => {
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery.length > 0) {
          const lowerQuery = trimmedQuery.toLowerCase();
          const matchedArticles = getAllArticles().filter(a => {
        const titleMatch = a.title.toLowerCase().includes(lowerQuery);
        const excerptMatch = a.excerpt.toLowerCase().includes(lowerQuery);
        const categoryMatch = a.category.toLowerCase().includes(lowerQuery);
        const authorMatch = a.author.toLowerCase().includes(lowerQuery);
        const tagsMatch = a.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) || false;
        return titleMatch || excerptMatch || categoryMatch || authorMatch || tagsMatch;
      });
      const matchedCategories = CATEGORIES.filter(c => 
        c.name.toLowerCase().includes(lowerQuery)
      );
      setSearchResults({ articles: matchedArticles, categories: matchedCategories });
    } else {
      setSearchResults({ articles: [], categories: [] });
    }
  }, [searchQuery]);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm border-b border-neutral-100' 
            : 'bg-white py-6 md:py-8 border-b border-neutral-50'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Logo on the left */}
            <div className="flex-none group">
              <Logo className="h-8 md:h-10 w-auto" variant="black" />
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsJoinOpen(true)}
                className="bg-[#f9b233] text-black px-6 h-10 flex items-center justify-center text-sm font-black uppercase tracking-widest hover:bg-[#e5a022] transition-colors"
                aria-label="Join our community"
              >
                Join Us
              </button>
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="group p-1 flex items-center space-x-2 h-10 justify-center"
                aria-label="Open Search"
              >
                <Search className={`w-6 h-6 cursor-pointer hover:text-[#f9b233] transition-colors text-black`} />
              </button>
              <button 
                onClick={() => setIsMenuOpen(true)}
                className={`flex items-center space-x-2 group p-1 h-10 justify-center`}
                aria-label="Open Menu"
              >
                <Menu className={`w-6 h-6 transition-colors group-hover:text-[#f9b233] text-black`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <div 
        className={`fixed inset-0 z-[80] bg-white transition-all duration-700 ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
          isSearchOpen 
            ? 'opacity-100 translate-y-0 visible' 
            : 'opacity-0 -translate-y-full pointer-events-none invisible'
        }`}
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-12">
          <div className="flex items-center justify-between border-b-2 border-neutral-100 pb-6 mb-12">
            <input 
              ref={searchInputRef}
              type="text"
              placeholder="Search articles, guides, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-3xl md:text-5xl font-serif font-black focus:outline-none placeholder:text-neutral-200 px-4 py-2"
            />
            <button 
              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
              className="p-3 hover:bg-[#f9b233] rounded-full transition-colors group"
              aria-label="Close search"
            >
              <X className="w-8 h-8 text-neutral-400 group-hover:text-black transition-colors" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Search Category Results */}
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.5em] font-black text-[#f9b233] mb-8">Categories</h3>
              <div className="flex flex-wrap gap-3">
                {searchResults.categories.length > 0 ? (
                  searchResults.categories.map(cat => (
                    <a 
                      key={cat.slug}
                      href={`#${cat.slug}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="px-6 py-3 bg-neutral-50 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#f9b233] transition-colors"
                    >
                      {cat.name}
                    </a>
                  ))
                ) : (
                  searchQuery.trim().length > 0 ? <p className="text-neutral-400 text-sm">No categories found.</p> : <p className="text-neutral-400 text-sm italic font-light">Start typing to search...</p>
                )}
              </div>
            </div>

            {/* Search Article Results */}
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.5em] font-black text-[#f9b233] mb-8">Articles</h3>
              <div className="space-y-8">
                {searchResults.articles.length > 0 ? (
                  searchResults.articles.map(article => (
                    <a
                      key={article.id}
                      href={`#/article/${article.id}`}
                      onClick={(e) => { 
                        e.preventDefault();
                        window.location.hash = `#/article/${article.id}`;
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="group flex items-start space-x-6 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <div className="w-20 h-20 bg-neutral-100 rounded-sm overflow-hidden flex-shrink-0">
                        <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg font-black leading-tight group-hover:text-[#f9b233] transition-colors">{article.title}</h4>
                        <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold mt-2 inline-block">{article.category}</span>
                      </div>
                    </a>
                  ))
                ) : (
                   searchQuery.trim().length > 0 && <p className="text-neutral-400 text-sm">No articles found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Our Community Overlay */}
      <div 
        className={`fixed inset-0 z-[75] bg-white transition-all duration-700 ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
          isJoinOpen 
            ? 'opacity-100 translate-y-0 visible' 
            : 'opacity-0 -translate-y-full pointer-events-none invisible'
        }`}
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="max-w-3xl mx-auto px-6 pt-24 pb-12">
          <div className="flex items-center justify-between border-b-2 border-neutral-100 pb-6 mb-12">
            <h2 className="text-3xl md:text-5xl font-serif font-black">Join Our Community</h2>
            <button 
              onClick={() => setIsJoinOpen(false)}
              className="p-3 hover:bg-[#f9b233] rounded-full transition-colors group"
              aria-label="Close join community"
            >
              <X className="w-8 h-8 text-neutral-400 group-hover:text-black transition-colors" />
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-lg text-neutral-600 font-light leading-relaxed mb-8">
                Get the best of Toronto's food scene delivered to your inbox every Thursday. Join over 40,000 food enthusiasts.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="join-email" className="block text-sm font-black uppercase tracking-widest text-neutral-900 mb-3">
                  Email Address
                </label>
                <input 
                  id="join-email"
                  type="email" 
                  placeholder="your@email.com"
                  className="w-full border-b-2 border-neutral-200 px-4 py-4 text-lg focus:outline-none focus:border-[#f9b233] transition-colors bg-transparent"
                />
              </div>

              <button className="w-full bg-[#f9b233] text-black px-8 py-5 text-sm font-black uppercase tracking-widest hover:bg-[#e5a022] transition-colors">
                Subscribe
              </button>

              <p className="text-xs text-neutral-400 text-center">
                By subscribing, you agree to our privacy policy. No spam, unsubscribe anytime.
              </p>
            </div>

            <div className="pt-12 border-t border-neutral-100">
              <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 mb-6">Follow Us</h3>
              <SocialLinks variant="icons" />
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen High-End Mobile Menu */}
      <div 
        className={`fixed inset-0 z-[70] bg-[#111] transition-all duration-700 ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
          isMenuOpen 
            ? 'translate-y-0 opacity-100 visible' 
            : '-translate-y-full pointer-events-none opacity-0 invisible'
        }`}
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="absolute top-8 right-8 flex items-center space-x-6 z-[80]">
           <button 
             onClick={() => setIsMenuOpen(false)} 
             className="text-white flex items-center space-x-4 group uppercase tracking-widest text-xs font-bold"
           >
             <span className="group-hover:text-[#f9b233] transition-colors">Close</span>
             <div className="p-3 bg-white/10 rounded-full group-hover:bg-[#f9b233] transition-colors">
               <X className="w-6 h-6 text-white group-hover:text-black" />
             </div>
           </button>
        </div>
        
        <div className="h-full w-full flex items-center justify-center overflow-hidden">
          <div className="p-12 lg:p-24 flex flex-col justify-center overflow-y-auto">
             <div className="max-w-4xl mx-auto text-center lg:text-left">
               <span className="text-[#f9b233] text-[10px] uppercase tracking-[0.5em] font-black mb-12 block">Navigation</span>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 lg:gap-y-12 gap-x-12 lg:gap-x-20">
                 {CATEGORIES.map((cat, idx) => {
                   const delayClasses = ['delay-0', 'delay-40', 'delay-80', 'delay-100', 'delay-200', 'delay-300', 'delay-400'];
                   return (
                   <a 
                     key={cat.slug}
                     href={`#${cat.slug}`}
                     onClick={() => setIsMenuOpen(false)}
                     className={`font-serif text-3xl lg:text-5xl font-black text-white hover:text-[#f9b233] transition-all flex items-baseline group mb-4 ${delayClasses[idx] || 'delay-0'}`}
                   >
                     <span className="mr-6 text-sm font-sans text-white/20 group-hover:text-[#f9b233] flex-shrink-0">0{idx + 1}</span>
                     <span className="leading-tight">{cat.name}</span>
                   </a>
                   );
                 })}
               </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
