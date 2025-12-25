import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';

type SocialLinksProps = {
  variant?: 'horizontal' | 'vertical' | 'icons';
  className?: string;
};

const SocialLinks = ({ variant = 'horizontal', className = '' }: SocialLinksProps): React.ReactElement => {
  if (variant === 'icons') {
    return (
      <div className={`flex space-x-6 ${className}`}>
        <a href="#" className="w-12 h-12 rounded-full border-2 border-neutral-200 flex items-center justify-center hover:border-[#f9b233] hover:text-[#f9b233] transition-colors" aria-label="Follow us on Instagram">
          <Instagram className="w-5 h-5" />
        </a>
        <a href="#" className="w-12 h-12 rounded-full border-2 border-neutral-200 flex items-center justify-center hover:border-[#f9b233] hover:text-[#f9b233] transition-colors" aria-label="Follow us on Twitter">
          <Twitter className="w-5 h-5" />
        </a>
        <a href="#" className="w-12 h-12 rounded-full border-2 border-neutral-200 flex items-center justify-center hover:border-[#f9b233] hover:text-[#f9b233] transition-colors" aria-label="Follow us on Facebook">
          <Facebook className="w-5 h-5" />
        </a>
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col space-y-8 ${className}`}>
        <Instagram className="w-6 h-6 cursor-pointer hover:text-[#f9b233] transition-colors" />
        <Twitter className="w-6 h-6 cursor-pointer hover:text-[#f9b233] transition-colors" />
        <Facebook className="w-6 h-6 cursor-pointer hover:text-[#f9b233] transition-colors" />
      </div>
    );
  }

  return (
    <div className={`flex space-x-8 ${className}`}>
      <a href="#" className="hover:text-[#f9b233] transition-all transform hover:-translate-y-1">Instagram</a>
      <a href="#" className="hover:text-[#f9b233] transition-all transform hover:-translate-y-1">Twitter</a>
      <a href="#" className="hover:text-[#f9b233] transition-all transform hover:-translate-y-1">Facebook</a>
    </div>
  );
};

export default SocialLinks;

