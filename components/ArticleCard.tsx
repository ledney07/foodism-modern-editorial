
import React from 'react';
import { Article } from '../types';
import { ArrowRight } from 'lucide-react';
import { getAuthorByName, getAuthorSlug } from '../constants';

type ArticleCardProps = {
  readonly article: Article;
  variant?: 'featured' | 'standard' | 'minimal';
};

const ArticleCard = React.memo(({ article, variant = 'standard' }: ArticleCardProps): React.ReactElement => {
  const handleClick = () => {
    window.location.hash = `#/article/${article.id}`;
  };

  if (variant === 'minimal') {
    return (
      <div 
        onClick={handleClick}
        className="group cursor-pointer py-6 border-b border-neutral-100 last:border-0"
      >
        <span className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2 block font-black group-hover:text-[#f9b233] transition-colors">{article.category}</span>
        <h3 className="font-serif text-xl font-bold group-hover:text-neutral-600 transition-colors leading-tight">
          {article.title}
        </h3>
        <div className="flex items-center mt-3 text-[11px] text-neutral-400 font-medium">
          <span>{article.date}</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleClick}
      className={`group cursor-pointer mb-12 flex flex-col`}
    >
      <div className="overflow-hidden rounded-sm aspect-[4/5] bg-neutral-100 relative">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        
        {/* Category badge */}
        <div className="absolute top-6 left-6 z-10">
          <span className="bg-[#f9b233] text-black text-[9px] uppercase tracking-[0.2em] px-4 py-2 font-black shadow-lg">
            {article.category}
          </span>
        </div>
        
        {/* Text content overlaid on image */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-black mb-3 leading-[1.1] text-white group-hover:text-[#f9b233] transition-colors duration-300">
            {article.title}
          </h2>
          <p className="text-white/90 text-sm md:text-base mb-4 line-clamp-2 font-light leading-relaxed">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            <div className="flex items-center text-[10px] text-white/80 font-black uppercase tracking-widest">
              <a
                href={`#/author/${getAuthorSlug(article.author)}`}
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.hash = `#/author/${getAuthorSlug(article.author)}`;
                }}
                className="flex items-center space-x-2 hover:text-[#f9b233] transition-colors group/author"
              >
                {(() => {
                  const author = getAuthorByName(article.author);
                  return author ? (
                    <>
                      <img
                        src={author.image}
                        alt={author.name}
                        className="w-5 h-5 rounded-full object-cover border border-white/30"
                      />
                      <span className="text-white group-hover/author:text-[#f9b233]">{article.author}</span>
                    </>
                  ) : (
                    <span className="text-white group-hover/author:text-[#f9b233]">{article.author}</span>
                  );
                })()}
              </a>
              <span className="mx-3 opacity-50">/</span>
              <span>{article.readTime}</span>
            </div>
            <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-[#f9b233] group-hover:border-[#f9b233] transition-all">
              <ArrowRight className="w-4 h-4 text-white group-hover:text-black transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ArticleCard.displayName = 'ArticleCard';

export default ArticleCard;
