import contentData from './data/content.json';
import type { Article, Category, ContentData } from './types';

const data = contentData as unknown as ContentData;

// Static data (always available as fallback)
export const CATEGORIES: readonly Category[] = data.categories;

// Get articles from localStorage (admin-created) and merge with base articles
const getAdminArticles = (): Article[] => {
  if (typeof window === 'undefined') return [];
  try {
    const adminArticles = localStorage.getItem('adminArticles');
    return adminArticles ? JSON.parse(adminArticles) : [];
  } catch {
    return [];
  }
};

// Base articles from JSON
const BASE_ARTICLES: readonly Article[] = data.articles;

// Function to get all articles (base + admin-created)
export const getAllArticles = (): Article[] => {
  return [...BASE_ARTICLES, ...getAdminArticles()];
};

// Export for backwards compatibility (returns base articles only)
export const MOCK_ARTICLES: readonly Article[] = BASE_ARTICLES;

export const CONTENT: ContentData = data;

// Helper function to get author slug from name
export const getAuthorSlug = (authorName: string): string => {
  return authorName.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
};

// Helper function to get author by name
export const getAuthorByName = (authorName: string) => {
  const authors = CONTENT.authors || [];
  return authors.find(author => 
    author.name.toLowerCase() === authorName.toLowerCase()
  );
};

// Export API service for optional use (import separately when needed)
export { ApiService } from './src/services/api';
