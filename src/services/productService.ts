import { API_CONFIG, CACHE_DURATION } from '@/lib/constants';
import { type Product, type ProductsResponse, type ProductFilters } from '@/types/product';

// Simple in-memory cache
interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCacheKey(endpoint: string, params?: Record<string, unknown>): string {
    if (!params) return endpoint;
    const queryString = Object.entries(params)
        .filter(([, value]) => value !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    return `${endpoint}?${queryString}`;
}

function isCacheValid<T>(entry: CacheEntry<T>, duration: number): boolean {
    return Date.now() - entry.timestamp < duration * 1000;
}

async function fetchWithCache<T>(
    url: string,
    cacheKey: string,
    cacheDuration: number,
    options?: RequestInit
): Promise<T> {
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && isCacheValid(cached as CacheEntry<T>, cacheDuration)) {
        return cached.data as T;
    }

    // Fetch from API
    try {
        const response = await fetch(url, {
            ...options,
            next: { revalidate: cacheDuration },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = (await response.json()) as T;

        // Cache the result
        cache.set(cacheKey, {
            data,
            timestamp: Date.now(),
        });

        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

/**
 * Fetch all products with optional filters
 */
export async function fetchProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    const skip = filters?.skip ?? 0;
    const limit = filters?.limit ?? 12;
    const category = filters?.category;

    let url = `${API_CONFIG.BASE_URL}${API_CONFIG.PRODUCTS_ENDPOINT}`;

    // Build query string
    const params = new URLSearchParams();
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());

    if (category) {
        url = `${API_CONFIG.BASE_URL}${API_CONFIG.PRODUCTS_ENDPOINT}/category/${category}`;
    }

    url += `?${params.toString()}`;

    const cacheKey = getCacheKey(`${API_CONFIG.PRODUCTS_ENDPOINT}`, {
        skip,
        limit,
        category,
    });

    return fetchWithCache<ProductsResponse>(url, cacheKey, CACHE_DURATION.PRODUCTS);
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(id: number): Promise<Product> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.PRODUCTS_ENDPOINT}/${id}`;
    const cacheKey = `${API_CONFIG.PRODUCTS_ENDPOINT}/${id}`;

    return fetchWithCache<Product>(url, cacheKey, CACHE_DURATION.PRODUCT_DETAIL);
}

/**
 * Fetch all available categories
 */
export async function fetchCategories(): Promise<string[]> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.CATEGORIES_ENDPOINT}`;
    const cacheKey = API_CONFIG.CATEGORIES_ENDPOINT;

    return fetchWithCache<string[]>(url, cacheKey, CACHE_DURATION.CATEGORIES);
}

/**
 * Search products by query
 */
export async function searchProducts(query: string, limit: number = 12, skip: number = 0): Promise<ProductsResponse> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.PRODUCTS_ENDPOINT}/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`;
    const cacheKey = getCacheKey('search', { q: query, limit, skip });

    return fetchWithCache<ProductsResponse>(url, cacheKey, CACHE_DURATION.PRODUCTS);
}

/**
 * Clear cache (useful for manual cache invalidation)
 */
export function clearCache(): void {
    cache.clear();
}
