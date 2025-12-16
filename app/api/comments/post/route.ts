import { NextRequest, NextResponse } from 'next/server';
import { commentsManager } from '@/lib/wordpress/comments';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, content, author, email, website, parentId } = body;

    // Basic validation
    if (!postId || !content || !author || !email) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: postId, content, author, email',
      }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email address',
      }, { status: 400 });
    }

    const commentData = {
      postId: parseInt(postId),
      content,
      author,
      email,
      website,
      parentId: parentId ? parseInt(parentId) : undefined,
    };

    const result = await commentsManager.submitComment(commentData);
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Comment submitted successfully. It will appear after approval.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error posting comment:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit comment',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
