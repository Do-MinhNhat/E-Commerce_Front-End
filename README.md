# E-Commerce Front-End

A modern, fully refactored e-commerce application built with Next.js 16, React 19, TypeScript, and Tailwind CSS. Integrated with DummyJSON API for product data.

## 🚀 Features

- ✅ **Latest Next.js Architecture** - Using App Router with route groups
- ✅ **DummyJSON API Integration** - Real product data with images, ratings, and stock info
- ✅ **Responsive Design** - Mobile-first approach with Tailwind CSS
- ✅ **Type-Safe** - Full TypeScript support with proper interfaces
- ✅ **API Routes** - Backend endpoints for products and categories
- ✅ **Service Layer** - Clean separation of concerns with services
- ✅ **Caching** - Implemented caching strategy for better performance
- ✅ **Loading States** - Skeleton loaders for better UX
- ✅ **Product Filtering** - Filter by categories
- ✅ **Search** - Full-text search capability
- ✅ **Pagination** - Handle large product lists efficiently
- ✅ **Dark Mode** - Built-in dark mode support

## 📦 Tech Stack

- **Framework**: Next.js 16.1.4
- **React**: 19.2.3
- **TypeScript**: 5
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **API Source**: DummyJSON API

## 🎯 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

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
# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

See [REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md) for detailed structure and architecture information.

```
src/
├── app/                    # Next.js App Router
├── components/             # React components
├── services/              # API service layer
├── lib/                   # Utilities and constants
├── types/                 # TypeScript interfaces
└── hooks/                 # Custom React hooks
```

## 🛣️ Available Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with featured categories |
| `/products` | Product listing with filtering & pagination |
| `/products/:id` | Product detail page |
| `/category/:slug` | Products filtered by category |
| `/login` | Login page (placeholder) |
| `/profile/:slug` | User profile page (placeholder) |

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (with filters) |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/categories` | Get all categories |

### Query Parameters

**GET /api/products**
- `skip` - Number of products to skip (default: 0)
- `limit` - Number of products to return (default: 12)
- `category` - Filter by category name
- `q` - Search query

Example:
```
/api/products?skip=0&limit=12&category=electronics
/api/products?q=laptop&limit=20
```

## 🎨 Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Dark Mode** - Full dark mode support with `dark:` prefix
- **Responsive** - Mobile-first responsive design
- **Custom Components** - Reusable UI components in `src/components/`

## 📝 Key Components

### Layout
- `Header.tsx` - Navigation header with search
- `Footer.tsx` - Footer with links

### Features
- `ProductCard.tsx` - Product card component
- `CategoryFilter.tsx` - Category filter dropdown
- `Pagination.tsx` - Pagination controls
- `ProductGridSkeleton.tsx` - Loading skeleton

## 🔄 Data Flow

```
User Interaction
    ↓
Page Component (Client)
    ↓
Fetch from API Route (/api/*)
    ↓
Service Layer (productService.ts)
    ↓
DummyJSON API
    ↓
Response → Cache → Component → UI
```

## 🚦 Getting Help

1. **Check REFACTORING_GUIDE.md** - Detailed structure and examples
2. **Review Component Source** - Code comments and examples
3. **API Documentation** - DummyJSON API docs at https://dummyjson.com

## 🤝 Development Guidelines

### Before Creating New Features
1. Check existing patterns in the codebase
2. Follow the established folder structure
3. Add proper TypeScript types
4. Use the service layer for API calls
5. Create loading/error states

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Prefer server components, mark client components with `'use client'`
- Use utility-first CSS with Tailwind

## 🔮 Future Enhancements

- [ ] Authentication system (NextAuth.js)
- [ ] Shopping cart functionality
- [ ] User wishlist
- [ ] Order management
- [ ] Payment integration
- [ ] Admin dashboard
- [ ] Product reviews
- [ ] Advanced search filters
- [ ] Social sharing
- [ ] Email notifications

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For detailed information about the refactoring, see [REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
