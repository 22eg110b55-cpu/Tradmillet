import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/adminAuth";
import { addOrder, listOrders } from "@/lib/db/ordersDb";
import { decrementStock, getProductById } from "@/lib/db/productsDb";
import type { Order, OrderCustomer, OrderLine, PaymentMethod } from "@/utils/types";
import { notifyOwnerNewOrder } from "@/lib/notify/orderNotify";

export async function GET() {
  if (!requireAdmin()) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const orders = await listOrders();
  return NextResponse.json({ orders });
}

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
  const paymentMethod = (body?.paymentMethod || "cod") as PaymentMethod;

  if (!customer?.name || !customer?.phone || !customer?.email || !customer?.address) {
    return NextResponse.json({ message: "Missing customer details" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
  }

  // Only allow "manual" order creation here. Razorpay-paid orders are created via /api/payment/verify.
  if (paymentMethod === "razorpay") {
    return NextResponse.json({ message: "Use Razorpay payment flow" }, { status: 400 });
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
      method: paymentMethod,
      status: paymentMethod === "cod" ? "unpaid" : "pending",
      provider: "manual"
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

  // best-effort owner notifications
  notifyOwnerNewOrder(order).catch(() => {});

  return NextResponse.json({ order }, { status: 201 });
}


