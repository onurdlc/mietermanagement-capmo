import { mapCapmoStatusToSystemStatus } from './status';

export type SystemTicketPayload = {
  id?: string;
  title: string;
  description: string;
  category?: string | null;
  type?: string | null;
  location?: string | null;
  dueDate?: Date | string | null;
  company?: string | null;
  responsiblePersons?: string | null;
};

export const isCapmoMockMode = () => !process.env.CAPMO_API_BASE_URL || !process.env.CAPMO_API_KEY || !process.env.CAPMO_PROJECT_ID;

export function mapSystemTicketToCapmoPayload(ticket: SystemTicketPayload) {
  return {
    projectId: process.env.CAPMO_PROJECT_ID ?? 'MOCK-PROJECT',
    shortText: ticket.title,
    description: ticket.description,
    category: ticket.category,
    type: ticket.type,
    location: ticket.location,
    dueDate: ticket.dueDate ? new Date(ticket.dueDate).toISOString() : null,
    company: ticket.company,
    responsiblePersons: ticket.responsiblePersons?.split('\n').map((v) => v.trim()).filter(Boolean) ?? [],
    status: 'OPEN',
  };
}

async function capmoFetch(path: string, init: RequestInit = {}) {
  const baseUrl = process.env.CAPMO_API_BASE_URL;
  const apiKey = process.env.CAPMO_API_KEY;
  if (!baseUrl || !apiKey) throw new Error('Capmo is not configured');

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...(init.headers ?? {}),
    },
  });

  const text = await response.text();
  const json = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(json?.message ?? `Capmo API error ${response.status}`);
  return json;
}

export async function createCapmoTicket(ticket: SystemTicketPayload) {
  const payload = mapSystemTicketToCapmoPayload(ticket);

  if (isCapmoMockMode()) {
    return {
      id: `CAPMO-MOCK-${Math.floor(10000 + Math.random() * 90000)}`,
      payload,
      mock: true,
    };
  }

  const result = await capmoFetch('/tickets', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return { id: result.id, payload, mock: false };
}

export async function uploadCapmoAttachment(capmoTicketId: string, file: { fileName: string; fileUrl: string; fileType: string; fileSize: number }) {
  if (isCapmoMockMode()) {
    return { id: `ATT-MOCK-${Math.floor(10000 + Math.random() * 90000)}`, mock: true };
  }

  const result = await capmoFetch(`/tickets/${capmoTicketId}/attachments`, {
    method: 'POST',
    body: JSON.stringify(file),
  });

  return { id: result.id, mock: false };
}

export async function getCapmoTicketStatus(capmoTicketId: string) {
  if (isCapmoMockMode()) {
    const statuses = ['Open', 'In Progress', 'On Hold', 'Done', 'Closed'];
    return mapCapmoStatusToSystemStatus(statuses[Math.floor(Math.random() * statuses.length)]);
  }

  const result = await capmoFetch(`/tickets/${capmoTicketId}`);
  return mapCapmoStatusToSystemStatus(result.status);
}

export { mapCapmoStatusToSystemStatus };
