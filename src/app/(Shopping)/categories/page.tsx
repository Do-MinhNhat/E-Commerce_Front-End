'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PATH } from '@/lib/constants';

interface Category {
    name: string;
    slug: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const res = await fetch('/api/categories');
                if (!res.ok) throw new Error('Failed to load categories');
                const data = await res.json();
                setCategories(data.categories || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setCategories([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadCategories();
    }, []);

    return (
        <div className="w-full">
            {/* Page Header */}
            <div className="mb-6 sm:mb-8 px-4 sm:px-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Browse Categories
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Explore our wide selection of product categories
                </p>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-48 sm:h-56 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-12 px-4">
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-4">
                        No categories available
                    </p>
                    <Link
                        href={ PATH.products }
                        className="inline-block bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 px-6 sm:px-8 rounded-lg transition-colors"
                    >
                        Browse All Products
                    </Link>
                </div>
            ) : (
                <>
                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 px-4 sm:px-0">
                        {categories.map((category) => (
                            <Link
                                key={category.slug}
                                href={`${PATH.products}?category=${category.slug}`}
                                className="group"
                            >
                                <div className="h-48 sm:h-56 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 shadow-sm hover:shadow-md active:shadow-lg transition-shadow touch-manipulation flex items-center justify-center p-4 sm:p-6">
                                    {/* Category Content */}
                                    <div className="text-center">
                                        {/* Icon */}
                                        <div className="mb-3 sm:mb-4 flex justify-center">
                                            <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <svg
                                                    className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600 dark:text-blue-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Category Name */}
                                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white capitalize group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {category.name.replace('-', ' ')}
                                        </h2>

                                        {/* Explore Text */}
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 sm:mt-3 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                                            Explore products →
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* View All Products CTA */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 sm:p-8 mx-4 sm:mx-0 text-center text-white">
                        <h2 className="text-xl sm:text-2xl font-bold mb-2">
                            Can't find what you're looking for?
                        </h2>
                        <p className="text-blue-100 mb-6 text-sm sm:text-base">
                            Browse all products and discover more amazing items
                        </p>
                        <Link
                            href={ PATH.products }
                            className="inline-block bg-white text-blue-600 hover:bg-blue-50 active:bg-gray-100 font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition-colors touch-manipulation min-h-[44px] flex items-center justify-center text-base"
                        >
                            View All Products
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
