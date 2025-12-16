'use client';

import useSWR, { SWRConfiguration } from 'swr';
import { WordPressClient } from '@/lib/wordpress/client';
import { Post, Category, Tag, Comment, User, WordPressQueryParams } from '@/types/wordpress';

const wordpressClient = new WordPressClient();

export function useWordPressPosts(params?: WordPressQueryParams, config?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR(
    ['posts', params],
    () => wordpressClient.getPosts(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      ...config,
    }
  );

  return {
    posts: data?.posts || [],
    totalPages: data?.totalPages || 0,
    totalPosts: data?.totalPosts || 0,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useWordPressPost(slug: string, config?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? ['post', slug] : null,
    () => wordpressClient.getPostBySlug(slug),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      ...config,
    }
  );

  return {
    post: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useWordPressCategories(params?: WordPressQueryParams) {
  const { data, error, isLoading, mutate } = useSWR(
    ['categories', params],
    () => wordpressClient.getCategories(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  return {
    categories: data?.categories || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useWordPressTags(params?: WordPressQueryParams) {
  const { data, error, isLoading, mutate } = useSWR(
    ['tags', params],
    () => wordpressClient.getTags(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  return {
    tags: data?.tags || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useWordPressPage(slug: string) {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? ['page', slug] : null,
    () => wordpressClient.getPageBySlug(slug),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    page: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useWordPressSearch(query: string, params?: WordPressQueryParams) {
  const { data, error, isLoading, mutate } = useSWR(
    query ? ['search', query, params] : null,
    () => wordpressClient.searchPosts(query, params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    results: data?.results || [],
    totalResults: data?.totalResults || 0,
    isLoading,
    isError: error,
    mutate,
  };
}