# Quick Reference Guide

## 🚀 Start Development

```bash
npm install
npm run dev
```

Visit: http://localhost:3000

## 📁 Quick File Locations

| What | Where |
|------|-------|
| Home page | `src/app/page.tsx` |
| Products page | `src/app/(Shopping)/product/page.tsx` |
| Product detail | `src/app/(Shopping)/product/[slug]/page.tsx` |
| Product card | `src/components/features/ProductCard.tsx` |
| API endpoints | `src/app/api/products/`, `src/app/api/categories/` |
| Product service | `src/services/productService.ts` |
| Types | `src/types/product.ts`, `src/types/category.ts` |
| Utils | `src/lib/utils.ts` |
| Constants | `src/lib/constants.ts` |

## 🔌 API Quick Reference

```bash
# Get all products
GET /api/products?skip=0&limit=12

# Get products by category
GET /api/products?category=electronics&limit=12

# Search products
GET /api/products?q=laptop

# Get single product
GET /api/products/1

# Get all categories
GET /api/categories
```

## 🛠️ Common Tasks

### Fetch Products in Component
```typescript
const res = await fetch(`/api/products?skip=0&limit=12`);
const data = await res.json();
```

### Add Loading State
```typescript
{isLoading ? <ProductGridSkeleton /> : <ProductGrid />}
```

### Format Price
```typescript
import { formatPrice } from '@/lib/utils';
formatPrice(99.99); // "99,99 ₫"
```

### Calculate Discount
```typescript
import { calculateDiscountedPrice } from '@/lib/utils';
calculateDiscountedPrice(100, 20); // 80
```

### Merge Classnames
```typescript
import { cn } from '@/lib/utils';
cn('px-4 py-2', isActive && 'bg-blue-500')
```

## 📦 Environment Setup

### Required Node Version
```
Node.js 18+
```

### Install Dependencies
```bash
npm install
```

### Build
```bash
npm run build
```

### Production Start
```bash
npm start
```

## 🎨 Styling Tips

### Dark Mode
```tsx
<div className="bg-white dark:bg-gray-800">
  Content
</div>
```

### Responsive Design
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  Items
</div>
```

### Common Breakpoints
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px

## 🔍 Finding Things

### Where is the Product List?
`src/app/(Shopping)/product/page.tsx`

### Where is the API for Products?
`src/app/api/products/route.ts`

### Where are Product Components?
`src/components/features/ProductCard.tsx`

### Where are Utility Functions?
`src/lib/utils.ts`

### Where are API Configuration?
`src/lib/constants.ts`

## 🐛 Troubleshooting

### Products Not Loading
1. Check if DummyJSON API is accessible
2. Open browser console for errors
3. Verify API route is working: `http://localhost:3000/api/products`

### Styling Not Applied
1. Make sure Tailwind CSS is installed
2. Check if class name is correct
3. Use `!important` if needed: `!bg-blue-500`

### Type Errors
1. Check if types are imported
2. Verify interfaces match API response
3. Run `npm run build` to see all errors

### Images Not Showing
1. Verify image URL is valid
2. Check browser console for 404s
3. Ensure Next.js Image component is used

## 📚 Key Documentation Files

1. **REFACTORING_GUIDE.md** - Full architecture overview
2. **MIGRATION_SUMMARY.md** - What was changed and why
3. **README.md** - Project overview and features
4. **src/services/productService.ts** - API service docs

## 💾 Git Tips

### Create Branch for Feature
```bash
git checkout -b feature/new-feature
```

### Commit Changes
```bash
git add .
git commit -m "feat: add new feature"
```

### Push Changes
```bash
git push origin feature/new-feature
```

## 🚀 Deployment

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to Other Platforms
- Build: `npm run build`
- Start: `npm start`
- Environment: Node.js 18+

## 📞 Need Help?

1. **Read REFACTORING_GUIDE.md** - Most questions answered there
2. **Check src/** - Look at similar components for examples
3. **Check types/** - Understand data structures
4. **Check examples in existing pages** - Copy patterns from working code

## ✅ Pre-Deployment Checklist

- [ ] `npm run build` passes without errors
- [ ] All pages load correctly
- [ ] Responsive design works on mobile
- [ ] Dark mode works
- [ ] API calls return correct data
- [ ] Images load properly
- [ ] Error states handled
- [ ] Loading states show

## 🎉 You're All Set!

The project is fully refactored and ready to use. Start developing!

```bash
npm run dev
```

Happy coding! 🚀
