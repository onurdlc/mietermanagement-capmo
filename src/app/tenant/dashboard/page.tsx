'use client';

import { useEffect, useState } from 'react';

export default function TenantDashboard() {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/tickets')
      .then(res => res.json())
      .then(data => setTickets(data));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Your Tickets</h1>
      <div className="grid gap-4">
        {tickets.map(ticket => (
          <div key={ticket.id} className="card p-4">
            <div className="font-semibold">{ticket.title}</div>
            <div className="text-sm text-slate-500">{ticket.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
