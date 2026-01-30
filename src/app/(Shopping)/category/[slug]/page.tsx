'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/features/ProductCard';
import { Pagination } from '@/components/features/Pagination';
import { ProductGridSkeleton } from '@/components/features/ProductGridSkeleton';
import { type Product, type ProductsResponse } from '@/types/product';

export default function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [skip, setSkip] = useState(0);
    const [total, setTotal] = useState(0);
    const [category, setCategory] = useState<string>('');
    const [paramsResolved, setParamsResolved] = useState<{ slug: string } | null>(null);

    const limit = 12;

    useEffect(() => {
        params.then(setParamsResolved);
    }, [params]);

    useEffect(() => {
        if (!paramsResolved) return;
        setCategory(paramsResolved.slug);
    }, [paramsResolved]);

    useEffect(() => {
        if (!category) return;

        const loadProducts = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const params = new URLSearchParams({
                    skip: skip.toString(),
                    limit: limit.toString(),
                    category,
                });

                const res = await fetch(`/api/products?${params.toString()}`);
                if (!res.ok) throw new Error('Failed to load products');
                const data: ProductsResponse = await res.json();
                setProducts(data.products);
                setTotal(data.total);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        loadProducts();
    }, [skip, category]);

    const handlePageChange = (newSkip: number) => {
        setSkip(newSkip);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 capitalize">
                    {category.replace('-', ' ')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Browse products in this category
                </p>
            </div>

            {error && (
                <div className="mb-8 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900 dark:text-red-100">
                    {error}
                </div>
            )}

            {isLoading ? (
                <ProductGridSkeleton count={limit} />
            ) : products.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        No products found in this category.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <Pagination
                        skip={skip}
                        limit={limit}
                        total={total}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
}
