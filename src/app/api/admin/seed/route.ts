import { NextResponse } from 'next/server';
import { exec } from 'child_process';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function run(command: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(new Error(stderr || error.message));
      else resolve({ stdout, stderr });
    });
  });
}

export async function POST(): Promise<Response> {
  try {
    const result = await run('npx prisma db push && npx prisma db seed');
    return NextResponse.json({ success: true, output: result.stdout, warnings: result.stderr });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
