import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getProductById } from "@/lib/db/productsDb";
import type { OrderCustomer, OrderLine, PaymentMethod } from "@/utils/types";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | {
        customer?: Partial<OrderCustomer>;
        items?: { productId?: string; quantity?: number }[];
        paymentMethod?: PaymentMethod;
      }
    | null;

  const customer = body?.customer;
  const items = body?.items || [];
  const paymentMethod = body?.paymentMethod || "razorpay";

  if (paymentMethod !== "razorpay") {
    return NextResponse.json({ message: "Invalid payment method" }, { status: 400 });
  }

  if (!customer?.name || !customer?.phone || !customer?.email || !customer?.address) {
    return NextResponse.json({ message: "Missing customer details" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { message: "Razorpay not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local" },
      { status: 500 }
    );
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
  const amount = Math.round(subtotal * 100); // INR paise

  const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const order = await rzp.orders.create({
    amount,
    currency: "INR",
    receipt: `tm_${Date.now()}`,
    notes: {
      customer_name: String(customer.name),
      customer_phone: String(customer.phone)
    }
  });

  return NextResponse.json({
    keyId,
    razorpayOrderId: order.id,
    amount,
    currency: "INR"
  });
}

