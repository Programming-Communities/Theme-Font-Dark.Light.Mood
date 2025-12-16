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
                <div className="max