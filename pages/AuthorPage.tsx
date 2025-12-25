import React from 'react';
import { getAllArticles, CONTENT } from '../constants';
import ArticleCard from '../components/ArticleCard';
import Breadcrumb from '../components/Breadcrumb';
import { Twitter, Instagram } from 'lucide-react';
import type { Author, Article } from '../types';

type AuthorPageProps = {
  authorSlug: string;
};

const AuthorPage = ({ authorSlug }: AuthorPageProps): React.ReactElement => {
  const authors = CONTENT.authors || [];
  const author = authors.find((a: Author) => a.slug === authorSlug);
  
  if (!author) {
    return (
      <div className="min-h-screen pt-24 md:pt-32 pb-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center py-20">
            <h1 className="font-serif text-4xl font-black mb-4">Author Not Found</h1>
            <p className="text-neutral-500">The author you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const authorArticles = getAllArticles().filter((article: Article) => 
    article.author.toLowerCase() === author.name.toLowerCase()
  );

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Breadcrumb */}
        <section className="mb-8 pt-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '#' },
              { label: author.name }
            ]}
          />
        </section>

        {/* Author Header */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row gap-12 items-start md:items-center border-b-2 border-neutral-200 pb-12 mb-12">
            {/* Author Image */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#f9b233]">
                <img
                  src={author.image}
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Author Info */}
            <div className="flex-1">
              <h1 className="font-serif text-4xl md:text-6xl font-black mb-3">
                {author.name}
              </h1>
              <p className="text-lg text-[#f9b233] font-black uppercase tracking-widest mb-6">
                {author.role}
              </p>
              <p className="text-lg text-neutral-600 font-light leading-relaxed max-w-3xl mb-8">
                {author.bio}
              </p>
              
              {/* Social Links */}
              {author.social && (
                <div className="flex items-center space-x-6">
                  {author.social.twitter && (
                    <a
                      href={`https://twitter.com/${author.social.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-neutral-600 hover:text-[#f9b233] transition-colors group"
                    >
                      <Twitter className="w-5 h-5" />
                      <span className="text-sm font-medium">{author.social.twitter}</span>
                    </a>
                  )}
                  {author.social.instagram && (
                    <a
                      href={`https://instagram.com/${author.social.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-neutral-600 hover:text-[#f9b233] transition-colors group"
                    >
                      <Instagram className="w-5 h-5" />
                      <span className="text-sm font-medium">{author.social.instagram}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Author Articles */}
        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-black mb-12">
            Articles by {author.name}
          </h2>
          
          {authorArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
              {authorArticles.map((article: Article) => (
                <div key={article.id} className="reveal">
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-xl text-neutral-400 font-light mb-4">
                No articles yet
              </p>
              <p className="text-neutral-500 font-light max-w-md mx-auto">
                Check back soon for articles by {author.name}.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AuthorPage;

