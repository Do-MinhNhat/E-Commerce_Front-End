'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

interface StockInfo {
    [productId: number]: number;
}

export default function CheckoutPage() {
    const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [stockInfo, setStockInfo] = useState<StockInfo>({});
    const [stockLoading, setStockLoading] = useState(false);
    const [stockError, setStockError] = useState<{ [key: number]: string }>({});

    // Fetch stock for all cart items
    useEffect(() => {
        const fetchStockInfo = async () => {
            if (cart.length === 0) return;

            setStockLoading(true);
            const stocks: StockInfo = {};

            try {
                await Promise.all(
                    cart.map(async (item) => {
                        try {
                            const res = await fetch(`/api/products/${item.id}`);
                            if (res.ok) {
                                const product = await res.json();
                                stocks[item.id] = product.stock;
                            }
                        } catch (err) {
                            console.error(`Failed to fetch stock for product ${item.id}`);
                        }
                    })
                );
                setStockInfo(stocks);
            } finally {
                setStockLoading(false);
            }
        };

        fetchStockInfo();
    }, [cart.length]); // Re-fetch when cart length changes

    const checkAndUpdateQuantity = async (productId: number, newQuantity: number) => {
        // Clear any existing error
        setStockError((prev) => ({ ...prev, [productId]: '' }));

        // Check against cached stock first
        const availableStock = stockInfo[productId];
        if (availableStock !== undefined && newQuantity > availableStock) {
            setStockError((prev) => ({
                ...prev,
                [productId]: `Only ${availableStock} available in stock`,
            }));
            updateQuantity(productId, availableStock);
            return;
        }

        updateQuantity(productId, newQuantity);
    };

    const handleIncreaseQuantity = async (productId: number, currentQuantity: number) => {
        const newQuantity = currentQuantity + 1;
        await checkAndUpdateQuantity(productId, newQuantity);
    };

    if (orderPlaced) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Thank you for your purchase. Your order has been confirmed.
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors min-h-11"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        Your Cart is Empty
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Looks like you haven&apos;t added any products yet.
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors min-h-11"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    const handlePlaceOrder = () => {
        clearCart();
        setOrderPlaced(true);
    };

    return (
        <div className="w-full">
            {/* Breadcrumb */}
            <div className="mb-6 sm:mb-8 flex items-center gap-2 text-xs sm:text-sm overflow-x-auto">
                <Link href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 whitespace-nowrap">
                    Home
                </Link>
                <span className="text-gray-500 shrink-0">/</span>
                <span className="text-gray-700 dark:text-gray-300">Checkout</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Shopping Cart ({getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''})
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-4 p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                        >
                            {/* Product Image */}
                            <Link href={`/products/${item.id}`} className="shrink-0">
                                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                    <Image
                                        src={item.thumbnail}
                                        alt={item.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </Link>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0 flex flex-col">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <Link href={`/products/${item.id}`}>
                                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                                            {item.title}
                                        </h3>
                                    </Link>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="shrink-0 p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                        title="Remove item"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>

                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                    Unit price: {formatPrice(item.price)}
                                    {stockInfo[item.id] !== undefined && (
                                        <span className="ml-2">
                                            ({stockInfo[item.id]} in stock)
                                        </span>
                                    )}
                                </p>

                                {stockError[item.id] && (
                                    <p className="text-xs text-red-600 dark:text-red-400 mb-2">
                                        {stockError[item.id]}
                                    </p>
                                )}

                                <div className="mt-auto flex items-center justify-between gap-4">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold text-base rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
                                            title="Decrease quantity"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            min={1}
                                            max={stockInfo[item.id]}
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === '') {
                                                    updateQuantity(item.id, 1);
                                                } else {
                                                    const num = parseInt(val);
                                                    if (!isNaN(num) && num >= 1) {
                                                        const maxStock = stockInfo[item.id];
                                                        const newQuantity = maxStock !== undefined && num > maxStock ? maxStock : num;
                                                        updateQuantity(item.id, newQuantity);
                                                    }
                                                }
                                            }}
                                            className="w-12 py-1.5 font-semibold text-gray-900 dark:text-white text-sm text-center border-x border-gray-300 dark:border-gray-600 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <button
                                            onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                                            disabled={stockInfo[item.id] !== undefined && item.quantity >= stockInfo[item.id]}
                                            className="px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold text-base rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
                                            title="Increase quantity"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Item Total */}
                                    <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                                        {formatPrice(item.price * item.quantity)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Clear Cart */}
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={clearCart}
                            className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                            Order Summary
                        </h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Subtotal ({getTotalItems()} items)
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {formatPrice(getTotalPrice())}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                <span className="font-medium text-green-600 dark:text-green-400">Free</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {formatPrice(Math.round(getTotalPrice() * 0.1))}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-base font-bold text-gray-900 dark:text-white">Total</span>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    {formatPrice(getTotalPrice() + Math.round(getTotalPrice() * 0.1))}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors min-h-11 flex items-center justify-center text-base"
                        >
                            Place Order
                        </button>

                        <Link
                            href="/products"
                            className="w-full mt-3 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 py-2 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
