import { NextResponse } from 'next/server';
import { fetchMonthlyRevenue } from '@/app/lib/data';

export async function GET() {
  try {
    const data = await fetchMonthlyRevenue();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API error in /api/revenue-metrics:', error);
    return NextResponse.json({ error: 'Failed to load revenue metrics' }, { status: 500 });
  }
}