import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "tm_admin";

function secret() {
  return process.env.ADMIN_TOKEN_SECRET || "dev-secret-change-me";
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
}

export function signAdminToken() {
  const payload = JSON.stringify({ v: 1, iat: Date.now() });
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${Buffer.from(payload).toString("base64url")}.${sig}`;
}

export function verifyAdminToken(token: string | undefined | null) {
  if (!token) return false;
  const [p, sig] = token.split(".");
  if (!p || !sig) return false;
  try {
    const payload = Buffer.from(p, "base64url").toString("utf8");
    const expected = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function setAdminCookie() {
  const token = signAdminToken();
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearAdminCookie() {
  cookies().set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export function requireAdmin() {
  const token = cookies().get(COOKIE)?.value;
  return verifyAdminToken(token);
}


