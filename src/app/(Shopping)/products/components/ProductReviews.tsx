'use client';

import { Product } from '@/types/product';

interface ProductReviewsProps {
    product: Product;
    reviewPage: number;
    selectedStarFilter: number | null;
    onReviewPageChange: (page: number) => void;
    onStarFilterChange: (star: number | null) => void;
}

export function ProductReviews({
    product,
    reviewPage,
    selectedStarFilter,
    onReviewPageChange,
    onStarFilterChange,
}: ProductReviewsProps) {
    if (!product.reviews || product.reviews.length === 0) {
        return null;
    }

    return (
        <div className="mt-12 sm:mt-16 pt-12 sm:pt-16 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-0">
            <div className="mb-12 sm:mb-16">
                {/* Reviews Header */}
                <div className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Customer Reviews
                    </h2>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <span
                                        key={i}
                                        className={`text-xl ${
                                            i <
                                            Math.floor(
                                                product.reviews!.reduce((sum, r) => sum + r.rating, 0) /
                                                    product.reviews!.length
                                            )
                                                ? 'text-yellow-400'
                                                : 'text-gray-300 dark:text-gray-600'
                                        }`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                {(
                                    product.reviews.reduce((sum, r) => sum + r.rating, 0) /
                                    product.reviews.length
                                ).toFixed(1)}
                            </span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Based on {product.reviews.length} review
                            {product.reviews.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                {/* Star Filter */}
                <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-4">
                        Filter by Rating
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onStarFilterChange(null)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedStarFilter === null
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            All Reviews
                        </button>
                        {[5, 4, 3, 2, 1].map((stars) => (
                            <button
                                key={stars}
                                onClick={() => onStarFilterChange(stars)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                                    selectedStarFilter === stars
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                <span>{'★'.repeat(stars)}</span>
                                {`(${product.reviews!.filter((r) => r.rating === stars).length})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filtered Reviews */}
                {(() => {
                    const filteredReviews = selectedStarFilter
                        ? product.reviews.filter((r) => r.rating === selectedStarFilter)
                        : product.reviews;
                    const reviewsPerPage = 5;
                    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
                    const startIdx = (reviewPage - 1) * reviewsPerPage;
                    const paginatedReviews = filteredReviews.slice(startIdx, startIdx + reviewsPerPage);

                    return (
                        <>
                            {/* Reviews List */}
                            {paginatedReviews.length > 0 ? (
                                <div className="space-y-6 mb-8">
                                    {paginatedReviews.map((review, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg"
                                        >
                                            {/* Review Header */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="flex gap-1 mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span
                                                                key={i}
                                                                className={`text-base ${
                                                                    i < review.rating
                                                                        ? 'text-yellow-400'
                                                                        : 'text-gray-300 dark:text-gray-600'
                                                                }`}
                                                            >
                                                                ★
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                                        {review.reviewerName}
                                                    </h4>
                                                </div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                                                    {new Date(review.date).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        }
                                                    )}
                                                </span>
                                            </div>

                                            {/* Review Comment */}
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 mb-8">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No reviews found for this rating.
                                    </p>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => onReviewPageChange(Math.max(1, reviewPage - 1))}
                                        disabled={reviewPage === 1}
                                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                    >
                                        Previous
                                    </button>
                                    <div className="flex items-center gap-2">
                                        {Array.from(
                                            { length: totalPages },
                                            (_, i) => i + 1
                                        ).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => onReviewPageChange(page)}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    reviewPage === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() =>
                                            onReviewPageChange(Math.min(totalPages, reviewPage + 1))
                                        }
                                        disabled={reviewPage === totalPages}
                                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    );
                })()}
            </div>
        </div>
    );
}
