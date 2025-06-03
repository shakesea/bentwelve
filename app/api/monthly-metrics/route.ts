import { NextResponse } from 'next/server';
import { fetchMonthlySales } from '@/app/lib/data';

export async function GET() {
  try {
    const data = await fetchMonthlySales();
    console.log('API fetched data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('API error in /api/monthly-metrics:', error);
    return NextResponse.json({ error: 'Failed to load metrics' }, { status: 500 });
  }
}
