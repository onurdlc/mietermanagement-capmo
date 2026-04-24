import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const logs = await prisma.capmoSyncLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  return NextResponse.json(logs);
}
