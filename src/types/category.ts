// Category types for DummyJSON
export interface Category {
    name: string;
    slug: string;
    url: string;
}

export interface CategoriesResponse {
    categories: Category[];
}