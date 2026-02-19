'use client';

import { Product } from '@/types/product';
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { PATH } from '@/lib/constants';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);
    const [addedToCart, setAddedToCart] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cartItems.find((item: any) => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                id: product.id,
                title: product.title,
                price: discountedPrice,
                thumbnail: product.thumbnail,
                quantity: 1,
            });
        }

        localStorage.setItem('cart', JSON.stringify(cartItems));
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    return (
        <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md active:shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <Link href={PATH.productDetail(product.id)}>
                {/* Image Container */}
                <div className="relative h-32 sm:h-40 md:h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                    />
                    {product.discountPercentage > 0 && (
                        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-semibold">
                            -{product.discountPercentage.toFixed(0)}%
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-2 sm:p-3 md:p-4">
                    {/* Title */}
                    <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                        {product.title}
                    </h3>

                    {/* Category Badge */}
                    <div className="mb-2 sm:mb-3 inline-block">
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 px-2 py-0.5 sm:py-1 rounded text-nowrap">
                            {product.category}
                        </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2 sm:mb-3 flex-wrap">
                        <span className="text-yellow-500 text-sm">★</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                            {product.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                            ({product.stock > 0 ? 'In Stock' : 'Out of Stock'})
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 flex-wrap mb-3">
                        <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                            {formatPrice(discountedPrice)}
                        </span>
                        {product.discountPercentage > 0 && (
                            <span className="text-xs sm:text-sm text-gray-500 line-through dark:text-gray-400">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Add to Cart Button */}
            <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addedToCart}
                className="w-full px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold border-t border-gray-200 dark:border-gray-700 transition-colors min-h-10 sm:min-h-11 touch-manipulation active:opacity-90"
                style={{
                    backgroundColor: addedToCart ? '#10b981' : product.stock === 0 ? '#9ca3af' : '#3b82f6',
                    color: 'white',
                }}
            >
                {addedToCart ? '✓ Added to Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    );
}
