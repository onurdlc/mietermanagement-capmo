import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="card p-8 max-w-2xl w-full text-center space-y-6">
        <div className="inline-flex rounded-full bg-emerald-50 text-emerald-700 px-4 py-2 text-sm font-semibold">Tenant Management System</div>
        <h1 className="text-4xl font-bold tracking-tight">Report defects. Sync with Capmo.</h1>
        <p className="text-slate-600 text-lg">A modern SaaS MVP for tenants, property managers and warranty managers with Capmo ticket integration and mock mode.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/login" className="btn-primary">Open Tenant Login</Link>
          <Link href="/api/tickets" className="btn-secondary">API Status</Link>
        </div>
      </div>
    </div>
  );
}
