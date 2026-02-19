// API Configuration
export const API_CONFIG = {
    BASE_URL: 'https://dummyjson.com',
    PRODUCTS_ENDPOINT: '/products',
    CATEGORIES_ENDPOINT: '/products/categories',
    TIMEOUT: 10000,
} as const;

// Pagination
export const PAGINATION = {
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 100,
} as const;

// Cache duration (in seconds)
export const CACHE_DURATION = {
    PRODUCTS: 300, // 5 minutes
    CATEGORIES: 600, // 10 minutes
    PRODUCT_DETAIL: 600, // 10 minutes
} as const;

export const PATH = {
    home: '/',
    products: '/products',
    productDetail: (id: number | string) => `/products/${id}`,
    categories: '/categories',
    checkout: '/checkout',
}