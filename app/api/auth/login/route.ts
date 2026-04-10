import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCustomerByEmail } from "@/lib/db/customersDb";
import { setCustomerCookie, clearCustomerCookie } from "@/lib/auth/customerAuth";

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");

  if (!email || !password) {
    return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
  }

  const customer = await getCustomerByEmail(email);
  if (!customer) {
    return NextResponse.json({ message: "Account not found. Please sign up." }, { status: 404 });
  }
  if (customer.passwordHash !== hashPassword(password)) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  setCustomerCookie(customer.id);
  return NextResponse.json({ customer: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone } });
}

export async function DELETE() {
  clearCustomerCookie();
  return NextResponse.json({ ok: true });
}

