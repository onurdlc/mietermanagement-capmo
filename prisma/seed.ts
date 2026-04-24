import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.upsert({
    where: { id: 'demo-org' },
    update: {},
    create: { id: 'demo-org', name: 'Demo Real Estate GmbH' }
  });

  const property = await prisma.property.upsert({
    where: { id: 'demo-property-kus9-159' },
    update: {},
    create: {
      id: 'demo-property-kus9-159',
      organizationId: org.id,
      name: 'KUS9-159',
      address: 'Demo Street 9, Frankfurt am Main'
    }
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

  await prisma.ticket.upsert({
    where: { id: 'demo-ticket-skirting' },
    update: {},
    create: {
      id: 'demo-ticket-skirting',
      organizationId: org.id,
      propertyId: property.id,
      tenantId: tenant.id,
      capmoTicketId: 'CAPMO-MOCK-12345',
      title: 'KUS9-159 - 3rd floor left | WE 33 - Loose skirting boards - 530204',
      description: 'In 2 rooms the skirting boards are loose.\n\nContact details tenant:\nBernd Fritz Georg Japp or Hannah Lena Japp\nPhone landline: 0175/7286292\nPhone mobile: 0151/67214190\nEmail: b.japp@japp.de',
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
}

main().finally(async () => prisma.$disconnect());
