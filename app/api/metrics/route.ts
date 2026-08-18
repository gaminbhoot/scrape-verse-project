import { NextResponse } from 'next/server';
import { store } from '@/src/lib/store';

export async function GET() {
  const metrics = store.getMetrics();
  return NextResponse.json({ metrics });
}
