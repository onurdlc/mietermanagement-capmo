import { NextResponse } from 'next/server';
import { exec } from 'child_process';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST() {
  return new Promise((resolve) => {
    exec('npx prisma db push && npx prisma db seed', (error, stdout, stderr) => {
      if (error) {
        resolve(NextResponse.json({ error: stderr }, { status: 500 }));
      } else {
        resolve(NextResponse.json({ success: true, output: stdout }));
      }
    });
  });
}
