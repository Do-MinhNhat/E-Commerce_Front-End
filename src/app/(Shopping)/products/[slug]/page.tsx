'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils';
import { ProductDetailSkeleton } from '@/components/features/ProductDetailSkeleton';
import { ProductRecommendations } from '@/app/(Shopping)/products/components/ProductRecommendations';
import { ProductReviews } from '@/app/(Shopping)/products/components/ProductReviews';
import { useCart } from '@/hooks/useCart';

export default function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [params_resolved, setParamsResolved] = useState<{ slug: string } | null>(null);
    const [tagRecommendations, setTagRecommendations] = useState<Product[]>([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [reviewPage, setReviewPage] = useState(1);
    const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);
    const [addedToCart, setAddedToCart] = useState(false);
    const { addToCart, isInCart } = useCart();

    useEffect(() => {
        params.then(setParamsResolved);
    }, [params]);

    useEffect(() => {
        if (!params_resolved) return;

        const loadProduct = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const res = await fetch(`/api/products/${params_resolved.slug}`);
                if (!res.ok) throw new Error('Product not found');
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        loadProduct();
    }, [params_resolved]);

    // Set selected image when product loads
    useEffect(() => {
        if (product) {
            setSelectedImage(product.images && product.images.length > 0 ? product.images[0] : product.thumbnail);
        }
    }, [product]);

    // Load recommendations
    useEffect(() => {
        if (!product) return;

        const loadRecommendations = async () => {
            try {
                setLoadingRecommendations(true);

                // Fetch products from the same category
                const res = await fetch(`/api/products?category=${encodeURIComponent(product.category)}&limit=30`);
                if (!res.ok) throw new Error('Failed to load recommendations');
                const data = await res.json();
                const categoryProducts: Product[] = data.products;

                // Filter out current product
                const otherProducts = categoryProducts.filter((p: Product) => p.id !== product.id);

                // Prioritize products with matching tags
                const withMatchingTags: Product[] = [];
                const withoutMatchingTags: Product[] = [];

                otherProducts.forEach((p: Product) => {
                    const hasMatchingTag = product.tags?.some(tag => p.tags?.includes(tag));
                    if (hasMatchingTag) {
                        withMatchingTags.push(p);
                    } else {
                        withoutMatchingTags.push(p);
                    }
                });

                // Combine: tag matches first, then others, randomize and limit to 8
                const recommendations = [
                    ...withMatchingTags.sort(() => Math.random() - 0.5),
                    ...withoutMatchingTags.sort(() => Math.random() - 0.5)
                ].slice(0, 8);

                setTagRecommendations(recommendations);
            } catch (err) {
                console.error('Error loading recommendations:', err);
                setTagRecommendations([]);
            } finally {
                setLoadingRecommendations(false);
            }
        };

        loadRecommendations();
    }, [product]);

    if (isLoading) {
        return (
            <div>
                <ProductDetailSkeleton />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Product not found'}</p>
                <Link href="/products" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    Back to Products
                </Link>
            </div>
        );
    }

    const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);

    return (
        <div className="w-full">
            {/* Breadcrumb */}
            <div className="mb-6 sm:mb-8 flex items-center gap-2 text-xs sm:text-sm px-4 sm:px-0 overflow-x-auto">
                <Link href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 whitespace-nowrap">
                    Home
                </Link>
                <span className="text-gray-500 shrink-0">/</span>
                <Link href="/products" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 whitespace-nowrap">
                    Products
                </Link>
                <span className="text-gray-500 shrink-0">/</span>
                <span className="text-gray-700 dark:text-gray-300 truncate">{product.title}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-0">
                {/* Image Gallery */}
                <div>
                    <div className="mb-3 sm:mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square relative">
                        <Image
                            src={selectedImage || product.thumbnail}
                            alt={product.title}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    {product.images && product.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                            {product.images.slice(0, 4).map((image, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedImage(image)}
                                    className={`rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square relative cursor-pointer hover:opacity-80 active:opacity-60 transition-opacity border-2 ${selectedImage === image ? 'border-blue-600 dark:border-blue-400' : 'border-transparent'
                                        }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`${product.title} ${idx + 1}`}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    {/* Category */}
                    <div className="mb-4">
                        <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold capitalize">
                            {product.category}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {product.title}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-6 flex-wrap">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`text-lg ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                {product.rating.toFixed(1)}
                            </span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {product.stock > 0 ? (
                                <span className="text-green-600 dark:text-green-400 font-semibold">In Stock</span>
                            ) : (
                                <span className="text-red-600 dark:text-red-400 font-semibold">Out of Stock</span>
                            )}
                        </div>
                    </div>

                    {/* Price */}
                    <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-baseline gap-2 sm:gap-3 mb-2 flex-wrap">
                            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                {formatPrice(discountedPrice)}
                            </span>
                            {product.discountPercentage > 0 && (
                                <>
                                    <span className="text-lg sm:text-xl text-gray-500 line-through dark:text-gray-400">
                                        {formatPrice(product.price)}
                                    </span>
                                    <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                                        -{product.discountPercentage.toFixed(0)}%
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2">
                            Description
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Product Details */}
                    <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-3">
                            Product Details
                        </h3>
                        <dl className="space-y-2 text-xs sm:text-sm">
                            <div className="flex gap-4">
                                <dt className="text-gray-600 dark:text-gray-400">Brand:</dt>
                                <dd className="text-gray-900 dark:text-white font-medium">{product.brand}</dd>
                            </div>
                            <div className="flex gap-4">
                                <dt className="text-gray-600 dark:text-gray-400">Stock:</dt>
                                <dd className="text-gray-900 dark:text-white font-medium">{product.stock} available</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-3">
                                Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-xs sm:text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add to Cart */}
                    {product.stock > 0 && (
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 min-h-11">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                        className="flex-1 px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                        title="Decrease quantity"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max={product.stock}
                                        value={quantity}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === '') {
                                                setQuantity(1);
                                            } else {
                                                const num = parseInt(value);
                                                if (!isNaN(num)) {
                                                    setQuantity(Math.max(1, Math.min(product.stock, num)));
                                                }
                                            }
                                        }}
                                        className="w-16 sm:w-20 px-2 py-2 font-semibold text-center text-gray-900 dark:text-white bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        disabled={quantity >= product.stock}
                                        className="flex-1 px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                        title="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        const discounted = calculateDiscountedPrice(product.price, product.discountPercentage);
                                        addToCart(
                                            {
                                                id: product.id,
                                                title: product.title,
                                                price: discounted,
                                                thumbnail: product.thumbnail,
                                            },
                                            quantity
                                        );
                                        setAddedToCart(true);
                                        setTimeout(() => setAddedToCart(false), 2000);
                                    }}
                                    disabled={addedToCart}
                                    className={`flex-1 font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors touch-manipulation min-h-11 flex items-center justify-center text-base sm:text-lg ${addedToCart
                                        ? 'bg-green-500 text-white'
                                        : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
                                        }`}
                                >
                                    {addedToCart ? '✓ Added to Cart' : isInCart(product.id) ? 'Add More to Cart' : 'Add to Cart'}
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                ({product.stock} available)
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews Section */}
            <ProductReviews
                product={product}
                reviewPage={reviewPage}
                selectedStarFilter={selectedStarFilter}
                onReviewPageChange={setReviewPage}
                onStarFilterChange={setSelectedStarFilter}
            />

            {/* Recommendations Section */}
            <ProductRecommendations
                tagRecommendations={tagRecommendations}
                loadingRecommendations={loadingRecommendations}
            />
        </div>
    );
}
