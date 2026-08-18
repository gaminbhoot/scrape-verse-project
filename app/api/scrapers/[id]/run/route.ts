import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/src/lib/store';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const run = await store.runScraper(id);
    const scraper = store.getScraper(id);
    return NextResponse.json({ success: true, run, scraper });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
