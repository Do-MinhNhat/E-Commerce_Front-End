'use client';

import { Product } from '@/types/product';
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { PATH } from '@/lib/constants';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);
    const [addedToCart, setAddedToCart] = useState(false);
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart({
            id: product.id,
            title: product.title,
            price: discountedPrice,
            thumbnail: product.thumbnail,
        });

        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    return (
        <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600">
            {/* Image Container */}
            <Link href={PATH.productDetail(product.id)} className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                <div className="relative h-40 sm:h-48 md:h-56 w-full overflow-hidden flex items-center justify-center">
                    <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Discount Badge */}
                    {product.discountPercentage > 0 && (
                        <div className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                            -{product.discountPercentage.toFixed(0)}%
                        </div>
                    )}

                    {/* Stock Badge */}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-white font-bold text-sm sm:text-base">Out of Stock</span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-1 p-3 sm:p-4">
                {/* Category */}
                <div className="mb-2">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                        {product.category}
                    </span>
                </div>

                {/* Title */}
                <Link href={PATH.productDetail(product.id)}>
                    <h3 className="line-clamp-2 text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {product.title}
                    </h3>
                </Link>

                {/* Rating & Stock Info */}
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-xs sm:text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {product.rating.toFixed(1)}
                        </span>
                    </div>
                </div>

                {/* Price */}
                <div className="mb-auto pb-3">
                    <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                            {formatPrice(discountedPrice)}
                        </span>
                        {product.discountPercentage > 0 && (
                            <span className="text-xs sm:text-sm text-gray-500 line-through dark:text-gray-400">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Add to Cart Button */}
            <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addedToCart}
                className={`w-full px-3 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-300 min-h-11 sm:min-h-12 touch-manipulation ${addedToCart
                    ? 'bg-green-500 text-white'
                    : product.stock === 0
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
                    }`}
            >
                {addedToCart ? '✓ Added to Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    );
}
