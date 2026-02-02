'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCard } from '@/components/features/ProductCard';
import { CategoryFilter } from '@/components/features/CategoryFilter';
import { Pagination } from '@/components/features/Pagination';
import { ProductGridSkeleton } from '@/components/features/ProductGridSkeleton';
import { type Product, type ProductsResponse } from '@/types/product';
import { CategoriesResponse, Category } from '@/types/category';

export default function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = use(searchParams);
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const limit = 12;

  // Initialize state from URL parameters
  useEffect(() => {
    const pageNum = params.page ? parseInt(params.page, 10) : 1;
    const newSkip = (pageNum - 1) * limit;
    setSkip(newSkip);
    setSelectedCategory(params.category);
  }, [params.category, params.page, limit]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load categories
        const categoriesRes = await fetch('/api/categories');
        if (!categoriesRes.ok) throw new Error('Failed to load categories');
        const categoriesData: CategoriesResponse = await categoriesRes.json();
        setCategories(categoriesData.categories);

        // Load products
        const queryParams = new URLSearchParams({
          skip: skip.toString(),
          limit: limit.toString(),
        });

        if (selectedCategory) {
          queryParams.append('category', selectedCategory);
        }

        const productsRes = await fetch(`/api/products?${queryParams.toString()}`);
        if (!productsRes.ok) throw new Error('Failed to load products');
        const productsData: ProductsResponse = await productsRes.json();
        setProducts(productsData.products);
        setTotal(productsData.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [skip, selectedCategory, limit]);

  const handleCategoryChange = (category: string | undefined) => {
    // Navigate with new category and reset to page 1
    const newParams = new URLSearchParams();
    if (category) {
      newParams.set('category', category);
    }
    newParams.set('page', '1');
    router.push(`?${newParams.toString()}`);
  };

  const handlePageChange = (newSkip: number) => {
    // Navigate with new page number
    const pageNum = (newSkip / limit) + 1;
    const newParams = new URLSearchParams();
    if (selectedCategory) {
      newParams.set('category', selectedCategory);
    }
    newParams.set('page', pageNum.toString());
    router.push(`?${newParams.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8 px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          All Products
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Browse our collection of quality products
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 sm:mb-8 flex gap-4 flex-wrap px-4 sm:px-0">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 sm:mb-8 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900 dark:text-red-100 mx-4 sm:mx-0">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="px-4 sm:px-0">
          <ProductGridSkeleton count={limit} />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 px-4">
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            No products found. Try a different category.
          </p>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 px-4 sm:px-0">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="px-4 sm:px-0">
            <Pagination
              skip={skip}
              limit={limit}
              total={total}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
