// DummyJSON API Product Type
export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    tags: string[];
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export interface ProductFilters {
    skip?: number;
    limit?: number;
    category?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
}