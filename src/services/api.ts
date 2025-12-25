import type { Article, Category } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class ApiService {
  private static async fetchJson<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }

  private static async postJson<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }

  private static async putJson<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }

  private static async deleteJson<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }

  // Articles
  static async getArticles(): Promise<Article[]> {
    return this.fetchJson<Article[]>('/articles');
  }

  static async getArticleById(id: string): Promise<Article> {
    return this.fetchJson<Article>(`/articles/${id}`);
  }

  static async getArticlesByCategory(category: string): Promise<Article[]> {
    return this.fetchJson<Article[]>(`/articles?category=${encodeURIComponent(category)}`);
  }

  static async getTrendingArticles(): Promise<Article[]> {
    return this.fetchJson<Article[]>('/articles?trending=true');
  }

  static async createArticle(article: Omit<Article, 'id'>): Promise<Article> {
    return this.postJson<Article>('/articles', article);
  }

  static async updateArticle(id: string, article: Partial<Article>): Promise<Article> {
    return this.putJson<Article>(`/articles/${id}`, article);
  }

  static async deleteArticle(id: string): Promise<void> {
    await this.deleteJson(`/articles/${id}`);
  }

  // Categories
  static async getCategories(): Promise<Category[]> {
    return this.fetchJson<Category[]>('/categories');
  }

  static async getCategoryBySlug(slug: string): Promise<Category> {
    return this.fetchJson<Category>(`/categories/${slug}`);
  }

  // Content (combined)
  static async getContent(): Promise<{ articles: Article[]; categories: Category[] }> {
    return this.fetchJson<{ articles: Article[]; categories: Category[] }>('/content');
  }
}

