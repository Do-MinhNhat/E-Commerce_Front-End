'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function ProductDetailSkeleton() {
    return (
        <div className="w-full">
            {/* Breadcrumb Skeleton */}
            <div className="mb-6 sm:mb-8 flex items-center gap-2 text-xs sm:text-sm px-4 sm:px-0">
                <Skeleton className="h-3 sm:h-4 w-12" />
                <Skeleton className="h-3 sm:h-4 w-2" />
                <Skeleton className="h-3 sm:h-4 w-16" />
                <Skeleton className="h-3 sm:h-4 w-2" />
                <Skeleton className="h-3 sm:h-4 w-32" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-0">
                {/* Image Gallery Section */}
                <div>
                    {/* Main Image Skeleton */}
                    <div className="mb-3 sm:mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square">
                        <Skeleton className="w-full h-full" />
                    </div>

                    {/* Thumbnail Gallery Skeleton */}
                    <div className="grid grid-cols-4 gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square">
                                <Skeleton className="w-full h-full" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    {/* Category Badge Skeleton */}
                    <div className="mb-4">
                        <Skeleton className="h-5 sm:h-6 w-20 rounded-full" />
                    </div>

                    {/* Title Skeleton */}
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
                        <Skeleton className="h-7 sm:h-8 md:h-9 w-full mb-2" />
                    </h1>

                    {/* Rating and Stock Skeleton */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-6 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-5 w-12" />
                        </div>
                        <Skeleton className="h-5 w-24" />
                    </div>

                    {/* Price Skeleton */}
                    <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-baseline gap-2 sm:gap-3 mb-2 flex-wrap">
                            <Skeleton className="h-8 sm:h-10 w-32" />
                            <Skeleton className="h-6 sm:h-7 w-24" />
                            <Skeleton className="h-5 sm:h-6 w-16 rounded-full" />
                        </div>
                    </div>

                    {/* Description Skeleton */}
                    <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <Skeleton className="h-4 sm:h-5 w-24 mb-2" />
                        <Skeleton className="h-3 w-full mb-1" />
                        <Skeleton className="h-3 w-5/6 mb-1" />
                        <Skeleton className="h-3 w-4/6" />
                    </div>

                    {/* Product Details Skeleton */}
                    <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <Skeleton className="h-4 sm:h-5 w-32 mb-3" />
                        <div className="space-y-2 text-xs sm:text-sm">
                            <div className="flex gap-4">
                                <Skeleton className="h-3 sm:h-4 w-12" />
                                <Skeleton className="h-3 sm:h-4 w-24" />
                            </div>
                            <div className="flex gap-4">
                                <Skeleton className="h-3 sm:h-4 w-12" />
                                <Skeleton className="h-3 sm:h-4 w-28" />
                            </div>
                        </div>
                    </div>

                    {/* Tags Skeleton */}
                    <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <Skeleton className="h-4 sm:h-5 w-16 mb-3" />
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-6 sm:h-7 w-16 rounded-full" />
                            ))}
                        </div>
                    </div>

                    {/* Add to Cart Skeleton */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 min-h-11">
                            <Skeleton className="flex-1 h-10 sm:h-12 rounded-none" />
                            <Skeleton className="flex-1 h-10 sm:h-12 rounded-none" />
                            <Skeleton className="flex-1 h-10 sm:h-12 rounded-none" />
                        </div>
                        <Skeleton className="flex-1 h-10 sm:h-12 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
