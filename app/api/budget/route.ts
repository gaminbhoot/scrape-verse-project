import { NextResponse } from 'next/server';
import { brightData } from '@/src/lib/brightdata';

export async function GET() {
  const budget = await brightData.getBudget();
  return NextResponse.json({ budget });
}
