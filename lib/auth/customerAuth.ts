import crypto from "crypto";
import { cookies } from "next/headers";
import { getCustomerById } from "@/lib/db/customersDb";

const COOKIE = "tm_customer";

function secret() {
  return process.env.CUSTOMER_TOKEN_SECRET || "dev-customer-secret-change-me";
}

function signToken(payload: object) {
  const body = JSON.stringify(payload);
  const sig = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  return `${Buffer.from(body).toString("base64url")}.${sig}`;
}

function verifyToken(token: string | undefined | null): any | null {
  if (!token) return null;
  const [p, sig] = token.split(".");
  if (!p || !sig) return null;
  try {
    const body = Buffer.from(p, "base64url").toString("utf8");
    const expected = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    return JSON.parse(body);
  } catch {
    return null;
  }
}

export function setCustomerCookie(id: string) {
  const token = signToken({ v: 1, iat: Date.now(), id });
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export function clearCustomerCookie() {
  cookies().set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function currentCustomer() {
  const raw = cookies().get(COOKIE)?.value;
  const payload = verifyToken(raw);
  if (!payload?.id) return null;
  return getCustomerById(String(payload.id));
}

