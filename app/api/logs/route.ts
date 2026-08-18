import { NextResponse } from 'next/server';
import { store } from '@/src/lib/store';

export async function GET() {
  const logs = store.getLogs();
  return NextResponse.json({ logs });
}
