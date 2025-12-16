import { NextRequest, NextResponse } from 'next/server';
import { reactionsManager } from '@/lib/reactions/reactions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, reaction } = body;

    if (!postId || !reaction) {
      return NextResponse.json({
        success: false,
        error: 'Post ID and reaction type are required',
      }, { status: 400 });
    }

    // Validate reaction type
    const validReactions = ['like', 'love', 'insightful', 'helpful', 'celebrate'];
    if (!validReactions.includes(reaction)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid reaction type',
      }, { status: 400 });
    }

    const stats = await reactionsManager.updateReaction(
      parseInt(postId),
      reaction as any
    );
    
    return NextResponse.json({
      success: true,
      data: stats,
      message: 'Reaction updated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating reaction:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update reaction',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
