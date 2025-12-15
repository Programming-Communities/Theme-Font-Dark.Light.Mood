export interface WordPressPost {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  modified: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails: {
        width: number;
        height: number;
      };
    };
  };
  categories: {
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
  tags: {
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
  author: {
    node: {
      name: string;
      avatar: {
        url: string;
      };
    };
  };
  commentCount: number;
  commentStatus: string;
}

export interface WordPressCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
}

export interface WordPressTag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface WordPressMedia {
  id: string;
  sourceUrl: string;
  altText: string;
  mediaDetails: {
    width: number;
    height: number;
  };
  caption?: string;
  description?: string;
}

export interface WordPressPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface WordPressResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
  }>;
}

export interface PostsResponse {
  posts: {
    nodes: WordPressPost[];
    pageInfo: WordPressPageInfo;
  };
}

export interface CategoriesResponse {
  categories: {
    nodes: WordPressCategory[];
  };
}

export interface PostBySlugResponse {
  post: WordPressPost;
}

export interface CategoryBySlugResponse {
  category: WordPressCategory & {
    posts: {
      nodes: WordPressPost[];
      pageInfo: WordPressPageInfo;
    };
  };
}
