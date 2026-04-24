'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [tenantNumber, setTenantNumber] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    const res = await fetch('/api/auth/tenant-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantNumber, lastName })
    });

    if (!res.ok) {
      setError('Invalid credentials');
      return;
    }

    const data = await res.json();
    localStorage.setItem('tenantId', data.id);
    router.push('/tenant/dashboard');
  };

  return (
    <div className="max-w-md mx-auto mt-16 card p-6 space-y-4">
      <h1 className="text-xl font-semibold">Tenant Login</h1>
      <input className="input" placeholder="Tenant Number" value={tenantNumber} onChange={(e) => setTenantNumber(e.target.value)} />
      <input className="input" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button className="btn-primary w-full" onClick={handleLogin}>Login</button>
    </div>
  );
}
