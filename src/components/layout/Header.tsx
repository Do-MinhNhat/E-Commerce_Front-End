'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setMobileMenuOpen(false);
        }
    };

    useEffect(() => {
        const fetchSearchResults = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/products?q=${encodeURIComponent(searchQuery)}`);
                if (!response.ok) throw new Error('Failed to fetch products');
                const data = await response.json();
                setSearchResults(data.products || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Search failed');
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        }
        if (searchQuery.trim()) {
            fetchSearchResults();
        }
    }, [searchQuery]);

    return (
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 min-w-fit">
                        <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-600 to-blue-700" />
                        <span className="font-bold text-lg text-gray-900 dark:text-white hidden sm:inline">
                            EStore
                        </span>
                    </Link>

                    {/* Search Bar - Hidden on mobile */}
                    <div className="hidden md:flex flex-1 max-w-md relative">
                        <form onSubmit={handleSearch} className="w-full">
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                            />
                        </form>

                        {/* Search Results Dropdown */}
                        {searchQuery.trim() && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                                {isLoading && (
                                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                        Loading...
                                    </div>
                                )}
                                {error && (
                                    <div className="p-4 text-center text-red-500 dark:text-red-400">
                                        {error}
                                    </div>
                                )}
                                {!isLoading && !error && searchResults.length === 0 && (
                                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                        No products found
                                    </div>
                                )}
                                {searchResults.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.id}`}
                                        onClick={() => {
                                            setSearchQuery('');
                                        }}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 transition-colors"
                                    >
                                        {product.thumbnail && (
                                            <img
                                                src={product.thumbnail}
                                                alt={product.title}
                                                className="w-10 h-10 object-cover rounded"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {product.title.split(new RegExp(`(${searchQuery.trim()})`, 'gi')).map((part: string, i: number) =>
                                                    part.toLowerCase() === searchQuery.trim().toLowerCase() ?
                                                        <span key={i} className="bg-yellow-200 dark:bg-yellow-700">{part}</span> :
                                                        <span key={i}>{part}</span>
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {product.description && (() => {
                                                    const desc = product.description;
                                                    const trimmedQuery = searchQuery.trim();
                                                    const index = desc.toLowerCase().indexOf(trimmedQuery.toLowerCase());
                                                    let contextText = desc;

                                                    if (index !== -1) {
                                                        const start = Math.max(0, index - 30);
                                                        const end = Math.min(desc.length, index + trimmedQuery.length + 30);
                                                        contextText = (start > 0 ? '...' : '') + desc.substring(start, end) + (end < desc.length ? '...' : '');
                                                    } else {
                                                        contextText = desc.length > 80 ? desc.substring(0, 80) + '...' : desc;
                                                    }

                                                    return contextText.split(new RegExp(`(${trimmedQuery})`, 'gi')).map((part: string, i: number) =>
                                                        part.toLowerCase() === trimmedQuery.toLowerCase() ?
                                                            <span key={i} className="bg-yellow-200 dark:bg-yellow-700">{part}</span> :
                                                            <span key={i}>{part}</span>
                                                    );
                                                })()}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                ${product.price}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
                        <Link
                            href="/"
                            className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                        >
                            Products
                        </Link>
                        <Link
                            href="/categories"
                            className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                        >
                            Categories
                        </Link>
                        <Link
                            href="/profile/account"
                            className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                        >
                            Profile
                        </Link>
                    </nav>

                    {/* Checkout Link */}
                    <Link
                        href="/checkout"
                        className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Cart</span>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-3">
                        {/* Mobile Search */}
                        <div className="relative px-4 mb-4">
                            <form onSubmit={handleSearch} className="mb-2">
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                                />
                            </form>

                            {/* Mobile Search Results */}
                            {searchQuery.trim() && (
                                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                                    {isLoading && (
                                        <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
                                            Loading...
                                        </div>
                                    )}
                                    {error && (
                                        <div className="p-3 text-center text-red-500 dark:text-red-400 text-sm">
                                            {error}
                                        </div>
                                    )}
                                    {!isLoading && !error && searchResults.length === 0 && (
                                        <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
                                            No products found
                                        </div>
                                    )}
                                    {searchResults.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.id}`}
                                            onClick={() => {
                                                setSearchQuery('');
                                                setMobileMenuOpen(false);
                                            }}
                                            className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 transition-colors"
                                        >
                                            {product.thumbnail && (
                                                <img
                                                    src={product.thumbnail}
                                                    alt={product.title}
                                                    className="w-8 h-8 object-cover rounded"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {product.title.split(new RegExp(`(${searchQuery.trim()})`, 'gi')).map((part: string, i: number) =>
                                                        part.toLowerCase() === searchQuery.trim().toLowerCase() ?
                                                            <span key={i} className="bg-yellow-200 dark:bg-yellow-700">{part}</span> :
                                                            <span key={i}>{part}</span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {product.description && (() => {
                                                        const desc = product.description;
                                                        const trimmedQuery = searchQuery.trim();
                                                        const index = desc.toLowerCase().indexOf(trimmedQuery.toLowerCase());
                                                        let contextText = desc;

                                                        if (index !== -1) {
                                                            const start = Math.max(0, index - 30);
                                                            const end = Math.min(desc.length, index + trimmedQuery.length + 30);
                                                            contextText = (start > 0 ? '...' : '') + desc.substring(start, end) + (end < desc.length ? '...' : '');
                                                        } else {
                                                            contextText = desc.length > 80 ? desc.substring(0, 80) + '...' : desc;
                                                        }

                                                        return contextText.split(new RegExp(`(${trimmedQuery})`, 'gi')).map((part: string, i: number) =>
                                                            part.toLowerCase() === trimmedQuery.toLowerCase() ?
                                                                <span key={i} className="bg-yellow-200 dark:bg-yellow-700">{part}</span> :
                                                                <span key={i}>{part}</span>
                                                        );
                                                    })()}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    ${product.price}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                        <Link
                            href="/"
                            className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/product"
                            className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Products
                        </Link>
                        <Link
                            href="/category"
                            className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Categories
                        </Link>
                        <Link
                            href="/profile/account"
                            className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Profile
                        </Link>
                        <Link
                            href="/checkout"
                            className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Go to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
