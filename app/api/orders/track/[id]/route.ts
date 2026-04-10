import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/db/ordersDb";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const order = await getOrderById(params.id);
  if (!order) return NextResponse.json({ message: "Not Found" }, { status: 404 });

  // Public, customer-facing data only
  return NextResponse.json({
    order: {
      id: order.id,
      createdAt: order.createdAt,
      status: order.status,
      payment: {
        method: order.payment?.method,
        status: order.payment?.status
      },
      customer: {
        name: order.customer?.name
      },
      items: order.items?.map((it) => ({
        productName: it.productName,
        quantity: it.quantity,
        lineTotal: it.lineTotal
      })),
      subtotal: order.subtotal
    }
  });
}

