import { NextRequest, NextResponse } from 'next/server';
import { fetchProductById } from '@/services/productService';

/**
 * GET /api/products/[id]
 * Fetch a single product by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const productId = parseInt(id, 10);

        if (isNaN(productId)) {
            return NextResponse.json(
                { error: 'Invalid product ID' },
                { status: 400 }
            );
        }

        const product = await fetchProductById(productId);
        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Product not found' },
            { status: 404 }
        );
    }
}
