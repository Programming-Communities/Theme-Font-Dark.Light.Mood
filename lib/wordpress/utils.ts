import { WordPressPost, WordPressCategory } from '@/types/wordpress';

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(dateString);
}

export function truncateText(text: string, maxLength: number = 150): string {
  if (!text) return '';
  
  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, '');
  
  if (cleanText.length <= maxLength) return cleanText;
  
  return cleanText.substring(0, maxLength).trim() + '...';
}

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function getCategoryColor(slug: string): string {
  const colors = [
    '#2563EB', '#059669', '#7C3AED', '#D97706', '#DC2626',
    '#0EA5E9', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
  ];
  
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export function generateExcerpt(content: string, maxLength: number = 200): string {
  const cleanContent = content.replace(/<[^>]*>/g, '');
  const sentences = cleanContent.match(/[^.!?]+[.!?]+/g) || [];
  
  let excerpt = '';
  for (const sentence of sentences) {
    if ((excerpt + sentence).length > maxLength) break;
    excerpt += sentence;
  }
  
  if (!excerpt) {
    excerpt = cleanContent.substring(0, maxLength);
    if (cleanContent.length > maxLength) excerpt += '...';
  }
  
  return excerpt.trim();
}

export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
}

export function getOptimizedImageUrl(url: string, width: number = 800, height?: number): string {
  if (!url || !isValidImageUrl(url)) return '/images/placeholder.jpg';
  
  // For WordPress, you might want to use image CDN or resizing
  // This is a basic implementation - adjust based on your WordPress setup
  return url;
}

export function sortCategoriesByCount(categories: WordPressCategory[]): WordPressCategory[] {
  return [...categories].sort((a, b) => b.count - a.count);
}

export function filterFeaturedPosts(posts: WordPressPost[]): WordPressPost[] {
  return posts.filter(post => post.featuredImage?.node?.sourceUrl);
}
