import { NextRequest, NextResponse } from 'next/server';
import { wordpressClient } from '@/lib/wordpress/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');

    let data;
    
    if (slug) {
      data = await wordpressClient.getCategoryBySlug(slug);
    } else {
      data = await wordpressClient.getCategories();
    }
    
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch categories',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
