// File: types/wordpress.d.ts
// COMPLETE FIXED VERSION

export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: Record<string, unknown>;
  categories: number[];
  tags: number[];
  comment_count?: number;
  
  _embedded?: {
    author?: WordPressUser[];
    "wp:featuredmedia"?: WordPressMedia[];
    "wp:term"?: Array<WordPressTerm[]>;
  };
  
  // Alias properties for easier access
  featuredMedia?: number;
  featuredMediaUrl?: string;
  excerptText?: string;
  contentText?: string;
  author_name?: string;
  view_count?: number;
  like_count?: number;
}

export interface WordPressMedia {
  id: number;
  date: string;
  date_gmt: string;
  slug: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  caption: {
    rendered: string;
  };
  description?: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  source_url: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    filesize?: number;
    sizes: {
      [key: string]: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
  };
  
  // Alias properties
  altText?: string;
  mediaType?: string;
  mimeType?: string;
  sourceUrl?: string;
  mediaDetails?: {
    width: number;
    height: number;
    file: string;
    filesize?: number;
    sizes: {
      [key: string]: {
        file: string;
        width: number;
        height: number;
        mimeType: string;
        sourceUrl: string;
      };
    };
  };
}

export interface WordPressUser {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    24: string;
    48: string;
    96: string;
  };
  
  // Alias properties
  avatarUrls?: {
    24: string;
    48: string;
    96: string;
  };
}

export interface WordPressTerm {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}

export interface WordPressComment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_url: string;
  date: string;
  date_gmt: string;
  content: {
    rendered: string;
  };
  link: string;
  status: string;
  type: string;
  author_avatar_urls: {
    24: string;
    48: string;
    96: string;
  };
}

export interface WordPressMenu {
  id: number;
  description: string;
  name: string;
  slug: string;
  locations: string[];
  items: WordPressMenuItem[];
}

export interface WordPressMenuItem {
  id: number;
  title: string;
  url: string;
  attr_title: string;
  description: string;
  type: string;
  type_label: string;
  object: string;
  object_id: number;
  parent: number;
  menu_order: number;
  target: string;
  classes: string[];
  xfn: string[];
  invalid: boolean;
  meta: Record<string, unknown>;
  children?: WordPressMenuItem[];
}

export interface WordPressQueryParams {
  per_page?: number;
  page?: number;
  search?: string;
  categories?: number[];
  tags?: number[];
  author?: number;
  order?: 'asc' | 'desc';
  orderby?: string;
  status?: string;
  slug?: string;
  include?: number[];
  post?: number;
}

export interface WordPressResponse<T> {
  data: T;
  total?: number;
  totalPages?: number;
  page?: number;
}