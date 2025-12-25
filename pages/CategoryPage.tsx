import React from 'react';
import { CATEGORIES, getAllArticles, getAuthorByName, getAuthorSlug } from '../constants';
import Breadcrumb from '../components/Breadcrumb';

type CategoryPageProps = {
  categorySlug: string;
};

const CategoryPage = ({ categorySlug }: CategoryPageProps): React.ReactElement => {
  const category = CATEGORIES.find(cat => cat.slug === categorySlug);
  const categoryArticles = getAllArticles().filter(article => 
    article.category.toLowerCase() === category?.name.toLowerCase()
  );

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Breadcrumb */}
        <section className="mb-8 pt-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '#' },
              { label: category?.name || 'Category' }
            ]}
          />
        </section>

        {/* Category Header */}
        <section className="mb-16">
          <div className="border-b-2 border-neutral-200 pb-8 mb-12">
            <h1 className="font-serif text-5xl md:text-7xl font-black mb-4">
              {category?.name || 'Category'}
            </h1>
            <p className="text-lg text-neutral-500 font-light max-w-2xl">
              Explore our curated collection of articles, guides, and features in {category?.name || 'this category'}.
            </p>
          </div>
        </section>

        {/* Articles List */}
        {categoryArticles.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            {categoryArticles.map((article) => (
              <div key={article.id} className="reveal">
                <div
                  onClick={() => (window.location.hash = `#/article/${article.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[4/5] rounded-sm overflow-hidden mb-6 bg-neutral-100">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-white/80 text-[8px] uppercase tracking-[0.3em] font-black">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl font-black leading-tight mb-3 group-hover:text-[#f9b233] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-neutral-500 text-sm font-light line-clamp-2 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center text-[10px] text-neutral-400 font-medium uppercase tracking-widest">
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
                              className="w-4 h-4 rounded-full object-cover border border-neutral-300"
                            />
                            <span>{article.author}</span>
                          </>
                        ) : (
                          <span>{article.author}</span>
                        );
                      })()}
                    </a>
                    <span className="mx-2">/</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </section>
        ) : (
          <section className="py-20 text-center border-t border-neutral-100 mt-8">
            <h2 className="font-serif text-3xl font-black mb-4">
              {category?.name} Content Coming Soon
            </h2>
            <p className="text-neutral-500 font-light max-w-2xl mx-auto leading-relaxed">
              Our editorial team is curating exceptional stories and features for {category?.name || 'this category'}. 
              Sign up for our newsletter to be notified when new content is published.
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;

