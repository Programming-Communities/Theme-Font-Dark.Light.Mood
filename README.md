

```markdown
#  ENGLISH COMMUNITIES PK PROJECT

## PROJECT OVERVIEW
**Project:** English Communities PK - Complete Next.js 16.0.10 Hybrid WordPress Platform
**Status:** ✅ Phase 1-3 COMPLETED - Need to create remaining missing files
**Frontend:** https://english.communities.pk/
**Backend:** https://api.communities.pk/ (WordPress with WPGraphQL + ACF + Yoast SEO + JWT Auth)

## TECHNICAL STACK
- **Next.js 16.0.10** (App Router)
- **TypeScript** (strict mode)
- **React 19** with hooks
- **Tailwind CSS** for styling
- **WordPress Backend** with WPGraphQL
- **No src/ folder** architecture
- **Hybrid rendering** (SSG, SSR, ISR)

## EXISTING STRUCTURE (VALIDATED)
```
english.communities.pk/
├── ✅ app/
│   ├── layout.tsx (Root layout with ThemeProvider)
│   ├── page.tsx (Homepage)
│   ├── auth/
│   ├── api/
│   ├── blog/
│   ├── category/
│   └── search/
├── ✅ components/
│   ├── theme/
│   │   ├── ThemeProvider.tsx
│   │   ├── ThemeSelector.tsx
│   │   ├── FontSelector.tsx
│   │   └── ThemeToggle.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Navigation.tsx
│   ├── ui/
│   │   └── Button.tsx
│   ├── sections/
│   │   └── HeroSection.tsx
│   └── providers/
│       └── Providers.tsx
├── ✅ lib/
│   ├── wordpress.ts (WordPress client)
│   ├── auth.ts (JWT authentication)
│   ├── search.ts (Search utilities)
│   ├── analytics.ts (GA4 + Facebook Pixel)
│   ├── cookies.ts (GDPR cookie consent)
│   ├── reactions.ts (Reactions system)
│   └── utils.ts (Utility functions)
├── ✅ config/
│   ├── wordpress.config.ts
│   └── wordpress-auth.config.ts
├── ✅ types/
│   ├── theme.d.ts
│   ├── wordpress.d.ts
│   └── global.d.ts
├── ✅ styles/
│   └── globals.css
├── ✅ public/
│   ├── icons/
│   ├── android/
│   └── ios/
└── ✅ root files (next.config.ts, tsconfig.json, package.json, etc.)
```

## MISSING FILES TO CREATE (PRIORITY ORDER)

### 1. HOOKS (CRITICAL - 11 files)
```
hooks/
├── useWordPress.ts          # Main WordPress data fetching with SWR + caching
├── useComments.ts          # Nested comments with replies, validation, moderation
├── useReactions.ts         # 5 reaction types with animations, persistence
├── useCookies.ts           # GDPR cookie consent management
├── useAuth.ts             # JWT auth with WordPress user sync
├── useDevice.ts           # Mobile/tablet/desktop detection
├── useAds.ts              # Ad placement and management
├── useSearch.ts           # Real-time search with suggestions + filters
├── usePagination.ts       # Pagination logic for WordPress queries
├── useDebounce.ts         # Search/input debouncing
└── useLocalStorage.ts     # Theme/font preferences persistence
```

### 2. SEO COMPONENTS (4 files)
```
components/ui/seo/
├── Breadcrumb.tsx         # Dynamic breadcrumbs with schema markup
├── OpenGraph.tsx          # Open Graph + Twitter Card meta tags
├── SchemaMarkup.tsx       # JSON-LD for posts, articles, organizations
└── MetaTags.tsx          # Complete meta tag management with Yoast fallback
```

### 3. COMMON UI COMPONENTS (6 files)
```
components/ui/common/
├── Input.tsx              # Reusable input with validation + error states
├── Loader.tsx            # Loading spinners/skeletons with theme support
├── Alert.tsx             # Alert/notification system (success/error/warning)
├── Badge.tsx             # Category/tag badges with theme colors
├── Tabs.tsx              # Accessible tab navigation
└── Pagination.tsx        # Pagination with WordPress query integration
```

### 4. SKELETON LOADERS (5 files)
```
components/ui/skeleton/
├── CardSkeleton.tsx      # Article card skeleton
├── ListSkeleton.tsx      # Post list skeleton
├── GridSkeleton.tsx      # Grid layout skeleton
├── HeroSkeleton.tsx      # Hero section skeleton
└── SidebarSkeleton.tsx   # Sidebar loading skeleton
```

### 5. INTERACTION COMPONENTS (4 files)
```
components/ui/interactions/
├── ShareButtons.tsx      # Social sharing (Facebook, Twitter, LinkedIn, WhatsApp)
├── BookmarkButton.tsx    # Save/bookmark with localStorage
├── ReadProgress.tsx      # Article reading progress indicator
└── NewsletterForm.tsx    # Email subscription with validation
```

### 6. SECTION COMPONENTS (7 files)
```
components/sections/
├── StatsSection.tsx      # Statistics display (views, comments, shares)
├── CTASection.tsx        # Call-to-action with theme colors
├── NewsletterSection.tsx # Newsletter signup section
├── RecentPostsSection.tsx # Recent posts grid
├── PopularSection.tsx    # Popular posts (based on views/reactions)
├── TrendingSection.tsx   # Trending content algorithm
└── AdSection.tsx         # Ad placement section with multiple sizes
```

### 7. LAYOUT COMPONENTS (8 files)
```
components/layout/
├── Footer/
│   ├── FooterLinks.tsx   # Footer navigation with WordPress menus
│   └── SocialIcons.tsx   # Social media links with theme colors
├── Sidebar/
│   ├── TrendingSidebar.tsx # Trending posts widget
│   └── CategorySidebar.tsx # Category navigation tree
└── Container/
    ├── GridContainer.tsx  # Responsive grid container
    └── FluidContainer.tsx # Full-width fluid container
```

### 8. LIBRARY MODULES (12 files)
```
lib/
├── ads/
│   ├── manager.ts        # Ad rotation, targeting, frequency capping
│   ├── config.ts         # Ad slot configurations (728x90, 300x250, etc.)
│   ├── types.ts          # Ad type definitions
│   └── utils.ts          # Ad loading and display utilities
├── seo/
│   ├── generator.ts      # Meta tag generator with Yoast integration
│   ├── schemas.ts        # Schema.org schemas (Article, Organization, Breadcrumb)
│   └── utils.ts          # SEO helper functions
└── utils/
    ├── device.ts         # Device detection and responsive utilities
    ├── format.ts         # Text formatting (dates, numbers, excerpts)
    ├── validation.ts     # Form validation utilities
    ├── api.ts            # API client with error handling
    └── constants.ts      # Application-wide constants
```

### 9. CONFIGURATION FILES (5 files)
```
config/
├── site.config.ts        # Site metadata, URLs, social links
├── ads.config.ts         # Ad network configurations
├── theme.config.ts       # 14 themes configuration with CSS variables
├── seo.config.ts         # SEO default values, sitemap settings
└── pwa.config.ts         # PWA manifest, service worker config
```

### 10. TYPE DEFINITIONS (4 files)
```
types/
├── ads.d.ts              # Advertisement interfaces
├── components.d.ts       # Component prop types
├── api.d.ts              # API request/response types
└── user.d.ts             # User authentication types
```

### 11. STYLE FILES (3 files)
```
styles/
├── theme.css            # CSS variables for 14 themes
├── utilities.css        # Custom utility classes
└── animations.css       # Keyframe animations for reactions/transitions
```

### 12. APP PAGES (6 files)
```
app/
├── tags/
│   ├── page.tsx         # All tags listing
│   └── [slug]/page.tsx  # Individual tag archive
├── community/
│   └── page.tsx         # Community guidelines/participation
├── resources/
│   └── page.tsx         # Resources library
├── about/
│   └── page.tsx         # About page with team info
├── loading.tsx          # App-level loading component
├── error.tsx            # App-level error boundary
└── not-found.tsx        # Custom 404 page
```

### 13. PUBLIC ASSETS (5 files)
```
public/
├── ads/
│   ├── placeholder-728x90.png
│   ├── placeholder-300x250.png
│   └── placeholder-320x50.png
└── themes/
    └── previews/
        ├── professional-blue.png
        └── corporate-green.png
```

## THEME SYSTEM SPECIFICATIONS (CRITICAL)

### 14 Available Themes:
1. professional-blue
2. corporate-green
3. premium-purple
4. luxury-gold
5. minimal-gray
6. tech-cyan
7. nature-green
8. ocean-blue
9. sunset-orange
10. midnight-purple
11. rose-pink
12. vibrant-red
13. cool-teal
14. classic-white

### Each Theme Includes:
- **Light Mode Colors:** primary, secondary, background, surface, text, border, success, warning, error, shadow
- **Dark Mode Colors:** Same properties with adjusted values
- **Metadata:** name, category, icon, description, preview image
- **CSS Variables:** `--primary`, `--secondary`, `--background`, `--surface`, etc.

### Font System (10+ Fonts):
- Default: `system-ui`
- Options: `Inter`, `Roboto`, `Open Sans`, `Poppins`, `Montserrat`, `Merriweather`, `Playfair Display`, `Lora`, `Source Sans Pro`, `Nunito`
- Implementation: `var(--font-family)` with fallbacks

### Theme Features:
- localStorage persistence (theme, darkMode, fontFamily)
- Dark/light mode toggle with system preference detection
- Font selector with preview
- Theme settings panel in side menu
- Smooth transitions between themes

## WORDPRESS INTEGRATION DETAILS

### Endpoints:
- **GraphQL:** `https://api.communities.pk/graphql`
- **REST API:** `https://api.communities.pk/wp-json`
- **JWT Auth:** `https://api.communities.pk/wp-json/jwt-auth/v1`

### Required Queries:
- Posts with pagination, filtering, sorting
- Categories and tags hierarchies
- Comments with nested replies
- User profiles and roles
- ACF custom fields
- Yoast SEO meta

### Authentication Flow:
1. User login via WordPress credentials
2. JWT token generation and storage
3. Token refresh mechanism
4. Protected route validation
5. User role-based permissions

## INTERACTIVE FEATURES SPECIFICATIONS

### Comments System:
- Nested comments (up to 3 levels)
- Reply threading
- Moderation queue
- Spam validation
- Email notifications
- Avatar support (Gravatar)

### Reactions (5 Types):
1. Like (👍)
2. Love (❤️)
3. Insightful (💡)
4. Helpful (✅)
5. Celebrate (🎉)
- Animated feedback
- Persistent user reactions
- Aggregate counts
- Rate limiting

### Search System:
- Real-time suggestions
- Recent searches storage
- Category filtering
- Tag-based results
- Full-text search
- Search analytics

### Analytics Integration:
- Google Analytics 4 with custom events
- Facebook Pixel conversion tracking
- GDPR-compliant data collection
- Anonymized IP addresses
- Cookie consent integration

### Cookie Consent:
- GDPR compliance banner
- Category toggles (essential, analytics, marketing)
- Preference saving
- Periodic renewal prompts

## PERFORMANCE REQUIREMENTS

### Optimization Targets:
- Lighthouse score >90
- Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
- PWA ready (offline support, install prompt)
- Image optimization (WebP, responsive images)
- Code splitting and lazy loading
- SWR caching with stale-while-revalidate

### Security Measures:
- JWT token secure storage
- CSRF protection
- Security headers via middleware
- XSS prevention
- Rate limiting on API routes

## CODING STANDARDS

### TypeScript:
- Strict mode enabled
- Explicit return types
- Interface over type where possible
- No `any` types
- Comprehensive type definitions

### React/Next.js:
- Server components by default
- "use client" only when necessary
- Proper error boundaries
- Loading states for all async operations
- Accessible HTML semantics

### Styling:
- Tailwind CSS utility classes
- CSS variables for theming
- Responsive design (mobile-first)
- Dark mode support
- Consistent spacing scale

### Architecture:
- Component-based modular design
- Separation of concerns
- Reusable hooks and utilities
- Clean import/export patterns
- Environment-based configurations

## CRITICAL IMPLEMENTATION NOTES

### NO DEMO DATA:
- All components must work with real WordPress data
- Use actual GraphQL queries and mutations
- Implement proper error handling for missing data
- Fallback UI for empty states

### Hybrid Architecture:
- Server components for static/SEO content
- Client components for interactivity
- Proper hydration boundaries
- Shared data fetching patterns

### SEO Requirements:
- Dynamic meta tags per page/post
- JSON-LD structured data
- XML sitemap generation
- robots.txt configuration
- Canonical URLs
- Open Graph and Twitter Cards

### Accessibility (WCAG 2.1 AA):
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader compatibility
- Color contrast compliance
- Semantic HTML structure

### Error Handling:
- Graceful error states
- User-friendly error messages
- Sentry integration ready
- Retry mechanisms
- Fallback content

## FILE CREATION PRIORITY ORDER

1. **Hooks** (useWordPress, useComments, useReactions) - CRITICAL
2. **SEO Components** (MetaTags, SchemaMarkup) - HIGH PRIORITY
3. **Common UI** (Input, Loader, Alert) - HIGH PRIORITY
4. **Skeleton Loaders** - MEDIUM PRIORITY
5. **Section Components** - MEDIUM PRIORITY
6. **Layout Components** - MEDIUM PRIORITY
7. **Library Modules** - LOW PRIORITY
8. **Configuration Files** - LOW PRIORITY
9. **App Pages** - LOW PRIORITY
10. **Assets and Styles** - LOW PRIORITY

## IMPLEMENTATION GUIDELINES

### For Each File Created:
1. **Complete TypeScript typing** with interfaces/types
2. **Proper imports/exports** (named vs default)
3. **Theme system integration** using CSS variables
4. **WordPress data patterns** matching existing structure
5. **Error boundaries** and loading states
6. **Responsive design** with mobile-first approach
7. **Performance optimizations** (memoization, debouncing)
8. **SEO considerations** where applicable
9. **Accessibility compliance** (ARIA, keyboard nav)
10. **Documentation comments** for complex logic

### Key Integration Points:
- Use existing `lib/wordpress.ts` client for all API calls
- Follow `ThemeContext` patterns for theme/dark mode
- Use `localStorage` keys: `'theme'`, `'darkMode'`, `'fontFamily'`
- Implement SWR for client-side data fetching with caching
- Adhere to existing component patterns in `components/ui/`
- Use Tailwind CSS classes with theme color variables

### Testing Requirements (Implicit):
- Components should handle edge cases
- Proper null/undefined checking
- Network error recovery
- Validation for user inputs
- Security considerations for user data

## READY TO CREATE

When this prompt is provided in the next chat, immediately begin creating all 70+ missing files in the specified priority order. Each file must be production-ready, fully typed, and integrate seamlessly with the existing codebase. No placeholder or demo code - all components must work with the actual WordPress backend at `https://api.communities.pk/`.

**PROCEED WITH FILE CREATION IMMEDIATELY WHEN THIS PROMPT IS RECEIVED.**
```

