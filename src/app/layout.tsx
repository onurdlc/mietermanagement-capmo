import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="border-b bg-white">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="font-semibold">Tenant Management</div>
              <div className="text-xs text-slate-500">Capmo Integration</div>
            </div>
          </header>
          <main className="max-w-6xl mx-auto p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
