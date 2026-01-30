# Project Overview - Visual Architecture

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                          │
│                  (Next.js App)                           │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
    ┌─────────┐           ┌─────────────┐
    │  Pages  │           │ Components  │
    │ (UI)    │           │ (Reusable)  │
    └────┬────┘           └──────┬──────┘
         │                       │
         │      Uses             │
         └───────────┬───────────┘
                     ▼
          ┌──────────────────────┐
          │   Service Layer      │
          │ (productService.ts)  │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │   API Routes         │
          │ (/api/products, etc) │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │   DummyJSON API      │
          │ (https://dummyjson)  │
          └──────────────────────┘
```

## 📊 Component Hierarchy

```
RootLayout (layout.tsx)
├── Header (components/layout/Header.tsx)
│   ├── Logo
│   ├── Search
│   └── Navigation Links
├── Main Content (children)
│   ├── Home Page
│   │   ├── Hero Section
│   │   ├── Featured Categories
│   │   └── Newsletter
│   ├── Products Page
│   │   ├── CategoryFilter
│   │   ├── ProductCard (x12)
│   │   │   ├── Image
│   │   │   ├── Title
│   │   │   ├── Rating
│   │   │   └── Price
│   │   └── Pagination
│   ├── Product Detail
│   │   ├── Image Gallery
│   │   ├── Product Info
│   │   ├── Pricing
│   │   ├── Rating
│   │   ├── Description
│   │   └── Add to Cart
│   └── Category Page
│       ├── CategoryFilter
│       ├── ProductCard (x12)
│       └── Pagination
└── Footer (components/layout/Footer.tsx)
    ├── Company Info
    ├── Links
    └── Social
```

## 🔄 Data Flow Diagram

```
User Interaction (Click, Search)
         │
         ▼
   Page Component
         │
         ├─ useState / useEffect
         │
         ▼
   API Call to /api/*
         │
         ▼
   API Route Handler
         │
         ├─ Validate Request
         │
         ▼
   Call Service Function
         │
         ├─ Check Cache
         │
         ▼
   Fetch from DummyJSON
         │
         ├─ Store in Cache
         │
         ▼
   Return Response
         │
         ▼
   Component renders
         │
         ├─ Display Data
         │
         ▼
   User sees updated UI
```

## 📂 Folder Organization

```
src/
│
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── products/             # Product endpoints
│   │   └── categories/           # Category endpoints
│   │
│   ├── (Auth)/                   # Auth route group
│   │   └── login/
│   │
│   ├── (Shopping)/               # Shopping route group
│   │   ├── product/              # Products
│   │   └── category/             # Categories
│   │
│   ├── (User)/                   # User route group
│   │   └── profile/
│   │
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
│
├── components/                   # React Components
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   │
│   ├── features/                 # Feature components
│   │   ├── ProductCard.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── Pagination.tsx
│   │   └── ProductGridSkeleton.tsx
│   │
│   └── ui/                       # Base UI components
│       ├── button.tsx
│       └── skeleton.tsx
│
├── services/                     # API Services
│   └── productService.ts         # Product API logic
│
├── lib/                          # Utilities
│   ├── utils.ts                  # Helper functions
│   └── constants.ts              # Configuration
│
├── types/                        # TypeScript Types
│   ├── product.ts
│   └── category.ts
│
└── hooks/                        # Custom Hooks
```

## 🔌 API Endpoints

```
GET /api/products
├── Query: skip, limit, category, q
└── Returns: { products, total, skip, limit }

GET /api/products/:id
└── Returns: { id, title, price, images, ... }

GET /api/categories
└── Returns: { categories: [string] }
```

## 🎨 Styling Architecture

```
Tailwind CSS
│
├── Utility Classes (px-4, py-2, etc)
├── Responsive Breakpoints (sm:, md:, lg:)
├── Dark Mode (dark:)
│
└── Custom Components
    ├── ProductCard
    ├── Header
    ├── Footer
    └── Pagination
```

## 🔐 Type System

```
Product Interface
├── id: number
├── title: string
├── description: string
├── price: number
├── discountPercentage: number
├── rating: number
├── stock: number
├── brand: string
├── category: string
├── thumbnail: string
├── images: string[]
└── tags: string[]

ProductsResponse
├── products: Product[]
├── total: number
├── skip: number
└── limit: number

ProductFilters
├── skip?: number
├── limit?: number
├── category?: string
└── sortBy?: string
```

## 🚀 Build Pipeline

```
Source Code (TypeScript + TSX)
         │
         ▼
   Next.js Compiler
         │
         ├─ TypeScript Check
         ├─ Bundle Splitting
         ├─ Asset Optimization
         │
         ▼
   Tailwind CSS Processing
         │
         ├─ Purge Unused Styles
         ├─ Minify CSS
         │
         ▼
   Production Build
         │
         ├─ .next/ folder
         │
         ▼
   Ready for Deployment
```

## 📱 Responsive Breakpoints

```
Mobile First Approach:
│
├─ Default (< 640px)     - Base styles
├─ sm: (640px+)          - Tablets
├─ md: (768px+)          - Small Desktop
├─ lg: (1024px+)         - Desktop
└─ xl: (1280px+)         - Large Desktop

Example:
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
  │ 1 column  │ 3 columns   │ 4 columns
  └─ mobile   ├─ tablet     └─ desktop
```

## 🔄 Feature Implementation Flow

```
1. Create Service Function
   └─ Define API call logic

2. Create API Route
   └─ Expose as endpoint

3. Create Component
   └─ UI representation

4. Integrate in Page
   └─ Fetch & Display

5. Add Styling
   └─ Responsive design

6. Test
   └─ Browser testing
```

## 📊 Performance Metrics

```
Caching Strategy
│
├─ In-Memory Cache (productService.ts)
│   ├─ Products: 5 minutes
│   ├─ Categories: 10 minutes
│   └─ Product Detail: 10 minutes
│
├─ Browser Cache
│   └─ Next.js Caching Headers
│
└─ CDN Ready
    └─ Images served via next/image
```

## 🎯 Development Workflow

```
1. Start Dev Server
   npm run dev
   │
   ├─ Hot Module Reload (HMR)
   ├─ Fast Refresh
   │
   ▼
2. Edit Code
   │
   ├─ Browser auto-updates
   ├─ TypeScript checks
   │
   ▼
3. Test Changes
   │
   ├─ Browser debugging
   ├─ Network inspection
   │
   ▼
4. Commit Changes
   │
   ├─ git add .
   ├─ git commit -m "feat: ..."
   │
   ▼
5. Deploy
   npm run build
   npm start
```

## 🛡️ Error Handling

```
User Action
    │
    ▼
Try-Catch Block
    │
    ├─ Success Path
    │   └─ Update State
    │
    └─ Error Path
        ├─ Log Error
        ├─ Display Message
        └─ Show Fallback UI
```

## 🎨 Theming (Dark Mode)

```
html element
    │
    ├─ class="dark"  → Dark theme active
    └─ no class      → Light theme active

Tailwind Usage:
<div className="bg-white dark:bg-gray-800">
           light              dark
</div>
```

## ✅ Quality Assurance

```
Code Quality
├─ TypeScript Checking ✅
├─ Import Validation ✅
├─ Type Safety ✅
└─ Linting (ESLint) ✅

Functionality
├─ API Endpoints Working ✅
├─ Components Rendering ✅
├─ Data Flow Correct ✅
└─ Error Handling ✅

Design
├─ Responsive Layout ✅
├─ Dark Mode ✅
├─ Accessibility ✅
└─ Performance ✅
```

## 🚀 Deployment Ready

```
✅ Code compiled
✅ No TypeScript errors
✅ All imports correct
✅ API routes functional
✅ Components exported properly
✅ Styles applied correctly
✅ Production build succeeds

Ready for:
├─ Vercel
├─ AWS
├─ Netlify
├─ Docker
└─ Self-hosted
```

---

**This refactored project is production-ready and follows Next.js 16 best practices!**
