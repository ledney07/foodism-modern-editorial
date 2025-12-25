
export interface Article {
  readonly id: string;
  readonly title: string;
  readonly excerpt: string;
  readonly content: string;
  readonly author: string;
  readonly date: string;
  readonly category: string;
  readonly image: string;
  readonly readTime: string;
  readonly trending?: boolean;
  readonly tags?: readonly string[];
  readonly takeaways?: readonly string[];
}

export interface Category {
  readonly name: string;
  readonly slug: string;
}

export enum NavigationSection {
  HOME = '/',
  ARTICLE = '/article',
  CATEGORY = '/category'
}

export interface SiteContent {
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly copyright: string;
}

export interface SectionContent {
  readonly title: string;
  readonly description?: string;
  readonly badge?: string;
  readonly linkText?: string;
}

export interface NewsletterContent {
  readonly title: string;
  readonly fullTitle?: string;
  readonly description: string;
  readonly fullDescription?: string;
  readonly buttonText: string;
  readonly fullButtonText?: string;
  readonly pricing?: string;
  readonly privacy: string;
}

export interface FooterLink {
  readonly label: string;
  readonly href: string;
}

export interface FooterLinkSection {
  readonly title: string;
  readonly items: readonly FooterLink[];
}

export interface Author {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly bio: string;
  readonly image: string;
  readonly role: string;
  readonly social?: {
    readonly twitter?: string;
    readonly instagram?: string;
  };
}

export type Comment = {
  id: string;
  author: string;
  text: string;
  date: string;
  replies?: Comment[];
};

export type CommentWithArticle = {
  articleId: string;
  articleTitle: string;
  comment: Comment;
  isReply: boolean;
  parentCommentId?: string;
};

export interface ContentData {
  readonly site: SiteContent;
  readonly categories: readonly Category[];
  readonly articles: readonly Article[];
  readonly authors?: readonly Author[];
  readonly sections: {
    readonly mustReads: SectionContent;
    readonly foodismSelects: SectionContent;
    readonly theDigest: SectionContent;
    readonly travelGuide: SectionContent;
    readonly newsletter: NewsletterContent;
    readonly joinCommunity: NewsletterContent;
    readonly iconAwards: SectionContent;
  };
  readonly footer: {
    readonly links: {
      readonly discover: FooterLinkSection;
      readonly company: FooterLinkSection;
      readonly legal: {
        readonly items: readonly FooterLink[];
      };
    };
  };
}
