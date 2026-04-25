import { NextRequest, NextResponse } from 'next/server';
import { analyzeTenantConversation } from '@/lib/real-ai';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages, language = 'de' } = body;

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: 'messages array required' }, { status: 400 });
  }

  const result = await analyzeTenantConversation(messages, language);

  return NextResponse.json(result);
}
