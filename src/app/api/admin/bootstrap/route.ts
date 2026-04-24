import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(): Promise<Response> {
  try {
    const org = await prisma.organization.upsert({
      where: { id: 'demo-org' },
      update: {},
      create: { id: 'demo-org', name: 'Demo Real Estate GmbH' }
    });

    const property = await prisma.property.upsert({
      where: { id: 'demo-property-kus9-159' },
      update: {},
      create: { id: 'demo-property-kus9-159', organizationId: org.id, name: 'KUS9-159', address: 'Demo Street 9, Frankfurt am Main' }
    });

    const tenant = await prisma.tenant.upsert({
      where: { id: 'demo-tenant-japp' },
      update: {},
      create: {
        id: 'demo-tenant-japp',
        propertyId: property.id,
        tenantNumber: '530204',
        firstName: 'Bernd',
        lastName: 'Japp',
        email: 'b.japp@japp.de',
        phone: '0175/7286292',
        mobile: '0151/67214190',
        unit: 'WE 33',
        floor: '3rd floor left'
      }
    });

    const ticket = await prisma.ticket.upsert({
      where: { id: 'demo-ticket-skirting' },
      update: {},
      create: {
        id: 'demo-ticket-skirting',
        organizationId: org.id,
        propertyId: property.id,
        tenantId: tenant.id,
        capmoTicketId: 'CAPMO-MOCK-12345',
        title: 'KUS9-159 - 3rd floor left | WE 33 - Loose skirting boards - 530204',
        description: 'In 2 rooms the skirting boards are loose.',
        category: 'Floor',
        type: 'Warranty defect',
        location: '3rd floor left | WE 33',
        status: 'Open',
        dueDate: new Date('2026-04-17'),
        company: 'P&P Group GmbH',
        responsiblePersons: 'Kenneth Wegner\nKatharina Walter\nFlorian Zengerle\nDariia Biliavtseva',
        capmoSyncStatus: 'SYNCED',
        capmoLastSyncedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, tenantLogin: { tenantNumber: tenant.tenantNumber, lastName: tenant.lastName }, ticketId: ticket.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
