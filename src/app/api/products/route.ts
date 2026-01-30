import { NextRequest, NextResponse } from 'next/server';
import { fetchProducts, fetchProductById, fetchCategories, searchProducts } from '@/services/productService';

/**
 * GET /api/products
 * Fetch all products with optional filters
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const skip = parseInt(searchParams.get('skip') ?? '0', 10);
        const limit = parseInt(searchParams.get('limit') ?? '12', 10);
        const category = searchParams.get('category') ?? undefined;
        const query = searchParams.get('q') ?? undefined;

        if (query) {
            const results = await searchProducts(query, limit);
            return NextResponse.json(results);
        }

        const results = await fetchProducts({ skip, limit, category });
        return NextResponse.json(results);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}
