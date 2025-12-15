export const GET_POSTS = `
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
`;

export const GET_POST_BY_SLUG = `
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
`;

export const GET_CATEGORIES = `
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
`;

export const GET_CATEGORY_BY_SLUG = `
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
`;

export const GET_TAGS = `
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
`;

export const GET_RECENT_POSTS = `
  query GetRecentPosts($first: Int = 5) {
    posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
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
      }
    }
  }
`;

export const GET_POPULAR_POSTS = `
  query GetPopularPosts($first: Int = 5) {
    posts(first: $first, where: { orderby: { field: COMMENT_COUNT, order: DESC } }) {
      nodes {
        id
        databaseId
        title
        slug
        excerpt
        date
        commentCount
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
      }
    }
  }
`;
