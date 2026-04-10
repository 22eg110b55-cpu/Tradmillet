import type { Order, OrderStatus } from "@/utils/types";
import { dataPath, readJsonFile, withWriteLock, writeJsonFile } from "@/lib/db/fileDb";

const ORDERS_FILE = dataPath("orders.json");

export async function listOrders(): Promise<Order[]> {
  return readJsonFile<Order[]>(ORDERS_FILE, []);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const all = await listOrders();
  return all.find((o) => o.id === id);
}

export async function addOrder(order: Order): Promise<Order> {
  return withWriteLock(ORDERS_FILE, async () => {
    const all = await listOrders();
    const next = [order, ...all];
    await writeJsonFile(ORDERS_FILE, next);
    return order;
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | undefined> {
  return withWriteLock(ORDERS_FILE, async () => {
    const all = await listOrders();
    const found = all.find((o) => o.id === id);
    if (!found) return undefined;
    const next = all.map((o) => (o.id === id ? { ...o, status } : o));
    await writeJsonFile(ORDERS_FILE, next);
    return { ...found, status };
  });
}


