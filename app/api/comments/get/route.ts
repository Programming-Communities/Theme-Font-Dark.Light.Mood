import { NextRequest, NextResponse } from 'next/server';
import { commentsManager } from '@/lib/wordpress/comments';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get('postId');
    const first = searchParams.get('first') ? parseInt(searchParams.get('first')!) : 10;
    const after = searchParams.get('after') || undefined;

    if (!postId) {
      return NextResponse.json({
        success: false,
        error: 'Post ID is required',
      }, { status: 400 });
    }

    const data = await commentsManager.getCommentsForPost(parseInt(postId), first, after);
    
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch comments',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
