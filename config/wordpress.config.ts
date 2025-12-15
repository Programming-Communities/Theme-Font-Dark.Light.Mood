export const WORDPRESS_CONFIG = {
  url: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://your-wordpress-site.com',
  graphqlEndpoint: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT || '/graphql',
  apiTimeout: 10000, // 10 seconds
  cacheTime: 60 * 1000, // 1 minute
} as const;

export const GRAPHQL_QUERIES = {
  GET_POSTS: `
    query GetPosts($first: Int = 10, $after: String) {
      posts(first: $first, after: $after) {
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
  `,
  
  GET_POST_BY_SLUG: `
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        databaseId
        title
        slug
        content
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
        tags {
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
    }
  `,
  
  GET_CATEGORIES: `
    query GetCategories {
      categories {
        nodes {
          id
          name
          slug
          description
          count
        }
      }
    }
  `,
  
  GET_CATEGORY_BY_SLUG: `
    query GetCategoryBySlug($slug: ID!, $first: Int = 10, $after: String) {
      category(id: $slug, idType: SLUG) {
        id
        name
        slug
        description
        count
        posts(first: $first, after: $after) {
          nodes {
            id
            databaseId
            title
            slug
            excerpt
            date
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
    }
  `,
  
  GET_TAGS: `
    query GetTags {
      tags {
        nodes {
          id
          name
          slug
          count
        }
      }
    }
  `,
} as const;
