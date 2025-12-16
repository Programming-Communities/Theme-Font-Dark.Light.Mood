// File 61: app/resources/page.tsx
/**
 * Resources Page - Learning materials, downloads, and study resources
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { getResources, getResourceCategories } from '@/lib/wordpress/api';
import { FluidContainer } from '@/components/layout/FluidContainer';
import { GridContainer } from '@/components/layout/GridContainer';
import ResourceCard from '@/components/resources/ResourceCard';
import ResourceFilter from '@/components/resources/ResourceFilter';
import CategorySidebar from '@/components/layout/CategorySidebar';
import TrendingSidebar from '@/components/layout/TrendingSidebar';
import DownloadStats from '@/components/resources/DownloadStats';

export const metadata: Metadata = {
  title: 'Free English Learning Resources - Pakistan',
  description: 'Download free English learning materials, worksheets, guides, and resources for Pakistani learners.',
  keywords: ['English resources', 'learning materials', 'worksheets', 'grammar guides', 'vocabulary lists'],
  openGraph: {
    title: 'Free English Learning Resources - Pakistan',
    description: 'Download free English learning materials, worksheets, guides, and resources for Pakistani learners.',
    type: 'website',
  },
};

interface ResourcesPageProps {
  searchParams: {
    page?: string;
    category?: string;
    level?: string;
    type?: string;
    sort?: 'popular' | 'newest' | 'rating';
    search?: string;
  };
}

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const currentPage = parseInt(searchParams.page || '1');
  const category = searchParams.category || '';
  const level = searchParams.level || '';
  const type = searchParams.type || '';
  const sortBy = searchParams.sort || 'popular';
  const searchQuery = searchParams.search || '';
  
  try {
    // Fetch resources with filters
    const resourcesData = await getResources({
      page: currentPage,
      per_page: 12,
      category,
      level,
      type,
      search: searchQuery,
      orderby: sortBy === 'rating' ? 'rating' : sortBy === 'newest' ? 'date' : 'downloads',
      order: 'desc',
    });
    
    // Fetch resource categories
    const categories = await getResourceCategories();
    
    if (!resourcesData || !resourcesData.data) {
      return (
        <FluidContainer>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Resources</h1>
              <p className="text-muted-foreground">
                English learning materials and resources.
              </p>
            </div>
          </div>
        </FluidContainer>
      );
    }
    
    const { data: resources, total, totalPages, currentPage: page } = resourcesData;
    
    // Resource types and levels for filter
    const resourceTypes = [
      { id: 'worksheet', name: 'Worksheets', count: 45 },
      { id: 'guide', name: 'Study Guides', count: 32 },
      { id: 'audio', name: 'Audio Lessons', count: 28 },
      { id: 'video', name: 'Video Tutorials', count: 52 },
      { id: 'ebook', name: 'E-books', count: 18 },
      { id: 'template', name: 'Templates', count: 24 },
    ];
    
    const resourceLevels = [
      { id: 'beginner', name: 'Beginner', color: 'bg-green-100 text-green-800' },
      { id: 'intermediate', name: 'Intermediate', color: 'bg-blue-100 text-blue-800' },
      { id: 'advanced', name: 'Advanced', color: 'bg-purple-100 text-purple-800' },
      { id: 'expert', name: 'Expert', color: 'bg-orange-100 text-orange-800' },
    ];
    
    return (
      <FluidContainer>
        <div className="theme-transition bg-background">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 mb-4">
                  <span>Free Resources</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Free English Learning Resources
                </h1>
                <p className="text-xl mb-8 opacity-90">
                  Download worksheets, guides, audio lessons, and study materials 
                  specifically designed for Pakistani English learners.
                </p>
                
                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6 mb-8">
                  <div>
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm opacity-75">Resources</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">50K+</div>
                    <div className="text-sm opacity-75">Downloads</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm opacity-75">Free</div>
                  </div>
                </div>
                
                <Link
                  href="#featured"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
                >
                  Explore Resources
                  <span className="text-lg">↓</span>
                </Link>
              </div>
            </div>
          </section>
          
          {/* Download Stats */}
          <section className="py-8 bg-card">
            <div className="container mx-auto px-4">
              <DownloadStats />
            </div>
          </section>
          
          {/* Main Content */}
          <section className="py-12" id="featured">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-8">
                    {/* Resource Filter */}
                    <ResourceFilter
                      categories={categories}
                      types={resourceTypes}
                      levels={resourceLevels}
                      currentCategory={category}
                      currentType={type}
                      currentLevel={level}
                      currentSort={sortBy}
                      searchQuery={searchQuery}
                    />
                    
                    {/* Resource Categories */}
                    <div className="bg-card rounded-xl p-6 shadow-sm">
                      <h3 className="text-lg font-bold mb-4">
                        Resource Categories
                      </h3>
                      <ul className="space-y-2">
                        {categories.map((cat) => (
                          <li key={cat.id}>
                            <Link
                              href={`/resources?category=${cat.slug}`}
                              className={`flex items-center justify-between p-2 rounded hover:bg-background ${
                                category === cat.slug ? 'bg-background font-semibold' : ''
                              }`}
                            >
                              <span>{cat.name}</span>
                              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                {cat.count}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Trending Resources */}
                    <div className="bg-card rounded-xl p-6 shadow-sm">
                      <h3 className="text-lg font-bold mb-4">
                        Trending Now
                      </h3>
                      <TrendingSidebar 
                        resourceType="downloads"
                        limit={5}
                        showType={true}
                        showDownloads={true}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Resources Grid */}
                <div className="lg:col-span-3">
                  {/* Header with Stats */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {category ? `${category} Resources` : 'All Resources'}
                        {searchQuery && ` for "${searchQuery}"`}
                      </h2>
                      <p className="text-muted-foreground">
                        Showing {resources.length} of {total} resources
                      </p>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Sort by:{' '}
                      <select 
                        className="ml-2 px-3 py-1 rounded border bg-background"
                        defaultValue={sortBy}
                        onChange={(e) => {
                          const url = new URL(window.location.href);
                          url.searchParams.set('sort', e.target.value);
                          window.location.href = url.toString();
                        }}
                      >
                        <option value="popular">Most Popular</option>
                        <option value="newest">Newest</option>
                        <option value="rating">Highest Rated</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Resources Grid */}
                  {resources.length > 0 ? (
                    <>
                      <GridContainer columns={2} className="mb-8">
                        {resources.map((resource) => (
                          <ResourceCard
                            key={resource.id}
                            resource={resource}
                            showCategory={true}
                            showLevel={true}
                            showDownloads={true}
                            showRating={true}
                            showPreview={true}
                          />
                        ))}
                      </GridContainer>
                      
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
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">🔍</div>
                      <h3 className="text-xl font-semibold mb-2">
                        No resources found
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Try adjusting your filters or search terms.
                      </p>
                      <Link
                        href="/resources"
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        Clear Filters
                      </Link>
                    </div>
                  )}
                  
                  {/* Featured Categories */}
                  <div className="mt-16">
                    <h3 className="text-2xl font-bold mb-8">
                      Popular Resource Types
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        {
                          title: 'Grammar Worksheets',
                          description: 'Practice exercises and worksheets',
                          count: '120+',
                          icon: '📝',
                          color: 'bg-blue-50 text-blue-700'
                        },
                        {
                          title: 'Vocabulary Lists',
                          description: 'Themed word lists and flashcards',
                          count: '85+',
                          icon: '📚',
                          color: 'bg-green-50 text-green-700'
                        },
                        {
                          title: 'Audio Lessons',
                          description: 'Listening and pronunciation practice',
                          count: '65+',
                          icon: '🎧',
                          color: 'bg-purple-50 text-purple-700'
                        },
                        {
                          title: 'Speaking Guides',
                          description: 'Conversation and speaking tips',
                          count: '45+',
                          icon: '🎤',
                          color: 'bg-orange-50 text-orange-700'
                        }
                      ].map((type) => (
                        <Link
                          key={type.title}
                          href={`/resources?type=${type.title.toLowerCase().split(' ')[0]}`}
                          className="block p-6 rounded-xl bg-card hover:shadow-lg transition-all"
                        >
                          <div className={`w-12 h-12 rounded-lg ${type.color} flex items-center justify-center text-2xl mb-4`}>
                            {type.icon}
                          </div>
                          <h4 className="font-bold mb-2">{type.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {type.description}
                          </p>
                          <div className="text-sm font-semibold text-primary">
                            {type.count} resources
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* How to Use Section */}
          <section className="py-12 bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">
                How to Use These Resources
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: '01',
                    title: 'Download Resources',
                    description: 'Browse our collection and download materials that match your learning level and goals.',
                    icon: '⬇️'
                  },
                  {
                    step: '02',
                    title: 'Follow Study Plans',
                    description: 'Use our suggested study plans or create your own schedule for consistent practice.',
                    icon: '📅'
                  },
                  {
                    step: '03',
                    title: 'Track Progress',
                    description: 'Mark resources as completed and track your learning journey in your dashboard.',
                    icon: '📈'
                  }
                ].map((step) => (
                  <div
                    key={step.step}
                    className="bg-background rounded-xl p-6 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      {step.icon}
                    </div>
                    <div className="text-sm text-primary font-semibold mb-2">
                      Step {step.step}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Newsletter Section */}
          <section className="py-12 bg-card">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Get New Resources Weekly
                </h2>
                <p className="text-xl text-muted-foreground mb-6">
                  Subscribe to receive new worksheets, guides, and learning tips every week.
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-3 rounded border bg-background text-foreground"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-white font-semibold rounded hover:bg-primary-dark transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="text-sm text-muted-foreground mt-4">
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </section>
        </div>
      </FluidContainer>
    );
  } catch (error) {
    console.error('Error loading resources page:', error);
    return (
      <FluidContainer>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Resources</h1>
            <p className="text-muted-foreground">
              English learning materials and resources.
            </p>
          </div>
        </div>
      </FluidContainer>
    );
  }
}