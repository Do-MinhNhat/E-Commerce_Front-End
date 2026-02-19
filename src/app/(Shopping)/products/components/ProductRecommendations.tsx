'use client';

import Link from 'next/link';
import { Product } from '@/types/product';
import { ProductGridSkeleton } from '../../../../components/features/ProductGridSkeleton';
import { ProductCard } from '../../../../components/features/ProductCard';

interface ProductRecommendationsProps {
    tagRecommendations: Product[];
    loadingRecommendations: boolean;
}

export function ProductRecommendations({
    tagRecommendations,
    loadingRecommendations,
}: ProductRecommendationsProps) {
    return (
        <div className="mt-12 sm:mt-16 pt-12 sm:pt-16 border-t border-gray-200 dark:border-gray-700">
            {/* Tag-Based Recommendations */}
            {tagRecommendations.length > 0 && (
                <div className="mb-12 sm:mb-16">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 px-4 sm:px-0">
                        Similar Products
                    </h2>
                    {loadingRecommendations ? (
                        <ProductGridSkeleton count={4} />
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 px-4 sm:px-0">
                            {tagRecommendations.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* If no recommendations */}
            {tagRecommendations.length === 0 && (
                <div className="text-center px-4 sm:px-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
                        Continue Shopping
                    </h2>
                    <Link
                        href="/products"
                        className="flex bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg transition-colors touch-manipulation min-h-11 items-center justify-center"
                    >
                        View All Products
                    </Link>
                </div>
            )}
        </div>
    );
}
