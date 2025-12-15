import { NextRequest, NextResponse } from 'next/server';
import { wordpressClient } from '@/lib/wordpress/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mediaId } = body;

    if (!mediaId) {
      return NextResponse.json({
        success: false,
        error: 'Media ID is required',
      }, { status: 400 });
    }

    const query = `
      query GetMedia($id: ID!) {
        mediaItem(id: $id, idType: DATABASE_ID) {
          id
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
          caption
          description
        }
      }
    `;

    const data = await wordpressClient.query(query, { id: parseInt(mediaId) });
    
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch media',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
