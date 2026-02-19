'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/features/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types/product';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState(query);

    useEffect(() => {
        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    const fetchSearchResults = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/products?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data.products || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Search failed');
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            const url = new URL(window.location.href);
            url.searchParams.set('q', searchInput);
            window.history.pushState({}, '', url);
            window.location.reload();
        }
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
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {[...Array(12)].map((_, i) => (
                            <Skeleton key={i} className="h-48 rounded-lg" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                        <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
                            Back to Home
                        </Link>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            No products found
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                            {query ? `No results for "${query}"` : 'Try searching for something'}
                        </p>
                        <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            Search Results {query && <span className="text-blue-600">for "{query}"</span>}
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                            Found {products.length} product{products.length !== 1 ? 's' : ''}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-12">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
