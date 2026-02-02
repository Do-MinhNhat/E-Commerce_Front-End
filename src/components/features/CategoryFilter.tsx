'use client';

import { Category } from '@/types/category';
import { useState } from 'react';

interface CategoryFilterProps {
    categories: Category[];
    selectedCategory?: string;
    onCategoryChange: (category: string | undefined) => void;
}

export function CategoryFilter({
    categories,
    selectedCategory,
    onCategoryChange,
}: CategoryFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative w-full sm:w-auto">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors min-h-[44px] sm:min-h-auto"
            >
                <span className="truncate">
                    {selectedCategory
                        ? `Category: ${categories.find(cat => cat.slug === selectedCategory)?.name || selectedCategory}`
                        : 'All Categories'
                    }
                </span>
                <svg
                    className={`h-4 w-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 sm:left-auto z-10 mt-2 w-full sm:w-56 rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800 max-h-80 overflow-y-auto">
                    <button
                        onClick={() => {
                            onCategoryChange(undefined);
                            setIsOpen(false);
                        }}
                        className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors min-h-[44px] flex items-center"
                    >
                        All Categories
                    </button>
                    {categories.map((category, index) => (
                        <button
                            key={`${category.slug}-${index}`}
                            onClick={() => {
                                onCategoryChange(category.slug);
                                setIsOpen(false);
                            }}
                            className={`block w-full px-4 py-3 text-left text-sm transition-colors min-h-[44px] flex items-center ${selectedCategory === category.slug
                                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
