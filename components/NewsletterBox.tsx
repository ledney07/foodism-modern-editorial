import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { CONTENT } from '../constants';

type NewsletterBoxProps = {
  variant?: 'sidebar' | 'full';
  className?: string;
};

const NewsletterBox = ({ variant = 'sidebar', className = '' }: NewsletterBoxProps): React.ReactElement => {
  const newsletter = CONTENT.sections.newsletter;
  
  if (variant === 'full') {
    return (
      <div className={`bg-[#f9b233] rounded-3xl py-20 px-10 md:px-20 overflow-hidden relative flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-10 reveal ${className}`}>
        <div className="relative z-10">
          <h2 className="font-serif text-5xl md:text-6xl font-black leading-tight mb-6">
            {newsletter.fullTitle?.split('<br/>').map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <p className="text-black/60 text-lg font-medium max-w-lg mb-0 leading-relaxed">
            {newsletter.fullDescription}
          </p>
        </div>
        <div className="relative z-10 flex flex-col gap-4">
          <button
            onClick={() => (window.location.hash = '#/premium')}
            className="bg-black text-white px-12 py-5 rounded-full text-[12px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl flex items-center justify-center group"
          >
            {newsletter.fullButtonText} <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
          </button>
          {newsletter.pricing && <span className="text-[10px] text-center font-bold opacity-40 uppercase tracking-widest">{newsletter.pricing}</span>}
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </div>
    );
  }

  return (
    <div className={`bg-[#f9b233] p-12 rounded-sm text-black reveal ${className}`}>
      <Sparkles className="w-8 h-8 mb-6" />
      <h4 className="font-serif text-3xl font-black mb-6">{newsletter.title}</h4>
      <p className="text-sm font-medium mb-10 leading-relaxed opacity-80">
        {newsletter.description}
      </p>
      <div className="relative">
        <input 
          type="email" 
          placeholder="Email Address" 
          className="w-full bg-white/20 border-b-2 border-black/30 placeholder:text-black/50 px-4 py-4 text-sm mb-6 focus:outline-none focus:border-black transition-all bg-transparent"
        />
        <button className="w-full bg-black text-white text-[11px] uppercase tracking-widest font-black py-5 hover:bg-neutral-800 transition-colors shadow-xl">
          {newsletter.buttonText}
        </button>
      </div>
    </div>
  );
};

export default NewsletterBox;

