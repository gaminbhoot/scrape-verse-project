import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { store } from '@/src/lib/store';

const idSchema = z.string().min(1).max(100).regex(/^[a-zA-Z0-9_\-]+$/, 'Invalid id format');

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const parsed = idSchema.safeParse(id);
    if (!parsed.success) return NextResponse.json({ success: false, error: 'Invalid collector id format' }, { status: 400 });
    // escape injection check: zod already rejects bad chars
    const run = await store.runScraper(id);
    const scraper = store.getScraper(id);
    return NextResponse.json({ success: true, run, scraper });
  } catch (err: any) {
    const msg = err.message || 'Run failed';
    const status = msg.includes('not found') ? 404 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
