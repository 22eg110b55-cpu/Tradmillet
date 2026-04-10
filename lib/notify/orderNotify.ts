import type { Order } from "@/utils/types";

export async function notifyOwnerNewOrder(order: Order) {
  const msg = buildOwnerMessage(order);

  await Promise.all([tryEmail(msg), tryWhatsApp(msg)]);
}

function buildOwnerMessage(order: Order) {
  const lines = order.items
    .map((it) => `- ${it.productName} × ${it.quantity} (₹${it.lineTotal})`)
    .join("\n");

  return `New Order Received\n\nOrder ID: ${order.id}\nStatus: ${order.status}\n\nItems:\n${lines}\n\nCustomer: ${order.customer.name}\nPhone: ${order.customer.phone}\nEmail: ${order.customer.email}\nAddress: ${order.customer.address}\n\nSubtotal: ₹${order.subtotal}`;
}

async function tryEmail(message: string) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.OWNER_EMAIL;
  if (!host || !user || !pass || !to) return;

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || "false") === "true";

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || user,
    to,
    subject: "TradMillet Foods - New Order Received",
    text: message
  });
}

async function tryLogWhatsApp(message: string) {
  const phone = process.env.OWNER_WHATSAPP_PHONE; // e.g. 919876543210
  if (!phone) return;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  // For a real WhatsApp send, integrate Twilio/WhatsApp Business API.
  // Here we log a ready-to-click link.
  console.log("[TradMillet] WhatsApp notify link:", url);
}

async function tryWhatsApp(message: string) {
  const provider = String(process.env.WHATSAPP_PROVIDER || "").toLowerCase();
  if (provider === "twilio") {
    await tryTwilioWhatsApp(message);
    return;
  }
  await tryLogWhatsApp(message);
}

async function tryTwilioWhatsApp(message: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM; // e.g. whatsapp:+14155238886
  const toPhone = process.env.OWNER_WHATSAPP_PHONE; // e.g. 919876543210
  if (!sid || !token || !from || !toPhone) return;

  const to = toPhone.startsWith("whatsapp:") ? toPhone : `whatsapp:+${toPhone.replace(/\\D/g, "")}`;
  const body = new URLSearchParams({ From: from, To: to, Body: message });

  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.log("[TradMillet] Twilio WhatsApp failed:", res.status, text);
  }
}


