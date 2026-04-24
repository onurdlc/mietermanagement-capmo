'use client';

import { demoTickets, messages, appointments } from '@/data/demo';

const statusClass = (s:string)=> s==='Open'?'badge badge-open':s==='In Progress'?'badge badge-progress':'badge badge-done';

export default function Dashboard(){
  return <div className="app-shell">
    <div className="topbar">
      <div className="brand"><div className="logo-mark">IX <span>mm</span></div><div><b>innoclix mm</b><div className="text-[10px] tracking-[.25em] text-gray-400">WHERE INNOVATION CLICKS</div></div></div>
      <div className="nav"><a className="active">Overview</a><a>My Requests</a><a>Messages</a><a>Appointments</a><a>Documents</a></div>
      <div className="user-pill">Onur Yilmaz <div className="avatar">OY</div></div>
    </div>
    <div className="page space-y-6">
      <section className="card p-7 overflow-hidden relative">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-teal-100 blur-2xl opacity-70" />
        <div className="relative flex flex-col md:flex-row justify-between gap-5 items-start md:items-center">
          <div><div className="badge badge-blue mb-3">Capmo Mock Mode active</div><h1 className="text-3xl font-black">Hello Mr. Yilmaz,</h1><p className="muted mt-2">Here is your live tenant management overview. Track defects, appointments, messages and Capmo status updates in one place.</p></div>
          <a href="/tenant/tickets/new" className="btn-primary shadow-lg">+ New Request</a>
        </div>
      </section>
      <section className="grid-4">
        <div className="panel"><p className="muted text-sm">Open requests</p><div className="text-4xl font-black mt-2">24</div><p className="text-red-500 text-xs mt-2">+5 since last week</p></div>
        <div className="panel"><p className="muted text-sm">In progress</p><div className="text-4xl font-black mt-2">18</div><p className="text-amber-500 text-xs mt-2">+3 since last week</p></div>
        <div className="panel"><p className="muted text-sm">Warranty</p><div className="text-4xl font-black mt-2">29</div><p className="text-teal-600 text-xs mt-2">62% of all requests</p></div>
        <div className="panel"><p className="muted text-sm">Capmo synced</p><div className="text-4xl font-black mt-2">81</div><p className="text-blue-600 text-xs mt-2">Mock integration running</p></div>
      </section>
      <section className="card p-5">
        <div className="flex justify-between items-center mb-4"><h2 className="font-bold text-lg">My Requests</h2><a className="text-sm text-teal-600 font-bold">Show all</a></div>
        <div className="grid-4">{demoTickets.map(t=><div className="ticket-card hover:shadow-xl transition" key={t.id}><span className={statusClass(t.status)}>{t.status}</span><h3 className="font-bold mt-4">{t.title}</h3><p className="text-xs text-gray-400 mt-1">ID: {t.id}</p><p className="text-xs text-gray-400">Capmo: {t.capmo}</p><div className="mt-5 text-teal-600 font-bold text-sm">Details →</div></div>)}</div>
      </section>
      <section className="grid-2">
        <div className="card p-5"><div className="flex justify-between mb-3"><h2 className="font-bold">Appointment proposals</h2><span>📅</span></div><p className="muted text-sm mb-3">Please select an appointment:</p>{appointments.map((a,i)=><label key={a} className="flex items-center gap-3 border rounded-lg p-3 mb-2 bg-white"><input type="radio" defaultChecked={i===1}/><span className="text-sm">{a}</span></label>)}<button className="btn-primary w-full mt-3">Confirm Appointment</button></div>
        <div className="card p-5"><div className="flex justify-between mb-3"><h2 className="font-bold">Latest messages</h2><a className="text-teal-600 text-sm font-bold">Show all</a></div>{messages.map((m,i)=><div key={m} className="flex justify-between gap-4 border-b py-3"><div><b className="text-sm">Property Management</b><p className="muted text-sm">{m}</p></div><span className="text-xs text-gray-400">12.05.2025<br/>10:{30+i}</span></div>)}</div>
      </section>
    </div>
  </div>
}
