import { NextResponse } from "next/server";
import crypto from "crypto";
import { addOrder } from "@/lib/db/ordersDb";
import { decrementStock, getProductById } from "@/lib/db/productsDb";
import type { Order, OrderCustomer, OrderLine } from "@/utils/types";
import { notifyOwnerNewOrder } from "@/lib/notify/orderNotify";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | {
        razorpay_order_id?: string;
        razorpay_payment_id?: string;
        razorpay_signature?: string;
        customer?: Partial<OrderCustomer>;
        items?: { productId?: string; quantity?: number }[];
      }
    | null;

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ message: "Razorpay not configured" }, { status: 500 });
  }

  const orderId = String(body?.razorpay_order_id || "");
  const paymentId = String(body?.razorpay_payment_id || "");
  const signature = String(body?.razorpay_signature || "");

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ message: "Missing Razorpay response" }, { status: 400 });
  }

  const expected = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return NextResponse.json({ message: "Invalid payment signature" }, { status: 400 });
  }

  const customer = body?.customer;
  const items = body?.items || [];
  if (!customer?.name || !customer?.phone || !customer?.email || !customer?.address) {
    return NextResponse.json({ message: "Missing customer details" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
  }

  const lines: OrderLine[] = [];
  for (const it of items) {
    const pid = String(it.productId || "");
    const qty = Math.max(1, Number(it.quantity || 1));
    const product = await getProductById(pid);
    if (!product) return NextResponse.json({ message: `Invalid product: ${pid}` }, { status: 400 });
    if (product.stock < qty) return NextResponse.json({ message: `Out of stock: ${product.name}` }, { status: 400 });
    lines.push({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: qty,
      lineTotal: product.price * qty
    });
  }

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);

  const order: Order = {
    id: `ord_${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`,
    createdAt: new Date().toISOString(),
    status: "pending",
    payment: {
      method: "razorpay",
      status: "paid",
      provider: "razorpay",
      providerOrderId: orderId,
      providerPaymentId: paymentId,
      providerSignature: signature
    },
    customer: {
      name: String(customer.name),
      phone: String(customer.phone),
      email: String(customer.email),
      address: String(customer.address)
    },
    items: lines,
    subtotal
  };

  await addOrder(order);
  await decrementStock(lines.map((l) => ({ productId: l.productId, quantity: l.quantity })));
  notifyOwnerNewOrder(order).catch(() => {});

  return NextResponse.json({ order }, { status: 201 });
}

