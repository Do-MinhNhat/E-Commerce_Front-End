'use client';

import Link from 'next/link';

interface PaginationProps {
    skip: number;
    limit: number;
    total: number;
    onPageChange: (skip: number) => void;
}

export function Pagination({ skip, limit, total, onPageChange }: PaginationProps) {
    const currentPage = Math.floor(skip / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Show max 5 page buttons
    let visiblePages = pages;
    if (pages.length > 5) {
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, startPage + 4);
        visiblePages = pages.slice(startPage - 1, endPage);
    }

    return (
        <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 flex-wrap">
            <button
                onClick={() => onPageChange(Math.max(0, skip - limit))}
                disabled={skip === 0}
                className="rounded-lg border border-gray-300 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors min-h-[44px] sm:min-h-auto min-w-[44px] sm:min-w-auto flex items-center justify-center"
                title="Previous page"
            >
                <span className="hidden sm:inline">← Previous</span>
                <span className="sm:hidden">←</span>
            </button>

            {visiblePages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange((page - 1) * limit)}
                    className={`rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors min-h-[44px] sm:min-h-auto min-w-[44px] sm:min-w-auto flex items-center justify-center ${page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                    title={`Go to page ${page}`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(Math.min((totalPages - 1) * limit, skip + limit))}
                disabled={skip + limit >= total}
                className="rounded-lg border border-gray-300 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors min-h-[44px] sm:min-h-auto min-w-[44px] sm:min-w-auto flex items-center justify-center"
                title="Next page"
            >
                <span className="hidden sm:inline">Next →</span>
                <span className="sm:hidden">→</span>
            </button>
        </div>
    );
}
