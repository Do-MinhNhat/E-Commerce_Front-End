import { CartItem } from '@/types/cart';
import { useState, useCallback, useEffect } from 'react';

const CART_KEY = 'cart';
const CART_EVENT = 'cart-updated';

function getCartFromStorage(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveCartToStorage(cart: CartItem[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_EVENT));
}

export function useCart() {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        setCart(getCartFromStorage());
    }, []);

    // Listen for cart updates from other components
    useEffect(() => {
        const handleUpdate = () => {
            setCart(getCartFromStorage());
        };
        window.addEventListener(CART_EVENT, handleUpdate);
        window.addEventListener('storage', handleUpdate);
        return () => {
            window.removeEventListener(CART_EVENT, handleUpdate);
            window.removeEventListener('storage', handleUpdate);
        };
    }, []);

    const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
        const current = getCartFromStorage();
        const existing = current.find((c) => c.id === item.id);

        let updated: CartItem[];
        if (existing) {
            updated = current.map((c) =>
                c.id === item.id ? { ...c, quantity: c.quantity + quantity } : c
            );
        } else {
            updated = [...current, { ...item, quantity }];
        }

        saveCartToStorage(updated);
        setCart(updated);
    }, []);

    const removeFromCart = useCallback((productId: number) => {
        const updated = getCartFromStorage().filter((item) => item.id !== productId);
        saveCartToStorage(updated);
        setCart(updated);
    }, []);

    const updateQuantity = useCallback((productId: number, quantity: number) => {
        if (quantity <= 0) {
            const updated = getCartFromStorage().filter((item) => item.id !== productId);
            saveCartToStorage(updated);
            setCart(updated);
            return;
        }

        const updated = getCartFromStorage().map((item) =>
            item.id === productId ? { ...item, quantity } : item
        );
        saveCartToStorage(updated);
        setCart(updated);
    }, []);

    const clearCart = useCallback(() => {
        saveCartToStorage([]);
        setCart([]);
    }, []);

    const getTotalPrice = useCallback(() => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cart]);

    const getTotalItems = useCallback(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);

    const isInCart = useCallback(
        (productId: number) => {
            return cart.some((item) => item.id === productId);
        },
        [cart]
    );

    return {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        isInCart,
    };
}
