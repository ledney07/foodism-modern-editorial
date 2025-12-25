import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import AuthModal from '../components/AuthModal';
import { CATEGORIES, CONTENT, getAllArticles } from '../constants';
import { Article, Category, Comment, CommentWithArticle } from '../types';
import { Plus, X, Save, MessageSquare, Trash2, Reply, Heart, Share2, Tag, Eye, LogOut, User } from 'lucide-react';
import { getCurrentUser, signOut, isAuthenticated, User as UserType } from '../utils/auth';

const AdminPage = (): React.ReactElement => {
  const [user, setUser] = useState<UserType | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [allComments, setAllComments] = useState<CommentWithArticle[]>([]);
  const [activeTab, setActiveTab] = useState<'articles' | 'create' | 'comments' | 'subscribers'>('articles');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('Admin');
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    category: '',
    image: '',
    readTime: '5 min read',
    trending: false,
    tags: '',
    takeaways: '',
  });

  useEffect(() => {
    // Check authentication
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setReplyAuthor(currentUser.name);
    } else {
      setShowAuthModal(true);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    // Load admin-created articles from localStorage (filtered by user)
    const savedArticles = localStorage.getItem('adminArticles');
    if (savedArticles) {
      try {
        const allArticles = JSON.parse(savedArticles);
        // Filter articles by current user
        const userArticles = allArticles.filter((a: Article) => {
          const articleUser = localStorage.getItem(`article-${a.id}-user`);
          return articleUser === user.id;
        });
        setArticles(userArticles);
      } catch (e) {
        console.error('Error loading articles:', e);
      }
    }
    // Load ALL articles (including base articles)
    const all = getAllArticles();
    setAllArticles(all);
    loadAllComments();
  }, [user]);

  const loadAllComments = () => {
    if (!user) return;
    
    const allArticles = getAllArticles();
    const commentsWithArticles: CommentWithArticle[] = [];

    // Only load comments for articles that belong to the current user
    allArticles.forEach((article) => {
      // Check if this is a user's article or a base article (show all comments for base articles)
      const articleUser = localStorage.getItem(`article-${article.id}-user`);
      const isUserArticle = articleUser === user.id;
      const isBaseArticle = !articleUser; // Base articles don't have a user assigned
      
      if (isUserArticle || isBaseArticle) {
        const commentsKey = `comments-${article.id}`;
        const stored = localStorage.getItem(commentsKey);
        if (stored) {
          try {
            const comments: Comment[] = JSON.parse(stored);
            comments.forEach((comment) => {
              commentsWithArticles.push({
                articleId: article.id,
                articleTitle: article.title,
                comment,
                isReply: false,
              });

              // Add replies
              if (comment.replies && comment.replies.length > 0) {
                comment.replies.forEach((reply) => {
                  commentsWithArticles.push({
                    articleId: article.id,
                    articleTitle: article.title,
                    comment: reply,
                    isReply: true,
                    parentCommentId: comment.id,
                  });
                });
              }
            });
          } catch (e) {
            console.error(`Error loading comments for article ${article.id}:`, e);
          }
        }
      }
    });

    setAllComments(commentsWithArticles);
  };

  const saveArticles = (updatedArticles: Article[]) => {
    if (!user) return;
    
    setArticles(updatedArticles);
    
    // Load all admin articles and merge
    const allAdminArticles = JSON.parse(localStorage.getItem('adminArticles') || '[]');
    const otherUserArticles = allAdminArticles.filter((a: Article) => {
      const articleUser = localStorage.getItem(`article-${a.id}-user`);
      return articleUser !== user.id;
    });
    
    // Tag each article with the user ID
    updatedArticles.forEach(article => {
      localStorage.setItem(`article-${article.id}-user`, user.id);
    });
    
    // Save merged articles
    localStorage.setItem('adminArticles', JSON.stringify([...otherUserArticles, ...updatedArticles]));
    
    // Refresh all articles list
    const all = getAllArticles();
    setAllArticles(all);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newArticle: Article = {
      id: editingId || Date.now().toString(),
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      author: formData.author,
      date: formData.date,
      category: formData.category,
      image: formData.image,
      readTime: formData.readTime,
      trending: formData.trending,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      takeaways: formData.takeaways ? formData.takeaways.split('\n').filter(t => t.trim()) : [],
    };

    if (editingId) {
      // Update existing article
      const updated = articles.map(a => a.id === editingId ? newArticle : a);
      saveArticles(updated);
      setIsEditing(false);
      setEditingId(null);
    } else {
      // Add new article
      saveArticles([...articles, newArticle]);
    }

    // Reset form
    resetForm();
    // Refresh all articles list
    const all = getAllArticles();
    setAllArticles(all);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      category: '',
      image: '',
      readTime: '5 min read',
      trending: false,
      tags: '',
      takeaways: '',
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      author: article.author,
      date: article.date,
      category: article.category,
      image: article.image,
      readTime: article.readTime,
      trending: article.trending || false,
      tags: article.tags?.join(', ') || '',
      takeaways: article.takeaways?.join('\n') || '',
    });
    setIsEditing(true);
    setEditingId(article.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this article? This will also delete all associated comments and likes.')) return;
    
    // Check if it's an admin-created article
    const isAdminArticle = articles.some(a => a.id === id);
    
    if (isAdminArticle) {
      const updated = articles.filter(a => a.id !== id);
      saveArticles(updated);
    } else {
      // For base articles, just show a warning that they can't be deleted
      alert('Base articles cannot be deleted, but you can hide them by removing them from the articles list.');
      return;
    }

    // Delete associated data
    localStorage.removeItem(`comments-${id}`);
    const likeCounts = JSON.parse(localStorage.getItem('articleLikeCounts') || '{}');
    delete likeCounts[id];
    localStorage.setItem('articleLikeCounts', JSON.stringify(likeCounts));

    // Refresh articles list
    const all = getAllArticles();
    setAllArticles(all);
    
    if (editingId === id) {
      resetForm();
    }
    loadAllComments(); // Reload comments in case we deleted an article
  };

  const getArticleStats = (articleId: string) => {
    // Get like count
    const likeCounts = JSON.parse(localStorage.getItem('articleLikeCounts') || '{}');
    const likeCount = likeCounts[articleId] || 0;

    // Get comment count
    const commentsKey = `comments-${articleId}`;
    const stored = localStorage.getItem(commentsKey);
    let commentCount = 0;
    if (stored) {
      try {
        const comments: Comment[] = JSON.parse(stored);
        commentCount = comments.length;
        // Count replies too
        comments.forEach(comment => {
          if (comment.replies) {
            commentCount += comment.replies.length;
          }
        });
      } catch (e) {
        console.error('Error counting comments:', e);
      }
    }

    // Get share count (if we track it)
    const shareCounts = JSON.parse(localStorage.getItem('articleShareCounts') || '{}');
    const shareCount = shareCounts[articleId] || 0;

    return { likeCount, commentCount, shareCount };
  };

  const handleDeleteComment = (articleId: string, commentId: string, isReply: boolean, parentCommentId?: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    const commentsKey = `comments-${articleId}`;
    const stored = localStorage.getItem(commentsKey);
    if (!stored) return;

    try {
      const comments: Comment[] = JSON.parse(stored);
      let updatedComments: Comment[];

      if (isReply && parentCommentId) {
        // Delete a reply
        updatedComments = comments.map((comment) => {
          if (comment.id === parentCommentId) {
            return {
              ...comment,
              replies: (comment.replies || []).filter((reply) => reply.id !== commentId),
            };
          }
          return comment;
        });
      } else {
        // Delete a main comment
        updatedComments = comments.filter((comment) => comment.id !== commentId);
      }

      localStorage.setItem(commentsKey, JSON.stringify(updatedComments));
      loadAllComments();
    } catch (e) {
      console.error('Error deleting comment:', e);
    }
  };

  const handleReplyToComment = (articleId: string, commentId: string) => {
    const commentsKey = `comments-${articleId}`;
    const stored = localStorage.getItem(commentsKey);
    if (!stored || !replyText.trim()) return;

    try {
      const comments: Comment[] = JSON.parse(stored);
      const reply: Comment = {
        id: Date.now().toString(),
        author: replyAuthor || 'Admin',
        text: replyText,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      const updatedComments = comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply],
          };
        }
        return comment;
      });

      localStorage.setItem(commentsKey, JSON.stringify(updatedComments));
      setReplyingTo(null);
      setReplyText('');
      loadAllComments();
    } catch (e) {
      console.error('Error replying to comment:', e);
    }
  };

  const authors = CONTENT.authors || [];
  const authorNames = authors.map(a => a.name);

  // Show auth modal if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-neutral-50 flex items-center justify-center">
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => {
            // Don't allow closing without login
            if (!isAuthenticated()) {
              window.location.hash = '#';
            }
          }}
          onSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            setReplyAuthor(loggedInUser.name);
            setShowAuthModal(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-neutral-50">
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          setReplyAuthor(loggedInUser.name);
          setShowAuthModal(false);
        }}
      />
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Breadcrumb */}
        <section className="mb-8 pt-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '#' },
              { label: 'Admin' }
            ]}
          />
        </section>

        {/* Header */}
        <section className="mb-12">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-serif text-5xl md:text-6xl font-black mb-4">Admin Dashboard</h1>
              <p className="text-neutral-600 font-light text-lg">
                Manage articles and respond to reader comments
              </p>
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-sm text-neutral-600">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <span className="text-xs text-neutral-400">{user.email}</span>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to sign out?')) {
                      signOut();
                      setUser(null);
                      setShowAuthModal(true);
                    }
                  }}
                  className="px-4 py-2 border-2 border-neutral-300 rounded-lg hover:border-red-400 hover:text-red-500 transition-all flex items-center space-x-2 text-sm font-black uppercase tracking-widest"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Tabs */}
        <section className="mb-8">
          <div className="flex items-center space-x-6 border-b-2 border-neutral-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('articles')}
              className={`pb-4 px-4 text-sm font-black uppercase tracking-widest transition-colors whitespace-nowrap ${
                activeTab === 'articles'
                  ? 'text-[#f9b233] border-b-2 border-[#f9b233] -mb-[2px]'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              Articles
            </button>
            <button
              onClick={() => {
                setActiveTab('create');
                resetForm();
              }}
              className={`pb-4 px-4 text-sm font-black uppercase tracking-widest transition-colors whitespace-nowrap ${
                activeTab === 'create'
                  ? 'text-[#f9b233] border-b-2 border-[#f9b233] -mb-[2px]'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              Create/Edit Article
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`pb-4 px-4 text-sm font-black uppercase tracking-widest transition-colors whitespace-nowrap ${
                activeTab === 'comments'
                  ? 'text-[#f9b233] border-b-2 border-[#f9b233] -mb-[2px]'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              Comment Moderation
            </button>
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`pb-4 px-4 text-sm font-black uppercase tracking-widest transition-colors whitespace-nowrap ${
                activeTab === 'subscribers'
                  ? 'text-[#f9b233] border-b-2 border-[#f9b233] -mb-[2px]'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              Newsletter Subscribers
            </button>
          </div>
        </section>

        {activeTab === 'articles' ? (
        <div>
          {/* Articles List View */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="font-black text-2xl uppercase tracking-widest">All Articles</h2>
            </div>
            
            {allArticles.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-neutral-400 text-lg">No articles found.</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {allArticles.map((article) => {
                  const stats = getArticleStats(article.id);
                  const isAdminArticle = articles.some(a => a.id === article.id);
                  const isSelected = selectedArticles.includes(article.id);
                  const articleUser = localStorage.getItem(`article-${article.id}-user`);
                  const canEdit = !articleUser || articleUser === user.id;
                  
                  return (
                    <div
                      key={article.id}
                      className={`p-6 hover:bg-neutral-50 transition-colors flex items-start space-x-4 ${
                        isSelected ? 'bg-[#f9b233]/5' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <label className="mt-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedArticles([...selectedArticles, article.id]);
                            } else {
                              setSelectedArticles(selectedArticles.filter(id => id !== article.id));
                            }
                          }}
                          className="w-5 h-5 border-2 border-neutral-300 rounded cursor-pointer text-[#f9b233] focus:ring-[#f9b233]"
                          aria-label={`Select article: ${article.title}`}
                        />
                      </label>
                      
                      {/* Article Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-xl mb-2 hover:text-[#f9b233] transition-colors cursor-pointer">
                          {article.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-neutral-500 mb-3">
                          <span className="font-medium">{article.category}</span>
                          <span>•</span>
                          <span>{article.author}</span>
                          <span>•</span>
                          <span>{article.date}</span>
                        </div>
                        
                        {/* Status and Stats */}
                        <div className="flex items-center space-x-4 flex-wrap gap-2">
                          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-black uppercase tracking-widest rounded-full">
                            Published
                          </span>
                          <div className="flex items-center space-x-4 text-xs text-neutral-500">
                            <span className="flex items-center space-x-1">
                              <Heart className="w-3.5 h-3.5 text-red-400" />
                              <span className="font-bold">{stats.likeCount}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                              <span className="font-bold">{stats.commentCount}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Share2 className="w-3.5 h-3.5 text-green-400" />
                              <span className="font-bold">{stats.shareCount}</span>
                            </span>
                          </div>
                          {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {article.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center space-x-1 bg-neutral-100 text-neutral-600 text-[10px] px-2 py-0.5 rounded-full font-medium"
                                >
                                  <Tag className="w-2.5 h-2.5" />
                                  <span>{tag}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            handleEdit(article);
                            setActiveTab('create');
                          }}
                          className="p-3 border-2 border-neutral-300 rounded-lg hover:border-[#f9b233] hover:bg-[#f9b233] transition-all group"
                          title="Edit Article"
                        >
                          <Save className="w-5 h-5 text-neutral-600 group-hover:text-black" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-3 bg-red-500 hover:bg-red-600 rounded-lg transition-all"
                          title="Delete Article"
                        >
                          <Trash2 className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Bulk Actions */}
            {selectedArticles.length > 0 && (
              <div className="p-4 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-700">
                  {selectedArticles.length} article(s) selected
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${selectedArticles.length} selected article(s)?`)) {
                        selectedArticles.forEach(id => {
                          const article = allArticles.find(a => a.id === id);
                          if (article) handleDelete(id);
                        });
                        setSelectedArticles([]);
                      }
                    }}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-black uppercase tracking-widest rounded-lg transition-all"
                  >
                    Delete Selected
                  </button>
                  <button
                    onClick={() => setSelectedArticles([])}
                    className="px-4 py-2 border-2 border-neutral-300 hover:border-neutral-400 text-sm font-black uppercase tracking-widest rounded-lg transition-all"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        ) : activeTab === 'create' ? (
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-black uppercase tracking-widest text-neutral-900 mb-3">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-neutral-200 focus:border-[#f9b233] focus:outline-none rounded-lg text-lg font-medium"
                    placeholder="Enter article title"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-black uppercase tracking-widest text-neutral-900 mb-3">
                    Excerpt *
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-neutral-200 focus:border-[#f9b233] focus:outline-none rounded-lg font-light resize-none"
                    placeholder="Brief description of the article"
                  />
                </div>

                {/* Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-black uppercase tracking-widest text-neutral-900 mb-3">
                    Content *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={12}
                    className="w-full px-4 py-3 border-2 border-neutral-200 focus:border-[#f9b233] focus:outline-none rounded-lg font-light resize-none"
                    placeholder="Article content (use double line breaks for paragraphs)"
                  />
                  <p className="text-xs text-neutral-400 mt-2">
                    Separate paragraphs with double line breaks (press Enter twice)
                  </p>
                </div>

                {/* Author & Category Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="author" className="block text-sm font-black uppercase tracking-widest text-neutral-900 mb-3">
                      Author *
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      required
                      list="authors"
                      className="w-full px-4 py-3 border-2 border-neutral-200 focus:border-[#f9b233] focus:outline-none rounded-lg font-medium"
                      placeholder="Author name"
                    />
                    <datalist id="authors">
                      {authorNames.map((name, idx) => (
                        <option key={idx} value={name} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-black uppercase tracking-widest text-neutral-900 mb-3">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-neutral-200 focus:border-[#f9b233] focus:outline-none rounded-lg font-medium"
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map((cat: Category) => (
                        <option key={cat.slug} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image URL & Date Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="image" className="block text-sm font-black uppercase tracking-widest text-neutral-900 mb-3">
                      Image URL *
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="url"
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        required
                        className="flex-1 px-4 py-3 border-2 border-neutral-200 focus:border-[#f9b233] focus:outline-none rounded-lg font-medium"
                        placeholder="https://images.unsplash.com/..."
                      />
                      {formData.image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-neutral-200 flex-shrink-0">
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-sm font-black uppercase tracking-widest text-neutral-900 mb-3">
                      Date *
                    </label>
                    <input
                      type="text"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-neutral-200 focus:border-[#f9b233] focus:outline-none rounded-lg font-medium"
                      placeholder="February 24, 2025"
                    />
                  </div>
                </div>

                {/* Read Time & Trending */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="readTime" className="block text-sm font-black uppercase tracking-widest text-neutral-900 mb-3">
                      Read Time *
                    </label>
                    <input
                      type="text"
                      id="readTime"
                      name="readTime"
                      value={formData.readTime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-neutral-200 focus:border-[#f9b233] focus:outline-none rounded-lg font-medium"
                      placeholder="5 min read"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="trending"
                        checked={formData.trending}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-[#f9b233] border-neutral-300 rounded focus:ring-[#f9b233]"
                      />
                      <span className="text-sm font-black uppercase tracking-widest text-neutral-900">
                        Mark as Trending
                      </span>
                    </label>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-black uppercase tracking-widest text-neutral-900 mb-3">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-neutral-200 focus:border-[#f9b233] focus:outline-none rounded-lg font-medium"
                    placeholder="Toronto, Fine Dining, Japanese"
                  />
                </div>

                {/* Takeaways */}
                <div>
                  <label htmlFor="takeaways" className="block text-sm font-black uppercase tracking-widest text-neutral-900 mb-3">
                    Key Takeaways (one per line)
                  </label>
                  <textarea
                    id="takeaways"
                    name="takeaways"
                    value={formData.takeaways}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-neutral-200 focus:border-[#f9b233] focus:outline-none rounded-lg font-light resize-none"
                    placeholder="First key takeaway&#10;Second key takeaway&#10;Third key takeaway"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center space-x-4 pt-6 border-t border-neutral-200">
                  <button
                    type="submit"
                    className="bg-[#f9b233] text-black px-8 py-4 rounded-full text-sm font-black uppercase tracking-widest hover:bg-[#e5a022] transition-all flex items-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>{isEditing ? 'Update Article' : 'Save Article'}</span>
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-8 py-4 border-2 border-neutral-300 rounded-full text-sm font-black uppercase tracking-widest hover:border-neutral-400 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        ) : activeTab === 'comments' ? (
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
            <h2 className="font-serif text-3xl font-black mb-8">All Comments ({allComments.length})</h2>
            
            {allComments.length === 0 ? (
              <div className="text-center py-20">
                <MessageSquare className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-400 text-lg">No comments yet.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {allComments.map((item) => (
                  <div
                    key={`${item.articleId}-${item.comment.id}`}
                    className="border-2 border-neutral-200 rounded-lg p-6 hover:border-[#f9b233] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-[#f9b233] flex items-center justify-center flex-shrink-0">
                            <span className="text-black font-black text-sm">
                              {item.comment.author.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-3">
                              <span className="font-black text-lg">{item.comment.author}</span>
                              {item.isReply && (
                                <span className="text-xs bg-neutral-100 px-2 py-1 rounded uppercase tracking-widest font-black text-neutral-600">
                                  Reply
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-400">{item.comment.date}</p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <a
                            href={`#/article/${item.articleId}`}
                            className="text-sm text-[#f9b233] hover:underline font-black uppercase tracking-widest"
                          >
                            Article: {item.articleTitle}
                          </a>
                        </div>
                        <p className="text-neutral-700 font-light leading-relaxed mb-4">
                          {item.comment.text}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleDeleteComment(
                            item.articleId,
                            item.comment.id,
                            item.isReply,
                            item.parentCommentId
                          )
                        }
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                        title="Delete comment"
                      >
                        <Trash2 className="w-5 h-5 text-neutral-400 group-hover:text-red-500 transition-colors" />
                      </button>
                    </div>

                    {!item.isReply && (
                      <div className="mt-4 pt-4 border-t border-neutral-100">
                        {replyingTo === item.comment.id ? (
                          <div className="space-y-3">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={3}
                              className="w-full px-4 py-3 border-2 border-neutral-200 focus:border-[#f9b233] focus:outline-none rounded-lg font-light resize-none"
                              placeholder="Write a response..."
                            />
                            <div className="flex items-center space-x-3">
                              <input
                                type="text"
                                value={replyAuthor}
                                onChange={(e) => setReplyAuthor(e.target.value)}
                                className="px-4 py-2 border-2 border-neutral-200 focus:border-[#f9b233] focus:outline-none rounded-lg font-medium text-sm"
                                placeholder="Your name (default: Admin)"
                              />
                              <button
                                onClick={() => handleReplyToComment(item.articleId, item.comment.id)}
                                className="bg-[#f9b233] text-black px-6 py-2 rounded-lg text-sm font-black uppercase tracking-widest hover:bg-[#e5a022] transition-colors flex items-center space-x-2"
                              >
                                <Reply className="w-4 h-4" />
                                <span>Send Reply</span>
                              </button>
                              <button
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText('');
                                }}
                                className="px-4 py-2 border-2 border-neutral-300 rounded-lg text-sm font-black uppercase tracking-widest hover:border-neutral-400 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReplyingTo(item.comment.id)}
                            className="flex items-center space-x-2 text-sm text-[#f9b233] font-black uppercase tracking-widest hover:underline"
                          >
                            <Reply className="w-4 h-4" />
                            <span>Reply as Admin</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'subscribers' ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="font-black text-2xl uppercase tracking-widest">Newsletter Subscribers</h2>
            </div>
            <div className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 text-lg mb-2">No subscribers yet</p>
              <p className="text-neutral-400 text-sm">Subscriber management coming soon</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdminPage;

