import { API_CONFIG, CACHE_DURATION } from '@/lib/constants';
import { type Product, type ProductsResponse, type ProductFilters } from '@/types/product';

async function fetchWithCache<T>(url: string, cacheDuration: number): Promise<T> {
    const response = await fetch(url, {
        next: { revalidate: cacheDuration },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
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

    return fetchWithCache<ProductsResponse>(url, CACHE_DURATION.PRODUCTS);
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(id: number): Promise<Product> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.PRODUCTS_ENDPOINT}/${id}`;

    return fetchWithCache<Product>(url, CACHE_DURATION.PRODUCT_DETAIL);
}

/**
 * Fetch all available categories
 */
export async function fetchCategories(): Promise<string[]> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.CATEGORIES_ENDPOINT}`;

    return fetchWithCache<string[]>(url, CACHE_DURATION.CATEGORIES);
}

/**
 * Search products by query
 */
export async function searchProducts(query: string, limit: number = 12, skip: number = 0): Promise<ProductsResponse> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.PRODUCTS_ENDPOINT}/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`;

    return fetchWithCache<ProductsResponse>(url, CACHE_DURATION.PRODUCTS);
}
