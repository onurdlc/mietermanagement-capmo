import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCapmoTicketStatus } from '@/lib/capmo';

export async function GET() {
  const tickets = await prisma.ticket.findMany({ where: { capmoTicketId: { not: null } } });
  const results = [];

  for (const ticket of tickets) {
    try {
      const newStatus = await getCapmoTicketStatus(ticket.capmoTicketId!);
      if (newStatus !== ticket.status) {
        await prisma.statusHistory.create({ data: { ticketId: ticket.id, oldStatus: ticket.status, newStatus, source: 'CAPMO_POLLING' } });
      }
      const updated = await prisma.ticket.update({ where: { id: ticket.id }, data: { status: newStatus, capmoSyncStatus: 'SYNCED', capmoLastSyncedAt: new Date() } });
      await prisma.capmoSyncLog.create({ data: { ticketId: ticket.id, direction: 'INBOUND', status: 'SUCCESS', responsePayload: JSON.stringify({ status: newStatus }) } });
      results.push(updated);
    } catch (error: any) {
      await prisma.capmoSyncLog.create({ data: { ticketId: ticket.id, direction: 'INBOUND', status: 'FAILED', errorMessage: error.message } });
    }
  }

  return NextResponse.json({ synced: results.length, results });
}
