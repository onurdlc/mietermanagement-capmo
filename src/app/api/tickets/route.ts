import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createCapmoTicket } from '@/lib/capmo';

export async function GET() {
  const tickets = await prisma.ticket.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(tickets);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const tenant = await prisma.tenant.findUnique({ where: { id: body.tenantId } });
  if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  const property = await prisma.property.findUnique({ where: { id: tenant.propertyId } });
  if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

  const ticket = await prisma.ticket.create({ data: {
    organizationId: property.organizationId,
    propertyId: property.id,
    tenantId: tenant.id,
    title: body.title,
    description: body.description,
    category: body.category,
    type: body.type,
    location: body.location ?? `${tenant.floor ?? ''} | ${tenant.unit ?? ''}`,
    status: 'Open',
    dueDate: body.dueDate ? new Date(body.dueDate) : null,
    company: body.company,
    responsiblePersons: body.responsiblePersons,
    capmoSyncStatus: 'PENDING'
  }});

  try {
    const capmo = await createCapmoTicket(ticket);
    const updated = await prisma.ticket.update({ where: { id: ticket.id }, data: { capmoTicketId: capmo.id, capmoSyncStatus: 'SYNCED', capmoLastSyncedAt: new Date() } });
    await prisma.capmoSyncLog.create({ data: { ticketId: ticket.id, direction: 'OUTBOUND', status: 'SUCCESS', requestPayload: JSON.stringify(capmo.payload), responsePayload: JSON.stringify(capmo) } });
    return NextResponse.json(updated, { status: 201 });
  } catch (error: any) {
    await prisma.capmoSyncLog.create({ data: { ticketId: ticket.id, direction: 'OUTBOUND', status: 'FAILED', errorMessage: error.message } });
    return NextResponse.json(ticket, { status: 201 });
  }
}
