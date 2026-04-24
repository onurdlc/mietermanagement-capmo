import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const tenantNumber = String(body.tenantNumber ?? '').trim();
  const lastName = String(body.lastName ?? '').trim();

  if (!tenantNumber || !lastName) {
    return NextResponse.json({ error: 'Tenant number and last name are required' }, { status: 400 });
  }

  const tenant = await prisma.tenant.findFirst({
    where: {
      tenantNumber,
      lastName: { equals: lastName, mode: 'insensitive' }
    }
  });

  if (!tenant) {
    return NextResponse.json({ error: 'Invalid tenant credentials' }, { status: 401 });
  }

  return NextResponse.json({
    id: tenant.id,
    tenantNumber: tenant.tenantNumber,
    firstName: tenant.firstName,
    lastName: tenant.lastName,
    propertyId: tenant.propertyId
  });
}
