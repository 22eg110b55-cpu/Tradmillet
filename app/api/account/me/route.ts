import { NextResponse } from "next/server";
import { currentCustomer } from "@/lib/auth/customerAuth";
import { listOrders } from "@/lib/db/ordersDb";

export async function GET() {
  const customer = await currentCustomer();
  if (!customer) {
    return NextResponse.json({ customer: null, orders: [] });
  }
  const allOrders = await listOrders();
  const orders = allOrders
    .filter((o) => o.customer?.email?.toLowerCase() === customer.email.toLowerCase())
    .map((o) => ({
      id: o.id,
      createdAt: o.createdAt,
      status: o.status,
      subtotal: o.subtotal
    }));
  return NextResponse.json({
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    },
    orders
  });
}

