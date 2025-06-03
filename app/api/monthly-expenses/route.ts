import { NextResponse } from 'next/server';
import { fetchMonthlyExpenses } from '@/app/lib/data';

export async function GET() {
  try {
    const data = await fetchMonthlyExpenses();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API error in /api/monthly-expenses:', error);
    return NextResponse.json({ error: 'Failed to load expenses' }, { status: 500 });
  }
}
