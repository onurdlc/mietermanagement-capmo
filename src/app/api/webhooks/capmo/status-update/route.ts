import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mapCapmoStatusToSystemStatus } from '@/lib/status';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { capmoTicketId, status } = body;
  if (!capmoTicketId || !status) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const ticket = await prisma.ticket.findFirst({ where: { capmoTicketId } });
  if (!ticket) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }

  const newStatus = mapCapmoStatusToSystemStatus(status);

  await prisma.statusHistory.create({
    data: {
      ticketId: ticket.id,
      oldStatus: ticket.status,
      newStatus,
      source: 'CAPMO'
    }
  });

  const updated = await prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      status: newStatus,
      capmoLastSyncedAt: new Date()
    }
  });

  return NextResponse.json(updated);
}
