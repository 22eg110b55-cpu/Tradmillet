import { dataPath, readJsonFile, withWriteLock, writeJsonFile } from "@/lib/db/fileDb";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
};

const CUSTOMERS_FILE = dataPath("customers.json");

function nowIso() {
  return new Date().toISOString();
}

export async function listCustomers(): Promise<Customer[]> {
  return readJsonFile<Customer[]>(CUSTOMERS_FILE, []);
}

export async function getCustomerByEmail(email: string): Promise<Customer | undefined> {
  const all = await listCustomers();
  return all.find((c) => c.email.toLowerCase() === email.toLowerCase());
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  const all = await listCustomers();
  return all.find((c) => c.id === id);
}

export async function saveCustomer(input: Omit<Customer, "createdAt" | "updatedAt"> & Partial<Customer>): Promise<Customer> {
  return withWriteLock(CUSTOMERS_FILE, async () => {
    const all = await listCustomers();
    const idx = all.findIndex((c) => c.id === input.id);
    const stamp = nowIso();
    const base: Customer =
      idx >= 0
        ? { ...all[idx], ...input, updatedAt: stamp }
        : {
            id: input.id,
            name: input.name,
            email: input.email,
            phone: input.phone,
            passwordHash: input.passwordHash,
            address: input.address || "",
            createdAt: stamp,
            updatedAt: stamp
          };
    const next = idx >= 0 ? all.map((c) => (c.id === base.id ? base : c)) : [base, ...all];
    await writeJsonFile(CUSTOMERS_FILE, next);
    return base;
  });
}

