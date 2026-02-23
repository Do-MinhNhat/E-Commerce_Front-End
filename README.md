# EStore — E-Commerce Front-End

A modern e-commerce storefront with an **AI-powered shopping assistant**, built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS 4**. Product data is sourced from [DummyJSON](https://dummyjson.com), and the chatbot is powered by **Google Gemini** with vector-based semantic search.

![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Gemini](https://img.shields.io/badge/Gemini-AI-8E75B2?logo=google)

---

## Features

### Shopping

- **Product Catalog** — Browse products with pagination and category filtering
- **Product Detail** — Image gallery, reviews, star ratings, discount pricing, and tag-based recommendations
- **Search** — Real-time search with instant dropdown results and a dedicated results page
- **Shopping Cart** — Add/remove items, adjust quantities, stock validation (persisted in `localStorage`)
- **Checkout** — Order summary with stock-aware quantity controls
- **Categories** — Browse and filter by product categories

### AI Shopping Assistant

- **Chatbot** — Floating chat widget powered by Gemini 2.5 Flash for conversational product discovery
- **Semantic Search** — Product embeddings generated with `gemini-embedding-001` enable meaning-based search, not just keyword matching
- **Product Cards in Chat** — The bot recommends products with inline clickable cards (image, price, link)
- **Conversation History** — Multi-turn chat context is maintained per session
- **Background Preloading** — Embeddings are loaded at server startup so the first chat response is fast

### UI / UX

- **Responsive Design** — Mobile-first layout that adapts to all screen sizes
- **Dark Mode** — Full dark mode support via Tailwind
- **Skeleton Loaders** — Smooth loading states for products, categories, and detail pages

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI Library | [React 19](https://react.dev) |
| Language | [TypeScript 5](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Components | [shadcn/ui](https://ui.shadcn.com) (New York style) |
| Icons | [Lucide React](https://lucide.dev) |
| AI | [Google Gemini](https://ai.google.dev) (`gemini-2.5-flash` + `gemini-embedding-001`) |
| Data Source | [DummyJSON API](https://dummyjson.com) |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout — Header, Footer, ChatBot, embedding init
│   ├── page.tsx                    # Home page (hero, categories, CTA)
│   ├── (Shopping)/
│   │   ├── categories/             # Category listing with loading skeleton
│   │   ├── checkout/               # Cart checkout page
│   │   ├── products/               # Product listing & detail pages
│   │   │   ├── components/         # ProductRecommendations, ProductReviews
│   │   │   └── [slug]/             # Dynamic product detail
│   │   └── search/                 # Search results page
│   └── api/
│       ├── categories/             # GET /api/categories
│       ├── chat/                   # POST /api/chat — AI chatbot endpoint
│       └── products/               # GET /api/products, GET /api/products/[id]
├── components/
│   ├── features/                   # CategoryFilter, Pagination, ProductCard, Skeletons
│   ├── layout/                     # Header, Footer, ChatBot
│   └── ui/                         # shadcn/ui primitives
├── hooks/
│   ├── useCart.ts                  # Cart state (localStorage + cross-component sync)
│   ├── useChat.ts                  # Chat hook — sends messages, tracks history
│   └── useLocalStorage.ts          # Generic localStorage hook
├── lib/
│   ├── constants.ts                # API config, pagination, cache durations, paths
│   ├── initEmbeddings.ts           # One-time embedding preload at server startup
│   └── utils.ts                    # Utility functions (formatPrice, etc.)
├── services/
│   ├── geminiService.ts            # Gemini AI: embeddings, vector search, chat
│   └── productService.ts           # DummyJSON API client with cache
└── types/
    ├── cart.ts                     # CartItem
    ├── category.ts                 # Category
    ├── chat.ts                     # ChatMessage, ChatResponse
    └── product.ts                  # Product, Review, ProductFilters
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.17+
- A **Google Gemini API key** — get one at [ai.google.dev](https://ai.google.dev)

### Installation

```bash
git clone <repository-url>
cd E-Commerce_Front-End
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Generate Embeddings (Optional)

Product embeddings are auto-generated on first server start and cached to `data/embeddings.json`. To pre-generate them:

```bash
npm run generate-embeddings
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

---

## API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/products` | GET | List products (`skip`, `limit`, `category`, `q` params) |
| `/api/products/[id]` | GET | Get a single product by ID |
| `/api/categories` | GET | List all product categories |
| `/api/chat` | POST | Send a message to the AI shopping assistant |

### Chat API

```
POST /api/chat
Content-Type: application/json

{
  "message": "Tìm laptop dưới 1000 đô",
  "history": []
}
```

**Response:**

```json
{
  "reply": "Dưới đây là một số laptop phù hợp...",
  "products": [{ "id": 1, "title": "...", "price": 999 }]
}
```

---

## Architecture

### AI Pipeline

```
User message
  → POST /api/chat
  → Embed query with gemini-embedding-001
  → Cosine similarity search against product embeddings
  → Top 10 products injected into Gemini 2.5 Flash system prompt
  → Gemini generates conversational reply with [ID:x] product references
  → Product cards extracted and returned alongside the reply
```

### Embedding Lifecycle

1. **Server startup** — `initializeEmbeddings()` fires once (module-level, guarded by a flag)
2. **First load** — Checks for cached `data/embeddings.json`; if found, loads from disk
3. **Cache miss** — Fetches all products from DummyJSON, generates embeddings in batches of 99 via `gemini-embedding-001`, saves to disk
4. **Race-condition safe** — Concurrent requests share the same `Promise`, preventing duplicate computation

### Cart System

- **localStorage persistence** — Cart survives page reloads
- **Cross-component sync** — Updates broadcast via custom `cart-updated` DOM events
- **Stock validation** — Checkout fetches real-time stock data and caps quantities
- **Hook API** — `useCart()` exposes `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `getTotalPrice`, `getTotalItems`, `isInCart`

### Caching Strategy

| Data | TTL | Method |
|---|---|---|
| Product listings | 5 min | Next.js `revalidate` |
| Categories | 10 min | Next.js `revalidate` |
| Product detail | 10 min | Next.js `revalidate` |
| Product embeddings | Persistent | Disk cache (`data/embeddings.json`) |

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Create optimized production build |
| `npm start` | Run the production server |
| `npm run lint` | Run ESLint |
| `npm run generate-embeddings` | Pre-generate product embeddings to disk |

---

## License

This project is private and not published to npm.