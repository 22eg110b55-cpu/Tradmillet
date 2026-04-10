import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/auth/adminAuth";

export async function POST() {
  clearAdminCookie();
  return NextResponse.json({ ok: true });
}


