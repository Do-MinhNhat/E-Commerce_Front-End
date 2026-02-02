import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
    return (
        <div>
            {/* Header skeleton */}
            <div className="mb-8">
                <Skeleton className="h-10 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
            </div>

            {/* Grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-48 w-full rounded-lg" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/3" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    );
}
