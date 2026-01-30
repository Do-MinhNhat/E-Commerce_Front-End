'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-2 sm:space-y-3">
                    {/* Image skeleton */}
                    <Skeleton className="h-32 sm:h-48 w-full rounded-lg" />
                    {/* Title skeleton */}
                    <Skeleton className="h-3 sm:h-4 w-full" />
                    {/* Category skeleton */}
                    <Skeleton className="h-2 sm:h-3 w-1/3" />
                    {/* Price skeleton */}
                    <Skeleton className="h-3 sm:h-4 w-1/2" />
                </div>
            ))}
        </div>
    );
}
