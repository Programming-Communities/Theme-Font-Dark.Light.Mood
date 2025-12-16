export const WORDPRESS_AUTH_CONFIG = {
  // JWT Authentication settings
  jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production',
  jwtExpiresIn: '7d', // Token expiration
  
  // WordPress JWT Auth endpoints
  authEndpoint: '/wp-json/jwt-auth/v1/token',
  tokenValidateEndpoint: '/wp-json/jwt-auth/v1/token/validate',
  
  // Cookie settings
  cookieName: 'ec_token',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: '/',
  },
  
  // User roles and permissions
  roles: {
    admin: 'administrator',
    editor: 'editor',
    author: 'author',
    contributor: 'contributor',
    subscriber: 'subscriber',
  },
  
  // API rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // Limit each IP to 100 requests per windowMs
  },
} as const;
