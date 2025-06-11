// app/api/total-categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchAllProducts } from '@/app/lib/data';

export async function GET(req: NextRequest) {
  try {
    const searchQuery = req.nextUrl.searchParams.get('q') || '';
    const allProducts = await fetchAllProducts(searchQuery);

    // Hitung kategori berdasarkan semua produk
    const categoryCounts: { [key: string]: number } = allProducts.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({ categoryCounts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching category counts:', error);
    return NextResponse.json({ error: 'Failed to fetch category counts' }, { status: 500 });
  }
}