import { NextRequest, NextResponse } from 'next/server';
import { fetchCategories } from '@/services/productService';

/**
 * GET /api/categories
 * Fetch all available product categories
 */
export async function GET(request: NextRequest) {
    try {
        const categories = await fetchCategories();
        return NextResponse.json({ categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}
