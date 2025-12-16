import { wordpressClient } from './client';

export interface WordPressComment {
  id: string;
  databaseId: number;
  content: string;
  date: string;
  author: {
    node: {
      name: string;
      email?: string;
      avatar?: {
        url: string;
      };
    };
  };
  parentId: number | null;
  replies?: {
    nodes: WordPressComment[];
  };
}

export interface CommentsResponse {
  comments: {
    nodes: WordPressComment[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      endCursor?: string;
      startCursor?: string;
    };
  };
}

export interface SubmitCommentData {
  postId: number;
  content: string;
  author: string;
  email: string;
  website?: string;
  parentId?: number;
}

export class CommentsManager {
  // Get comments for a post
  async getCommentsForPost(postId: number, first: number = 10, after?: string) {
    const query = `
      query GetComments($postId: ID!, $first: Int = 10, $after: String) {
        comments(where: { contentId: $postId, parent: 0 }, first: $first, after: $after) {
          nodes {
            id
            databaseId
            content
            date
            author {
              node {
                name
                email
                avatar {
                  url
                }
              }
            }
            parentId
            replies(first: 10) {
              nodes {
                id
                databaseId
                content
                date
                author {
                  node {
                    name
                    email
                    avatar {
                      url
                    }
                  }
                }
                parentId
              }
            }
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

    return wordpressClient.query<CommentsResponse>(query, { postId, first, after });
  }

  // Submit a comment (using REST API since GraphQL mutations need auth setup)
  async submitComment(data: SubmitCommentData) {
    // This uses WordPress REST API
    const formData = new FormData();
    formData.append('post', data.postId.toString());
    formData.append('content', data.content);
    formData.append('author_name', data.author);
    formData.append('author_email', data.email);
    
    if (data.website) {
      formData.append('author_url', data.website);
    }
    
    if (data.parentId) {
      formData.append('parent', data.parentId.toString());
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/comments`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to submit comment: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting comment:', error);
      throw error;
    }
  }

  // Get comment count for a post
  async getCommentCount(postId: number) {
    const query = `
      query GetCommentCount($postId: ID!) {
        post(id: $postId, idType: DATABASE_ID) {
          commentCount
        }
      }
    `;

    return wordpressClient.query(query, { postId });
  }

  // Format comment date
  formatCommentDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Check if comment is pending approval
  isCommentPending(comment: any): boolean {
    return comment.status === 'hold';
  }
}

// Singleton instance
export const commentsManager = new CommentsManager();
