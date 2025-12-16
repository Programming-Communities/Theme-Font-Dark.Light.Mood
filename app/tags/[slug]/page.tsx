// File 59: app/tags/[slug]/page.tsx
/**
 * Single Tag Page - Display posts for a specific tag
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTagBySlug, getPostsByTag } from '@/lib/wordpress/api';
import { generateTagMetadata } from '@/lib/seo/generator';
import { GridContainer } from '@/components/layout/GridContainer';
import { FluidContainer } from '@/components/layout/FluidContainer';
import PostCard from '@/components/posts/PostCard';
import CategorySidebar from '@/components/layout/CategorySidebar';
import TrendingSidebar from '@/components/layout/TrendingSidebar';
import TagInfo from '@/components/tags/TagInfo';
import RelatedTags from '@/components/tags/RelatedTags';

interface TagPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
    sort?: 'date' | 'popular' | 'title';
  };
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  try {
    const tag = await getTagBySlug(params.slug);
    if (!tag) {
      return {
        title: 'Tag Not Found - English Communities PK',
        description: 'The requested tag could not be found.',
      };
    }
    
    return generateTagMetadata(tag);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Tag - English Communities PK',
      description: 'Browse posts by tag on English Communities PK.',
    };
  }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const currentPage = parseInt(searchParams.page || '1');
  const sortBy = searchParams.sort || 'date';
  
  try {
    // Fetch tag data
    const tag = await getTagBySlug(params.slug);
    
    if (!tag) {
      return notFound();
    }
    
    // Fetch posts for this tag
    const postsData = await getPostsByTag(tag.id, {
      page: currentPage,
      per_page: 12,
      orderby: sortBy === 'popular' ? 'views' : sortBy,
      order: sortBy === 'title' ? 'asc' : 'desc',
    });
    
    if (!postsData || !postsData.data) {
      return notFound();
    }
    
    const { data: posts, total, totalPages, currentPage: page } = postsData;
    
    return (
      <FluidContainer>
        <div className="theme-transition bg-background">
          {/* Hero Section */}
          <section className="py-12 bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                  <span>Tag</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {tag.name}
                </h1>
                {tag.description && (
                  <p className="text-xl text-muted-foreground mb-6">
                    {tag.description}
                  </p>
                )}
                <TagInfo tag={tag} showCount={true} showMeta={true} />
              </div>
            </div>
          </section>
          
          {/* Main Content */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-8">
                    {/* Tag Details */}
                    <div className="bg-card rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold mb-4">
                        About this Tag
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Total Posts
                          </div>
                          <div className="text-2xl font-bold">
                            {tag.count}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Recent Activity
                          </div>
                          <div className="text-sm">
                            {tag.count > 0 ? 'Active' : 'No recent posts'}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Popularity
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full"
                                style={{ 
                                  width: `${Math.min(100, (tag.count / 100) * 100)}%` 
                                }}
                              />
                            </div>
                            <span className="text-sm">
                              {Math.min(100, Math.round((tag.count / 100) * 100))}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Related Tags */}
                    <RelatedTags 
                      tagId={tag.id}
                      limit={10}
                      showCount={true}
                    />
                    
                    {/* Category Sidebar */}
                    <CategorySidebar 
                      showCount={true}
                      showIcons={true}
                      limit={10}
                    />
                  </div>
                </div>
                
                {/* Main Content Area */}
                <div className="lg:col-span-2">
                  {/* Sort Controls */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-bold">
                        Posts Tagged "{tag.name}"
                      </h2>
                      <p className="text-muted-foreground">
                        Showing {posts.length} of {total} posts
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label htmlFor="sort" className="text-sm font-medium">
                          Sort by:
                        </label>
                        <select 
                          id="sort"
                          className="px-3 py-2 rounded border bg-background text-foreground"
                          defaultValue={sortBy}
                          onChange={(e) => {
                            const url = new URL(window.location.href);
                            url.searchParams.set('sort', e.target.value);
                            window.location.href = url.toString();
                          }}
                        >
                          <option value="date">Latest</option>
                          <option value="popular">Most Popular</option>
                          <option value="title">Title (A-Z)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Posts Grid */}
                  {posts.length > 0 ? (
                    <GridContainer columns={2}>
                      {posts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          layout="vertical"
                          showExcerpt={true}
                          showMeta={true}
                          showCategory={true}
                          showAuthor={true}
                          showDate={true}
                          imageSize="medium"
                        />
                      ))}
                    </GridContainer>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">📭</div>
                      <h3 className="text-xl font-semibold mb-2">
                        No posts found
                      </h3>
                      <p className="text-muted-foreground">
                        There are no posts tagged with "{tag.name}" yet.
                      </p>
                    </div>
                  )}
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <nav className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const url = new URL(window.location.href);
                            url.searchParams.set('page', Math.max(1, page - 1).toString());
                            window.location.href = url.toString();
                          }}
                          disabled={page === 1}
                          className="px-4 py-2 rounded border bg-background disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => {
                                const url = new URL(window.location.href);
                                url.searchParams.set('page', pageNum.toString());
                                window.location.href = url.toString();
                              }}
                              className={`px-4 py-2 rounded border ${
                                page === pageNum
                                  ? 'bg-primary text-white border-primary'
                                  : 'bg-background'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        {totalPages > 5 && (
                          <>
                            <span className="px-2">...</span>
                            <button
                              onClick={() => {
                                const url = new URL(window.location.href);
                                url.searchParams.set('page', totalPages.toString());
                                window.location.href = url.toString();
                              }}
                              className="px-4 py-2 rounded border bg-background"
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => {
                            const url = new URL(window.location.href);
                            url.searchParams.set('page', Math.min(totalPages, page + 1).toString());
                            window.location.href = url.toString();
                          }}
                          disabled={page === totalPages}
                          className="px-4 py-2 rounded border bg-background disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  )}
                  
                  {/* Tag Description */}
                  {tag.description && (
                    <div className="mt-12 p-6 rounded-lg bg-card">
                      <h3 className="text-lg font-semibold mb-4">
                        About {tag.name}
                      </h3>
                      <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: tag.description }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
          
          {/* Trending Posts Sidebar */}
          <section className="py-12 bg-card">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8">
                Trending in {tag.name}
              </h2>
              <TrendingSidebar 
                tagId={tag.id}
                limit={6}
                showExcerpt={false}
                showMeta={true}
              />
            </div>
          </section>
          
          {/* Newsletter Section */}
          <section className="py-12 bg-gradient-primary text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Stay Updated on {tag.name}
                </h2>
                <p className="text-xl opacity-90 mb-6">
                  Get notified when new posts are added to this tag.
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-3 rounded text-gray-900"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white text-primary font-semibold rounded hover:bg-white/90 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="text-sm opacity-75 mt-4">
                  No spam. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </section>
        </div>
      </FluidContainer>
    );
  } catch (error) {
    console.error('Error loading tag page:', error);
    return notFound();
  }
}