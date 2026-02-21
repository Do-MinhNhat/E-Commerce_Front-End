'use client';

import { useEffect, useState, useMemo, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/components/features/ProductCard';
import { CategoryFilter } from '@/components/features/CategoryFilter';
import { Pagination } from '@/components/features/Pagination';
import { ProductGridSkeleton } from '@/components/features/ProductGridSkeleton';
import { Product, ProductsResponse } from '@/types/product';
import { Category, CategoriesResponse } from '@/types/category';

const LIMIT = 12;

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const query = searchParams.get('q') || '';
    const categoryParam = searchParams.get('category') || undefined;
    const pageParam = searchParams.get('page') || '1';

    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [totalFromApi, setTotalFromApi] = useState(0);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState(query);

    const currentPage = Math.max(1, parseInt(pageParam, 10) || 1);

    // Fetch categories once
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                if (!res.ok) throw new Error('Failed to load categories');
                const data: CategoriesResponse = await res.json();
                setCategories(data.categories);
            } catch {
                // Silently fail — category filter just won't show
            }
        };
        loadCategories();
    }, []);

    // Fetch search results — when category is active, fetch all results for client-side filtering
    useEffect(() => {
        if (!query) {
            setAllProducts([]);
            setTotalFromApi(0);
            return;
        }

        const fetchSearchResults = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (categoryParam) {
                    // DummyJSON search doesn't support category filter, so fetch a large batch
                    // and filter client-side
                    const response = await fetch(
                        `/api/products?q=${encodeURIComponent(query)}&limit=100&skip=0`
                    );
                    if (!response.ok) throw new Error('Failed to fetch products');
                    const data: ProductsResponse = await response.json();
                    setAllProducts(data.products || []);
                    setTotalFromApi(data.total);
                } else {
                    // No category filter — use server-side pagination
                    const skip = (currentPage - 1) * LIMIT;
                    const response = await fetch(
                        `/api/products?q=${encodeURIComponent(query)}&limit=${LIMIT}&skip=${skip}`
                    );
                    if (!response.ok) throw new Error('Failed to fetch products');
                    const data: ProductsResponse = await response.json();
                    setAllProducts(data.products || []);
                    setTotalFromApi(data.total);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Search failed');
                setAllProducts([]);
                setTotalFromApi(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [query, categoryParam, currentPage]);

    // Derive visible products and totals
    const { displayProducts, total } = useMemo(() => {
        if (categoryParam) {
            const filtered = allProducts.filter((p) => p.category === categoryParam);
            const start = (currentPage - 1) * LIMIT;
            return {
                displayProducts: filtered.slice(start, start + LIMIT),
                total: filtered.length,
            };
        }
        return { displayProducts: allProducts, total: totalFromApi };
    }, [allProducts, categoryParam, currentPage, totalFromApi]);

    const skip = (currentPage - 1) * LIMIT;

    // --- URL navigation helpers ---
    const buildUrl = useCallback(
        (overrides: { q?: string; category?: string | undefined; page?: number }) => {
            const params = new URLSearchParams();
            const q = overrides.q ?? query;
            if (q) params.set('q', q);
            if ('category' in overrides) {
                if (overrides.category) params.set('category', overrides.category);
            } else if (categoryParam) {
                params.set('category', categoryParam);
            }
            const page = overrides.page ?? 1;
            if (page > 1) params.set('page', page.toString());
            return `/search?${params.toString()}`;
        },
        [query, categoryParam]
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            router.push(buildUrl({ q: searchInput.trim(), category: undefined, page: 1 }));
        }
    };

    const handleCategoryChange = (category: string | undefined) => {
        router.push(buildUrl({ category, page: 1 }));
    };

    const handlePageChange = (newSkip: number) => {
        const page = Math.floor(newSkip / LIMIT) + 1;
        router.push(buildUrl({ page }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="w-full">
            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 shadow-sm py-4 sm:py-6 mb-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search products..."
                            className="flex-1 px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors min-h-[44px] active:bg-blue-800"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header + Category Filter */}
                {query && (
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Search Results {query && <span className="text-blue-600">for &ldquo;{query}&rdquo;</span>}
                        </h1>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                            <CategoryFilter
                                categories={categories}
                                selectedCategory={categoryParam}
                                onCategoryChange={handleCategoryChange}
                            />
                            {!isLoading && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {total} product{total !== 1 ? 's' : ''} found
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-6 sm:mb-8 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900 dark:text-red-100">
                        <p className="mb-2">{error}</p>
                        <Link href="/" className="text-red-600 hover:text-red-700 dark:text-red-300 font-semibold text-sm">
                            Back to Home
                        </Link>
                    </div>
                )}

                {/* Loading */}
                {isLoading ? (
                    <ProductGridSkeleton count={LIMIT} />
                ) : !query ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            Search for products
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            Enter a keyword above to find products
                        </p>
                    </div>
                ) : displayProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            No products found
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                            {categoryParam
                                ? `No results for "${query}" in this category. Try removing the filter.`
                                : `No results for "${query}"`}
                        </p>
                        <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Products Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
                            {displayProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            skip={skip}
                            limit={LIMIT}
                            total={total}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<ProductGridSkeleton count={LIMIT} />}>
            <SearchContent />
        </Suspense>
    );
}