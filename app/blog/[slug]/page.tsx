import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { wordpressClient } from '@/lib/wordpress/client';
import PostDetailClient from '@/components/blog/PostDetailClient';
import { Suspense } from 'react';
import PostSkeleton from '@/components/ui/skeleton/PostSkeleton';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const data = await wordpressClient.getPostBySlug(slug);
    const post = data.post;
    
    if (!post) {
      return {
        title: 'Post Not Found - English Communities PK',
        description: 'The requested article could not be found.',
      };
    }
    
    return {
      title: `${post.title} - English Communities PK`,
      description: post.excerpt || 'Read this article on English Communities PK',
      keywords: post.categories.nodes.map(cat => cat.name),
      authors: [{ name: post.author?.node?.name || 'Unknown Author' }],
      openGraph: {
        type: 'article',
        title: post.title,
        description: post.excerpt || '',
        publishedTime: post.date,
        modifiedTime: post.modified,
        authors: [post.author?.node?.name || 'Unknown Author'],
        tags: post.categories.nodes.map(cat => cat.name),
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || '',
      },
    };
  } catch (error) {
    return {
      title: 'Post Not Found - English Communities PK',
      description: 'The requested article could not be found.',
    };
  }
}

export const revalidate = 60;

async function getPostData(slug: string) {
  try {
    const data = await wordpressClient.getPostBySlug(slug);
    
    if (!data.post) {
      notFound();
    }
    
    // Get related posts
    const categorySlug = data.post.categories.nodes[0]?.slug;
    let relatedPosts = [];
    
    if (categorySlug) {
      const categoryData = await wordpressClient.getCategoryBySlug(categorySlug, 4);
      relatedPosts = categoryData.category?.posts?.nodes || [];
      // Remove current post from related
      relatedPosts = relatedPosts.filter(p => p.slug !== slug);
    }
    
    return {
      post: data.post,
      relatedPosts: relatedPosts.slice(0, 3),
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    notFound();
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const { post, relatedPosts } = await getPostData(slug);
  
  return (
    <Suspense fallback={<PostDetailSkeleton />}>
      <PostDetailClient post={post} relatedPosts={relatedPosts} />
    </Suspense>
  );
}

function PostDetailSkeleton() {
  return <PostSkeleton variant="detailed" />;
}
