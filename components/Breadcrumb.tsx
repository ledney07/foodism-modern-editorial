import React from 'react';
import { ChevronRight } from 'lucide-react';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

const Breadcrumb = ({ items, className = '' }: BreadcrumbProps): React.ReactElement => {
  const handleClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (href === '#' || href === '') {
      window.location.hash = '';
    } else {
      window.location.hash = href;
    }
  };

  return (
    <nav className={`flex items-center space-x-3 text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-black ${className}`}>
      <div className="w-8 h-[1px] bg-[#f9b233]"></div>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-3 h-3 opacity-30" />}
          {item.href ? (
            <a
              href={item.href}
              onClick={(e) => handleClick(item.href!, e)}
              className="hover:text-[#f9b233] transition-colors cursor-pointer"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-black truncate max-w-[200px]">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;

