import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function ensureDemoTenant() {
  const org = await prisma.organization.upsert({ where: { id: 'demo-org' }, update: {}, create: { id: 'demo-org', name: 'Demo Real Estate GmbH' } });
  const property = await prisma.property.upsert({ where: { id: 'demo-property-kus9-159' }, update: {}, create: { id: 'demo-property-kus9-159', organizationId: org.id, name: 'KUS9-159', address: 'Demo Street 9, Frankfurt am Main' } });
  await prisma.tenant.upsert({ where: { id: 'demo-tenant-japp' }, update: {}, create: { id: 'demo-tenant-japp', propertyId: property.id, tenantNumber: '530204', firstName: 'Bernd', lastName: 'Japp', email: 'b.japp@japp.de', phone: '0175/7286292', mobile: '0151/67214190', unit: 'WE 33', floor: '3rd floor left' } });
}

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json();
  const tenantNumber = String(body.tenantNumber ?? '').trim();
  const lastName = String(body.lastName ?? '').trim();

  if (!tenantNumber || !lastName) return NextResponse.json({ error: 'Tenant number and last name are required' }, { status: 400 });

  await ensureDemoTenant();

  const tenant = await prisma.tenant.findFirst({ where: { tenantNumber, lastName: { equals: lastName, mode: 'insensitive' } } });
  if (!tenant) return NextResponse.json({ error: 'Invalid tenant credentials' }, { status: 401 });

  return NextResponse.json({ id: tenant.id, tenantNumber: tenant.tenantNumber, firstName: tenant.firstName, lastName: tenant.lastName, propertyId: tenant.propertyId });
}
