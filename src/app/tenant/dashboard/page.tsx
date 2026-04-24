'use client';

import { demoTickets, messages, appointments } from '@/data/demo';

export default function Dashboard(){
  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="brand"><div className="logo-mark">IX <span>mm</span></div> innoclix mm</div>
        <div className="nav">
          <a className="active">Overview</a>
          <a>My Requests</a>
          <a>Messages</a>
          <a>Appointments</a>
        </div>
        <div className="user-pill"><div className="avatar">OY</div> Onur Yilmaz</div>
      </div>

      <div className="page space-y-6">

        <div className="card p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Hello Mr. Yilmaz,</h1>
            <p className="muted">Here is your current overview.</p>
          </div>
          <button className="btn-primary">+ New Request</button>
        </div>

        <div className="grid-4">
          {demoTickets.map(t=> (
            <div key={t.id} className="ticket-card">
              <div className="flex justify-between">
                <span className={t.status==='Open'?'badge badge-open':t.status==='In Progress'?'badge badge-progress':'badge badge-done'}>{t.status}</span>
              </div>
              <div className="mt-2 font-semibold">{t.title}</div>
              <div className="text-xs text-gray-400">ID: {t.id}</div>
              <div className="mt-2 text-sm text-blue-600">Details →</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          <div className="panel">
            <h3 className="font-semibold mb-3">Appointment proposals</h3>
            {appointments.map(a=> (
              <div key={a} className="mb-2">
                <input type="radio"/> {a}
              </div>
            ))}
            <button className="btn-primary mt-3 w-full">Confirm Appointment</button>
          </div>

          <div className="panel">
            <h3 className="font-semibold mb-3">Latest messages</h3>
            {messages.map(m=> (
              <div key={m} className="text-sm border-b py-2">{m}</div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
