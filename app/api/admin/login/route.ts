import { NextResponse } from "next/server";
import { adminConfigured, setAdminCookie } from "@/lib/auth/adminAuth";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { email?: string; password?: string } | null;
  if (!body?.email || !body?.password) return NextResponse.json({ message: "Missing credentials" }, { status: 400 });

  if (!adminConfigured()) {
    return NextResponse.json(
      { message: "Admin not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local" },
      { status: 500 }
    );
  }

  const ok = body.email === process.env.ADMIN_EMAIL && body.password === process.env.ADMIN_PASSWORD;
  if (!ok) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

  setAdminCookie();
  return NextResponse.json({ ok: true });
}


