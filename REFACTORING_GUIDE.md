# E-Commerce Front-End Refactoring Guide

This document outlines the refactored Next.js project structure following latest Next.js best practices and integrating with the DummyJSON API.

## 📁 New Project Structure

```
src/
├── app/
│   ├── api/                          # API routes
│   │   ├── products/
│   │   │   ├── route.ts              # GET /api/products
│   │   │   └── [id]/
│   │   │       └── route.ts          # GET /api/products/:id
│   │   └── categories/
│   │       └── route.ts              # GET /api/categories
│   ├── (Auth)/
│   │   └── login/
│   │       └── page.tsx              # Login page
│   ├── (Shopping)/
│   │   ├── category/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx          # Category products page
│   │   │   ├── loading.tsx           # Category loading skeleton
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Dynamic category page
│   │   └── product/
│   │       ├── page.tsx              # Products listing
│   │       ├── loading.js            # Products loading skeleton
│   │       └── [slug]/
│   │           └── page.tsx          # Product detail page
│   ├── (User)/
│   │   └── profile/
│   │       └── [slug]/
│   │           └── page.tsx          # User profile page
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home page
│   └── globals.css                   # Global styles
├── components/
│   ├── layout/
│   │   ├── Header.tsx                # Header component
│   │   └── Footer.tsx                # Footer component
│   ├── features/
│   │   ├── ProductCard.tsx           # Product card component
│   │   ├── CategoryFilter.tsx        # Category filter component
│   │   ├── Pagination.tsx            # Pagination component
│   │   └── ProductGridSkeleton.tsx   # Loading skeleton
│   └── ui/
│       ├── button.tsx                # UI Button
│       └── skeleton.tsx              # UI Skeleton
├── lib/
│   ├── utils.ts                      # Utility functions
│   └── constants.ts                  # Constants (API config, etc.)
├── services/
│   └── productService.ts             # Product API service
├── types/
│   ├── product.ts                    # Product types
│   └── category.ts                   # Category types
└── hooks/                            # Custom React hooks
```

## 🔄 API Routes

### Products API
- **GET /api/products** - Fetch all products with pagination
  - Query params: `skip`, `limit`, `category`, `q` (search)
- **GET /api/products/:id** - Fetch single product by ID
- **GET /api/categories** - Fetch all available categories

## 🎯 Key Features

### 1. **DummyJSON API Integration**
All product data is fetched from DummyJSON API (https://dummyjson.com/)
- Products with images, prices, ratings, and stock info
- Categories support
- Full-text search capability
- Built-in pagination

### 2. **Service Layer**
`src/services/productService.ts` provides:
- `fetchProducts()` - Get all products with filters
- `fetchProductById()` - Get single product details
- `fetchCategories()` - Get available categories
- `searchProducts()` - Search products by query
- Simple in-memory caching for better performance

### 3. **API Routes**
RESTful API routes in `src/app/api/` handle:
- Request validation
- Error handling
- Caching strategies
- Response formatting

### 4. **Component Organization**

#### Layout Components (`src/components/layout/`)
- **Header.tsx** - Navigation header with search
- **Footer.tsx** - Footer with links and info

#### Feature Components (`src/components/features/`)
- **ProductCard.tsx** - Reusable product card with images, prices, ratings
- **CategoryFilter.tsx** - Category dropdown filter
- **Pagination.tsx** - Pagination controls
- **ProductGridSkeleton.tsx** - Loading state skeleton

### 5. **Pages Structure**
- **Home Page** (`/`) - Hero section, featured categories, newsletter signup
- **Products Listing** (`/products`) - Full product catalog with filtering & pagination
- **Product Detail** (`/products/:id`) - Detailed product view with gallery and actions
- **Category Page** (`/category/:slug`) - Products filtered by category
- **Login Page** (`/login`) - Authentication page (placeholder)
- **Profile Page** (`/profile/:slug`) - User profile (placeholder)

### 6. **Type Safety**
Strong TypeScript types for:
- Product interface matching DummyJSON API response
- ProductsResponse with pagination info
- ProductFilters for query parameters
- Category types

### 7. **Utilities**
Helper functions in `src/lib/utils.ts`:
- `cn()` - Classname merging (Tailwind + clsx)
- `formatPrice()` - Format numbers as Vietnamese currency
- `calculateDiscountedPrice()` - Calculate discount prices
- `handleApiError()` - Error handling utility

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Visit http://localhost:3000

### 3. Build for Production
```bash
npm run build
npm start
```

## 📦 Dependencies

### Core
- **next** (16.1.4) - React framework
- **react** (19.2.3) - UI library
- **react-dom** (19.2.3) - React DOM

### Styling
- **tailwindcss** (4) - Utility-first CSS
- **@tailwindcss/postcss** (4) - PostCSS plugin
- **clsx** (2.1.1) - Classname utility
- **tailwind-merge** (3.4.0) - Merge Tailwind classes

### UI Components
- **lucide-react** (0.563.0) - Icon library
- **@radix-ui/react-slot** (1.2.4) - Headless component utility
- **class-variance-authority** (0.7.1) - CSS-in-JS solution

## 🔧 Development Best Practices

### 1. **Server vs Client Components**
- Use server components by default for better performance
- Mark components with `'use client'` only when needed (interactivity, hooks)

### 2. **Data Fetching**
- Use API routes for client-side fetches
- Implement caching with `next: { revalidate: ... }`
- Handle errors gracefully with try-catch

### 3. **Image Optimization**
- Always use Next.js `Image` component
- Specify width/height for better performance
- Use `fill` prop for container-based sizing

### 4. **Styling**
- Use Tailwind CSS utility classes
- Keep component styles scoped
- Use `cn()` utility for dynamic classnames

### 5. **State Management**
- Use React hooks (useState, useEffect) for component state
- Pass props for data flow
- Consider Context API for global state (future enhancement)

## 📝 Example: Adding a New Feature

### 1. Create API Route
```typescript
// src/app/api/newfeature/route.ts
export async function GET(request: NextRequest) {
  // Handle request
}
```

### 2. Create Service
```typescript
// src/services/newFeatureService.ts
export async function fetchNewFeature() {
  // Fetch from API
}
```

### 3. Create Component
```typescript
// src/components/features/NewFeature.tsx
'use client';
export function NewFeature() {
  // Component implementation
}
```

### 4. Use in Page
```typescript
// src/app/newpage/page.tsx
import { NewFeature } from '@/components/features/NewFeature';

export default function Page() {
  return <NewFeature />;
}
```

## 🎨 Styling Customization

### Tailwind Configuration
- Configured in `tailwind.config.mjs`
- Supports dark mode with `dark:` prefix
- Custom colors and spacing can be added to config

### Color Scheme
- Primary: Blue (#2563eb)
- Background: White/Gray-950
- Text: Gray-900/White

## 🔒 Environment Variables
Create `.env.local` for any environment-specific settings:
```
NEXT_PUBLIC_API_URL=https://dummyjson.com
```

## 📚 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [DummyJSON API](https://dummyjson.com)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🤝 Contributing

When adding new features:
1. Follow the established component structure
2. Add proper TypeScript types
3. Use the service layer for API calls
4. Test responsiveness on mobile devices
5. Ensure accessibility standards

## ⚠️ Important Notes

### Data Caching
The product service includes a simple in-memory cache. For production:
- Consider using Redis or similar for distributed caching
- Implement cache invalidation strategy
- Use Next.js ISR (Incremental Static Regeneration) for pages

### Authentication
Login and profile pages are placeholders. Implement:
- Authentication provider (NextAuth.js recommended)
- Protected routes middleware
- User session management

### Shopping Cart
Add to cart functionality needs:
- State management (Context API or Redux)
- Local storage persistence
- Cart API routes
- Checkout flow

## 📞 Support

For issues or questions:
1. Check existing code examples
2. Refer to Next.js documentation
3. Review type definitions
4. Check browser console for errors
