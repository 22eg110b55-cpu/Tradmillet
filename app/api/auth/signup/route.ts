import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCustomerByEmail, saveCustomer } from "@/lib/db/customersDb";
import { setCustomerCookie } from "@/lib/auth/customerAuth";

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function randomId() {
  return `cus_${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | {
        name?: string;
        email?: string;
        phone?: string;
        password?: string;
      }
    | null;

  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const phone = String(body?.phone || "").trim();
  const password = String(body?.password || "");

  if (!name || !email || !phone || !password) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const existing = await getCustomerByEmail(email);
  if (existing) {
    return NextResponse.json({ message: "Account already exists. Please login." }, { status: 400 });
  }

  const customer = await saveCustomer({
    id: randomId(),
    name,
    email,
    phone,
    passwordHash: hashPassword(password)
  });

  setCustomerCookie(customer.id);
  return NextResponse.json({ customer: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone } });
}

