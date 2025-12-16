// File 58: app/tags/page.tsx
/**
 * Tags Page - Display all tags with filtering and search
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTags, getTagCounts } from '@/lib/wordpress/api';
import { SearchBar } from '@/components/search/SearchBar';
import { GridContainer } from '@/components/layout/GridContainer';
import { FluidContainer } from '@/components/layout/FluidContainer';
import TagCloud from '@/components/tags/TagCloud';
import TagList from '@/components/tags/TagList';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export const metadata: Metadata = {
  title: 'Tags - English Communities PK',
  description: 'Browse all topics and tags for English learning content in Pakistan.',
  keywords: ['English tags', 'learning topics', 'English vocabulary', 'grammar tags', 'language topics'],
  openGraph: {
    title: 'Tags - English Communities PK',
    description: 'Browse all topics and tags for English learning content in Pakistan.',
    type: 'website',
  },
};

interface TagsPageProps {
  searchParams: {
    page?: string;
    search?: string;
    sort?: 'name' | 'count' | 'popular';
    view?: 'cloud' | 'list' | 'grid';
  };
}

export default async function TagsPage({ searchParams }: TagsPageProps) {
  const currentPage = parseInt(searchParams.page || '1');
  const searchQuery = searchParams.search || '';
  const sortBy = searchParams.sort || 'name';
  const viewMode = searchParams.view || 'cloud';
  
  try {
    // Fetch tags from WordPress
    const tagsData = await getTags({
      page: currentPage,
      per_page: viewMode === 'cloud' ? 100 : 20,
      search: searchQuery,
      orderby: sortBy === 'count' ? 'count' : 'name',
      order: sortBy === 'name' ? 'asc' : 'desc',
    });
    
    // Fetch tag counts for statistics
    const tagCounts = await getTagCounts();
    
    if (!tagsData || !tagsData.data) {
      return notFound();
    }
    
    const { data: tags, total, totalPages, currentPage: page } = tagsData;
    
    return (
      <FluidContainer>
        <div className="theme-transition bg-background">
          {/* Hero Section */}
          <section className="py-12 bg-gradient-primary text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Explore Topics & Tags
                </h1>
                <p className="text-xl opacity-90 mb-8">
                  Discover all topics and tags for English learning content. 
                  Find exactly what you're looking for.
                </p>
                
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto">
                  <SearchBar 
                    placeholder="Search tags (e.g., grammar, vocabulary, pronunciation...)"
                    defaultValue={searchQuery}
                    searchPath="/tags"
                  />
                </div>
              </div>
            </div>
          </section>
          
          {/* Stats Section */}
          <section className="py-8 bg-card">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-6 rounded-lg bg-background shadow-sm">
                  <div className="text-3xl font-bold text-primary">
                    {tagCounts?.total || 0}
                  </div>
                  <div className="text-muted-foreground mt-2">
                    Total Tags
                  </div>
                </div>
                <div className="text-center p-6 rounded-lg bg-background shadow-sm">
                  <div className="text-3xl font-bold text-primary">
                    {tagCounts?.mostPopular?.count || 0}
                  </div>
                  <div className="text-muted-foreground mt-2">
                    Most Used Tag
                  </div>
                  <div className="text-sm font-medium mt-1">
                    {tagCounts?.mostPopular?.name || 'N/A'}
                  </div>
                </div>
                <div className="text-center p-6 rounded-lg bg-background shadow-sm">
                  <div className="text-3xl font-bold text-primary">
                    {tagCounts?.averagePerPost?.toFixed(1) || 0}
                  </div>
                  <div className="text-muted-foreground mt-2">
                    Avg Tags per Post
                  </div>
                </div>
                <div className="text-center p-6 rounded-lg bg-background shadow-sm">
                  <div className="text-3xl font-bold text-primary">
                    {tagCounts?.recentlyAdded || 0}
                  </div>
                  <div className="text-muted-foreground mt-2">
                    New This Month
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Main Content */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              {/* View Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold">
                    All Tags {searchQuery && `for "${searchQuery}"`}
                  </h2>
                  <p className="text-muted-foreground">
                    Showing {tags.length} of {total} tags
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  {/* Sort Dropdown */}
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
                      <option value="name">Name (A-Z)</option>
                      <option value="count">Post Count</option>
                      <option value="popular">Popularity</option>
                    </select>
                  </div>
                  
                  {/* View Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const url = new URL(window.location.href);
                        url.searchParams.set('view', 'cloud');
                        window.location.href = url.toString();
                      }}
                      className={`p-2 rounded ${viewMode === 'cloud' ? 'bg-primary text-white' : 'bg-card'}`}
                    >
                      Cloud
                    </button>
                    <button
                      onClick={() => {
                        const url = new URL(window.location.href);
                        url.searchParams.set('view', 'list');
                        window.location.href = url.toString();
                      }}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-card'}`}
                    >
                      List
                    </button>
                    <button
                      onClick={() => {
                        const url = new URL(window.location.href);
                        url.searchParams.set('view', 'grid');
                        window.location.href = url.toString();
                      }}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-card'}`}
                    >
                      Grid
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Tags Display */}
              <Suspense fallback={<LoadingSpinner />}>
                {viewMode === 'cloud' ? (
                  <TagCloud 
                    tags={tags}
                    maxFontSize={48}
                    minFontSize={14}
                    limit={100}
                  />
                ) : viewMode === 'list' ? (
                  <TagList 
                    tags={tags}
                    showCount={true}
                    showDescription={true}
                    columns={1}
                  />
                ) : (
                  <GridContainer columns={3}>
                    {tags.map((tag) => (
                      <a
                        key={tag.id}
                        href={`/tags/${tag.slug}`}
                        className="block p-6 rounded-lg bg-card hover:bg-card/80 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              {tag.name}
                            </h3>
                            {tag.description && (
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {tag.description}
                              </p>
                            )}
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {tag.count}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-4">
                          {tag.count} post{tag.count !== 1 ? 's' : ''}
                        </div>
                      </a>
                    ))}
                  </GridContainer>
                )}
              </Suspense>
              
              {/* Pagination */}
              {totalPages > 1 && viewMode !== 'cloud' && (
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
              
              {/* Alphabetical Navigation */}
              {viewMode !== 'cloud' && (
                <div className="mt-12">
                  <h3 className="text-lg font-semibold mb-4">Browse by Letter</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 26 }, (_, i) => {
                      const letter = String.fromCharCode(65 + i);
                      const hasTags = tags.some(tag => 
                        tag.name.charAt(0).toUpperCase() === letter
                      );
                      
                      return (
                        <a
                          key={letter}
                          href={`/tags?sort=name&view=list&search=${letter}`}
                          className={`w-10 h-10 flex items-center justify-center rounded ${
                            hasTags
                              ? 'bg-primary text-white hover:bg-primary-dark'
                              : 'bg-card text-muted-foreground cursor-not-allowed'
                          }`}
                        >
                          {letter}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>
          
          {/* Related Topics Section */}
          <section className="py-12 bg-card">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8 text-center">
                Popular Topic Categories
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Grammar',
                    description: 'Tenses, parts of speech, sentence structure',
                    count: tags.filter(t => 
                      t.name.toLowerCase().includes('grammar') || 
                      t.description?.toLowerCase().includes('grammar')
                    ).length,
                    icon: '📚'
                  },
                  {
                    title: 'Vocabulary',
                    description: 'Word lists, idioms, phrases, expressions',
                    count: tags.filter(t => 
                      t.name.toLowerCase().includes('vocab') || 
                      t.description?.toLowerCase().includes('word')
                    ).length,
                    icon: '📖'
                  },
                  {
                    title: 'Pronunciation',
                    description: 'Accent, intonation, sounds, speaking',
                    count: tags.filter(t => 
                      t.name.toLowerCase().includes('pronunciation') || 
                      t.description?.toLowerCase().includes('speak')
                    ).length,
                    icon: '🎤'
                  },
                  {
                    title: 'Writing',
                    description: 'Essays, emails, creative writing, formal',
                    count: tags.filter(t => 
                      t.name.toLowerCase().includes('writing') || 
                      t.description?.toLowerCase().includes('write')
                    ).length,
                    icon: '✍️'
                  }
                ].map((category) => (
                  <a
                    key={category.title}
                    href={`/tags?search=${category.title.toLowerCase()}&view=list`}
                    className="block p-6 rounded-lg bg-background hover:bg-background/80 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="text-3xl mb-4">{category.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {category.count} tags
                      </span>
                      <span className="text-primary">Explore →</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </FluidContainer>
    );
  } catch (error) {
    console.error('Error loading tags page:', error);
    return notFound();
  }
}