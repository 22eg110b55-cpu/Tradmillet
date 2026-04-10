import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/adminAuth";
import { updateOrderStatus } from "@/lib/db/ordersDb";
import type { OrderStatus } from "@/utils/types";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!requireAdmin()) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { status?: OrderStatus } | null;
  const status = body?.status;
  if (status !== "pending" && status !== "processing" && status !== "packed" && status !== "shipped" && status !== "delivered") {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }
  const order = await updateOrderStatus(params.id, status);
  if (!order) return NextResponse.json({ message: "Not Found" }, { status: 404 });
  return NextResponse.json({ order });
}


