import { NextRequest, NextResponse } from 'next/server';
import { wordpressClient } from '@/lib/wordpress/client';
import { GRAPHQL_QUERIES } from '@/config/wordpress.config';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const first = parseInt(searchParams.get('first') || '10');
    const after = searchParams.get('after') || undefined;
    const category = searchParams.get('category') || undefined;

    let query = GRAPHQL_QUERIES.GET_POSTS;
    let variables: any = { first, after };

    // If category is specified, modify the query
    if (category) {
      query = `
        query GetPostsByCategory($category: String!, $first: Int = 10, $after: String) {
          posts(
            first: $first, 
            after: $after,
            where: { categoryName: $category }
          ) {
            nodes {
              id
              databaseId
              title
              slug
              excerpt
              date
              modified
              featuredImage {
                node {
                  sourceUrl
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
              }
              categories {
                nodes {
                  id
                  name
                  slug
                }
              }
              author {
                node {
                  name
                  avatar {
                    url
                  }
                }
              }
              commentCount
              commentStatus
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              endCursor
              startCursor
            }
          }
        }
      `;
      variables.category = category;
    }

    const data = await wordpressClient.query(query, variables);
    
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch posts',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({
        success: false,
        error: 'Post slug is required',
      }, { status: 400 });
    }

    const data = await wordpressClient.getPostBySlug(slug);
    
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch post',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
