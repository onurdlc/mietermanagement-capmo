'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const fallbackTicket = {
  id: 'demo-ticket-skirting',
  title: 'KUS9-159 - 3rd floor left | WE 33 - Loose skirting boards - 530204',
  description: 'In 2 rooms the skirting boards are loose.',
  status: 'Open',
  category: 'Floor',
  capmoTicketId: 'CAPMO-MOCK-12345'
};

export default function TenantDashboard() {
  const [tickets, setTickets] = useState<any[]>([fallbackTicket]);
  const [tenantName, setTenantName] = useState('Bernd Japp');

  useEffect(() => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) return;
    fetch('/api/tickets')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setTickets(data);
      })
      .catch(() => setTickets([fallbackTicket]));
  }, []);

  return (
    <div className="space-y-8">
      <section className="card p-6 bg-gradient-to-br from-white to-emerald-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-emerald-700">Tenant Portal</div>
            <h1 className="text-3xl font-bold mt-1">Welcome, {tenantName}</h1>
            <p className="text-slate-600 mt-2">Report defects, track Capmo ticket status, and view updates from property management.</p>
          </div>
          <Link href="/tenant/tickets/new" className="btn-primary text-center">Create new defect report</Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="card p-5"><div className="text-sm text-slate-500">Open Tickets</div><div className="text-3xl font-bold text-emerald-700">{tickets.length}</div></div>
        <div className="card p-5"><div className="text-sm text-slate-500">Capmo Mode</div><div className="text-2xl font-bold text-blue-700">Mock</div></div>
        <div className="card p-5"><div className="text-sm text-slate-500">Property</div><div className="text-2xl font-bold">KUS9-159</div></div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Existing Reports</h2>
        {tickets.map(ticket => (
          <div key={ticket.id} className="card p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-semibold">{ticket.title}</div>
              <div className="text-sm text-slate-500 mt-1">{ticket.description}</div>
              <div className="text-xs text-slate-400 mt-2">Capmo ID: {ticket.capmoTicketId ?? 'Pending'}</div>
            </div>
            <span className="badge bg-emerald-100 text-emerald-700">{ticket.status}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
