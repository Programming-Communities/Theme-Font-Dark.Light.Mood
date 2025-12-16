import { NextRequest, NextResponse } from 'next/server';
import { reactionsManager } from '@/lib/reactions/reactions';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({
        success: false,
        error: 'Post ID is required',
      }, { status: 400 });
    }

    const stats = await reactionsManager.getReactions(parseInt(postId));
    
    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching reactions:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch reactions',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
