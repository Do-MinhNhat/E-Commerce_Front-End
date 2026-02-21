# 🛒 EStore — E-Commerce Front-End

A modern, responsive e-commerce storefront built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS 4**. Powered by the [DummyJSON](https://dummyjson.com) API for product data.

![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

---

## ✨ Features

- **Product Catalog** — Browse products with pagination and category filtering
- **Product Detail** — Image gallery, reviews, ratings, discount pricing, and tag-based recommendations
- **Search** — Real-time search with dropdown results and a dedicated search results page
- **Shopping Cart** — Add/remove items, adjust quantities, stock validation (persisted in `localStorage`)
- **Checkout** — Order summary with stock-aware quantity controls
- **Categories** — Browse and filter by product categories
- **Responsive Design** — Mobile-first layout with dark mode support
- **Loading States** — Skeleton loaders for products, categories, and detail pages
- **API Routes** — Server-side proxy endpoints for products, categories, and search

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI Library | [React 19](https://react.dev) |
| Language | [TypeScript 5](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Components | [shadcn/ui](https://ui.shadcn.com) (New York style) |
| Icons | [Lucide React](https://lucide.dev) |
| Data Source | [DummyJSON API](https://dummyjson.com) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Header + Footer)
│   ├── page.tsx                # Home page (hero, categories, CTA)
│   ├── (Auth)/
│   │   └── login/              # Login page
│   ├── (Shopping)/
│   │   ├── categories/         # Category listing & detail pages
│   │   ├── checkout/           # Cart checkout page
│   │   ├── products/           # Product listing & detail pages
│   │   │   ├── components/     # ProductRecommendations, ProductReviews
│   │   │   └── [slug]/         # Dynamic product detail
│   │   └── search/             # Search results page
│   └── api/
│       ├── categories/         # GET /api/categories
│       └── products/           # GET /api/products, GET /api/products/[id]
├── components/
│   ├── features/               # CategoryFilter, Pagination, ProductCard, Skeletons
│   ├── layout/                 # Header, Footer
│   └── ui/                     # shadcn/ui primitives (Skeleton, etc.)
├── hooks/
│   ├── useCart.ts              # Cart state management (localStorage + events)
│   └── useLocalStorage.ts      # Generic localStorage hook
├── lib/
│   ├── constants.ts            # API config, pagination, cache durations, paths
│   └── utils.ts                # Utility functions (formatPrice, etc.)
├── services/
│   └── productService.ts       # API client with in-memory caching
└── types/
    ├── cart.ts                 # CartItem interface
    ├── category.ts             # Category interfaces
    └── product.ts              # Product, Review, ProductFilters interfaces
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd E-Commerce_Front-End

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## 🔌 API Routes

The app proxies requests through Next.js API routes to the DummyJSON API:

| Endpoint | Method | Description |
|---|---|---|
| `/api/products` | GET | List products (supports `skip`, `limit`, `category`, `q` params) |
| `/api/products/[id]` | GET | Get a single product by ID |
| `/api/categories` | GET | List all product categories |

### Query Parameters

- `skip` — Number of products to skip (default: `0`)
- `limit` — Products per page (default: `12`)
- `category` — Filter by category slug
- `q` — Search query string

---

## 🛒 Cart System

The cart is fully client-side and uses `localStorage` for persistence:

- **Cross-component sync** — Cart updates are broadcast via custom DOM events (`cart-updated`) so all components stay in sync
- **Stock validation** — Checkout page fetches real-time stock data and caps quantities accordingly
- **Hook API** — `useCart()` exposes `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `getTotalPrice`, `getTotalItems`, and `isInCart`

---

## ⚡ Caching Strategy

| Data | Cache Duration | Method |
|---|---|---|
| Product listings | 5 minutes | In-memory + Next.js `revalidate` |
| Categories | 10 minutes | In-memory + Next.js `revalidate` |
| Product detail | 10 minutes | In-memory + Next.js `revalidate` |

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm start` | Run the production server |
| `npm run lint` | Run ESLint checks |

---

## 📄 License

This project is private and not published to npm.