import React from 'react';

type SplitFeatureSectionProps = {
  readonly title: string | React.ReactNode;
  readonly description: string;
  badge?: string;
  linkText?: string;
  linkHref?: string;
  image1?: string;
  image1Alt?: string;
  image2?: string;
  image2Alt?: string;
  className?: string;
};

const SplitFeatureSection = ({
  badge = 'The Great Escape',
  title,
  description,
  linkText = 'Read Travel Guide',
  linkHref = '#',
  image1 = 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=800',
  image1Alt = 'Niagara Valley',
  image2 = 'https://images.unsplash.com/photo-1723492816139-05d24edd702a?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  image2Alt = 'Wine Country',
  className = '',
}: SplitFeatureSectionProps): React.ReactElement => {
  return (
    <section className={`bg-neutral-900 py-40 text-white relative overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f9b233]/5 blur-[120px]"></div>
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="reveal">
            <span className="text-[#f9b233] text-[11px] uppercase tracking-[0.4em] mb-6 block font-bold">{badge}</span>
            <h2 className="font-serif text-6xl md:text-8xl font-black mb-10 leading-tight">{title}</h2>
            <p className="text-xl text-white/50 font-light max-w-lg mb-12 leading-relaxed">
              {description}
            </p>
            <a href={linkHref} className="inline-block text-sm uppercase tracking-widest font-black border-b-2 border-[#f9b233] pb-2 hover:text-[#f9b233] transition-all">
              {linkText}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-6 reveal delay-200">
            <div className="aspect-[3/5] rounded-sm overflow-hidden translate-y-12">
              <img src={image1} alt={image1Alt} className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
            </div>
            <div className="aspect-[3/5] rounded-sm overflow-hidden">
              <img src={image2} alt={image2Alt} className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SplitFeatureSection;

