import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const orgName = 'Demo Real Estate GmbH';

  const org = await prisma.organization.upsert({
    where: { id: 'demo-org' },
    update: {
      name: orgName,
      slug: createSlug(orgName),
      isActive: true,
      plan: 'ENTERPRISE',
      seats: 25,
      primaryColor: '#08b7ca',
      secondaryColor: '#00d994',
      billingEmail: 'demo@example.com'
    },
    create: {
      id: 'demo-org',
      name: orgName,
      slug: createSlug(orgName),
      isActive: true,
      plan: 'ENTERPRISE',
      seats: 25,
      primaryColor: '#08b7ca',
      secondaryColor: '#00d994',
      billingEmail: 'demo@example.com'
    }
  });

  const property = await prisma.property.upsert({
    where: { id: 'demo-property-kus9-159' },
    update: {
      organizationId: org.id,
      name: 'KUS9-159',
      address: 'Demo Street 9, Frankfurt am Main'
    },
    create: {
      id: 'demo-property-kus9-159',
      organizationId: org.id,
      name: 'KUS9-159',
      address: 'Demo Street 9, Frankfurt am Main'
    }
  });

  const tenant = await prisma.tenant.upsert({
    where: { id: 'demo-tenant-japp' },
    update: {
      propertyId: property.id,
      tenantNumber: '530204',
      firstName: 'Bernd',
      lastName: 'Japp',
      email: 'b.japp@japp.de',
      phone: '0175/7286292',
      mobile: '0151/67214190',
      unit: 'WE 33',
      floor: '3rd floor left',
      isActive: true
    },
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
      floor: '3rd floor left',
      isActive: true
    }
  });

  await prisma.ticket.upsert({
    where: { id: 'demo-ticket-skirting' },
    update: {
      organizationId: org.id,
      propertyId: property.id,
      tenantId: tenant.id,
      capmoTicketId: 'CAPMO-MOCK-12345',
      status: 'Open',
      priority: 'NORMAL',
      capmoSyncStatus: 'SYNCED',
      capmoLastSyncedAt: new Date()
    },
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
      priority: 'NORMAL',
      dueDate: new Date('2026-04-17'),
      company: 'P&P Group GmbH',
      responsiblePersons: 'Kenneth Wegner\nKatharina Walter\nFlorian Zengerle\nDariia Biliavtseva',
      capmoSyncStatus: 'SYNCED',
      capmoLastSyncedAt: new Date()
    }
  });

  console.log('Demo seed completed. Login: tenantNumber=530204, lastName=Japp');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
