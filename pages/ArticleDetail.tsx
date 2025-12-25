
import React, { useState, useEffect, useRef } from 'react';
import { Article } from '../types';
import { getAllArticles, CATEGORIES, getAuthorByName, getAuthorSlug } from '../constants';
import { getArticleAISummary } from '../geminiService';
import { Share2, Bookmark, Clock, MessageSquare, Sparkles, Heart, Twitter, Linkedin, Facebook } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import Comments from '../components/Comments';

interface ArticleDetailProps {
  id: string;
}

const ArticleDetail = ({ id }: ArticleDetailProps) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const commentsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const found = getAllArticles().find(a => a.id === id);
    if (found) {
      setArticle(found);
      window.scrollTo(0, 0);
      
      // Load like and bookmark state from localStorage
      const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
      const bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');
      const likeCounts = JSON.parse(localStorage.getItem('articleLikeCounts') || '{}');
      
      setIsLiked(likedArticles.includes(id));
      setIsBookmarked(bookmarkedArticles.includes(id));
      setLikeCount(likeCounts[id] || 0);
    }
  }, [id]);

  const handleFetchAISummary = async () => {
    if (!article || aiSummary) return;
    setIsLoadingSummary(true);
    const summary = await getArticleAISummary(article.content);
    setAiSummary(summary);
    setIsLoadingSummary(false);
  };

  useEffect(() => {
    // Close share menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  const getShareUrl = () => {
    return `${window.location.origin}${window.location.pathname}#/article/${id}`;
  };

  const handleShareClick = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleSocialShare = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    if (!article) return;
    
    const url = encodeURIComponent(getShareUrl());
    const title = encodeURIComponent(article.title || '');
    const text = encodeURIComponent(article.excerpt || '');

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}&via=foodismca`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setShowShareMenu(false);
      
      // Track share count
      const shareCounts = JSON.parse(localStorage.getItem('articleShareCounts') || '{}');
      shareCounts[article.id] = (shareCounts[article.id] || 0) + 1;
      localStorage.setItem('articleShareCounts', JSON.stringify(shareCounts));
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setShowShareMenu(false);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleScrollToComments = () => {
    if (commentsSectionRef.current) {
      commentsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLike = () => {
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
    const likeCounts = JSON.parse(localStorage.getItem('articleLikeCounts') || '{}');
    
    if (isLiked) {
      // Unlike
      const newLiked = likedArticles.filter((aid: string) => aid !== id);
      localStorage.setItem('likedArticles', JSON.stringify(newLiked));
      setIsLiked(false);
      setLikeCount((prev) => {
        const newCount = Math.max(0, prev - 1);
        likeCounts[id] = newCount;
        localStorage.setItem('articleLikeCounts', JSON.stringify(likeCounts));
        return newCount;
      });
    } else {
      // Like
      const newLiked = [...likedArticles, id];
      localStorage.setItem('likedArticles', JSON.stringify(newLiked));
      setIsLiked(true);
      setLikeCount((prev) => {
        const newCount = prev + 1;
        likeCounts[id] = newCount;
        localStorage.setItem('articleLikeCounts', JSON.stringify(likeCounts));
        return newCount;
      });
    }
  };

  const handleBookmark = () => {
    const bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');
    
    if (isBookmarked) {
      // Unbookmark
      const newBookmarked = bookmarkedArticles.filter((aid: string) => aid !== id);
      localStorage.setItem('bookmarkedArticles', JSON.stringify(newBookmarked));
      setIsBookmarked(false);
    } else {
      // Bookmark
      const newBookmarked = [...bookmarkedArticles, id];
      localStorage.setItem('bookmarkedArticles', JSON.stringify(newBookmarked));
      setIsBookmarked(true);
    }
  };

  if (!article) return <div className="h-screen flex items-center justify-center font-serif text-3xl font-black italic">Loading Story...</div>;

  return (
    <div className="bg-white">
      {/* Article Hero */}
      <section className="relative w-full bg-neutral-900 overflow-hidden min-h-[90vh] pt-24 md:pt-32">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover brightness-[0.7] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-10 md:p-24 reveal-hero">
          <div className="max-w-5xl mx-auto">
            <span className="inline-block bg-[#f9b233] text-black text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2.5 mb-8">
              {article.category}
            </span>
            <h1 className="font-serif text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-10">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-10 text-white/70 text-[11px] uppercase tracking-[0.2em] font-black">
              <div className="flex items-center space-x-3">
                <span className="w-10 h-[1px] bg-[#f9b233]"></span>
                <a
                  href={`#/author/${getAuthorSlug(article.author)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = `#/author/${getAuthorSlug(article.author)}`;
                  }}
                  className="flex items-center space-x-2 hover:text-white transition-colors cursor-pointer group/author"
                >
                  {(() => {
                    const author = getAuthorByName(article.author);
                    return author ? (
                      <>
                        <img
                          src={author.image}
                          alt={author.name}
                          className="w-6 h-6 rounded-full object-cover border border-white/30"
                        />
                        <span>By {article.author}</span>
                      </>
                    ) : (
                      <span>By {article.author}</span>
                    );
                  })()}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#f9b233]" />
                <span>{article.readTime}</span>
              </div>
              <span>{article.date}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body Content */}
      <main className="max-w-[1440px] mx-auto px-6 py-24 flex flex-col lg:flex-row gap-20 relative">
        
        {/* Left Toolbar (Sticky) */}
        <aside className="hidden lg:block w-20 sticky top-40 h-fit reveal">
          <div className="flex flex-col items-center space-y-12 text-neutral-300">
            <div className="relative" ref={shareMenuRef}>
              <button
                onClick={handleShareClick}
                className={`hover:text-[#f9b233] hover:scale-125 transition-all ${showShareMenu ? 'text-[#f9b233]' : ''}`}
                title="Share Story"
              >
                <Share2 className="w-6 h-6" />
              </button>
              
              {/* Share Menu */}
              {showShareMenu && (
                <div className="absolute left-12 top-0 bg-white border border-neutral-200 rounded-lg shadow-2xl p-3 min-w-[200px] z-[99999]" style={{ zIndex: 99999 }}>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleSocialShare('twitter')}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-neutral-50 rounded-lg transition-colors text-left group"
                    >
                      <Twitter className="w-5 h-5 text-neutral-700 group-hover:text-black" />
                      <span className="text-sm font-medium text-neutral-700 group-hover:text-black">Share on X</span>
                    </button>
                    <button
                      onClick={() => handleSocialShare('linkedin')}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-neutral-50 rounded-lg transition-colors text-left group"
                    >
                      <Linkedin className="w-5 h-5 text-neutral-700 group-hover:text-[#0077b5]" />
                      <span className="text-sm font-medium text-neutral-700 group-hover:text-black">Share on LinkedIn</span>
                    </button>
                    <button
                      onClick={() => handleSocialShare('facebook')}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-neutral-50 rounded-lg transition-colors text-left group"
                    >
                      <Facebook className="w-5 h-5 text-neutral-700 group-hover:text-[#1877f2]" />
                      <span className="text-sm font-medium text-neutral-700 group-hover:text-black">Share on Facebook</span>
                    </button>
                    <div className="border-t border-neutral-100 my-1"></div>
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-neutral-50 rounded-lg transition-colors text-left group"
                    >
                      <Share2 className="w-5 h-5 text-neutral-700 group-hover:text-[#f9b233]" />
                      <span className="text-sm font-medium text-neutral-700 group-hover:text-black">Copy Link</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleBookmark}
              className={`hover:scale-125 transition-all ${
                isBookmarked ? 'text-[#f9b233] fill-[#f9b233]' : 'hover:text-[#f9b233]'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
            >
              <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={handleLike}
                className={`hover:scale-125 transition-all ${
                  isLiked ? 'text-[#f9b233] fill-[#f9b233]' : 'hover:text-[#f9b233]'
                }`}
                title={isLiked ? 'Unlike Story' : 'Like Story'}
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              {likeCount > 0 && (
                <span className="text-xs font-black text-neutral-400">{likeCount}</span>
              )}
            </div>
            <div className="w-[1px] h-16 bg-neutral-100"></div>
            <button
              onClick={handleScrollToComments}
              className="flex flex-col items-center hover:text-[#f9b233] hover:scale-125 transition-all cursor-pointer"
              title="View Comments"
            >
              <MessageSquare className="w-6 h-6 text-neutral-300 hover:text-[#f9b233] transition-colors" />
            </button>
          </div>
        </aside>

        {/* Center Content */}
        <article className="flex-1 max-w-3xl mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-16 reveal">
            <Breadcrumb
              items={[
                { label: 'Home', href: '#' },
                { label: article.category, href: `#${CATEGORIES.find(c => c.name === article.category)?.slug || '#'}` },
                { label: article.title }
              ]}
            />
          </div>

          {/* AI Summary Box */}
          <div className="mb-16 p-10 bg-neutral-50 border-l-4 border-[#f9b233] relative overflow-hidden reveal">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4 text-neutral-900">
                <div className="p-2 bg-[#f9b233] rounded-sm">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em]">The AI Breakdown</h3>
              </div>
              {!aiSummary && !isLoadingSummary && (
                <button 
                  onClick={handleFetchAISummary}
                  className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-[#f9b233] hover:border-[#f9b233] transition-all"
                >
                  Get Quick Summary
                </button>
              )}
            </div>

            {isLoadingSummary && (
              <div className="flex flex-col space-y-4 animate-pulse">
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
              </div>
            )}

            {aiSummary && (
              <div className="text-lg text-neutral-700 font-light leading-relaxed whitespace-pre-line reveal">
                {aiSummary}
              </div>
            )}
            
            {!aiSummary && !isLoadingSummary && (
              <p className="text-sm text-neutral-500 font-light italic">
                Get an instant AI-powered editorial summary of this long-form feature.
              </p>
            )}
          </div>

          {/* Fixed Drop Cap content block */}
          <div className="prose prose-2xl max-w-none text-neutral-800 font-light leading-[1.8] space-y-12 reveal">
            <p className="article-drop-cap text-2xl font-normal leading-relaxed text-neutral-900 italic mb-16">
              {article.excerpt}
            </p>

            {article.content.split('\n\n').map((para, i) => {
              const delayClasses = ['delay-0', 'delay-100', 'delay-200', 'delay-300', 'delay-400'];
              return (
                <p key={i} className={`reveal ${delayClasses[i] || 'delay-0'}`}>{para}</p>
              );
            })}

            <blockquote className="my-20 bg-neutral-900 text-white p-12 lg:p-16 rounded-sm relative reveal">
              <div className="absolute top-0 left-12 w-1 h-20 bg-[#f9b233]"></div>
              <p className="font-serif text-3xl lg:text-5xl font-black italic leading-tight mb-8">
                "We wanted to create something that feels like a celebration. Every plate is a canvas, and every flavor a note in a symphony."
              </p>
              <cite className="text-xs uppercase tracking-[0.3em] font-black text-[#f9b233] not-italic">— Executive Chef Michael Chen</cite>
            </blockquote>

            <p className="reveal">
              The program extends beyond the kitchen. Curated by Lead Sommelier Sarah Kim, the sake list features rare small-batch brews that are almost impossible to find outside of Kyoto. For those preferring cocktails, the signature "Waterfront Spritz"—a yuzu and sparkling sake concoction—is the ultimate sunset companion.
            </p>

            {article.takeaways && (
              <div className="my-20 border-2 border-neutral-100 p-12 reveal">
                <h3 className="font-serif text-3xl font-black mb-8 border-b border-neutral-100 pb-4">Essentials</h3>
                <ul className="space-y-6">
                  {article.takeaways.map((take, i) => (
                    <li key={i} className="flex items-start space-x-6">
                      <div className="w-2 h-2 rounded-full bg-[#f9b233] mt-2.5"></div>
                      <span className="text-lg text-neutral-600 leading-relaxed font-light">{take}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-24 pt-16 border-t border-neutral-100 flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-8 reveal">
            {(() => {
              const author = getAuthorByName(article.author);
              return author ? (
                <>
                  <div className="w-24 h-24 rounded-full bg-neutral-100 overflow-hidden ring-4 ring-neutral-50 shrink-0">
                    <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#f9b233] mb-2 block">The Author</span>
                    <a
                      href={`#/author/${getAuthorSlug(article.author)}`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.hash = `#/author/${getAuthorSlug(article.author)}`;
                      }}
                      className="font-serif text-3xl font-black mb-4 hover:text-[#f9b233] transition-colors cursor-pointer block"
                    >
                      {article.author}
                    </a>
                    <p className="text-base text-neutral-500 font-light max-w-xl leading-relaxed mb-4">
                      {author.bio}
                    </p>
                    {author.role && (
                      <p className="text-sm text-[#f9b233] font-black uppercase tracking-widest">
                        {author.role}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-full bg-neutral-100 overflow-hidden ring-4 ring-neutral-50 shrink-0">
                    <img src={`https://picsum.photos/seed/${article.author}/400`} alt={article.author} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#f9b233] mb-2 block">The Author</span>
                    <p className="font-serif text-3xl font-black mb-4">{article.author}</p>
                    <p className="text-base text-neutral-500 font-light max-w-xl leading-relaxed">
                      Our contributing writer covering the latest in food and culture.
                    </p>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Comments Section */}
          <div ref={commentsSectionRef}>
            <Comments articleId={id} />
          </div>
        </article>

        {/* Right Sidebar (Newsletter/Related) */}
        <aside className="hidden xl:block w-96 reveal">
          <div className="sticky top-40">
            <h3 className="text-[11px] uppercase tracking-[0.3em] font-black text-neutral-400 mb-10 border-b border-neutral-50 pb-6 flex items-center">
              <span className="w-8 h-[1px] bg-[#f9b233] mr-4"></span>
              Recommended Stories
            </h3>
            <div className="space-y-16">
              {getAllArticles().filter(a => a.id !== id).slice(0, 3).map(related => (
                <div key={related.id} className="group cursor-pointer" onClick={() => window.location.hash = `#/article/${related.id}`}>
                  <div className="aspect-[16/10] overflow-hidden rounded-sm bg-neutral-100 mb-6">
                    <img 
                      src={related.image} 
                      alt={related.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <h4 className="font-serif text-xl font-black leading-tight group-hover:text-[#f9b233] transition-colors">{related.title}</h4>
                  <div className="flex items-center mt-3 text-[9px] uppercase tracking-widest text-neutral-400 font-bold">
                    <span>{related.category}</span>
                    <span className="mx-2 opacity-30">•</span>
                    <span>{related.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default ArticleDetail;
