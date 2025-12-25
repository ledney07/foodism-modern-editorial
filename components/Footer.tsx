import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import Logo from './Logo';
import SocialLinks from './SocialLinks';
import { CONTENT } from '../constants';

const Footer = (): React.ReactElement => {
  const { site, footer } = CONTENT;
  
  return (
    <footer className="bg-[#111] text-white py-20 overflow-hidden border-t-8 border-[#f9b233]">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32 reveal">
          <div className="col-span-1 md:col-span-2">
            <h2 className="logo-text text-6xl font-black tracking-tighter mb-10 flex items-start group">
              <Logo className="h-8 md:h-10 w-auto" variant="white" />
            </h2>
            <p className="text-neutral-500 font-light text-xl max-w-sm leading-relaxed mb-12">
              {site.tagline}
            </p>
            <div className="flex items-center space-x-8">
              <a href="#" className="flex items-center space-x-3 hover:text-[#f9b233] transition-colors group">
                <Instagram className="w-6 h-6 cursor-pointer group-hover:text-[#f9b233] transition-colors" />
                <span className="text-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">Instagram</span>
              </a>
              <a href="#" className="flex items-center space-x-3 hover:text-[#f9b233] transition-colors group">
                <Twitter className="w-6 h-6 cursor-pointer group-hover:text-[#f9b233] transition-colors" />
                <span className="text-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">Twitter</span>
              </a>
              <a href="#" className="flex items-center space-x-3 hover:text-[#f9b233] transition-colors group">
                <Facebook className="w-6 h-6 cursor-pointer group-hover:text-[#f9b233] transition-colors" />
                <span className="text-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">Facebook</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#f9b233] mb-10">{footer.links.discover.title}</h3>
            <ul className="space-y-6 text-lg font-medium">
              {footer.links.discover.items.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:text-[#f9b233] transition-colors inline-block">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#f9b233] mb-10">{footer.links.company.title}</h3>
            <ul className="space-y-6 text-sm font-medium">
              {footer.links.company.items.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:text-[#f9b233] transition-colors inline-block">{item.label}</a>
                </li>
              ))}
              <li>
                <a 
                  href="#/admin" 
                  className="hover:text-[#f9b233] transition-colors inline-block"
                >
                  Admin Dashboard
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-12 text-[9px] uppercase tracking-[0.3em] font-black text-neutral-600 reveal">
          <p>{site.copyright}</p>
          <div className="flex space-x-12 mt-8 md:mt-0">
            {footer.links.legal.items.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-white transition-colors">{item.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

