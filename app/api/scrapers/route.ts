import { NextResponse } from 'next/server';
import { store } from '@/src/lib/store';

export async function GET() {
  const scrapers = store.getScrapers();
  return NextResponse.json({ scrapers });
}
